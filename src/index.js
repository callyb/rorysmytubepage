import React from "react";
import ReactDOM from "react-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import './style.css';
import 'mdbreact/dist/css/mdb.css';
import 'core-js/fn/number/is-nan'; 
import 'core-js/es7/'; 
import 'core-js/es6/'; 
import 'raf/polyfill';
import App from "./App";

ReactDOM.render(<App />, document.querySelector("#root"));
