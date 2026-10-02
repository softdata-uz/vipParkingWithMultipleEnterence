import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom'
import Status from "../components/status/Status";
import Report from "../components/report/Report";
import Setting from "../components/setting/Setting";
import DatabaseBlack from "../components/employees/database/DatabaseBlack";
import DatabaseAdd from "../components/employees/database/DatabaseAdd";
import {canAccess, ROLE_HOME} from "../utils/roleAccess";

/* RBAC: manzilga to'g'ridan-to'g'ri kirilsa ham (nav'da havola bo'lmasa ham) ruxsatsiz rol
   o'zi uchun mos boshlang'ich sahifaga qaytariladi (backend API'lar allaqachon rol bo'yicha
   himoyalangan — bu shunchaki UI'da bo'sh/xatolik sahifasini ko'rsatmaslik uchun). */
const Guard = ({role, path, children}) =>
    canAccess(path, role) ? children : <Navigate to={ROLE_HOME[role] || '/status'} replace/>;

const RootPage = ({role}) => {
    return (
        <Routes>
            <Route path="/employees" element={<Guard role={role} path="/employees"><DatabaseBlack/></Guard>}/>
            {/* guruh ichi — manzilda id: sahifa yangilanganda ham shu guruhda qoladi */}
            <Route path="/employees/:groupId" element={<Guard role={role} path="/employees"><DatabaseAdd/></Guard>}/>
            <Route path="/status" element={<Status/>}/>
            <Route path="/report" element={<Report/>}/>
            {/* eski "Terminal hisoboti" sahifasi Hisobot bilan almashtirilgan (u sanasiz so'rov yuborib, doim bo'sh chiqardi) */}
            <Route path="/terminal-report" element={<Navigate to="/report" replace/>}/>
            <Route path="/setting" element={<Guard role={role} path="/setting"><Setting/></Guard>}/>
            <Route path='*' element={<Navigate to={ROLE_HOME[role] || '/status'}/>}/>
        </Routes>
    );
};

export default RootPage;