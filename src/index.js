import React, {Suspense} from 'react';
import {Provider as ReduxProvider} from 'react-redux'
import {store} from "./redux/store";
import ReactDOM from 'react-dom';
import './design-system/tokens.css';
import './index.css';
import './i18n';
// import './assets/custom-css/custom-antd.css';

// import {PersistGate} from "redux-persist/integration/react";
import Loader from "./components/loading/Loader";
import App from "./App";
import {ThemeProvider} from "./context/ThemeContext";


ReactDOM.render(
    <ThemeProvider>
        <ReduxProvider store={store}>
            <Suspense fallback={<Loader/>}>
                <App/>
            </Suspense>
        </ReduxProvider>
    </ThemeProvider>,
    document.getElementById("root")
);

