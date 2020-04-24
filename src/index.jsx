import ReactDOM from 'react-dom'
import './components/main.css'
import App from './components/App.jsx'
import React from 'react'
import { Provider } from 'react-redux';
import {BrowserRouter} from 'react-router-dom'
import store from './components/store.js';


import reloadMagic from './components/reload-magic-client.js' // automatic reload
reloadMagic() // automatic reload

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
        <App/>
        </BrowserRouter>
    </Provider>
, document.getElementById("root"))