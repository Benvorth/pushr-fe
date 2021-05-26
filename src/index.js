import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

import * as serviceWorkerCacheInit from './serviceWorker/sw-cache-init';

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorkerCacheInit.init();