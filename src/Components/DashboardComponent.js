import React, {Component} from 'react';
import { async } from 'q';
import * as queries from '../graphql/queries';
import {API, graphqlOperation} from 'aws-amplify';
import Chart from './CandleStickChartForDiscontinuousIntraDay';
const moment = require("moment-timezone");

const PRICE_LIMIT = 50;

class DashboardComponent extends Component {
    

    constructor() {
        super();
        this.state = {  
            symbols: []
        };
    }

    componentDidMount = async() => {
        var dataPoints = await this.loadDashboard();
        var symbols = Object.keys(dataPoints);
        this.setState({
            dataPoints: dataPoints,
            symbols: symbols
        })
        ;
    }

    loadDashboard = async() => {
        var symbols = await API.graphql(graphqlOperation(queries.listStockSymbols));
        symbols = symbols.data.listStockSymbols.items;
        var dataPointsBySymbol = {};
        for (var i in symbols) {
            var symbol = symbols[i];
            var symbolText = symbol.symbol;
            dataPointsBySymbol[symbolText] = await this.retrieveLatestPricesBySymbol(symbolText);
        }

        return dataPointsBySymbol
    }

    retrieveLatestPricesBySymbol = async(symbol) => {
        var nextToken = null;
        var queryTimestamp = this.generateQueryTimestamp();
        var dataPoints = [];

        var minTs = Number.MAX_SAFE_INTEGER;
        var maxTs = 0;

        do {
            var results = await API.graphql(graphqlOperation(queries.retrieveLatestIntradayPrices, {
                symbol: symbol,
                ts: queryTimestamp,
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

                    minTs = Math.min(minTs, point.date);
                    maxTs = Math.max(maxTs, point.date);

                    dataPoints.push(point);
                }
                
            }
        } while (nextToken != null);

        return {
            min_date: new Date(minTs),
            max_date: new Date(maxTs),
            points: dataPoints.reverse()
        };
    }

    generateQueryTimestamp() {
        return moment(moment().format("YYYY")+"-01-01").unix();
    }

    render() {
        return (
            <div>
                <h3>Dashboard</h3>
                <a href="/manage-stock-symbols">Manage Stock Symbols</a>
                <div className="mt-2">
                    {this.state.symbols.map(symbol => {
                        return (
                            <div>
                                <h3>{symbol}</h3>
                                <div>
                                    <Chart data={this.state.dataPoints[symbol].points} />
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