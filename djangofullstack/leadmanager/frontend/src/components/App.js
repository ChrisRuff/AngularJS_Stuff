import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom"

import Header from "./layout/Header";
import Dashboard from './leads/Dashboard';
import ArraySorter from './ArraySorter/ArraySorter';
import NumberRecognition from './NumberPredictor/NumberRecognition';
import Evolution from './Evolution/Evolution';

import { Provider } from 'react-redux';
import store from '../store';

class App extends Component
{
		render()
		{
			return(
				<Provider store={store}>
					<Router>
						<Fragment>
							<Header />
							<div>
								<Switch>
									<Route exact path ='/' component={Dashboard}></Route>
									<Route exact path ='/Sorter' component={ArraySorter}></Route>
									<Route exact path ='/NumberPredictor' component={NumberRecognition}></Route>
									<Route exact path ='/Evolution' component={Evolution}></Route>
								</Switch>
							</div>
						</Fragment>
					</Router>
				</Provider>
					)}
}

ReactDOM.render(<App />, document.getElementById('app'));
