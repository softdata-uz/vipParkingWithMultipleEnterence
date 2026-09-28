import React from 'react';
import {Rings , Circles} from "react-loader-spinner";

import './loader.css'
import {useTheme} from "../../context/ThemeContext";
const Loader = () => {
    const {theme} = useTheme() || {};
    return (
        <div className="loader">
            <Circles
                visible={true}
                height="80"
                width="80"
                color={theme === 'dark' ? '#16B364' : '#099250'}
                ariaLabel="rings-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
};

export default Loader;