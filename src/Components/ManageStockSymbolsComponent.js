import React, {Component} from 'react';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import {API, graphqlOperation} from 'aws-amplify';
import { async } from 'q';

class ManageStockSymbolsComponent extends Component {
    constructor() {
        super();

        this.state = {
            symbols: [],
            newSymbol: "",
            submitBtnDisabled: false
        }

        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentDidMount = async() => {
        await this.refreshList();
    }

    refreshList = async() => {
        var result = await API.graphql(graphqlOperation(queries.listStockSymbols));
        this.setState({symbols: result.data.listStockSymbols.items});
    }

    handleFormChange(event) {
        var targetName = event.target.name;
        var targetValue = event.target.value;
        var payload = {}
        payload[targetName] = targetValue;
        this.setState(payload);
    }

    handleFormSubmit = async(event) => {
        event.preventDefault();
        this.setState({submitBtnDisabled: true});
        await API.graphql(graphqlOperation(mutations.createStockSymbol, {input: {
            symbol: this.state.newSymbol
        }}))
        await this.refreshList();
        this.setState({newSymbol: ""});
        this.setState({submitBtnDisabled: false});
    }

    render() {
        return (
            <div>
                <a href="/">&lt; Back to Dashboard</a>
                <h3 className="mt-2">Manage Stock Symbols</h3>
                <table className="table table-striped">
                    <thead class="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Symbol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.symbols.map(item => {
                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.symbol}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="mt-2 border p-2">
                    <h4>Add Symbol</h4>
                    <form onSubmit={this.handleFormSubmit} method="POST">
                        <div className="form-group">
                            <label for="symbol">Symbol</label>
                            <input type="text" required="true" onChange={this.handleFormChange} className="form-control" value={this.state.newSymbol} name="newSymbol" placeholder="AMZN" />
                        </div>
                        <button type="submit" disabled={this.state.submitBtnDisabled} class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default ManageStockSymbolsComponent;