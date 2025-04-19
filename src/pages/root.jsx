import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom'
import {useLocation} from 'react-router-dom'
import UserList from "../components/userList/UserList";
import Status from "../components/status/Status";
import Report from "../components/report/Report";
import Setting from "../components/setting/Setting";
import TerminalReport from '../components/terminalReport/TerminalReport';
import DatabaseBlack from "../components/employees/database/DatabaseBlack";

const RootPage = (props) => {
    const {setPathName} = props;
    const location = useLocation();
    setPathName(location?.pathname);

    return (
        <Routes>
            {/*<Route path="/user-list" element={<UserList/>}/>*/}
            <Route path="/employees" element={<DatabaseBlack/>}/>
            <Route path="/status" element={<Status/>}/>
            <Route path="/report" element={<Report/>}/>
            <Route path="/terminal-report" element={<TerminalReport/>}/>
            <Route path="/setting" element={<Setting/>}/>
            <Route path='*' element={<Navigate to="/employees"/>}/>
        </Routes>
    );
};

export default RootPage;