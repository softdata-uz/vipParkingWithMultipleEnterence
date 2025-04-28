import React, {useEffect, useState} from 'react';
import icon2 from "../../../images/parkingModul/database/Vector (4).svg";
import icon5 from "../../../images/parkingModul/database/Vector (7).svg";
import icon6 from "../../../images/parkingModul/database/Vector (8).svg";
import icon9 from '../../../images/parkingModul/database/Group (2).svg';
import carIcon from '../../../images/parkingModul/database/directions_car.png';
import notCheck from '../../../images/parkingModul/database/Vector (24).png';

import {Checkbox, Dropdown, Form, Menu, message, Progress, Slider} from "antd";
import burger from "../../../images/parkingModul/database/Vector (23).png";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

import DatabaseAdd from "./DatabaseAdd";
import editIcon from "../../../images/parkingModul/database/Vector (25).png";
import deleteIcon from "../../../images/parkingModul/database/Vector (26).png";
import AddModalBlack from "./addModal/AddModalBlack";
import axios from "axios";
import {ip} from "../../../ip";
import DatabaseBlackPagination from "./DatabaseBlackPagination";
import BlackDeleteModal from "./deleteModal/BlackDeleteModal";
import {BiCctv} from 'react-icons/bi';
import {GiCctvCamera} from 'react-icons/gi'
import {AiOutlineUp , AiOutlineDown} from 'react-icons/ai';

import AddDeleteModal from "./deleteModal/AddDeleteModal";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import prev from "../../../images/Vector.png";

import './databaseBlack.css';
import AddCameraModal from "./AddCameraModal";


const CheckboxGroup = Checkbox.Group;


