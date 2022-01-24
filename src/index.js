
import React from 'react';
import ReactDOM from 'react-dom';
import './style-sample.css';


import App from "./App.js";
import Home from "./Home.js"

grecaptcha.ready(function () {
        ReactDOM.render(<App />, document.getElementById('react-container'));
    })




