import React, {Component} from 'react';
import {Auth} from 'aws-amplify';
import { async } from 'q';
import {Redirect} from 'react-router-dom';

class GreeterComponent extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: false
        }

        this.handleSignout = this.handleSignout.bind(this);
    }

    componentDidMount = async() => {
        try {
            var user = await Auth.currentAuthenticatedUser();
            this.setState({user: user, isLoggedIn: true});
        } catch (e) {
            this.setState({isLoggedIn: false});
        }
    }

    handleSignout = async(event) => {
        await Auth.signOut();
        return <Redirect to="/" />;
    }

    render() {
        var isLoggedIn = this.state.isLoggedIn;
        
        var greeterTemplate = null;

        if (isLoggedIn) {
            var user = this.state.user;
            greeterTemplate = <div>Logged in as {user.attributes.email} <a className="btn btn-sm btn-danger" onClick={this.handleSignout}>Logout</a></div>
        } 

        return (
            <div>{greeterTemplate}</div>
        );
    }
}

class NavBarComponent extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/">Stock Monitoring Dashboard</a>
                <div className="collapse navbar-collapse">
                    <div className="mr-auto"></div>
                    <div className="mr-2 text-light">
                        <GreeterComponent />
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBarComponent;