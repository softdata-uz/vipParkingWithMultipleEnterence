import React, {useEffect, useState} from 'react';

import {Checkbox, Dropdown, Menu, message} from 'antd';
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import icon1 from '../../../images/parkingModul/database/Vector (3).svg';
import icon2 from '../../../images/parkingModul/database/Vector (4).svg';
import icon5 from '../../../images/parkingModul/database/Vector (7).svg';
import icon6 from '../../../images/parkingModul/database/Vector (8).svg';
import icon7 from '../../../images/parkingModul/database/Vector (9).svg';
import flag from '../../../images/parkingModul/database/Group 55888 (2).png';
import burger from '../../../images/parkingModul/database/Vector (23).png';
import editIcon from '../../../images/parkingModul/database/Vector (25).png';
import deleteIcon from '../../../images/parkingModul/database/Vector (26).png';
import exel from '../../../images/exel.svg';
import uzbFlag from "../../../images/uzbFlag.png";


import {MdOutlineCancel, MdOutlinePersonOutline} from "react-icons/md";

import moment from "moment";

import AddModal from "./addModal/AddModal";

import './database.css';
import './databaseBlack.css';
import axios from "axios";
import {ip} from "../../../ip";
import DatabaseAddPagination from "./addModal/DatabaseAddPagination";
import AddDeleteModal from "./deleteModal/AddDeleteModal";
import {Link} from "react-router-dom";
import prev from "../../../images/Vector.png";

const CheckboxGroup = Checkbox.Group;



const DatabaseAdd = (props) => {

    const {
        pageChange,
        setPageChange,
        categoryId,
        setCategoryId,
        getTestGroup
    } = props;

    const isDarkMode = useSelector(state => state.theme.theme_data);
    const {t} = useTranslation();
    const lang = localStorage.getItem('i18nextLng');


    const [checkedList, setCheckedList] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [listTotal, setListTotal] = useState(null);
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const handleResize = () => {
        setScreenSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [listPaginationLimit, setListPaginationLimit] = useState(screenSize.width < 1500 ? 12 : 20);
    const [listPaginationCurrent, setListPaginationCurrent] = useState(1);
    const [listInitialValues, setListInitialValues] = useState({
        fullname: "",
        position: '',
        tel:'',
        staff_group_id: "",
        from_date: "",
        to_date: "",
        vehicle_number: "",
        image: ""
    });

    // console.log(listInitialValues)
    // img


    const getListGroup = async (e) => {
        // console.log(e?.target.name);
        const response = await axios.get(`${ip}/api/staff/${categoryId.id}/${listPaginationLimit}/${listPaginationCurrent}`, {
            // params: {searched_data : id.target.value},
            headers: {'x-access-token': localStorage.getItem('vipparking-token')}
        })
        const {data} = response;
        // console.log(response.data)
        const count = data.count;
        setListTotal(count)
        const newData = data.data.map((item, index) => (
            {
                ...item,
                from_date: moment(item.from_date),
                to_date: moment(item.to_date),
            }
        ))

        setDataList(newData)
    }

    // console.log(dataList)

    useEffect(() => {
        if (searched === false && pageChange === false) {
            getListGroup()
        }
        getTestGroup();
    }, [listPaginationLimit, listPaginationCurrent, listTotal]);


    const listPaginationOnchange = (e = 1, option) => {
        setListPaginationCurrent(e)
        setListPaginationLimit(option)
    }
    useEffect(() => {

    }, [listPaginationLimit, listPaginationCurrent,]);


    // chek group


    const onChange = (list) => {
        const isChecked = checkedList.some(item => item === list.id)
        if (isChecked) {
            const filterChecked = checkedList.filter(item => item !== list.id)
            setCheckedList(filterChecked);
        } else {
            setCheckedList(prev => [...prev, list.id]);
        }
    };
    const onCheckAllChange = (e) => {
        setCheckedList(dataList.length === checkedList.length ? [] : dataList.map(item => item.id));
    };
    // chek group

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setListInitialValues({
            fullname: "",
            position: '',
            tel:'',
            staff_group_id: "",
            from_date: "",
            to_date: "",
            vehicle_number: "",
            image: ""
        });
        setIsModalOpen(true);
    }

    // delete card
    const [deleteModal, setDeleteModal] = useState(false);
    const deleteDataList = () => {
        if (checkedList.length > 0) {
            setDeleteModal(true);
        }
    }

    const editCamera = (value) => {
        console.log(value)
        setListInitialValues({
            ...value,
            edit: true
        });
        setIsModalOpen(true);
    }

    function WidgetMenu(props) {
        const deleteForButton = () => {
            checkedList.push(props.value.id);
            if (checkedList.length > 0) {
                setDeleteModal(true);
            }
        }

        return (
            <Menu {...props}>
                <Menu.Item>
                    <div className="parking_database_dropEdit" onClick={() => editCamera(props.value)}>
                        <div className="icon"><img src={editIcon} style={{width: "16px"}}/></div>
                        <span>{t("Tahrirlash")}</span>
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div className="parking_database_dropDelete" onClick={() => deleteForButton()}>
                        <div className="icon"><img src={deleteIcon} style={{width: "12px"}}/></div>
                        <span>{t("O'chirish")}</span>
                    </div>
                </Menu.Item>
            </Menu>
        );
    }

    const upDate = () => {
        getListGroup();
        // window.location.reload(false);
    }

    const [searched, setSearched] = useState(false);
    const searchList = (e) => {
        setSearched(true);
        const formData = {
            searched_data: e.target.value,
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));

        axios.get(`${ip}/api/staff/${categoryId.id}/${listPaginationLimit}/${listPaginationCurrent}`,
            {
                params: {searched_data: e.target.value},
                headers: {'x-access-token': localStorage.getItem('vipparking-token')}
            })
            .then((response) => {
                // console.log(response);
                const {data} = response;
                const count = data.count;
                setListTotal(count)
                const newData = data.data.map((item, index) => (
                    {
                        ...item,
                        from_date: moment(item.from_date),
                        to_date: moment(item.to_date),
                    }
                ))
                setDataList(newData);
            })
    }


