/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const intradayStockPriceCreated = `subscription IntradayStockPriceCreated($symbol: String) {
  intradayStockPriceCreated(symbol: $symbol) {
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
