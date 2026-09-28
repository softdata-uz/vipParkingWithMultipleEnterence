import React, {useEffect, useState} from "react";

import "./multipleEnterence.css";

import logo from "../../images/softdataLogo.svg";
import {Link} from "react-router-dom";

import enterIcon from "../../images/new/log-in-02.png";
import carFlag from "../../images/new/Group 55888 (4).png";
import addGroupIcon from "../../images/Illustration.png";
import emptyIcon from "../../images/new/Group.png";
import plusIcon from "../../images/plus.png";

import GroupListModal from "./GroupListModal";

import axios from "axios";
import {ip} from "../../ip";

import {RiDeleteBin6Line} from "react-icons/ri";

import socketIOClient from "socket.io-client";

import {
    Checkbox,
    Input
} from "antd";

import moment from "moment";


/* ============================================================
   VIEWER SETTINGS
============================================================ */

const MIN_VIEWERS = 1;
const MAX_VIEWERS = 12;
const DEFAULT_VIEWERS = 3;


const clampViewerCount = (value) => {

    const num = Number(value);

    if (!Number.isFinite(num)) {
        return DEFAULT_VIEWERS;
    }

    return Math.min(
        Math.max(
            Math.trunc(num),
            MIN_VIEWERS
        ),
        MAX_VIEWERS
    );
};


const buildViewerIds = (count) => {

    return Array.from(
        {length: count},
        (_, i) => i + 1
    );
};


const readStoredViewerIds = () => {

    try {

        const stored = JSON.parse(
            localStorage.getItem("viewerIds")
        );

        if (Array.isArray(stored)) {

            const ids = stored
                .map(Number)
                .filter(Number.isFinite);

            if (ids.length > 0) {

                return ids.slice(
                    0,
                    MAX_VIEWERS
                );
            }
        }

    } catch (error) {

        console.log(
            "viewerIds parse error:",
            error
        );
    }

    return buildViewerIds(
        DEFAULT_VIEWERS
    );
};