// upload excel file
    // img
    const [fileState, setFileState] = useState({
        initial: true,
        uploaded: false,
        requested: false,
        check: false
    });
    const [filee, setFilee] = useState({});

    const upload = (e) => {
        if (e.target.files && e.target.files[0]) {
            // console.log('uploaded')
            setFilee({...filee, excel: e.target.files[0]})
            setFileState({
                initial: false,
                uploaded: true,
                requested: false,
                check: true
            })
        } else {
            setFileState({
                initial: true,
                uploaded: false,
                requested: false,
                check: false
            })
        }

        const formData = {
            // file: filee.excel,
            file: e.target.files[0],
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));

        axios.post(`${ip}/api/excel/staff/${categoryId.id}`,
            fd,
            {
                headers: {'x-access-token': localStorage.getItem('vipparking-token')}
            })
            .then((res) => {
                console.log(res)
                getListGroup();
                message.success(t(`${res.data.msg}`));
            })
            .catch(err => {
                message.error(err.response.data.msg);
                // console.log(err?.response?.data)
            })
    }
    // img
// upload excel file


    const sendExcel = () => {

        let excelId = Array.from(new Set(checkedList));

        axios.put(`${ip}/api/update/vehicle_list`,
            {
                data: excelId
            },
            {
                headers: {'x-access-token': localStorage.getItem('vipparking-token')}
            }
        )
            .then((res) => {
                console.log(res)
                getListGroup();
                setCheckedList([]);
                setFileState({
                    initial: true,
                    uploaded: false,
                    requested: false,
                    check: false
                });
            })
    }

    const cencelExcel = () => {
        axios.get(`${ip}/api/cancel/vehicle_list`,
            {
                headers: {'x-access-token': localStorage.getItem('vipparking-token')}
            }
        )
            .then((res) => {
                    console.log(res)
                    getListGroup();
                    setCheckedList([]);
                    setFileState({
                        initial: true,
                        uploaded: false,
                        requested: false,
                        check: false
                    })
                }
            )
            .catch(err => console.log(err))
    }


    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            <div className="parking_database">
                <div className="parking_database_top">
                    <div className="user_list_top_left">
                        <Link to="/" className="user_list_top_left_prev"><img src={prev}/></Link>
                        <div className="user_list_top_left_text">
                            <span>Asosiy »</span>
                            <p>Xodimlar</p>
                        </div>
                    </div>
                    <div className="parking_database_top_pagination">
                        <DatabaseAddPagination
                            listPaginationLimit={listPaginationLimit}
                            listPaginationCurrent={listPaginationCurrent}
                            listPaginationOnchange={listPaginationOnchange}
                            listTotal={listTotal}
                            screenSize={screenSize}
                        />
                    </div>
                </div>

                <div className={`parking_database_body ${isDarkMode && 'darkModeBackground darkModeBorder'}`}>
                    <div className="parking_database_body_topButtons">
                        <div className="parking_database_body_topButtons_left">
                            <button className={`${isDarkMode && 'darkModeBackground darkModeBorder'} `} type="button">
                                <div className="parking_database_body_topButtons_left_buttonText"
                                     onClick={() => setPageChange(true)}><img src={icon1}/>{t('Orqaga')}</div>
                            </button>
                            <button className={`${isDarkMode && 'darkModeBackground darkModeBorder'} `} type="button"
                                    onClick={showModal}>
                                <div className="parking_database_body_topButtons_left_buttonText"><img
                                    src={icon2}/>{t('Qo‘shish')}</div>
                            </button>

                            <div className="excel">
                                <label htmlFor='add_staff_img'
                                       className={fileState.uploaded ? `excel_upload_file parking_database_body_topButtons_excel ${isDarkMode && 'darkModeBorder'}` : `parking_database_body_topButtons_excel ${isDarkMode && 'darkModeBorder'}`}>
                                    <div className="parking_database_body_topButtons_excel_inner">
                                        <img src={exel}/>
                                        <div
                                            className={`${isDarkMode && 'darkModeColor'}`}>{fileState.uploaded ? t("Yuborish") : t("Import")}</div>
                                    </div>
                                    {
                                        fileState.uploaded ?
                                            <input onClick={sendExcel} id="add_staff_img" style={{display: 'none'}}/>
                                            :
                                            <input onChange={upload} type="file" id="add_staff_img"
                                                   style={{display: 'none'}}/>
                                    }
                                </label>
                                {fileState.uploaded ? <div className="excel_exit" onClick={cencelExcel}
                                ><MdOutlineCancel style={{fontSize: "20px"}}/>{t("Bekor qilish")}</div> : ""}
                            </div>

                            <button type="button" className={checkedList.length > 0 ?
                                `deleteButton ${isDarkMode && 'darkModeBackground darkModeBorder'}`
                                : `disabledButtons ${isDarkMode && 'darkModeBackground darkModeBorder'}`}
                                    onClick={deleteDataList}>
                                <div className="parking_database_body_topButtons_left_buttonText"><img
                                    src={icon5}/>{t('O‘chirish')}</div>
                            </button>
                            <button className={`${isDarkMode && 'darkModeBackground darkModeBorder'} `} type="button"
                                    onClick={upDate}>
                                <div className="parking_database_body_topButtons_left_buttonText"><img
                                    src={icon6}/>{t('Yangilash')}</div>
                            </button>
                            <div
                                className={`parking_database_body_topButtons_left_search ${isDarkMode && 'darkModeInputBackgraund'}`}>
                                <div
                                    className={`parking_database_body_topButtons_left_search_text  ${isDarkMode && 'darkModeInputBackgraund'}`}>
                                    <input className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                           placeholder={t("Izlash")} onChange={searchList}/>
                                    <img src={icon7} style={{margin: "0"}}/>
                                </div>
                            </div>

                        </div>
                        {/*<div className="parking_database_body_topButtons_excel">*/}
                        {/*<img src={exel}/>{t("Import")}*/}
                        {/*</div>*/}
                        <div className="parking_database_body_topButtons_right">


                            <div className="parking_database_body_topButtons_right1">
                                <MdOutlinePersonOutline className={`${isDarkMode && 'darkModeColor'}`}
                                                        style={{marginRight: 2}} size={20}/>
                                <span className={`${isDarkMode && 'darkModeColor'}`}>{categoryId.name}</span>
                            </div>

                            <div
                                className={`parking_database_body_topButtons_right_line ${isDarkMode && 'darkModeLineBackground'}`}></div>
                            <div className="parking_database_body_topButtons_right2">
                                <span
                                    className={`${isDarkMode && 'darkModeColor'}`}>{t('Ma’lumotlar soni:') + " " + listTotal}</span>
                            </div>
                            {/*<div className="parking_database_body_topButtons_right3">*/}
                            {/*    <span>{t('Faol')}</span>*/}
                            {/*</div>*/}
                        </div>
                    </div>

                    <div className="parking_database_body_cards">
                        <div className="parking_database_body_cards_head">
                            <Checkbox
                                indeterminate={dataList.length === checkedList.length ? false : checkedList.length > 0}
                                onChange={onCheckAllChange}
                                checked={dataList.length === checkedList.length && dataList.length !== 0}
                            >
                                {t("Barchasini belgilash")}
                            </Checkbox>
                        </div>

                        <div
                            className={screenSize.width < 1500 ? "parking_database_body_cards_body" : "parking_database_black_body_cards_body_20"}>
                            {/*<div className="parking_database_body_cards_body">*/}
                            {
                                dataList?.map((item, index) => {
                                    // console.log(item)
                                    const tex = item?.vehicle_number;
                                    const tt = item.vehicle_number;
                                    const a = !isNaN(tt?.substr(2, 2));
                                    const isChecked = checkedList?.some(check => check === item.id)

                                    return (
                                        <div
                                            className={`${item.accepted === false ? `parking_database_body_cards_body_card_excel ${isDarkMode && 'darkModeCard darkModeBorder'}` : `parking_database_body_cards_body_card ${isDarkMode && 'darkModeCard darkModeBorder'}`}`}
                                            key={index}>
                                            <div className="parking_database_body_cards_body_card_inner1">
                                                <div
                                                    className={`parking_database_body_cards_body_card_inner1_top ${isDarkMode && 'darkModeBackground '}`}>
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onChange={() => onChange(item)}
                                                        type="checkbox"
                                                    />

                                                    <img src={`${ip}/staff/${item.image}`} />

                                                </div>
                                                <div className="parking_database_body_cards_body_card_inner1_bottom">
                                                         <span className="vehicle_flag0">
                                                             {
                                                                 tex?.length === 8 ?
                                                                     <div className="table2_inner">
                                                                         {
                                                                             a == false && tex?.length === 8 ?

                                                                                 tex?.substr(0, 2)
                                                                                 + " " + tex?.substr(2, 1) + " " +
                                                                                 tex?.substr(3, 3) + " " +
                                                                                 tex?.substr(6, tex?.length)
                                                                                 :
                                                                                 a == true && tex?.length === 8 ?
                                                                                     tt?.substr(0, 2) + " " +
                                                                                     tt?.substr(2, 3) + " " +
                                                                                     tt?.substr(5, tt?.length)
                                                                                     : item?.vehicle_number

                                                                         }
                                                                         {tex?.length === 8 ? <img src={flag}/> : ""}
                                                                     </div>
                                                                     :

                                                                     tex?.substr(0, 3) === "PAA" ?
                                                                         <div className="raqam_paa">
                                                                             <div className="raqam_paa_inner">
                                                                                 <div className="raqam_paa_inner_img">
                                                                                     <img src={uzbFlag}/>
                                                                                 </div>
                                                                                 <div
                                                                                     className="raqam_paa_inner_number">
                                                                                     {
                                                                                         tex?.substr(0, 3) + " " + tex?.substr(3, tex?.length)
                                                                                     }
                                                                                 </div>
                                                                             </div>
                                                                         </div>

                                                                         :

                                                                         /*/!*yashillar uchun CMD*!/*/
                                                                         tex?.substr(0, 3) === "CMD" ?
                                                                             <div className="raqam_cmd">
                                                                                 <div className="raqam_cmd_inner">
                                                                                     {
                                                                                         tex?.substr(0, 3) + " " + tex?.substr(3, 2) + "-" +
                                                                                         tex?.substr(5, tex?.length)
                                                                                     }
                                                                                 </div>
                                                                             </div>

                                                                             :

                                                                             /*/!*yashillar uchun D*!/*/
                                                                             !isNaN(tex?.substr(1, tex?.length)) && tex?.substr(0, 1) === "D" && tex?.length === 7 ?
                                                                                 <div className="raqam_cmd">
                                                                                     <div className="raqam_cmd_inner">
                                                                                         {
                                                                                             tex?.substr(0, 1) + " " + tex?.substr(1, tex.length)
                                                                                         }
                                                                                     </div>
                                                                                 </div>

                                                                                 :

                                                                                 /*/!*yashillar uchun T*!/*/
                                                                                 !isNaN(tex?.substr(1, tex?.length)) && tex?.substr(0, 1) === "T" && tex?.length === 7 ?
                                                                                     <div className="raqam_cmd">
                                                                                         <div
                                                                                             className="raqam_cmd_inner">
                                                                                             {
                                                                                                 tex?.substr(0, 1) + " " + tex?.substr(1, tex?.length)
                                                                                             }
                                                                                         </div>
                                                                                     </div>

                                                                                     :

                                                                                     /*/!*yashillar uchun X*!/*/
                                                                                     !isNaN(tex?.substr(1, tex?.length)) && tex?.substr(0, 1) === "X" && tex?.length === 7 ?
                                                                                         <div className="raqam_cmd">
                                                                                             <div
                                                                                                 className="raqam_cmd_inner">
                                                                                                 {
                                                                                                     tex?.substr(0, 1) + " " + tex?.substr(1, tex?.length)
                                                                                                 }
                                                                                             </div>
                                                                                         </div>

                                                                                         :

                                                                                         /*/!*yashillar uchun ajaratilgan 01 ga oxshashlilar M*!/*/
                                                                                         !isNaN(tex?.substr(3, tex?.length)) && tex?.length === 9 && tex?.substr(2, 1) === "M" ?
                                                                                             <div className="raqam_cmd">
                                                                                                 <div
                                                                                                     className="raqam_cmd_inner">
                                                                                                     {
                                                                                                         tex?.substr(0, 2)
                                                                                                         + " " + tex?.substr(2, 1) + " " + tex?.substr(3, tex?.length)
                                                                                                     }
                                                                                                 </div>
                                                                                             </div>

                                                                                             :

                                                                                             /*/!*ko'klar uchun*!/*/
                                                                                             tex?.length === 6 && tex?.substr(0, 1) === "U" ?
                                                                                                 <div
                                                                                                     className="raqam_blue">
                                                                                                     <div
                                                                                                         className="raqam_blue_inner">
                                                                                                         {
                                                                                                             tex?.substr(0, 2)
                                                                                                             + " " + tex?.substr(2, tex?.length)
                                                                                                         }
                                                                                                     </div>
                                                                                                 </div>

                                                                                                 :

                                                                                                 /*sariqlar uchun*/
                                                                                                 !isNaN(tex?.substr(3, tex?.length)) && tex?.length === 9 && tex?.substr(2, 1) === "H" ?
                                                                                                     <div
                                                                                                         className="raqam_yellow">
                                                                                                         <div
                                                                                                             className="raqam_yellow_inner">
                                                                                                             {
                                                                                                                 tex?.substr(0, 2)
                                                                                                                 + " " + tex?.substr(2, 1) + " " + tex?.substr(3, tex?.length)
                                                                                                             }
                                                                                                         </div>
                                                                                                     </div>
                                                                                                     :
                                                                                                     <div
                                                                                                         className="table2_inner">
                                                                                                         {
                                                                                                             item?.vehicle_number
                                                                                                         }
                                                                                                     </div>
                                                             }
                                                        </span>
                                                </div>
                                            </div>
                                            <div className="parking_database_body_cards_body_card_inner2">
                                                <div className="parking_database_body_cards_body_card_inner2_left">

                                                    <div className={`textt ${isDarkMode && 'darkModeColor'}`}>
                                                        {t("F.I.Sh")}: {item.fullname}
                                                    </div>
                                                    <div className={`textt ${isDarkMode && 'darkModeColor'}`}>
                                                        {t("Boshqarma")}: {item.position}
                                                    </div>

                                                    <div className={`textt ${isDarkMode && 'darkModeColor'}`}>
                                                        {t("Telefon")}: {item.tel}
                                                    </div>


                                                    <div
                                                        className={`textt ${isDarkMode && 'darkModeColor'}`}>{t("Vaqt")}:
                                                        {" " + moment(item.from_date).format("DD.MM.YYYY") + "  " +
                                                            moment(item.to_date).format("DD.MM.YYYY")}
                                                    </div>


                                                </div>
                                                <div className="parking_database_body_cards_body_card_inner2_right">
                                                    <Dropdown overlay={<WidgetMenu value={item}/>}
                                                              placement="bottomRight">
                                                        <div className="burgerImg">
                                                            <img src={burger} className="burgerImg"/>
                                                        </div>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                </div>
            </div>

            <AddModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                getListGroup={getListGroup}
                categoryId={categoryId}
                listInitialValues={listInitialValues}
                setListInitialValues={setListInitialValues}
            />
            <AddDeleteModal
                getListGroup={getListGroup}
                setDeleteModal={setDeleteModal}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                deleteModal={deleteModal}
                setFileState={setFileState}
            />
        </div>
    );
};

export default DatabaseAdd;