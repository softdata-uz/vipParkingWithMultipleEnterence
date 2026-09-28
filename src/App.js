import React, {useEffect} from "react";
import {Routes, Route, BrowserRouter , Navigate} from 'react-router-dom'

import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {ip} from "./ip";
import {getMeAction, LOGIN_REQUEST, LoginFailure, loginResponse} from "./redux/action/action";
import {api, storage} from "./services";
import Loader from "./components/loading/Loader";
import Layout from "./components/Layout";
import Login from "./components/loginPage/Login";
import NewViewPage from "./components/newViewPage/NewViewPage";
import MultipleEnterence from "./components/MultipleEnterence/MultipleEnterence";
import {LightZone} from "./context/ThemeContext";

function App() {

    const dispatch = useDispatch();
    const {isAuthenticated , isFetched} = useSelector(store => store.auth);
    const token = storage.local.get("token");
    useEffect(() => {
        const loadFetch = async () => {
            dispatch(LOGIN_REQUEST());
            try {
                const {data} = await api.get(`${ip}/api/me`,
                    {headers: {'x-access-token': token}}
                );
                // console.log(data)
                const user = data?.user;
                if (user) {
                    dispatch(getMeAction(data?.user));
                } else {
                    dispatch(LoginFailure());
                }
            } catch (error) {
                dispatch(LoginFailure());
            } finally {
                dispatch(loginResponse());
            }
        };
        if (token) {
            loadFetch();
        }
    }, []);

    if (!isFetched) {
        return <Loader/>
    }


    return (
        <React.Fragment>
            {isAuthenticated ?
                <Layout/>
                :
                <BrowserRouter>
                    <Routes>
                        {/*<Route path='/' element={<NewViewPage/>}/>*/}
                        <Route path='/' element={<LightZone><MultipleEnterence/></LightZone>}/>

                        <Route path='/login' element={<Login/>}/>
                        <Route path='*' element={<Navigate to="/"/>}/>
                    </Routes>
                </BrowserRouter>
            }
        </React.Fragment>
    );
}

export default App;
