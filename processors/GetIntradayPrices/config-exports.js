const config = {
    cognito_pool_id: "eu-west-1_DMhZ3rrXS",
    cognito_backend_client_id: "pq3rcra4kend08leir0lbth06",
    cognito_backend_access_key: "stockMonitoring/local/backend",
    appsync_endpoint_url: "https://efrgcmtrnfcn7oshfxf2kvsx4y.appsync-api.eu-west-1.amazonaws.com/graphql",
    appsync_region: "eu-west-1",
    data_feed_key: "stockMonitoring/local/datafeed",
    feed_interval: "30min"
}

module.exports=config;