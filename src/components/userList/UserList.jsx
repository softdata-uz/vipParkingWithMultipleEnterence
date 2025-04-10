import React, {useState, useEffect} from 'react';
import Layout from "../Layout";
import {Link} from "react-router-dom";
import prev from "../../images/Vector.png";
import search from "../../images/tabler-icon-search (1).png";
import plus from "../../images/add-circle.png";

import modalImg from "../../images/gallery-add.png";
import UploadIcon from "../../images/Vector (22).png"
import {MdOutlineAddCircleOutline} from 'react-icons/md';

import {Alert, Button, message, Space} from 'antd';
import {Form, Input, Select} from 'antd';
import Modal from "react-modal";
import "./userList.css";
import UserListTable from "./UserListTable";
import UserListPagination from "./UserListPagination";
import axios from "axios";
import {ip} from "../../ip";
import moment from "moment";
import ReportTable from "../report/ReportTable";
import {useDispatch, useSelector} from "react-redux";
import DeleteModal from "./deleteModal/DeleteModal";
import {CiImageOn} from "react-icons/ci";
import {MdOutlineCancel} from "react-icons/md";
import excelIcon from "../../images/excelIcon.png";


const {Option} = Select;

const UserList = (props) => {


    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteData, setDeleteData] = useState([]);


    const [staffData, setStaffData] = useState();
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [staffTotal, setStaffTotal] = useState(null);
    const [staffPaginationLimit, setStaffPaginationLimit] = useState(15);
    const [staffPaginationCurrent, setStaffPaginationCurrent] = useState(1);
    const [filterInitialValue, setFilterInitialValue] = useState({
        // fromDate: '',
        // toDate: '',
        searched_data: '',
        // type: 'all',
        table_name: '',
        order_by: '',
        // fullname: '',
        // position: '',
        // vehicle_number: '',
        // tel: ''
        // searched_data, table_name, order_by
    })
    const getStaffData = async (paramsObj) => {
        await axios.get(`${ip}/api/staff/${staffPaginationLimit}/${staffPaginationCurrent}`,
            {
                headers: {'x-access-token': localStorage.getItem('vipparking-token')},
                params: paramsObj
            })
            .then(response => {
                const {data} = response;
                const count = data.count;
                setStaffTotal(count);
                const newData = data.data.map((item, index) => (
                    {
                        ...item,
                        key: index + 1 + (data.current_page - 1) * staffPaginationLimit,
                        fullname : item.fullname,
                        position: item.position,
                        vehicle_number: item.vehicle_number,
                        tel: item.tel,
                        id: item.id,
                        image : item.image
                    }
                ));
                setStaffData(newData);
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    const staffPaginationOnchange = (e = 1, option) => {
        getStaffData(e);
        setStaffPaginationCurrent(e);
        setStaffPaginationLimit(option);
    }

    useEffect(() => {
        getStaffData(filterInitialValue);
    }, [
        staffPaginationLimit,
        staffPaginationCurrent,
        filterInitialValue.searched_data
    ]);


    const [initialValues, setInitialValues] = useState({
        fullname : '',
        image: '',
        vehicle_image: '',
        position: '',
        tel: '',
        vehicle_number: '',
        created_time: '',
        key: '',
        id: ''
    });
    useEffect(() => {

    }, [initialValues, setInitialValues]);


    // img
    const [view, setView] = useState(null);
    const [imageState, setImageState] = useState({
        initial: true,
        uploaded: false,
        requested: false,
        check: false
    });
    const [img, setImg] = useState({});
    const upload = (e) => {
        if (e.target.files && e.target.files[0]) {
            // console.log('uploaded')
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


    // img car
    const [view2, setView2] = useState(null);
    const [imageState2, setImageState2] = useState({
        initial: true,
        uploaded: false,
        requested: false,
        check: false
    });
    const [img2, setImg2] = useState({})
    const uploadCar = (e) => {
        if (e.target.files && e.target.files[0]) {
            // console.log('uploaded')
            setView2(URL.createObjectURL(e.target.files[0]))
            setImg2({...img2, image: e.target.files[0]})
            setImageState2({
                initial: false,
                uploaded: true,
                requested: false,
                check: true
            })
        } else {
            setView2(null)
            setImageState2({
                initial: true,
                uploaded: false,
                requested: false,
                check: false
            })
        }
    }

    // img car

    const cancel = () => {
        setOpen(!open);
        setImageState({
            initial: true,
            uploaded: false,
            requested: false,
            check: false
        })
        setImageState2({
            initial: true,
            uploaded: false,
            requested: false,
            check: false
        })
        setInitialValues({
            fullname : '',
            image: '',
            vehicle_image: '',
            position: '',
            tel: '',
            vehicle_number: '',
            created_time: '',
            key: '',
            id: ''
        })
    }

    const onClose = (e) => {
        console.log(e, 'I was closed.');
    };
    const [messageApi, contextHolder] = message.useMessage();
    const addStaff = (values) => {
        const formData = {
            ...values,
            image : imageState.uploaded ? img.image : initialValues ? initialValues.image : "",
            // vehicle_image: imageState2.uploaded ? img2.image : initialValues ? initialValues.vehicle_image : "",
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));

        if (initialValues.edit) {
            axios.put(`${ip}/api/staff/${initialValues.id}`, fd, {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
                .then((res) => {
                    message.success("Xodim ma'lumotlari o'zgartirildi", 5);
                    getStaffData();
                    cancel();
                })
                .catch(err =>
                    message.error(err?.response?.data.msg)
                )
        } else {
            axios.post(`${ip}/api/staff`, fd, {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
                .then((res) => {
                    // console.log(res)
                    message.success("Yangi xodim qo'shildi", 5);
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


// upload excel file
    // img
    const [fileState2, setFileState2] = useState({
        initial: true,
        uploaded: false,
        requested: false,
        check: false
    });
    const [filee2, setFilee2] = useState({});

    const upload2 = (e) => {
        if (e.target.files && e.target.files[0]) {
            // console.log('uploaded')
            setFilee2({...filee2, excel: e.target.files[0]})
            setFileState2({
                initial: false,
                uploaded: true,
                requested: false,
                check: true
            })
        } else {
            setFileState2({
                initial: true,
                uploaded: false,
                requested: false,
                check: false
            })
        }

    }
    // img
// upload excel file


    const sendExcel = () => {
        const formData = {
            file: filee2.excel,
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));
        axios.post(`${ip}/api/excel/staff`,
            fd,
            {headers: {'x-access-token': localStorage.getItem('vipparking-token')}}
        )
            .then((res) => {
                // console.log(res);
                getStaffData();
                setFileState2({
                    initial: true,
                    uploaded: false,
                    requested: false,
                    check: false
                });
                setFilee2({});
                message.success(res?.data?.msg);
            })
            .catch(err => {
                // console.log(err)
                message.error(err.response.data.msg);
                // console.log(err?.response?.data)
            })
    }

    const cencelExcel = () => {
        setFileState2({
            initial: true,
            uploaded: false,
            requested: false,
            check: false
        });
        setFilee2({})
    }


    return (
            <div className="user_list">
                <div className="user_list_top">
                    <div className="user_list_top_left">
                        <Link to="/" className="user_list_top_left_prev"><img src={prev}/></Link>
                        <div className="user_list_top_left_text">
                            <span>Asosiy »</span>
                            <p>Xodimlar</p>
                        </div>
                    </div>
                    <div className="user_list_top_right">
                        <div className="user_list_top_right_search">
                            <img src={search}/>
                            <input
                                type="text"
                                placeholder="Izlash"
                                onChange={(event) => {
                                    setFilterInitialValue({
                                        ...filterInitialValue,
                                        searched_data: event.currentTarget.value,
                                    });
                                    setStaffPaginationCurrent(1)
                                }
                                }
                            />
                        </div>
                        <div className="user_list_top_right_add" onClick={() => setOpen(true)}>
                            {/*<img src={plus}/>*/}
                            <MdOutlineAddCircleOutline size={23} sytle={{marginRight: "8px"}}/>
                            Yangi qo'shish
                        </div>

                        {/*<div className="">*/}
                        {/*<img src={excelIcon}/>Import*/}
                        {/*<div className="excel">*/}
                        <label htmlFor='staff_exel' className="">
                            <div className="user_list_top_right_excel">
                                <img src={excelIcon}/>
                                <div>{fileState2.uploaded ? "Saqlash" : "Import"}</div>
                            </div>
                            {
                                fileState2.uploaded ?
                                    <input onClick={sendExcel} id="staff_exel" style={{display: 'none'}}/>
                                    :
                                    <input onChange={upload2} type="file" id="staff_exel"
                                           style={{display: 'none'}}/>
                            }
                        </label>
                        {fileState2.uploaded ? <div className="excel_exit" onClick={cencelExcel}
                        ><MdOutlineCancel style={{fontSize: "20px", marginRight: "5px"}}/>Bekor qilish</div> : ""}
                        {/*</div>*/}

                        {/*</div>*/}

                    </div>
                </div>
                <div className="user_list_body">
                    <UserListTable
                        staffData={staffData}
                        filterInitialValue={filterInitialValue}
                        setFilterInitialValue={setFilterInitialValue}
                        getStaffData={getStaffData}
                        open={open}
                        setOpen={setOpen}
                        setDeleteOpen={setDeleteOpen}
                        setDeleteData={setDeleteData}
                        setInitialValues={setInitialValues}
                    />
                </div>
                <div className="user_list_pagination">
                    <div className="user_list_pagination_inner">
                        <p className='content_total'>Jami: {staffTotal}</p>
                        <UserListPagination
                            staffPaginationLimit={staffPaginationLimit}
                            staffPaginationCurrent={staffPaginationCurrent}
                            staffPaginationOnchange={staffPaginationOnchange}
                            staffTotal={staffTotal}
                        />
                    </div>
                </div>

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
                                <h2>{initialValues.edit ? "Xodim ma'lumotlarini o'zgartirish" : "Xodim qo‘shish"}</h2>
                            </div>


                            <div className="user_list_modal_form">

                                <div className="user_list_modal_form_input">
                                    <span>Xodim rasmi</span>
                                    <div className="user_list_modal_uploadImg">
                                        <div className="user_list_modal_uploadImg_left">
                                            <div className="user_list_modal_uploadImg_left_inner">
                                                {
                                                    initialValues.edit && !imageState.check ?
                                                        <img src={`${ip}/staff/${initialValues.image}`} className="img1"/> :
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
                                                           className=""/>
                                                </label>
                                                <div className="upload_button_text">
                                                    <span>Maksimal fayl hajmi 1 Mb 500x500 o‘lchamda</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="user_list_modal_form_input">
                                    {/*<span>Mashina rasmi</span>*/}
                                    {/*<div className="user_list_modal_uploadImg">*/}
                                    {/*    <div className="user_list_modal_uploadImg_left">*/}
                                    {/*        <div className="user_list_modal_uploadImg_left_inner">*/}
                                    {/*            {*/}
                                    {/*                initialValues.edit && !imageState2.check ?*/}
                                    {/*                    <img src={`${ip}/staff/${initialValues.vehicle_image}`} className="img1"/> :*/}
                                    {/*                    imageState2.uploaded ? <img src={view2} className="img1"/>*/}
                                    {/*                        : <img src={modalImg} className="img2"/>}*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*    <div className="user_list_modal_uploadImg_right">*/}
                                    {/*        <div className="user_list_modal_uploadImg_right_inner">*/}
                                    {/*            <label htmlFor='add_staff_img2' className="upload_button">*/}
                                    {/*                <div className="upload_button_icon">*/}
                                    {/*                    /!*<img src={UploadIcon} style={{marginRight: "8px"}}/>*!/*/}
                                    {/*                    <CiImageOn size={22} style={{marginRight: "8px"}}/>Rasm yuklash*/}
                                    {/*                </div>*/}
                                    {/*                <input onChange={uploadCar} name='image' type="file"*/}
                                    {/*                       id="add_staff_img2"*/}
                                    {/*                       style={{display: 'none'}}*/}
                                    {/*                       className=""/>*/}
                                    {/*            </label>*/}
                                    {/*            <div className="upload_button_text">*/}
                                    {/*                <span>Maksimal fayl hajmi 1 Mb 500x500 o‘lchamda</span>*/}
                                    {/*            </div>*/}
                                    {/*        </div>*/}

                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>

                                <div className="user_list_modal_form_input">
                                    <span>F.I.SH</span>
                                    <Form.Item name="fullname" rules={[{
                                        required: true,
                                        message: "F.I.SH ni kiriting"
                                    }]}>
                                        <Input placeholder="Kiriting"/>
                                    </Form.Item>
                                </div>
                                <div className="user_list_modal_form_input">
                                    <span>Boshqarma</span>
                                    <Form.Item name="position" rules={[{
                                        required: false,
                                        message: "Boshqarmani kiriting"
                                    }]}>
                                        <Input placeholder="Kiriting"/>
                                        {/*<Select>*/}
                                        {/*    <Select.Option value="demo">Demo</Select.Option>*/}
                                        {/*    <Select.Option value="demo2">Demo2</Select.Option>*/}
                                        {/*</Select>*/}
                                    </Form.Item>
                                </div>
                                <div className="user_list_modal_form_input">
                                    <span>Telefon raqami</span>
                                    <Form.Item name="tel" rules={[{
                                        required: false,
                                        message: "Telefon raqamini kiriting"
                                    }]}>
                                        <Input placeholder="+998"/>
                                    </Form.Item>
                                </div>
                                <div className="user_list_modal_form_input">
                                    <span>Avtomobil raqami</span>
                                    <Form.Item name="vehicle_number" rules={[{
                                        required: true,
                                        message: "Avtomobil raqamini kiriting"
                                    }]}>
                                        <Input
                                            // style={{textTransform: 'uppercase'}}
                                            placeholder="Kiriting"/>
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="user_list_modal_form_buttons">
                                <div className="user_list_modal_form_buttons_one">
                                    <button type="button" className="user_list_modal_form_buttons_left"
                                            onClick={cancel}>Bekor qilish
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
                <DeleteModal
                    deleteOpen={deleteOpen}
                    setDeleteOpen={setDeleteOpen}
                    deleteData={deleteData}
                    setDeleteData={setDeleteData}
                    getStaffData={getStaffData}
                />

            </div>
    );
};

export default UserList;