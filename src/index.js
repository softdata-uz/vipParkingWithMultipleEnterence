import React, {Suspense} from 'react';
import {positions, Provider} from "react-alert";
import {Provider as ReduxProvider} from 'react-redux'
import AlertTemplate from "react-alert-template-basic";
import {store} from "./redux/store";
import ReactDOM from 'react-dom';
import './index.css';
// import './assets/custom-css/custom-antd.css';


import './index.css';
// import {PersistGate} from "redux-persist/integration/react";
import Loader from "./components/loading/Loader";
import App from "./App";


const options = {
    timeout: 5 * 1000,
    position: positions.TOP_CENTER,
    containerStyle: {
        zIndex: 1009999
    }
};

ReactDOM.render(
    <ReduxProvider store={store}>
        <Suspense fallback={<Loader/>}>
            <Provider template={AlertTemplate} {...options}>
                <App/>
            </Provider>
        </Suspense>
    </ReduxProvider>,
    document.getElementById("root")
);

