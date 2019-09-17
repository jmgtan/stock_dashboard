import React, {Component} from 'react';
import { async } from 'q';
import * as queries from '../graphql/queries';
import * as subscriptions from '../graphql/subscriptions';
import {API, graphqlOperation} from 'aws-amplify';
import Chart from './CandleStickChartForDiscontinuousIntraDay';

const PRICE_LIMIT = 50;

class DashboardComponent extends Component {
    

    constructor() {
        super();
        this.state = {  
            symbols: []
        };

        this.mountedSubscriptions = {};
        this.buffer = {};
    }

    componentDidMount = async() => {
        var symbolKeys = await this.loadDashboard();

        if (symbolKeys.length > 0) {
            for (var i in symbolKeys) {
                var symbolKey = symbolKeys[i];

                this.mountedSubscriptions[symbolKey] = API.graphql(graphqlOperation(subscriptions.intradayStockPriceCreated, {symbol: symbolKey})).subscribe({
                    next: this.handleSubscription.bind(this)
                });
            }
        }
    }

    handleSubscription(data) {
        var row = data.value.data["intradayStockPriceCreated"];

        var symbol = row.symbol;

        var point = {
            date: new Date(+row.data_timestamp * 1000),
            open: +row.open_price,
            high: +row.high_price,
            low: +row.low_price,
            close: +row.close_price,
            volume: +row.volume
        };

        var isAddedToBuffer = false;
        var dataPoints = this.state.dataPoints;
        
        if (dataPoints[symbol].points.length == 0 && this.buffer[symbol].length == 0) {
            this.buffer[symbol].push(point);
            isAddedToBuffer = true;
        } else if (this.buffer[symbol].length > 0) {
            dataPoints[symbol].points = dataPoints[symbol].points.concat(this.buffer[symbol]);
            this.buffer[symbol] = [];
        }

        if (!isAddedToBuffer) {
            dataPoints[symbol].points.push(point);
            this.setState({dataPoints: dataPoints});
        }
    }

    componentWillUnmount = async() => {
        for (var symbolKey in this.mountedSubscriptions) {
            console.log("Unsubscribing "+symbolKey);
            this.mountedSubscriptions[symbolKey].unsubscribe();
            this.mountedSubscriptions[symbolKey] = null;
        }
    }

    loadDashboard = async() => {
        var symbols = await API.graphql(graphqlOperation(queries.listStockSymbols));
        symbols = symbols.data.listStockSymbols.items;
        var dataPointsBySymbol = {};
        for (var i in symbols) {
            var symbol = symbols[i];
            var symbolText = symbol.symbol;
            this.buffer[symbolText] = [];
            dataPointsBySymbol[symbolText] = await this.retrieveLatestPricesBySymbol(symbolText);
        }

        var symbolKeys = Object.keys(dataPointsBySymbol);

        this.setState({
            dataPoints: dataPointsBySymbol,
            symbols: symbolKeys
        });

        return symbolKeys;
    }

    retrieveLatestPricesBySymbol = async(symbol) => {
        var nextToken = null;
        var dataPoints = [];

        do {
            var results = await API.graphql(graphqlOperation(queries.retrieveLatestIntradayPrices, {
                symbol: symbol,
                ts: 0,
                nextToken: nextToken
            }));   
            
            results = results.data.retrieveLatestIntradayPrices;
            nextToken = results.nextToken;
            var items = results.items;

            if (items.length > 0) {
                for (var i = 0;i < items.length;i++) {
                    var item = items[i];
                    var point = {
                        date: new Date(+item.data_timestamp * 1000),
                        open: +item.open_price,
                        high: +item.high_price,
                        low: +item.low_price,
                        close: +item.close_price,
                        volume: +item.volume
                    };

                    dataPoints.push(point);
                }
                
            }
        } while (nextToken != null);

        return {
            points: dataPoints.reverse()
        };
    }

    render() {
        return (
            <div>
                <h3>Dashboard</h3>
                <a href="/manage-stock-symbols">Manage Stock Symbols</a>
                <div>
                    {this.state.symbols.map(symbol => {
                        var hasDataPoints = this.state.dataPoints[symbol].points.length > 0;
                        return (
                            <div className="m-2">
                                <h3>{symbol}</h3>
                                <div className="border">
                                    {hasDataPoints ? (
                                        <Chart symbol={symbol} data={this.state.dataPoints[symbol].points} />
                                    ) : (
                                        <div className="p-2"><h5 className="text-danger">No data points</h5></div>
                                    )}
                                    
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        ); 
    }
}

export default DashboardComponent;