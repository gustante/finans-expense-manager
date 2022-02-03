import React from 'react';
import ReactDOM from 'react-dom';
import './style-sample.css';
import { HashRouter as Router } from "react-router-dom";

import App from "./App.js";



grecaptcha.ready(function () {
        ReactDOM.render(
            <Router>
                <App />
            </Router>  
                ,document.getElementById('react-container')
            
        );
    })




