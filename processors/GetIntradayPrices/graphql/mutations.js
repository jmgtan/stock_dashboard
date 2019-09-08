const gql = require("graphql-tag");

module.exports = {
    createIntradayStockPrice: gql(`mutation CreateIntradayStockPrice($input: CreateIntradayStockPriceInput!) {
        createIntradayStockPrice(input: $input) {
          id
          symbol
          data_timezone
          data_timestamp
          open_price
          high_price
          low_price
          close_price
          volume
        }
      }`)
}