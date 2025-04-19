import React, {useState} from 'react';
import {ip} from "../ip";
import logo from "../images/softdataLogo.svg";
import {AiOutlineAppstore} from "react-icons/ai";
import {RiSettingsLine} from "react-icons/ri";
import {TbFileText} from "react-icons/tb";
import {BsPeople} from "react-icons/bs";
import {AiOutlineCar} from "react-icons/ai";
import {BrowserRouter, Link} from 'react-router-dom';
import {DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined,} from '@ant-design/icons';
import {Popover} from 'antd';
import {MdExitToApp} from "react-icons/md";

import './layout.css';
import RootPage from "../pages/root";

import {storage} from "../services";
import {useDispatch, useSelector} from "react-redux";
import {changeAvatar, getMeAction, LoginFailure, loginResponse, LoginSuccess} from "../redux/action/action";

const Layout = (props) => {

    const [pathName, setPathName] = useState('');
    const token = storage.local.get("token");
    const user = storage.local.get("user");
    const {isAuthenticated} = useSelector(store => store.auth)
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(LoginFailure());
        localStorage.removeItem('vipparking-token');
    }

    const [open, setOpen] = useState(false);
    const [openPopover, setOpenPopover] = useState(false);

    const hide = () => {
        setOpenPopover(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpenPopover(newOpen);
    };
    const openChangeAdmin = () => {
        setOpen(true);
        hide();
    }


    return (
        <BrowserRouter>
            <div className="layout">
                <div className="layout_header">
                    <div className="layout_header_left">
                        <div className="layout_header_logo">
                            <Link to="/user-list">
                                <img className="AirLogo" src={logo}/>
                            </Link>
                        </div>

                        <div className="layout_header_vertical">

                        </div>

                        <div className="layout_header_link">
                            {/*<div className="layout_header_link_inner"><Link to="/"*/}
                            {/*                                                className={`${pathName === "/" ? "layout_header_link_inner_link active" : "layout_header_link_inner_link"}`}>*/}
                            {/*    <AiOutlineAppstore className="Icon"/>Asosiy oyna</Link></div>*/}
                            {/*<div className="layout_header_link_vertical"></div>*/}
                            <div className="layout_header_link_inner">
                                <Link to="/employees" className={`${pathName === "/employees" ? "layout_header_link_inner_link active" : "layout_header_link_inner_link"}`}>
                                <BsPeople className="Icon"/>
                                    Xodimlar
                                </Link>
                            </div>
                            <div className="layout_header_link_vertical"></div>

                            <div className="layout_header_link_inner"><Link to="/status"
                                                                            className={`${pathName === "/status" ? "layout_header_link_inner_link active" : "layout_header_link_inner_link"}`}>
                                <AiOutlineCar className="Icon" />Joriy holat</Link></div>
                            <div className="layout_header_link_vertical"></div>

                            <div className="layout_header_link_inner"><Link to="/report"
                                                                            className={`${pathName === "/report" ? "layout_header_link_inner_link active" : "layout_header_link_inner_link"}`}>
                                <TbFileText className="Icon"/>Hisobot</Link></div>
                            <div className="layout_header_link_vertical"></div>

                            {/*<div className="layout_header_link_inner"><Link to="/terminal-report"*/}
                            {/*                                                className={`${pathName === "/terminal-report" ? "layout_header_link_inner_link active" : "layout_header_link_inner_link"}`}>*/}
                            {/*    <TbFileText className="Icon"/>Terminal hisoboti</Link></div>*/}
                            {/*<div className="layout_header_link_vertical"></div>*/}

                            <div className="layout_header_link_inner"><Link to="/setting"
                                                                            className={`${pathName === "/setting" ? "layout_header_link_inner_link active" : "layout_header_link_inner_link"}`}>
                                <RiSettingsLine className="Icon"/>Sozlamalar</Link></div>
                        </div>
                    </div>
                    <div className="layout_header_right">
                        {/*<div className="layout_header_right_exit" onClick={logout}>*/}
                            <Popover
                                open={openPopover}
                                onOpenChange={handleOpenChange}
                                content={<div className="contentHeader">
                                    {/*<div className="contentHeader_inner" onClick={openChangeAdmin}>*/}
                                    {/*    <FaEdit/>*/}
                                    {/*    <p>{t("Tahrirlash")}</p></div>*/}
                                    <div className="contentHeader_inner" onClick={logout}>
                                        <MdExitToApp/>
                                        <p>Chiqish</p>
                                    </div>
                                </div>} trigger="click" placement="leftBottom">
                                <div className="layout_header_user">
                                    {
                                        // user && <img src={`${ip}/api/admins/${user.id}/img`} alt=""/>
                                        user && <img src={`${ip}/${user.image}`} alt=""/>
                                    }
                                    <p>{user?.lastname + " " + user?.firstname + " " + user?.fathersname}</p>
                                </div>
                            </Popover>
                        {/*</div>*/}
                    </div>


                </div>

                <div className="layout_body">
                    <RootPage setPathName={setPathName}/>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default Layout;