const MultipleEnterence = () => {


    /* ============================================================
       TIME
    ============================================================ */

    const [time, setTime] = useState(
        new Date()
    );


    useEffect(() => {

        const interval = setInterval(() => {

            setTime(
                new Date()
            );

        }, 1000);


        return () => {

            clearInterval(
                interval
            );
        };

    }, []);


    const formatDate = (date) => {

        const day = String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


        const month = String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


        const year =
            date.getFullYear();


        const hours = String(
            date.getHours()
        ).padStart(
            2,
            "0"
        );


        const minutes = String(
            date.getMinutes()
        ).padStart(
            2,
            "0"
        );


        return `${day}.${month}.${year}, ${hours}:${minutes}`;
    };



    /* ============================================================
       GROUP MODAL
    ============================================================ */

    const [
        openGroup,
        setOpenGroup
    ] = useState(false);


    const [
        groupData,
        setGroupData
    ] = useState([]);


    const [
        dataGroupViewer,
        setDataGroupViewer
    ] = useState({});



    /* ============================================================
       GET CAMERA GROUPS
    ============================================================ */

    const getGroupData = async () => {

        try {

            const response =
                await axios.get(
                    `${ip}/api/all/camera-group`
                );


            const {data} =
                response.data;


            setGroupData(

                data.filter(
                    (item) =>
                        item.viewer === 0
                )
            );


            const scrnCameraGroup = {};


            data.forEach(
                (item) => {

                    if (
                        item.viewer !== 0
                    ) {

                        scrnCameraGroup[
                            item.viewer
                        ] = item;
                    }
                }
            );


            setDataGroupViewer(
                scrnCameraGroup
            );


        } catch (error) {

            console.log(
                error.response
            );
        }
    };


    useEffect(() => {

        getGroupData();

    }, []);



    /* ============================================================
       EVENT DATA
    ============================================================ */

    const [
        eventDataObj,
        setEventDataObj
    ] = useState({});



    /* ============================================================
       VIEWER IDS
    ============================================================ */

    const [
        viewerIds,
        setViewerIds
    ] = useState(
        readStoredViewerIds
    );


    const [
        viewerCount,
        setViewerCount
    ] = useState(
        () =>
            String(
                viewerIds.length
            )
    );


    /*
     * ENG MUHIM QISM
     *
     * Agar faqat 1 ta viewer bo'lsa
     * alohida layout ishlatiladi.
     */
    const isSingleViewer =
        viewerIds.length === 1;



    /* ============================================================
       SET VIEWER COUNT
    ============================================================ */

    const handleSetViewerIds = () => {

        const count =
            clampViewerCount(
                viewerCount
            );


        const newIds =
            buildViewerIds(
                count
            );


        setViewerCount(
            String(count)
        );


        setViewerIds(
            newIds
        );


        localStorage.setItem(
            "viewerCount",
            String(count)
        );


        localStorage.setItem(
            "viewerIds",
            JSON.stringify(
                newIds
            )
        );
    };



    /* ============================================================
       GET EVENT
    ============================================================ */

    const getEventDataByViewerId =
        async (viewerId) => {

            try {

                const response =
                    await axios.get(
                        `${ip}/api/temp/${viewerId}`
                    );


                setEventDataObj(
                    (prev) => ({

                        ...prev,

                        [viewerId]:
                            response.data.data,
                    })
                );


            } catch (error) {

                console.error(
                    `Error fetching data for viewer ${viewerId}:`,
                    error
                );
            }
        };



    /* ============================================================
       VIEWER CHANGE
    ============================================================ */

    useEffect(() => {

        viewerIds.forEach(
            (viewerId) => {

                getEventDataByViewerId(
                    viewerId
                );
            }
        );

    }, [viewerIds]);



    /* ============================================================
       SOCKET
    ============================================================ */

    useEffect(() => {

        const socket =
            socketIOClient(
                ip
            );


        socket.on(
            "enter",
            (viewerId) => {

                getEventDataByViewerId(
                    viewerId
                );
            }
        );


        return () => {

            socket.disconnect();
        };

    }, []);



    /* ============================================================
       GROUP SELECT
    ============================================================ */

    const [
        screenViewerNum,
        setScreenViewerNum
    ] = useState(null);


    const openSelectGroup =
        (viewerId) => {

            setScreenViewerNum(
                viewerId
            );

            setOpenGroup(
                true
            );
        };



    /* ============================================================
       DELETE GROUP
    ============================================================ */

    const [
        deleteViewerNum,
        setDeleteViewerNum
    ] = useState(null);


    const onChange =
        (e, id) => {

            setDeleteViewerNum(

                e.target.checked
                    ? id
                    : null
            );
        };


    const deleteViewer = () => {

        axios.put(
            `${ip}/api/viewer/camera-group/${deleteViewerNum}`,
            {
                viewer: 0
            }
        )
            .then(() => {

                viewerIds.forEach(
                    (viewerId) => {

                        getEventDataByViewerId(
                            viewerId
                        );
                    }
                );


                getGroupData();


                setDeleteViewerNum(
                    null
                );

            })
            .catch(
                (error) => {

                    console.log(
                        error
                    );
                }
            );
    };



    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <div className="multipleEnterence">


            {/* ====================================================
                HEADER
            ==================================================== */}

            <div className="multipleEnterence_header">


                <div className="multipleEnterence_header_left">

                    <img
                        src={logo}
                        alt="SoftData"
                    />

                </div>



                <div className="multipleEnterence_header_right">


                    <div className="multipleEnterence_header_right_delete_and_input">


                        {
                            deleteViewerNum && (

                                <div
                                    className="multipleEnterence_header_right_delete"
                                    onClick={deleteViewer}
                                >

                                    <RiDeleteBin6Line
                                        size={22}
                                    />

                                    <p>
                                        O'chirish
                                    </p>

                                </div>
                            )
                        }



                        <div className="multipleEnterence_header_right_input">


                            <p>
                                Oynalar sonini kiriting :
                            </p>


                            <Input
                                placeholder="Oynalar sonini"

                                value={viewerCount}

                                maxLength={2}

                                onChange={
                                    (e) => {

                                        const raw =
                                            e.target.value;


                                        if (
                                            raw === ""
                                            ||
                                            /^\d+$/.test(raw)
                                        ) {

                                            setViewerCount(
                                                raw
                                            );
                                        }
                                    }
                                }

                                onPressEnter={
                                    handleSetViewerIds
                                }

                                onBlur={
                                    () => {

                                        setViewerCount(
                                            String(
                                                clampViewerCount(
                                                    viewerCount
                                                )
                                            )
                                        );
                                    }
                                }
                            />


                            <div
                                className="multipleEnterence_header_right_input_button"
                                onClick={
                                    handleSetViewerIds
                                }
                            >

                                Saqlash

                            </div>

                        </div>

                    </div>



                    <div className="multipleEnterence_header_right_inner">

                        <h2>
                            {formatDate(time)}
                        </h2>

                    </div>



                    <div className="multipleEnterence_header_right_inner">

                        <Link to="/login">

                            <img
                                src={enterIcon}
                                alt=""
                            />

                            <span>
                                Tizimga kirish
                            </span>

                        </Link>

                    </div>


                </div>

            </div>



            {/* ====================================================
                BODY
            ==================================================== */}

            <div
                className={
                    `multipleEnterence_body ${
                        isSingleViewer
                            ? "singleViewerLayout"
                            : ""
                    }`
                }
            >


                {
                    viewerIds.map(
                        (viewerId) => {


                            const data =
                                eventDataObj[
                                    viewerId
                                ];



                            /* ====================================
                               GROUP YO'Q
                            ==================================== */

                            if (!data) {

                                return (

                                    <div
                                        className="multipleEnterence_body_group"
                                        key={viewerId}
                                    >

                                        <div className="multipleEnterence_body_group_inner">


                                            <img
                                                src={addGroupIcon}
                                                alt=""
                                            />


                                            <p>
                                                Guruh topilmadi
                                            </p>


                                            <span>
                                                Guruh shakllantirilgan bo‘lsa qo‘shish talab etiladi
                                            </span>


                                            <div
                                                className="multipleEnterence_body_group_inner_add"
                                                onClick={
                                                    () =>
                                                        openSelectGroup(
                                                            viewerId
                                                        )
                                                }
                                            >

                                                <img
                                                    src={plusIcon}
                                                    alt=""
                                                />

                                                Qo’shish

                                            </div>

                                        </div>

                                    </div>
                                );
                            }



                            /* ====================================
                               DATA BO'SH
                            ==================================== */

                            if (
                                data.length === 0
                            ) {

                                return (

                                    <div
                                        className="multipleEnterence_body_empty"
                                        key={viewerId}
                                    >


                                        <div className="multipleEnterence_body_card_information_groupName">


                                            <div className="multipleEnterence_body_card_information_groupName_left">

                                                <Checkbox
                                                    onChange={
                                                        (e) =>
                                                            onChange(
                                                                e,
                                                                dataGroupViewer[
                                                                    viewerId
                                                                ]?.id
                                                            )
                                                    }
                                                />

                                            </div>



                                            <div className="multipleEnterence_body_card_information_corridor corridor_green">

                                                <p>
                                                    {
                                                        dataGroupViewer[
                                                            viewerId
                                                        ]?.name
                                                    }
                                                </p>

                                            </div>


                                        </div>



                                        <div className="multipleEnterence_body_empty_body">


                                            <div className="multipleEnterence_body_empty_inner">


                                                <img
                                                    src={emptyIcon}
                                                    alt=""
                                                />


                                                <p>
                                                    Ma’lumot topilmadi
                                                </p>


                                            </div>

                                        </div>


                                    </div>
                                );
                            }



                            /* ====================================
                               DATA MAVJUD
                            ==================================== */

                            const vehicle =
                                data[0]?.vehicle_data;


                            const staff =
                                data[0]?.staff_data;


                            const isAllowed =
                                Boolean(
                                    staff?.id
                                );


                            const directionText =
                                vehicle?.direction ===
                                "enter"
                                    ? "KIRISH"
                                    : "CHIQISH";


                            return (

                                <div
                                    className={
                                        `multipleEnterence_body_card ${
                                            isSingleViewer
                                                ? "multipleEnterence_body_card_single"
                                                : ""
                                        }`
                                    }

                                    key={viewerId}
                                >


                                    {/* ============================
                                        INFO + IMAGE
                                    ============================ */}

                                    <div className="multipleEnterence_body_card_main">


                                        {/* LEFT INFORMATION */}

                                        <div className="multipleEnterence_body_card_information">


                                            <div className="multipleEnterence_body_card_information_groupName">


                                                <div className="multipleEnterence_body_card_information_groupName_left">

                                                    <Checkbox
                                                        onChange={
                                                            (e) =>
                                                                onChange(
                                                                    e,
                                                                    dataGroupViewer[
                                                                        viewerId
                                                                    ]?.id
                                                                )
                                                        }
                                                    />

                                                </div>



                                                <div className="multipleEnterence_body_card_information_corridor corridor_green">

                                                    <p>
                                                        {
                                                            dataGroupViewer[
                                                                viewerId
                                                            ]?.name
                                                        }
                                                    </p>

                                                </div>

                                            </div>



                                            <div className="multipleEnterence_body_card_information_inner">

                                                <span>
                                                    F.I.SH
                                                </span>

                                                <p>
                                                    {
                                                        staff?.fullname
                                                        ||
                                                        "-"
                                                    }
                                                </p>

                                            </div>



                                            <div className="multipleEnterence_body_card_information_inner">

                                                <span>
                                                    Boshqarma
                                                </span>

                                                <p>
                                                    {
                                                        staff?.position
                                                        ||
                                                        "-"
                                                    }
                                                </p>

                                            </div>



                                            <div className="multipleEnterence_body_card_information_inner">

                                                <span>
                                                    Vaqt
                                                </span>

                                                <p>

                                                    {
                                                        vehicle?.the_date

                                                            ?

                                                            moment(
                                                                vehicle.the_date
                                                            ).format(
                                                                "DD.MM.YYYY, HH:mm:ss"
                                                            )

                                                            :

                                                            "-"
                                                    }

                                                </p>

                                            </div>



                                            <div className="multipleEnterence_body_card_information_inner">

                                                <span>
                                                    Avtomobilning davlat raqami
                                                </span>

                                                <p>

                                                    {
                                                        vehicle?.vehicle_number
                                                        ||
                                                        "-"
                                                    }

                                                    <img
                                                        src={carFlag}
                                                        alt=""
                                                    />

                                                </p>

                                            </div>


                                        </div>



                                        {/* RIGHT IMAGE */}

                                        <div className="multipleEnterence_body_card_img">

                                            <img
                                                src={
                                                    `${ip}/api/image/temp/${vehicle?.ip_address}/full_image/${vehicle?.the_date}`
                                                }

                                                className="car_img_full"

                                                alt="Avtomobil"
                                            />

                                        </div>


                                    </div>



                                    {/* ============================
                                        STATUS - ALWAYS BOTTOM
                                    ============================ */}

                                    <div
                                        className={
                                            `multipleEnterence_body_card_status ${
                                                isAllowed
                                                    ? "activeS"
                                                    : "noActiveS"
                                            }`
                                        }
                                    >

                                        {
                                            directionText
                                        }

                                        {" : "}

                                        {
                                            isAllowed
                                                ? "RUXSAT"
                                                : "TAQIQLANADI"
                                        }

                                    </div>


                                </div>
                            );
                        }
                    )
                }

            </div>



            {/* ====================================================
                GROUP MODAL
            ==================================================== */}

            <GroupListModal

                openGroup={
                    openGroup
                }

                setOpenGroup={
                    setOpenGroup
                }

                groupData={
                    groupData
                }

                setGroupData={
                    setGroupData
                }

                screenViewerNum={
                    screenViewerNum
                }

                getEventDataByViewerId={
                    getEventDataByViewerId
                }

                setDataGroupViewer={
                    setDataGroupViewer
                }
            />


        </div>
    );
};


export default MultipleEnterence;