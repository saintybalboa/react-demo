import './App.scss'; // Order of import affects order of styles imported
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Switch, NavLink } from 'react-router-dom';
import Home from '../../pages/Home';
import About from '../../pages/About';


function App() {
    return (
       <>
            <Helmet
                htmlAttributes={{lang: "en", amp: undefined}} // amp takes no value
                titleTemplate="React Demo - %s"
                titleAttributes={{itemprop: "name", lang: "en"}}
                meta={[
                    {name: "description", content: "React demo is a basic universal web app."},
                    {name: "viewport", content: "width=device-width, initial-scale=1"}
                ]}
            />
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
        </>
    );
}

export default App;
