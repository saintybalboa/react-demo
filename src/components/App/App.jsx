import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import Home from '../../pages/Home';
import About from '../../pages/About';

function App() {
    return (
        <div className="App">
            <ul>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/about">About</NavLink>
                </li>
            </ul>
            <Switch>
                <Route path="/" exact component={ Home } />
                <Route path="/about" component={ About } />
            </Switch>
        </div>
    );
}

export default App;
