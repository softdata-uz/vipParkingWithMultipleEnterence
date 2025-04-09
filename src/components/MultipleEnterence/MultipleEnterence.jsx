import React, {useEffect, useState} from 'react';

import './multipleEnterence.css';
import logo from "../../images/softdataLogo.svg";
import {Link} from "react-router-dom";
import enterIcon from "../../images/new/log-in-02.png";
import carFlag from "../../images/new/Group 55888 (4).png";
import carImg from '../../images/new/11012023_162101(712)_full_image 1.png';
import addGroupIcon from '../../images/managmentImg.svg';
import emptyIcon from '../../images/new/Group.png';

import GroupListModal from "./GroupListModal";
import axios from "axios";
import {ip} from "../../ip";
import {RiDeleteBin6Line} from 'react-icons/ri';

import socketIOClient from "socket.io-client";
import {Checkbox, Input} from "antd";
import moment from "moment";

const MultipleEnterence = () => {

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}.${month}.${year}, ${hours}:${minutes}`;
    };

    const [openGroup, setOpenGroup] = useState(false);
    const [groupData, setGroupData] = useState([]);


    const [dataGroupViewer, setDataGroupViewer] = useState({
        // 1 : {},
        // 2 : {},
        // 3 : {},
    });

    const getGroupData = async () => {
        try {
            const response = await axios.get(`${ip}/api/all/camera-group`);

            // const { data } = response;
            // const newData = data.data.map((item, index) => ({
            //     ...item,
            //     key: index + 1,
            //     name: item.name,
            //     viewer: item.viewer
            // }));

            // const groupedData = {};
            // newData.forEach(item => {
            //     if (item.viewer !== 0) {
            //         groupedData[item.viewer] = item;
            //     }
            // });
            //
            // setDataGroupViewer(groupedData);

            // setGroupData(newData);

            const {data} = response.data;

            setGroupData(data.filter((item) => item.viewer === 0));
            const scrnCameraGroup = {};
            data.forEach((item) => {
                if (item.viewer !== 0) {
                    scrnCameraGroup[item.viewer] = item;
                }
            });
            setDataGroupViewer(scrnCameraGroup);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        getGroupData();
    }, []);


    // const [eventDataObj, setEventDataObj] = useState({});
    //
    // const getEventDataByViewerId = async (viewerId) => {
    //     try {
    //         const response = await axios.get(`http://127.0.0.1:11000/api/temp/${viewerId}`);
    //         setEventDataObj((prev) => ({
    //             ...prev,
    //             [viewerId]: response.data.data,
    //         }));
    //     } catch (error) {
    //         console.error(`Error fetching data for viewer ${viewerId}:`, error);
    //     }
    // };
    //
    // useEffect(() => {
    //     // Dastlab yuklab olish
    //     [1, 2, 3].forEach(getEventDataByViewerId);
    //     // Socket ulanish
    //     const socket = socketIOClient(ip);
    //     socket.on("new_data", (viewerId) => {
    //         getEventDataByViewerId(viewerId);
    //     });
    //
    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);

    const [eventDataObj, setEventDataObj] = useState({});

    // const viewerIds = [1, 2 ,3]; // 4 tagacha card ko‘rsatish
    const [viewerCount, setViewerCount] = useState(() => {
        const storedCount = localStorage.getItem("viewerCount");
        return storedCount ? Number(storedCount) : 3;
    });

    const [viewerIds, setViewerIds] = useState(() => {
        const storedIds = localStorage.getItem("viewerIds");
        return storedIds ? JSON.parse(storedIds) : [1, 2, 3];
    });

    const handleSetViewerIds = () => {
        const newIds = Array.from({ length: viewerCount }, (_, i) => i + 1);
        setViewerIds(newIds);

        // localStorage'ga saqlash
        localStorage.setItem("viewerCount", viewerCount);
        localStorage.setItem("viewerIds", JSON.stringify(newIds));
    };



    const getEventDataByViewerId = async (viewerId) => {

        // console.log("ishladi "+viewerId)

        try {
            const response = await axios.get(`${ip}/api/temp/${viewerId}`);
            setEventDataObj((prev) => ({
                ...prev,
                [viewerId]: response.data.data,
            }));
        } catch (error) {
            console.error(`Error fetching data for viewer ${viewerId}:`, error);
        }
    };

    useEffect(() => {
        viewerIds.forEach(getEventDataByViewerId);
        const socket = socketIOClient(ip);
        socket.on("enter", (viewerId) => {
            getEventDataByViewerId(viewerId);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const [screenViewerNum, setScreenViewerNum] = useState(null);
    const openSelectGroup = (viewerId) => {
        setScreenViewerNum(viewerId);
        setOpenGroup(true);
    }
    const [deleteViewerNum, setDeleteViewerNum] = useState(null);
    const onChange = (e, id) => {
        setDeleteViewerNum(e.target.checked ? id : null);
    };

    const deleteViewer = () => {
        axios.put(`${ip}/api/viewer/camera-group/${deleteViewerNum}`, {viewer: 0})
            .then((res) => {
                viewerIds.forEach(getEventDataByViewerId);
                // getEventDataByViewerId(screenViewerNum);
                getGroupData();
                setDeleteViewerNum(null);
            })
            .catch((err) => {
                console.log(err);
            });
    }


    return (
        <div className="multipleEnterence">
            <div className="multipleEnterence_header">
                <div className="multipleEnterence_header_left">
                    <img src={logo}/>
                </div>

                <div className="multipleEnterence_header_right">
                    <div className="multipleEnterence_header_right_delete_and_input">
                        {deleteViewerNum && <div className="multipleEnterence_header_right_delete"
                                                 onClick={deleteViewer}>
                            <RiDeleteBin6Line size={22}/><p>O'chirish</p>
                        </div>}
                        <div className="multipleEnterence_header_right_input">
                                <p>Oynalar sonini kiriting : </p>
                                <Input placeholder="Oynalar sonini"
                                       value={viewerCount}
                                       onChange={(e) => {
                                           const val = Number(e.target.value);
                                           setViewerCount(val);
                                           localStorage.setItem("viewerCount", val); // shu yerda saqlaymiz
                                       }}
                                />
                            <div className="multipleEnterence_header_right_input_button" onClick={handleSetViewerIds}>Saqlash</div>
                        </div>
                    </div>
                    <div className="multipleEnterence_header_right_inner">
                        <h2>{formatDate(time)}</h2>
                    </div>
                    <div className="multipleEnterence_header_right_inner">
                        <Link to="/login">
                            <img src={enterIcon}/> <span>Tizimga kirish</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="multipleEnterence_body">
                {viewerIds.map((viewerId) => {
                    const data = eventDataObj[viewerId];
                    // 3: Umuman yo'q bo‘lsa
                    if (!data) {
                        return (
                            <div className="multipleEnterence_body_group">
                                <div className='multipleEnterence_body_group_inner'>
                                    <img src={addGroupIcon}/>
                                    <p>Iltimos guruhni tanlang</p>
                                    <div className="multipleEnterence_body_group_inner_add"
                                         onClick={() => openSelectGroup(viewerId)}>
                                        {"Tanlang"}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // 2: Data bor, ammo bo‘sh array
                    if (data.length === 0) {
                        return (
                            <div className="multipleEnterence_body_empty">
                                <div className="multipleEnterence_body_card_information_groupName">
                                    <div className="multipleEnterence_body_card_information_groupName_left">
                                        <Checkbox onChange={(e) => onChange(e, dataGroupViewer[viewerId]?.id)}></Checkbox>
                                    </div>
                                    <div className="multipleEnterence_body_card_information_corridor corridor_green">
                                        <p>{dataGroupViewer[viewerId]?.name}</p>
                                    </div>
                                </div>
                                <div className="multipleEnterence_body_empty_body">
                                    <div className="multipleEnterence_body_empty_inner">
                                        <img src={emptyIcon}/>
                                        <p>Ma’lumot topilmadi</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    // 1: Ma'lumot mavjud
                    const vehicle = data[0].vehicle_data;
                    const staff = data[0].staff_data;
                    // const storedData = localStorage.getItem("viewerData");
                    // if (storedData) {
                    //     setDataGroupViewer(JSON.parse(storedData));
                    // }
                    return (
                        <div className="multipleEnterence_body_card">
                            <div className="multipleEnterence_body_card_information">
                                <div className="multipleEnterence_body_card_information_groupName">
                                    <div className="multipleEnterence_body_card_information_groupName_left">
                                        <Checkbox
                                            onChange={(e) => onChange(e, dataGroupViewer[viewerId]?.id)}></Checkbox>
                                    </div>
                                    <div className="multipleEnterence_body_card_information_corridor corridor_green">
                                        <p>{dataGroupViewer[viewerId]?.name}</p>
                                    </div>
                                </div>
                                <div className="multipleEnterence_body_card_information_inner"><span>F.I.SH</span>
                                    <p>{data[0]?.staff_data?.fullname || "-"}</p></div>
                                <div className="multipleEnterence_body_card_information_inner"><span>Boshqarma</span>
                                    <p>{data[0]?.staff_data?.position || "-"}</p></div>
                                <div className="multipleEnterence_body_card_information_inner"><span>Vaqt</span>
                                    <p>{data[0]?.vehicle_data?.the_date ? moment(data[0]?.vehicle_data?.the_date).format('DD.MM.YYYY, HH:mm:ss') : "-"}</p>
                                </div>
                                <div className="multipleEnterence_body_card_information_inner">
                                    <span>Avtomobilning davlat raqami</span>
                                    <p>{data[0]?.vehicle_data?.vehicle_number || '-'} <img src={carFlag}/></p>
                                </div>
                                {
                                    data[0]?.staff_data?.id ?
                                        <div className="multipleEnterence_body_card_information_alert activeS">
                                            {data[0]?.vehicle_data?.direction === "enter" ? "KIRISH" : "CHIQISH"} :
                                            RUXSAT</div>
                                        :
                                        <div className="multipleEnterence_body_card_information_alert noActiveS">
                                            {data[0]?.vehicle_data?.direction === "enter" ? "KIRISH" : "CHIQISH"} :
                                            TAQIQLANADI</div>
                                }
                            </div>
                            <div className="multipleEnterence_body_card_img">
                                <img
                                    src={`${ip}/api/image/temp/${data[0]?.vehicle_data?.ip_address}/full_image/${data[0]?.vehicle_data?.the_date}`}
                                    className="car_img_full"/>
                            </div>
                        </div>
                    );
                })}
                {/*<div className="multipleEnterence_body_group">*/}
                {/*    <div className='multipleEnterence_body_group_inner'>*/}
                {/*        <img src={addGroupIcon}/>*/}
                {/*        <p>Iltimos guruhni tanlang</p>*/}
                {/*        <div className="multipleEnterence_body_group_inner_add" onClick={()=>setOpenGroup(true)}>*/}
                {/*            {"Tanlang"}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className="multipleEnterence_body_empty">*/}
                {/*    <div className="multipleEnterence_body_empty_inner">*/}
                {/*        <img src={emptyIcon}/>*/}
                {/*        <p>Ma’lumot topilmadi</p>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className="multipleEnterence_body_card">*/}
                {/*    <div className="multipleEnterence_body_card_information">*/}
                {/*        <div className="multipleEnterence_body_card_information_corridor corridor_green"><p>1-yo‘lak</p></div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner">*/}
                {/*            <span>Avtomobilning davlat raqami</span>*/}
                {/*            <p>XX X XXX XX <img src={carFlag}/></p>*/}
                {/*        </div>*/}
                {/*        <div className="multipleEnterence_body_card_information_alert activeS">Kirishga ruxsat</div>*/}
                {/*    </div>*/}
                {/*    <div className="multipleEnterence_body_card_img">*/}
                {/*        <img src={carImg} className="car_img_full"/>*/}
                {/*    </div>*/}
                {/*</div>*/}


                {/*<div className="multipleEnterence_body_card">*/}
                {/*    <div className="multipleEnterence_body_card_information">*/}
                {/*        <div className="multipleEnterence_body_card_information_corridor corridor_warning">*/}
                {/*            <p>1-yo‘lak</p></div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p>*/}
                {/*        </div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p>*/}
                {/*        </div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p>*/}
                {/*        </div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner">*/}
                {/*            <span>Avtomobilning davlat raqami</span>*/}
                {/*            <p>XX X XXX XX <img src={carFlag}/></p>*/}
                {/*        </div>*/}
                {/*        <div className="multipleEnterence_body_card_information_alert activeS">Kirishga ruxsat</div>*/}
                {/*    </div>*/}
                {/*    <div className="multipleEnterence_body_card_img">*/}
                {/*        <img src={carImg} className="car_img_full"/>*/}
                {/*    </div>*/}
                {/*</div>*/}


                {/*<div className="multipleEnterence_body_card">*/}
                {/*    <div className="multipleEnterence_body_card_information">*/}
                {/*        <div className="multipleEnterence_body_card_information_corridor corridor_blue"><p>1-yo‘lak</p>*/}
                {/*        </div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p>*/}
                {/*        </div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p>*/}
                {/*        </div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p>*/}
                {/*        </div>*/}
                {/*        <div className="multipleEnterence_body_card_information_inner">*/}
                {/*            <span>Avtomobilning davlat raqami</span>*/}
                {/*            <p>XX X XXX XX <img src={carFlag}/></p>*/}
                {/*        </div>*/}
                {/*        <div className="multipleEnterence_body_card_information_alert activeS">Kirishga ruxsat</div>*/}
                {/*    </div>*/}
                {/*    <div className="multipleEnterence_body_card_img">*/}
                {/*        <img src={carImg} className="car_img_full"/>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

            <GroupListModal
                openGroup={openGroup}
                setOpenGroup={setOpenGroup}
                groupData={groupData}
                setGroupData={setGroupData}
                screenViewerNum={screenViewerNum}
                getEventDataByViewerId={getEventDataByViewerId}
                setDataGroupViewer={setDataGroupViewer}
            />

        </div>
    );
};

export default MultipleEnterence;