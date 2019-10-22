import React from 'react';

import {Switch, Route, NavLink} from "react-router-dom"
import HelloWorld from '../HelloWorld/HelloWorld.js'
import Home from './Home.js'
import Style from './App.css'
const App = () => {
  return (
    <div className="App">
        <Navigation />
        <Main />
    </div>
  );
}

const Navigation = () => (
    <nav>
        <ul style={Style}>
            <li style={Style}><NavLink to='/'>Home</NavLink></li>
            <li><NavLink to='/HelloWorld'>HelloWorld</NavLink></li>
        </ul>
    </nav>
);

export default App;

const Main = () => {
    return (
        <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/HelloWorld/' component={HelloWorld}></Route>
        </Switch>
    );
}

