/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createIntradayStockPrice = `mutation CreateIntradayStockPrice($input: CreateIntradayStockPriceInput!) {
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
}
`;
export const updateIntradayStockPrice = `mutation UpdateIntradayStockPrice($input: UpdateIntradayStockPriceInput!) {
  updateIntradayStockPrice(input: $input) {
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
export const deleteIntradayStockPrice = `mutation DeleteIntradayStockPrice($input: DeleteIntradayStockPriceInput!) {
  deleteIntradayStockPrice(input: $input) {
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
export const createStockSymbol = `mutation CreateStockSymbol($input: CreateStockSymbolInput!) {
  createStockSymbol(input: $input) {
    id
    symbol
    owner
  }
}
`;
export const updateStockSymbol = `mutation UpdateStockSymbol($input: UpdateStockSymbolInput!) {
  updateStockSymbol(input: $input) {
    id
    symbol
    owner
  }
}
`;
export const deleteStockSymbol = `mutation DeleteStockSymbol($input: DeleteStockSymbolInput!) {
  deleteStockSymbol(input: $input) {
    id
    symbol
    owner
  }
}
`;
