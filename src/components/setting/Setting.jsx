import React, {useEffect, useState} from 'react';


import {MdOutlineAddCircleOutline} from 'react-icons/md';
import {TfiVideoCamera} from 'react-icons/tfi';
import {MdOutlineAdminPanelSettings} from 'react-icons/md';
import {CiImageOn} from 'react-icons/ci';

import Layout from "../Layout";
import {Form, Input, message, Tabs, Select} from "antd";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import prev from "../../images/Vector.png";
import search from "../../images/tabler-icon-search (1).png";
import plus from "../../images/add-circle.png";
import {Alert, Space} from 'antd';

import './setting.css';
import modalImg from "../../images/gallery-add.png";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {ip} from "../../ip";
import SettingTable from "./SettingTable";
import UserListPagination from "../userList/UserListPagination";
import SettingPagination from "./SettingPagination";
import UserListTable from "../userList/UserListTable";
import DeleteModal from "../userList/deleteModal/DeleteModal";
import DeleteSettingModal from "./deleteSettingModal/DeleteSettingModal";
import CameraPagination from "./CameraPagination";
import CameraTable from "./CameraTable";
import DeleteCameraModal from "./deleteSettingModal/DeleteCameraModal";
import GroupTable from "./GroupTable";
import DeleteGroupModal from "./deleteSettingModal/DeleteGroupModal";


const {TabPane} = Tabs;
const {Options} = Select;

const Setting = (props) => {

    const [tabKey, setTabKey] = useState(1);
    const onChangeTabs = (key) => {
        // console.log(key);
        setTabKey(key);
    }

    const [open, setOpen] = useState(false);
    const [openCamera, setOpenCamera] = useState(false);
    const [openGroup, setOpenGroup] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteOpenCamera, setDeleteOpenCamera] = useState(false);
    const [deleteOpenGroup, setDeleteOpenGroup] = useState(false);

    const [deleteData, setDeleteData] = useState([]);
    const [deleteDataCamera, setDeleteDataCamera] = useState([]);
    const [deleteDataGroup, setDeleteDataGroup] = useState([]);

    const [staffData, setStaffData] = useState();
    const [cameraData, setCameraData] = useState();
    const [groupData, setGroupData] = useState();

    const [isOpenFilter, setIsOpenFilter] = useState(false);

    const [staffTotal, setStaffTotal] = useState(null);
    const [cameraTotal, setCameraTotal] = useState(null);

    const [staffPaginationLimit, setStaffPaginationLimit] = useState(15);
    const [cameraPaginationLimit, setCameraPaginationLimit] = useState(15);
    const [staffPaginationCurrent, setStaffPaginationCurrent] = useState(1);
    const [cameraPaginationCurrent, setCameraPaginationCurrent] = useState(1);
    const [filterInitialValue, setFilterInitialValue] = useState({
        fromDate: '',
        toDate: '',
        searched_data: '',
        type: 'all',
        table_name: '',
        order_by: '',
        lastname: '',
        firstname: '',
        fathersname: '',
        role: '',
        login: '',
        password: ''
    })
    const [filterInitialValue2, setFilterInitialValue2] = useState({
        fromDate: '',
        toDate: '',
        searched_data: '',
        type: 'all',
        table_name: '',
        order_by: '',
        name: '',
        channel: '',
        ip_address: '',
        role: '',
        username: '',
        password: '',
        direction: ''
    })
    const [filterInitialValueGroup, setFilterInitialValueGroup] = useState({
        name: ''
    })


    const getStaffData = async (paramsObj) => {
        await axios.get(`${ip}/api/admin/${staffPaginationLimit}/${staffPaginationCurrent}`,
            {
                headers: {'x-access-token': localStorage.getItem('vipparking-token')},
                params: paramsObj
            })
            .then(response => {
                const {data} = response;
                const count = data.count;
                setStaffTotal(count)
                const newData = data.data.map((item, index) => (
                    {
                        ...item,
                        key: index + 1 + (data.current_page - 1) * staffPaginationLimit,
                        lastname: item.lastname,
                        firstname: item.firstname,
                        fathersname: item.fathersname,
                        position: item.position,
                        vehicle_number: item.vehicle_number,
                        tel: item.tel,
                        id: item.id
                    }
                ));
                setStaffData(newData)
            })
            .catch(error => {
                console.log(error.response);
            })
    }
    const getCameraData = async (paramsObj) => {
        await axios.get(`${ip}/api/cameras/${staffPaginationLimit}/${cameraPaginationCurrent}`,
            {
                headers: {'x-access-token': localStorage.getItem('vipparking-token')},
                params: paramsObj
            })
            .then(response => {
                const {data} = response;
                const count = data.count;
                setCameraTotal(count)
                // console.log(data)
                const newData = data.data.map((item, index) => (
                    {
                        ...item,
                        key: index + 1 + (data.current_page - 1) * cameraPaginationLimit,
                        name: item.name,
                        type: item.type,
                        brand: item.brand,
                        channel: item.channel,
                        camera_group_id: item.camera_group_id,
                        camera_group: item.camera_group,
                        ip_address: item.ip_address,
                        username: item.username,
                        password: item.password,
                    }
                ));
                setCameraData(newData)
            })
            .catch(error => {
                console.log(error.response);
            })
    }


    const getGroupData = async (paramsObj) => {
        await axios.get(`${ip}/api/camera-group`,
            {
                headers: {'x-access-token': localStorage.getItem('vipparking-token')},
                params: paramsObj
            })
            .then(response => {
                const {data} = response;
                // console.log(response)
                const newData = data.data.map((item, index) => (
                    {
                        ...item,
                        key: index + 1,
                        name: item.name,
                        viewer: item.viewer
                    }
                ));
                setGroupData(newData)
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    // console.log(cameraData)
    const staffPaginationOnchange = (e = 1, option) => {
        getStaffData(e)
        setStaffPaginationCurrent(e)
        setStaffPaginationLimit(option)
    }
    const cameraPaginationOnchange = (e = 1, option) => {
        getCameraData(e)
        setCameraPaginationCurrent(e)
        setCameraPaginationLimit(option)
    }

    useEffect(() => {
        getStaffData(filterInitialValue);
    }, [
        staffPaginationLimit,
        staffPaginationCurrent,
        filterInitialValue.searched_data
    ]);
    useEffect(() => {
        getCameraData(filterInitialValue2);
    }, [
        cameraPaginationLimit,
        cameraPaginationCurrent,
        filterInitialValue2.searched_data
    ]);

    useEffect(() => {
        getGroupData(filterInitialValueGroup);
    }, [
        filterInitialValueGroup
    ]);


    const [initialValues, setInitialValues] = useState({
        lastname: '',
        firstname: '',
        fathersname: '',
        position: '',
        vehicle_number: '',
        role: '',
        tel: '',
        image: '',
        created_time: '',
        login: '',
        id: '',
        key: '',
    });
    const [initialValuesCamera, setInitialValuesCamera] = useState({
        channel: '',
        created_time: '',
        direction: '',
        id: '',
        ip_address: '',
        key: '',
        name: '',
        password: '',
        type: '',
        username: '',
    });
    const [initialValuesGroup, setInitialValuesGroup] = useState({
        name: '',
    });

    useEffect(() => {

    }, [initialValues, setInitialValues]);
    useEffect(() => {

    }, [initialValuesCamera, setInitialValuesCamera]);
    // useEffect(() => {
    //
    // }, [initialValuesGroup, setInitialValuesGroup]);

    // img
    const [view, setView] = useState(null);
    const [imageState, setImageState] = useState({
        initial: true,
        uploaded: false,
        requested: false,
        check: false
    });
    const [img, setImg] = useState({})
    const upload = (e) => {
        if (e.target.files && e.target.files[0]) {
            console.log('uploaded')
            setView(URL.createObjectURL(e.target.files[0]))
            setImg({...img, image: e.target.files[0]})
            setImageState({
                initial: false,
                uploaded: true,
                requested: false,
                check: true
            })
        } else {
            setView(null)
            setImageState({
                initial: true,
                uploaded: false,
                requested: false,
                check: false
            })
        }
    }
    // img


    const cancel = () => {
        setOpen(!open);
        setImageState({
            initial: true,
            uploaded: false,
            requested: false,
            check: false
        });
        setInitialValues({
            lastname: '',
            firstname: '',
            fathersname: '',
            position: '',
            vehicle_number: '',
            role: '',
            tel: '',
            image: '',
            created_time: '',
            login: '',
            id: '',
            key: '',
        })
    }
    const cancelCamera = () => {
        setOpenCamera(!openCamera);
        setInitialValuesCamera({
            channel: '',
            created_time: '',
            direction: '',
            id: '',
            ip_address: '',
            key: '',
            name: '',
            password: '',
            type: '',
            username: ''
        })
    }
    const cancelGroup = () => {
        setOpenGroup(!openGroup);
        setInitialValuesGroup({
            name: '',
        })
    }

    const addStaff = (values) => {
        const formData = {
            ...values,
            image: imageState.uploaded ? img.image : initialValues ? initialValues.image : "",
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));

        if (initialValues.edit) {
            axios.put(`${ip}/api/admin/${initialValues.id}`, fd, {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
                .then((res) => {
                    console.log(res);
                    message.success("Admin ma'lumotlari o'zgartirildi", 5);
                    getStaffData();
                    cancel();
                })
                .catch(err =>
                    message.error(err?.response?.data.msg)
                )
        } else {
            axios.post(`${ip}/api/admin`, fd, {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
                .then((res) => {
                    console.log(res)
                    message.success("Yangi admin qo'shildi", 5);
                    getStaffData();
                    cancel();
                })
                .catch(err =>
                    message.error(err?.response?.data.msg)
                )
        }

    }
    const onFinishFailed = (error) => {
        console.log(error);
    }


    // add camera
    const addCamera = (values) => {
        const formData = {
            ...values,
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));

        if (initialValuesCamera.edit) {
            axios.put(`${ip}/api/cameras/${initialValuesCamera.id}`, fd,
                {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
                .then((res) => {
                    message.success("Kamera ma'lumotlari o'zgartirildi", 5);
                    getCameraData();
                    cancelCamera();
                })
                .catch(err => {
                    message.error(err?.response?.data.msg)
                })
        } else {
            axios.post(`${ip}/api/cameras`, fd,
                {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
                .then((res) => {
                    console.log(res)
                    message.success("Yangi kamera qo'shildi", 5);
                    getCameraData();
                    cancelCamera();
                })
                .catch(err => {
                    message.error(err?.response?.data.msg)
                })
        }
    }
    const onFinishFailedCamera = (error) => {
        console.log(error);
    }

    // add camera

    // add Group
    const addGroup = (values) => {
        const formData = {
            ...values,
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));

        if (initialValuesGroup.edit) {
            axios.put(`${ip}/api/camera-group/${initialValuesGroup.id}`, values,
                {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
                .then((res) => {
                    message.success("Guruh ma'lumotlari o'zgartirildi", 5);
                    getGroupData();
                    cancelGroup();
                })
                .catch(err => {
                    message.error(err?.response?.data.msg)
                })
        } else {
            axios.post(`${ip}/api/camera-group`, values, {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
                .then((res) => {
                    console.log(res)
                    message.success("Yangi guruh qo'shildi", 5);
                    getGroupData();
                    cancelGroup();
                })
                .catch(err => {
                    message.error(err?.response?.data.msg)
                })
        }
    }
    const onFinishFailedGroup = (error) => {
        console.log(error);
    }
    // add Group

    return (
        <div className="setting">
            <div className="setting_top">
                <div className="setting_top_left">
                    <div className="setting_top_left_link">
                        <Link to="/" className="setting_top_left_prev"><img src={prev}/></Link>
                        <div className="setting_top_left_text">
                            <span>Asosiy »</span>
                            <p>Sozlamalar</p>
                        </div>
                    </div>

                    <div className="setting_top_left_tabs">

                    </div>

                </div>
                <div className="setting_top_right">
                    {
                        tabKey == 1 ?
                            <div className="setting_top_right_search">
                                <img src={search}/>
                                {<input type="text"
                                        placeholder="Izlash"
                                        onChange={(e) => setFilterInitialValue({
                                            ...filterInitialValue,
                                            searched_data: e.target.value,
                                        })}
                                />}
                            </div>
                            : ""
                    }
                    {
                        tabKey == 1 ?
                            <div className="setting_top_right_add"
                                 onClick={() => setOpen(true)}>
                                <MdOutlineAddCircleOutline size={23} sytle={{marginRight: "8px"}}/>
                                {"Admin qo'shish"}
                            </div>
                            : ""
                    }
                </div>
            </div>
            <div className="setting_body">
                <Tabs onChange={onChangeTabs} type="card" defaultActiveKey="1">

                    <TabPane tab={<div className="tabPaneIcon"><MdOutlineAdminPanelSettings
                        size={20}/><span>Adminlar</span></div>} key="1">

                        <SettingTable
                            staffData={staffData}
                            filterInitialValue={filterInitialValue}
                            setFilterInitialValue={setFilterInitialValue}
                            setOpen={setOpen}
                            setDeleteOpen={setDeleteOpen}
                            setDeleteData={setDeleteData}
                            setInitialValues={setInitialValues}
                        />

                    </TabPane>

                    <TabPane
                        tab={
                            <div className="tabPaneIcon"><TfiVideoCamera size={20}/>
                                <span>Kameralar</span>
                            </div>}
                        key="2"
                    >

                        <div className="setting_body_cameras">
                            <div className="setting_body_cameras_inner">
                                <div className="setting_body_cameras_inner_table">
                                    <CameraTable
                                        cameraData={cameraData}
                                        filterInitialValue2={filterInitialValue2}
                                        setFilterInitialValue2={setFilterInitialValue2}
                                        setOpenCamera={setOpenCamera}
                                        setDeleteOpenCamera={setDeleteOpenCamera}
                                        setDeleteDataCamera={setDeleteDataCamera}
                                        setInitialValuesCamera={setInitialValuesCamera}
                                    />
                                </div>
                                <div className="setting_body_cameras_inner_bottom">
                                    <div className="setting_top_right_add"
                                         onClick={() => setOpenCamera(true)}>
                                        <MdOutlineAddCircleOutline size={23} sytle={{marginRight: "8px"}}/>
                                        {"Kamera qo'shish"}
                                    </div>
                                    <div className="settin_pagination_inner">
                                        <p className='content_total'>Jami: {cameraTotal}</p>
                                        <CameraPagination
                                            cameraPaginationLimit={cameraPaginationLimit}
                                            cameraPaginationCurrent={cameraPaginationCurrent}
                                            cameraPaginationOnchange={cameraPaginationOnchange}
                                            cameraTotal={cameraTotal}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="setting_body_cameras_group">
                                <div className="setting_body_cameras_group_table">
                                    <GroupTable
                                        groupData={groupData}
                                        filterInitialValueGroup={filterInitialValueGroup}
                                        setFilterInitialValueGroup={setFilterInitialValueGroup}
                                        setOpenGroup={setOpenGroup}
                                        setDeleteOpenGroup={setDeleteOpenGroup}
                                        setDeleteDataGroup={setDeleteDataGroup}
                                        setInitialValuesGroup={setInitialValuesGroup}
                                    />
                                </div>
                                <div className="setting_body_cameras_group_add">
                                    <div className="setting_top_right_add"
                                         onClick={() => setOpenGroup(true)}>
                                        <MdOutlineAddCircleOutline size={23} sytle={{marginRight: "8px"}}/>
                                        {"Guruh qo'shish"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>

                </Tabs>

                {tabKey == 1 ? <div className="settin_pagination">
                        <div className="settin_pagination_inner">
                            <p className='content_total'>Jami: {staffTotal}</p>
                            <SettingPagination
                                staffPaginationLimit={staffPaginationLimit}
                                staffPaginationCurrent={staffPaginationCurrent}
                                staffPaginationOnchange={staffPaginationOnchange}
                                staffTotal={staffTotal}
                            />
                        </div>
                    </div> :
                    ""
                }
            </div>

            {/*admin modal*/}
            <Modal
                isOpen={open}
                onRequestClose={cancel}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark='optional'
                    onFinish={addStaff}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={initialValues}
                >
                    <div className="user_list_modal">
                        <div className="user_list_modal_head">
                            <h2>{initialValues.edit ? "Admin ma'lumotlarini o'zgartirish" : "Admin qo'shish"}</h2>
                        </div>
                        <div className="user_list_modal_uploadImg">
                            <div className="user_list_modal_uploadImg_left">
                                <div className="user_list_modal_uploadImg_left_inner">
                                    {
                                        initialValues.edit && !imageState.check ?
                                            <img src={`${ip}/${initialValues.image}`} className="img1"/> :
                                            imageState.uploaded ? <img src={view} className="img1"/>
                                                : <img src={modalImg} className="img2"/>}
                                </div>
                            </div>
                            <div className="user_list_modal_uploadImg_right">
                                <div className="user_list_modal_uploadImg_right_inner">
                                    <label htmlFor='add_staff_img' className="upload_button">
                                        <div className="upload_button_icon">
                                            {/*<img src={UploadIcon} style={{marginRight: "8px"}}/>*/}
                                            <CiImageOn size={22} style={{marginRight: "8px"}}/>Rasm yuklash
                                        </div>
                                        <input onChange={upload} name='image' type="file"
                                               id="add_staff_img"
                                               style={{display: 'none'}}
                                               className=""
                                        />
                                    </label>
                                    <div className="upload_button_text">
                                        <span>Maksimal fayl hajmi 1 Mb 500x500 o‘lchamda</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="user_list_modal_form">

                            <div className="user_list_modal_form_input">
                                <span>Familiya</span>
                                <Form.Item name="lastname" rules={
                                    [{
                                        required: true,
                                        message: "Familiya kiriting"
                                    }]
                                }>
                                    <Input placeholder="Kiriting"/>
                                </Form.Item>
                            </div>
                            <div className="user_list_modal_form_input">
                                <span>Ism</span>
                                <Form.Item name="firstname" rules={
                                    [{
                                        required: true,
                                        message: "Ism kiriting"
                                    }]
                                }>
                                    <Input placeholder="Kiriting"/>
                                </Form.Item>
                            </div>
                            <div className="user_list_modal_form_input">
                                <span>Otasining ismi</span>
                                <Form.Item name="fathersname" rules={[{
                                    required: true,
                                    message: "Otasining ismini kiriting"
                                }]}>
                                    <Input placeholder="Kiriting"/>
                                </Form.Item>
                            </div>
                            <div className="user_list_modal_form_input">
                                <span>Boshqarma</span>
                                <Form.Item name="role" rules={[{
                                    required: true,
                                    message: "Boshqarmani tanlang"
                                }]}>
                                    {/*<Input placeholder="Kiriting"/>*/}
                                    <Select
                                        placeholder="Tanlang"
                                        // defaultValue="king"
                                    >
                                        <Select.Option disabled value="">
                                            <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                        </Select.Option>
                                        {/*<Select.Option value="king">King</Select.Option>*/}
                                        <Select.Option value="superadmin">Super Admin</Select.Option>
                                        <Select.Option value="admin">Admin</Select.Option>
                                        <Select.Option value="operator">Operator</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="user_list_modal_form_input">
                                <span>Login</span>
                                <Form.Item name="login" rules={[{
                                    required: true,
                                    message: "Login kiriting"
                                }]}>
                                    <Input placeholder="Kiriting"/>
                                </Form.Item>
                            </div>
                            <div className="user_list_modal_form_input">
                                <span>Parol</span>
                                <Form.Item name="password" rules={[{
                                    required: true,
                                    message: "Parol kiriting"
                                }]} type="password">
                                    {/*<Input placeholder="Kiriting"/>*/}
                                    <Input.Password placeholder="Kiriting"/>
                                </Form.Item>
                            </div>

                            {/*<Form.Item label=" ">*/}
                            {/*    <Button type="primary" htmlType="submit">*/}
                            {/*        Submit*/}
                            {/*    </Button>*/}
                            {/*</Form.Item>*/}

                        </div>
                        <div className="user_list_modal_form_buttons">
                            <div className="user_list_modal_form_buttons_one">
                                <button type="button" className="user_list_modal_form_buttons_left"
                                        onClick={() => cancel()}>Bekor qilish
                                </button>
                            </div>
                            <div>
                                <button type="submit" className="user_list_modal_form_buttons_right">Saqlash
                                </button>
                            </div>
                        </div>

                    </div>
                </Form>
            </Modal>

            {/*kamera modal*/}
            <Modal
                isOpen={openCamera}
                onRequestClose={cancelCamera}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark='optional'
                    onFinish={addCamera}
                    onFinishFailed={onFinishFailedCamera}
                    autoComplete="off"
                    initialValues={initialValuesCamera}
                >
                    <div className="user_list_modal">
                        <div className="user_list_modal_head" style={{marginBottom: "10px"}}>
                            <h2>{initialValuesCamera.edit ? "Kamera ma'lumotlarini o'zgartirish" : "Yangi kamera qo'shish"}</h2>
                        </div>

                        <div className="user_list_modal_form_input">

                        </div>

                        <div className="user_list_modal_form">
                            <div className="user_list_modal_form_input">
                                <span>Nomi</span>
                                <Form.Item name="name" rules={
                                    [{
                                        required: true,
                                        message: "Kamera nomi kiriting"
                                    }]}>
                                    <Input placeholder="Kiriting"/>
                                </Form.Item>
                            </div>
                            <div className="user_list_modal_form_input">
                                <span>Guruh</span>
                                <Form.Item name="camera_group_id" rules={
                                    [{
                                        required: true,
                                        message: "Tanlanmagan"
                                    }]
                                }>
                                    <Select
                                        placeholder="Tanlang"
                                    >
                                        <Select.Option disabled value="">
                                            <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                        </Select.Option>
                                        {groupData?.map((item, index) => {
                                            return (
                                                <Select.Option value={item.id}>{item.name}</Select.Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="user_list_modal_form_input">
                                <span>Turi</span>
                                <Form.Item name="type" rules={
                                    [{
                                        required: true,
                                        message: "Tanlanmagan"
                                    }]
                                }>
                                    <Select
                                        placeholder="Tanlang"
                                        // defaultValue="dahua"
                                    >
                                        <Select.Option disabled value="">
                                            <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                        </Select.Option>
                                        <Select.Option value="dahua">Dahua</Select.Option>
                                        <Select.Option value="hikvision">Hikvision</Select.Option>
                                        <Select.Option value="other">Boshqalar</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className="user_list_modal_form_input">
                                <span>Kanal</span>
                                <Form.Item name="channel" rules={
                                    [{
                                        required: true,
                                        message: "Kanalni kiriting"
                                    }]}>
                                    <Input placeholder="Kiriting"/>
                                </Form.Item>

                                {/*<span>Markasi</span>*/}
                                {/*<Form.Item name="channel" rules={*/}
                                {/*    [{*/}
                                {/*        required: true,*/}
                                {/*        message: "Tanlanmagan"*/}
                                {/*    }]*/}
                                {/*}>*/}
                                {/*    <Select*/}
                                {/*        placeholder="Tanlang"*/}
                                {/*        // defaultValue="dahua"*/}
                                {/*    >*/}
                                {/*        <Select.Option disabled value="">*/}
                                {/*            <span style={{color: "#bfbfbf"}}>Tanlang</span>*/}
                                {/*        </Select.Option>*/}
                                {/*        <Select.Option value="dahua">Dahua</Select.Option>*/}
                                {/*        <Select.Option value="hikvision">Hikvision</Select.Option>*/}
                                {/*        <Select.Option value="other">Boshqalar</Select.Option>*/}
                                {/*    </Select>*/}
                                {/*</Form.Item>*/}
                            </div>


                            <div className="user_list_modal_form_input">
                                <span>Yo'nalishi</span>
                                <Form.Item name="direction" rules={[{
                                    required: true,
                                    message: "Yo'nalishini tanlang"
                                }]}>
                                    {/*<Input placeholder="Kiriting" type={"number"}/>*/}
                                    <Select
                                        placeholder="Tanlang"
                                        // defaultValue="tanlash"
                                    >
                                        <Select.Option disabled value="">
                                            <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                        </Select.Option>
                                        <Select.Option value="enter">Kirish</Select.Option>
                                        <Select.Option value="exit">Chiqish</Select.Option>
                                        {/*<Select.Option value="operator">Operator</Select.Option>*/}
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className="user_list_modal_form_input">
                                <span>IP manzili</span>
                                <Form.Item name="ip_address" rules={[{
                                    required: true,
                                    message: "IP manzilini kiriting"
                                }]}>
                                    <Input placeholder="Kiriting"/>
                                </Form.Item>
                            </div>
                            <div className="user_list_modal_form_input">
                                <span>Login</span>
                                <Form.Item name="username" rules={[{
                                    required: true,
                                    message: "Login kiriting"
                                }]}>
                                    <Input placeholder="Kiriting"/>
                                </Form.Item>
                            </div>
                            <div className="user_list_modal_form_input">
                                <span>Parol</span>
                                <Form.Item name="password" rules={[{
                                    required: true,
                                    message: "Parol kiriting"
                                }]} type="password">
                                    {/*<Input placeholder="Kiriting"/>*/}
                                    <Input.Password placeholder="Kiriting"/>
                                </Form.Item>
                            </div>
                        </div>
                        <div className="user_list_modal_form_buttons">
                            <div className="user_list_modal_form_buttons_one">
                                <button type="button" className="user_list_modal_form_buttons_left"
                                        onClick={() => cancelCamera()}>Bekor qilish
                                </button>
                            </div>
                            <div>
                                <button type="submit" className="user_list_modal_form_buttons_right">Saqlash
                                </button>
                            </div>
                        </div>

                    </div>
                </Form>
            </Modal>

            {/*group modal*/}
            <Modal
                isOpen={openGroup}
                onRequestClose={cancelGroup}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark='optional'
                    onFinish={addGroup}
                    onFinishFailed={onFinishFailedGroup}
                    autoComplete="off"
                    initialValues={initialValuesGroup}
                >
                    <div className="user_list_modal">
                        <div className="user_list_modal_head" style={{marginBottom: "10px"}}>
                            <h2>{initialValuesGroup.edit ? "Guruh ma'lumotlarini o'zgartirish" : "Yangi guruh qo'shish"}</h2>
                        </div>
                        <div className="user_list_modal_form_input">
                            <span>Nomi</span>
                            <Form.Item name="name" rules={
                                [{
                                    required: true,
                                    message: "Guruh nomi kiriting"
                                }]}>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="user_list_modal_form_buttons">
                            <div className="user_list_modal_form_buttons_one">
                                <button type="button" className="user_list_modal_form_buttons_left"
                                        onClick={() => cancelGroup()}>Bekor qilish
                                </button>
                            </div>
                            <div>
                                <button type="submit" className="user_list_modal_form_buttons_right">Saqlash</button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>

            <DeleteSettingModal
                deleteOpen={deleteOpen}
                setDeleteOpen={setDeleteOpen}
                deleteData={deleteData}
                setDeleteData={setDeleteData}
                getStaffData={getStaffData}
            />
            <DeleteCameraModal
                deleteOpenCamera={deleteOpenCamera}
                setDeleteOpenCamera={setDeleteOpenCamera}
                deleteDataCamera={deleteDataCamera}
                setDeleteDataCamera={setDeleteDataCamera}
                getCameraData={getCameraData}
            />
            <DeleteGroupModal
                deleteOpenGroup={deleteOpenGroup}
                setDeleteOpenGroup={setDeleteOpenGroup}
                deleteDataGroup={deleteDataGroup}
                setDeleteDataGroup={setDeleteDataGroup}
                getGroupData={getGroupData}
            />


        </div>
    );
};

export default Setting;