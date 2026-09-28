import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom'
import UserList from "../components/userList/UserList";
import Status from "../components/status/Status";
import Report from "../components/report/Report";
import Setting from "../components/setting/Setting";
import TerminalReport from '../components/terminalReport/TerminalReport';
import DatabaseBlack from "../components/employees/database/DatabaseBlack";
import DatabaseAdd from "../components/employees/database/DatabaseAdd";
import {LightZone} from "../context/ThemeContext";

/* Qorong'i rejimga hali o'tkazilmagan sahifalar yorug' zonada (LightZone izohiga qarang).
   Sahifa yangilanganda o'rami olib tashlanadi — Xodimlar, Joriy holat, Hisobot va Sozlamalar allaqachon yangilangan. */
const legacy = (page) => <LightZone>{page}</LightZone>;

const RootPage = () => {
    return (
        <Routes>
            {/*<Route path="/user-list" element={<UserList/>}/>*/}
            <Route path="/employees" element={<DatabaseBlack/>}/>
            {/* guruh ichi — manzilda id: sahifa yangilanganda ham shu guruhda qoladi */}
            <Route path="/employees/:groupId" element={<DatabaseAdd/>}/>
            <Route path="/status" element={<Status/>}/>
            <Route path="/report" element={<Report/>}/>
            <Route path="/terminal-report" element={legacy(<TerminalReport/>)}/>
            <Route path="/setting" element={<Setting/>}/>
            <Route path='*' element={<Navigate to="/employees"/>}/>
        </Routes>
    );
};

export default RootPage;