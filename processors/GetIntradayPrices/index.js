const AWS = require("aws-sdk");
const configExports = require('./config-exports');
const AWSAppSyncClient = require('aws-appsync').default;
const {listAllStockSymbols} = require('./graphql/queries');
const {createIntradayStockPrice} = require('./graphql/mutations');
const axios = require('axios');
const moment = require("moment-timezone");
require("isomorphic-fetch");

AWS.config.update({region: configExports.appsync_region});

const getBackendTokens = async(sm) => {
    const idp = new AWS.CognitoIdentityServiceProvider();
    const backendAdminCredentialsSecret = await sm.getSecretValue({SecretId: configExports.cognito_backend_access_key}).promise();
    const backendAdminCredentials = JSON.parse(backendAdminCredentialsSecret.SecretString);

    const adminAuthResult = await idp.adminInitiateAuth({
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        ClientId: configExports.cognito_backend_client_id,
        UserPoolId: configExports.cognito_pool_id,
        AuthParameters: {
            "USERNAME": backendAdminCredentials.username,
            "PASSWORD": backendAdminCredentials.password
        }
    }).promise();

    return adminAuthResult.AuthenticationResult;
}

const buildAppSyncClient = (backendTokens) => {
    return new AWSAppSyncClient({
        url: configExports.appsync_endpoint_url,
        region: configExports.appsync_region,
        auth: {
            type: "AMAZON_COGNITO_USER_POOLS",
            jwtToken: backendTokens.AccessToken
        },
        disableOffline: true
    });
}

const getFeedApiKey = async(sm) => {
    const dataFeedSecretResult = await sm.getSecretValue({SecretId: configExports.data_feed_key}).promise();
    return JSON.parse(dataFeedSecretResult.SecretString).feed_api_key;
}

const getPrices = async(apiKey, symbol) => {
    const feedUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+symbol+"&interval="+configExports.feed_interval+"&apikey="+apiKey;
    const response = await axios(feedUrl);
    const data = response.data;
    if ("Note" in data) {
        console.log("["+symbol+"] Rate limit exceeded, skipping request");
        return [];
    } else if ("Error Message" in data) {
        return [];
    } else {
        const metadata = data["Meta Data"];
        const timezone = metadata["6. Time Zone"];
        const feedPrices = data["Time Series ("+configExports.feed_interval+")"];
    
        var prices = [];
    
        for (i in feedPrices) {
            const ts = moment.tz(i, timezone).unix();
            const price = feedPrices[i];
            prices.push({
                id: symbol+"-"+ts,
                symbol: symbol,
                data_timezone: timezone,
                data_timestamp: ts,
                open_price: price["1. open"],
                high_price: price["2. high"],
                low_price: price["3. low"],
                close_price: price["4. close"],
                volume: price["5. volume"]
            });
        }
    
        return prices.reverse();
    }
}

const writePrices = async(client, prices) => {
    for (i in prices) {
        const price = prices[i];
        try {
            await client.mutate({mutation: createIntradayStockPrice, variables: {input: price}});
        } catch (e) {

        }
    }
}

exports.handler = async(event) => {
    const sm = new AWS.SecretsManager();
    const backendTokens = await getBackendTokens(sm);
    const client = buildAppSyncClient(backendTokens);
    var nextToken = null;
    const symbols = new Set();

    const apiKey = await getFeedApiKey(sm);

    do {
        var results = await client.query({query: listAllStockSymbols, variables: {nextToken: nextToken}});
    
        const items = results.data.listAllStockSymbols.items;
        nextToken = results.data.listAllStockSymbols.nextToken;

        if (items != null && items.length > 0) {
            for (var i=0;i<items.length;i++) {
                var item = items[i];

                var symbol = item.symbol.toUpperCase();

                if (!symbols.has(symbol)) {
                    const prices = await getPrices(apiKey, symbol);
                    if (prices.length > 0) {
                        await writePrices(client, prices);
                        symbols.add(symbol);
                    }
                }
            }
        }
    } while (nextToken != null);
}