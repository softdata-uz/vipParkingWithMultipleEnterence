import React, {useEffect, useState} from 'react';

import './multipleEnterence.css';
import logo from "../../images/softdataLogo.svg";
import {Link} from "react-router-dom";
import enterIcon from "../../images/new/log-in-02.png";
import carFlag from "../../images/new/Group 55888 (4).png";
import carImg from '../../images/new/11012023_162101(712)_full_image 1.png';
import addGroupIcon from '../../images/Illustration.png';
import emptyIcon from '../../images/new/Group.png';
import plusIcon from '../../images/plus.png';

import GroupListModal from "./GroupListModal";
import axios from "axios";
import {ip} from "../../ip";
import {RiDeleteBin6Line} from 'react-icons/ri';

import socketIOClient from "socket.io-client";
import {Checkbox, Input} from "antd";
import moment from "moment";

/* ====================================================================
 *  Oynalar soni uchun cheklovlar.
 *
 *  Ilgari `Number(e.target.value)` to'g'ridan-to'g'ri saqlanardi:
 *    - input tozalansa  -> Number("")  = 0
 *    - harf yozilsa     -> Number("a") = NaN
 *  Ikkala holatda ham Array.from({length: val}) BO'SH massiv qaytaradi,
 *  ya'ni ekranda bironta oyna qolmaydi. Ustiga bu qiymat localStorage'ga
 *  darhol yozilardi — sahifa qayta yuklansa ham bo'sh ekran ochilardi.
 * ================================================================== */
const MIN_VIEWERS = 1;
const MAX_VIEWERS = 12;   // ekran sig'imiga qarab o'zgartirsa bo'ladi
const DEFAULT_VIEWERS = 3;

const clampViewerCount = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return DEFAULT_VIEWERS;
    return Math.min(Math.max(Math.trunc(num), MIN_VIEWERS), MAX_VIEWERS);
};

const buildViewerIds = (count) =>
    Array.from({length: count}, (_, i) => i + 1);

// JSON.parse buzilgan qiymatda xato tashlaydi va sahifa umuman ochilmay
// qoladi — shuning uchun try/catch va turni tekshirish
const readStoredViewerIds = () => {
    try {
        const stored = JSON.parse(localStorage.getItem("viewerIds"));
        if (Array.isArray(stored)) {
            const ids = stored.map(Number).filter(Number.isFinite);
            if (ids.length > 0) return ids.slice(0, MAX_VIEWERS);
        }
    } catch (e) {
        // buzilgan qiymat — default'ga tushamiz
    }
    return buildViewerIds(DEFAULT_VIEWERS);
};

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


    const [dataGroupViewer, setDataGroupViewer] = useState({});

    const getGroupData = async () => {
        try {
            const response = await axios.get(`${ip}/api/all/camera-group`);

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


    const [eventDataObj, setEventDataObj] = useState({});

    // Qo'llanilgan oynalar ro'yxati (localStorage'dan)
    const [viewerIds, setViewerIds] = useState(readStoredViewerIds);

    // Input'dagi QORALAMA qiymat — foydalanuvchi yozayotganda vaqtincha
    // bo'sh bo'lishi mumkin. Haqiqiy qiymatga faqat "Saqlash" bosilganda
    // aylanadi, shuning uchun yarim yozilgan son ekranni buzmaydi.
    const [viewerCount, setViewerCount] = useState(() => String(viewerIds.length));

    const handleSetViewerIds = () => {
        const count = clampViewerCount(viewerCount);
        const newIds = buildViewerIds(count);

        setViewerCount(String(count));   // input'ni tuzatilgan qiymatga qaytaramiz
        setViewerIds(newIds);

        // Ikkalasi BIRGA yoziladi. Ilgari `viewerCount` har bosishda alohida
        // saqlanardi — natijada qayta yuklaganda input 5 ni ko'rsatib,
        // ekranda 3 ta oyna turishi mumkin edi.
        localStorage.setItem("viewerCount", String(count));
        localStorage.setItem("viewerIds", JSON.stringify(newIds));
    };


    const getEventDataByViewerId = async (viewerId) => {
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

    // Oynalar ro'yxati o'zgarganda ham qayta yuklanadi — ilgari deps [] edi,
    // shuning uchun "Saqlash" bosib oyna qo'shilganda yangi oynalar sahifa
    // yangilanmaguncha "Guruh topilmadi" bo'lib turardi
    useEffect(() => {
        viewerIds.forEach(getEventDataByViewerId);
    }, [viewerIds]);

    // Socket alohida: bir marta ulanadi va oynalar soni o'zgarganda
    // uzilib-ulanmaydi (server viewerId ni o'zi yuboradi)
    useEffect(() => {
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
                                   maxLength={2}
                                   onChange={(e) => {
                                       const raw = e.target.value;
                                       // yozayotganda faqat raqamga ruxsat,
                                       // bo'sh qiymat ham mumkin
                                       if (raw === "" || /^\d+$/.test(raw)) {
                                           setViewerCount(raw);
                                       }
                                   }}
                                   onPressEnter={handleSetViewerIds}
                                   onBlur={() => setViewerCount(String(clampViewerCount(viewerCount)))}
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
                            <div className="multipleEnterence_body_group" key={viewerId}>
                                <div className='multipleEnterence_body_group_inner'>
                                    <img src={addGroupIcon}/>
                                    <p>Guruh topilmadi</p>
                                    <span>Guruh shakllantirilgan bo‘lsa qo‘shish talab etiladi</span>
                                    <div className="multipleEnterence_body_group_inner_add"
                                         onClick={() => openSelectGroup(viewerId)}>
                                        <img src={plusIcon}/> Qo’shish
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // 2: Data bor, ammo bo‘sh array
                    if (data.length === 0) {
                        return (
                            <div className="multipleEnterence_body_empty" key={viewerId}>
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
                    return (
                        <div className="multipleEnterence_body_card" key={viewerId}>
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
