import './App.scss';
import React from 'react';
import BannerImage from '../../assets/images/banner.png';
import Logo from '../../assets/images/logo.svg';
import { useRoutes, NavLink } from 'react-router-dom';
import routes from '../../routes';

function App() {
    // Get output for the first route that matches the request path.
    const renderRoute = useRoutes(routes);

    return (
        <div className="app">
            <Logo className="logo" />
            <nav>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/services/1">App</NavLink></li>
                    <li><NavLink to="/services/2">Web</NavLink></li>
                    <li><NavLink to="/services/3">Design</NavLink></li>
                </ul>
            </nav>
            <img src={BannerImage} alt="React Demo banner" />
            {renderRoute}
        </div>
    );
}

export default App;
