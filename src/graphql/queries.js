/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listAllStockSymbols = `query ListAllStockSymbols($limit: Int, $nextToken: String) {
  listAllStockSymbols(limit: $limit, nextToken: $nextToken) {
    items {
      id
      symbol
      owner
    }
    nextToken
  }
}
`;
export const retrieveLatestIntradayPrices = `query RetrieveLatestIntradayPrices(
  $symbol: String
  $ts: Int
  $limit: Int
  $nextToken: String
) {
  retrieveLatestIntradayPrices(
    symbol: $symbol
    ts: $ts
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
`;
export const getIntradayStockPrice = `query GetIntradayStockPrice($id: ID!) {
  getIntradayStockPrice(id: $id) {
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
}
`;
export const listIntradayStockPrices = `query ListIntradayStockPrices(
  $filter: ModelIntradayStockPriceFilterInput
  $limit: Int
  $nextToken: String
) {
  listIntradayStockPrices(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
`;
export const getStockSymbol = `query GetStockSymbol($id: ID!) {
  getStockSymbol(id: $id) {
    id
    symbol
    owner
  }
}
`;
export const listStockSymbols = `query ListStockSymbols(
  $filter: ModelStockSymbolFilterInput
  $limit: Int
  $nextToken: String
) {
  listStockSymbols(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      symbol
      owner
    }
    nextToken
  }
}
`;
