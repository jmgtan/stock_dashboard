const gql = require("graphql-tag");

module.exports = {
    listAllStockSymbols: gql(`query ListAllStockSymbols($limit: Int, $nextToken: String) {
        listAllStockSymbols(limit: $limit, nextToken: $nextToken) {
          items {
            id
            symbol
          }
          nextToken
        }
      }`)
}