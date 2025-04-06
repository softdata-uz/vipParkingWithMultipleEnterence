import React, {useState} from 'react'
import {useSelector} from "react-redux";

import LoginPage from './components/loginPage/Login'
import App from './App'
import ViewPage from "./components/viewPage/ViewPage";
import NewViewPage from "./components/newViewPage/NewViewPage";

function Auth() {

    const user = useSelector(state => state.parking.user)
    const [login, setLogin] = useState(false)


    if (user && user.role) {
        return <App user={user}/>
    }


    return ( login ?
                <LoginPage />
                :
            // <ViewPage setLogin={setLogin}/>
            <NewViewPage setLogin={setLogin}/>
        )
    }

export default Auth
