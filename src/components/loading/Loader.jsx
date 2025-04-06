import React from 'react';
import {Rings , Circles} from "react-loader-spinner";

import './loader.css'
const Loader = () => {
    return (
        <div className="loader">
            <Circles
                visible={true}
                height="80"
                width="80"
                color="#26BF56"
                ariaLabel="rings-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
};

export default Loader;