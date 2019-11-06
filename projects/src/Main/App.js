import React from 'react';

import {Switch, Route, NavLink} from "react-router-dom"
import HelloWorld from '../HelloWorld/HelloWorld.js'
import ArraySorter from '../ArraySorter/ArraySorter.js'
import NumberRecognizer from '../NumberRecognition/NumberRecognition.js'
import Home from './Home.js'
import Style from './App.css'
const App = () => {
  return (
    <span className="App">
        <Navigation />
        <Main />
    </span>
  );
}

const Navigation = () => (
    <nav>
        <ul style={Style}>
            <li style={Style}><NavLink to='/'>Home</NavLink></li>
            <li><NavLink to='/HelloWorld'>HelloWorld</NavLink></li>
            <li><NavLink to='/ArraySorter'>ArraySorter</NavLink></li>
            <li><NavLink to='/NumberRecognizer'>NumberRecognizer</NavLink></li>
        </ul>
    </nav>
);

export default App;

const Main = () => {
    return (
        <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/HelloWorld/' component={HelloWorld}></Route>
            <Route exact path='/ArraySorter/' component={ArraySorter}></Route>
            <Route exact path='/NumberRecognizer/' component={NumberRecognizer}></Route>
        </Switch>
    );
}

