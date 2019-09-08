import React from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import awsExports from './aws-exports';
import {withAuthenticator} from 'aws-amplify-react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import DashboardComponent from './Components/DashboardComponent';
import NavBarComponent from './Components/NavBarComponent';
import ManageStockSymbolsComponent from './Components/ManageStockSymbolsComponent';

Amplify.configure(awsExports);

function App() {
  return (
    <div>
      <NavBarComponent />
      <div className="container">
          <div className="mt-2">
            <BrowserRouter>
              <Switch>
                <Route exact path="/" component={DashboardComponent} />
                <Route exact path="/manage-stock-symbols" component={ManageStockSymbolsComponent} />
              </Switch>
            </BrowserRouter>
          </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App, {
  usernameAttributes: 'email',
  signUpConfig: {
    hideAllDefaults: true,
    signUpFields: [
      {
        label: 'Email',
        key: 'email',
        required: true,
        displayOrder: 1,
        type: 'string'
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 2,
        type: 'password'
      }
    ]
  }
});