const DatabaseBlack = () => {

    const isDarkMode = useSelector(state => state.theme.theme_data);
    const {t} = useTranslation();
    const lang = localStorage.getItem('i18nextLng');


    const [dataTest, setDataTest] = useState([]);
    const [testTotal, setTestTotal] = useState(null);
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

    const [testPaginationLimit, setTestPaginationLimit] = useState(screenSize.width < 1500 ? 12 : 20);
    const [testPaginationCurrent, setTestPaginationCurrent] = useState(1);
    const [testInitialValues, setTestInitialValues] = useState({
        name: '',
        type: '',
    })
    const [percent, setPercent] = useState(0);


    // console.log(selectedIps)


    const getTestGroup = () => {
        axios.get(`${ip}/api/staff-group/${testPaginationLimit}/${testPaginationCurrent}`, {
            headers: {'x-access-token': localStorage.getItem('vipparking-token')}
        })
            .then((res) => {
                console.log(res.data.data)
                setTestTotal(res.data.count);
                setDataTest(res.data.data);
                setPercent(res.data.percent)
            })
    }

    // console.log(dataTest)

    useEffect(() => {
        getTestGroup();
    }, [testPaginationLimit, testPaginationCurrent, testTotal]);


    const testPaginationOnchange = (e = 1, option) => {
        setTestPaginationCurrent(e)
        setTestPaginationLimit(option)
    }
    useEffect(() => {

    }, [
        testPaginationLimit,
        testPaginationCurrent,
    ]);

    const [checkedList, setCheckedList] = useState([]);

    const onChange = (list) => {
        const isChecked = checkedList.some(item => item === list.id)
        if (isChecked) {
            const filterChecked = checkedList.filter(item => item !== list.id);
            setCheckedList(filterChecked);
        } else {
            setCheckedList(prev => [...prev, list.id]);
        }
    };

    const onCheckAllChange = (e) => {
        setCheckedList(dataTest.length === checkedList.length ? [] : dataTest.map(item => item.id));
    };

    // delete card
    const [deleteBlackModal, setDeleteBlackModal] = useState(false)

    const deleteDataTest = () => {
        if (checkedList.length > 0) {
            setDeleteBlackModal(true);
        }
    }

    const clearDataTest = () => {
        axios.delete(`${ip}/api/clear/staff-group`,
            {
                data: checkedList,
                headers: {'x-access-token': localStorage.getItem('vipparking-token')}
            }
        )
            .then((res) => {
                setCheckedList([]);
                getTestGroup()
            })
    }

    const editCamera = (value) => {
        // console.log(value)
        setTestInitialValues({
            ...value,
            edit: true
        })
        setModalOpenBlack(true);
    }

    // change page
    const [pageChange, setPageChange] = useState(true);
    const [categoryId, setCategoryId] = useState([]);

    const chanePage = (item) => {
        setPageChange(false);
        setCategoryId(item);
    }

    // change page

    function WidgetMenu(props) {
        const deleteForButton = () => {
            checkedList.push(props.value.id);
            if (checkedList.length > 0) {
                setDeleteBlackModal(true);
            }
        }

        return (
            <Menu {...props}>
                <Menu.Item>
                    <div className="parking_database_dropEdit" onClick={() => editCamera(props.value)}>
                        <div className="icon"><img src={editIcon} alt={"image"} style={{width:"16px"}}/></div>
                        <span>{t("Tahrirlash")}</span>
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div className="parking_database_dropDelete" onClick={() => deleteForButton()}>
                        <div className="icon"><img src={deleteIcon} alt={"image"} style={{width:"12px"}}/></div>
                        <span>{t("O‘chirish")}</span>
                    </div>
                </Menu.Item>
            </Menu>
        );
    }

    const [modalOpenBlack, setModalOpenBlack] = useState(false);
    const addModalOpen = () => {
        setTestInitialValues({
            name: '',
            type: '',
        })
        setModalOpenBlack(true);
    }
    const upDate = () => {
        getTestGroup();
        // window.location.reload(false);
    }



    // camera biriktirish
    const [openCamModal, setOpenCamModal] = useState(false);
    const [catId , setCatId] = useState('')
    const [cameraData , setCameraData] = useState([]);

    const [selectedIps, setSelectedIps] = useState([]);

    const changeCheckbox = (e, item) => {
        const { checked } = e.target;
        const ip = item.ip_address;

        if (checked) {
            setSelectedIps(prev => [...prev, ip]);
        } else {
            setSelectedIps(prev => prev.filter(address => address !== ip));
        }
    };

    const openModalCamera = (category_id) => {
        setOpenCamModal(!openCamModal);
        setCatId(category_id);
        axios.get(`${ip}/api/all/cameras`,
            {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
            .then((res)=>{
                // console.log(res)
                setCameraData(res?.data?.data)
            })
    }


    const onFinish = (values) => {

        axios.put(`${ip}/api/update-camera/staff-group/${catId}`,
            {
                cameras: selectedIps
            },
            {
                headers: { 'x-access-token': localStorage.getItem('vipparking-token') }
            }
        )
            .then((res) => {
                setOpenCamModal(false);
                getTestGroup()
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
                message.error(error.response.data.msg);
            });
    };


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <div>
            {pageChange === true ?
                <div className="parking_database_black">
                    <div className="parking_database_black_top">
                        <div className="user_list_top_left">
                            <Link to="/" className="user_list_top_left_prev"><img src={prev}/></Link>
                            <div className="user_list_top_left_text">
                                <span>Asosiy »</span>
                                <p>Xodimlar</p>
                            </div>
                        </div>
                        <div className="parking_database_black_top_pagination">
                            <DatabaseBlackPagination
                                testPaginationLimit={testPaginationLimit}
                                testPaginationCurrent={testPaginationCurrent}
                                testPaginationOnchange={testPaginationOnchange}
                                testTotal={testTotal}
                                screenSize={screenSize}
                            />
                        </div>
                    </div>

                    <div className={`parking_database_black_body ${isDarkMode && 'darkModeBackground darkModeBorder'}`}>
                        <div className="parking_database_black_body_topButtons">
                            <div className="parking_database_black_body_topButtons_left">
                                <button type="button" className={`${isDarkMode && 'darkModeBackground darkModeBorder'} `}>
                                    <div className={`parking_database_black_body_topButtons_left_buttonText  `}
                                         onClick={addModalOpen}><img src={icon2}/>
                                        {t('Yaratish')}
                                    </div>
                                </button>

                                <button type="button" onClick={deleteDataTest}
                                        className={checkedList.length > 0 ? `deleteButton ${isDarkMode && 'darkModeBackground darkModeBorder'}`
                                            : `disabledButtons ${isDarkMode && 'darkModeBackground darkModeBorder'}`}>
                                    <div className={`parking_database_black_body_topButtons_left_buttonText `}>
                                        <img src={icon5}/>{t('O‘chirish')}
                                    </div>
                                </button>
                                <button type="button" onClick={clearDataTest}
                                        className={checkedList.length > 0 ? `filterButton ${isDarkMode && 'darkModeBackground darkModeBorder'}`
                                            : `disabledButtons ${isDarkMode && 'darkModeBackground darkModeBorder'}`}>
                                    <div className="parking_database_black_body_topButtons_left_buttonText"><img
                                        src={icon9}/>{t('Tozalash')}</div>
                                </button>
                                <button type="button" onClick={upDate}  className={`${isDarkMode && 'darkModeBackground darkModeBorder'} `}>
                                    <div className="parking_database_black_body_topButtons_left_buttonText"><img
                                        src={icon6}/>{t('Yangilash')}</div>
                                </button>
                                <div className="parking_database_black_body_topButtons_progress">
                                    <Progress percent={67} size="small"/>
                                    <span className={` ${isDarkMode && 'darkModeColor'}`}>
                                        {t("Ma'lumotlar")} {67}%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span className={` ${isDarkMode && 'darkModeColor'}`}>
                                    {t('Ma’lumotlar soni:') + " " + testTotal}
                                </span>
                            </div>
                        </div>
                        <div className="parking_database_black_body_cards">
                            <div className="parking_database_black_body_cards_head">
                                <Checkbox
                                    indeterminate={dataTest.length === checkedList.length ? false : checkedList.length > 0}
                                    onChange={onCheckAllChange}
                                    checked={dataTest.length === checkedList.length && dataTest.length !== 0}
                                >
                                    {t("Barchasini belgilash")}
                                </Checkbox>
                            </div>

                            <div className={screenSize.width < 1500 ? "parking_database_black_body_cards_body" : "parking_database_black_body_cards_body_20"}>
                                {
                                    dataTest?.map((item, index) => {
                                        console.log(item)
                                        const isChecked = checkedList?.some(check => check === item.id)
                                        return (
                                            <div className={`parking_database_black_body_cards_body_card ${isDarkMode && 'darkModeCard darkModeBorder'}`} key={index}
                                                 onClick={() => chanePage(item)}>
                                                <div className="parking_database_black_body_cards_body_card_top">
                                                    <div
                                                        className="parking_database_black_body_cards_body_card_top_left"
                                                        onClick={event => event.stopPropagation()}>
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onChange={() => onChange(item)}
                                                            type="checkbox"
                                                        >
                                                            <span className={`${isDarkMode && 'darkModeColor'}`}>{item.name}</span>
                                                        </Checkbox>
                                                    </div>
                                                    <div className="" onClick={event => event.stopPropagation()}>
                                                        <Dropdown overlay={<WidgetMenu value={item}/>}
                                                                  placement="bottomRight"
                                                            // trigger={"click"}
                                                        >
                                                            <div className="burgerImg">
                                                                <img src={burger} className="burgerImg"/>
                                                            </div>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <div className="parking_database_black_body_cards_body_card_body">
                                                    <div
                                                        className="parking_database_black_body_cards_body_card_body_left">
                                                        <img src={carIcon}/>
                                                        <span className={`${isDarkMode && 'darkModeColor'}`} style={{marginLeft: "5px"}}>{item.item_count}</span>
                                                    </div>
                                                    <div
                                                        className={item.type === "whitelist" ? "whiteList" : "blackList"}>
                                                        <span>{item.type === "whitelist" ? t("Oq ro'yxat") : t("Qora ro'yxat")}</span>
                                                    </div>
                                                </div>



                                                {/*----footer---*/}

                                                <div className='parking_database_black_body_cards_body_card_footer'
                                                     onClick={event => event.stopPropagation()}>

                                                    <div className='camera_length'>
                                                        <BiCctv/>
                                                        {item.cameras.length}
                                                    </div>

                                                    <div className="parking_database_black_body_cards_body_card_footer_camButton"
                                                         onClick={()=>openModalCamera(item.id)}>
                                                        <div className="parking_database_black_body_cards_body_card_footer_camButton_inner">
                                                            <BiCctv style={{marginRight: "5px"}}/>{t("Biriktirish")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    {/*<AddCameraModal*/}
                    {/*    getTestGroup={getTestGroup}*/}
                    {/*/>*/}

                    <Modal
                        isOpen={openCamModal}
                        onRequestClose={openModalCamera}
                        contentLabel="My dialog"
                        className="mymodal"
                        overlayClassName="myoverlay"
                        closeTimeoutMS={0}
                    >
                        <div className="camera_lists">
                            <div className="camera_lists_title"><h2>{t("Kameralar ro'yxati")}</h2></div>

                            <Form
                                name="basic"
                                initialValues={{remember: true}}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <div className="camera_lists_body">

                                    {
                                        cameraData.map((item,index)=>{
                                            // console.log(item)
                                            return(
                                                <div>
                                                    <div className="sdd">
                                                        <Form.Item name={item.name} value={index}>
                                                            <Checkbox
                                                                name={item.name}
                                                                defaultChecked={item.added}
                                                                onChange={(e) => changeCheckbox(e, item)}
                                                            >
                                                                <BiCctv style={{marginRight: "5px"}} />
                                                                {item.name}
                                                                <span className='sdd_ip'>{item.ip_address}</span>
                                                            </Checkbox>
                                                        </Form.Item>
                                                    </div>
                                                    <div className="camera_lists_body_line"></div>
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                                <div className='camera_lists_body_button'>
                                    <button type="button" className="camera_lists_body_button_cancel" onClick={()=>setOpenCamModal(!openCamModal)}>
                                        {t("Bekor qilish")}
                                    </button>
                                    <button type="submit" className="camera_lists_body_button_submit">
                                        {t("Saqlash")}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </Modal>

                </div>
                :
                <DatabaseAdd
                    pageChange={pageChange}
                    setPageChange={setPageChange}
                    categoryId={categoryId}
                    getTestGroup={getTestGroup}
                />
            }
            <AddModalBlack
                modalOpenBlack={modalOpenBlack}
                setModalOpenBlack={setModalOpenBlack}
                setDataTest={setDataTest}
                testPaginationLimit={testPaginationLimit}
                testPaginationCurrent={testPaginationCurrent}
                setTestTotal={setTestTotal}
                testInitialValues={testInitialValues}
                setTestInitialValues={setTestInitialValues}
                getTestGroup={getTestGroup}
            />
            <BlackDeleteModal
                deleteBlackModal={deleteBlackModal}
                setDeleteBlackModal={setDeleteBlackModal}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                getTestGroup={getTestGroup}
            />
        </div>
    );
};

export default DatabaseBlack;