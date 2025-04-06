import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import prev from "../../images/Vector.png";
import search from "../../images/tabler-icon-search (1).png";
import {MdOutlineAddCircleOutline, MdOutlineCancel} from 'react-icons/md';

import {message, Select} from 'antd';
import "./userList.css";
import UserListTable from "./UserListTable";
import UserListPagination from "./UserListPagination";
import axios from "axios";
import {ip} from "../../ip";
import DeleteModal from "./deleteModal/DeleteModal";
import excelIcon from "../../images/excelIcon.png";
import AddEmployeeModal from "./addModal/AddEmployeeModal";


const {Option} = Select;

const UserList = (props) => {


    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteData, setDeleteData] = useState([]);

    const [doorName, setDoorName] = useState([]);

    const [staffData, setStaffData] = useState();
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [staffTotal, setStaffTotal] = useState(null);
    const [staffPaginationLimit, setStaffPaginationLimit] = useState(15);
    const [staffPaginationCurrent, setStaffPaginationCurrent] = useState(1);
    const [filterInitialValue, setFilterInitialValue] = useState({
        searched_data: '', // type: 'all',
        table_name: '', order_by: '',
    })

    const [initialValues, setInitialValues] = useState({
        fullname: '',
        staff_image: '',
        vehicle_image: '',
        position: '',
        door_ip: [],
        vehicle_number: '',
        vehicle_model: '',
        created_time: '',
        key: '',
        id: ''
    });

    // console.log(initialValues)
    const getStaffData = async (paramsObj) => {
        await axios.get(`${ip}/api/staff/${staffPaginationLimit}/${staffPaginationCurrent}`, {
            headers: {'x-access-token': localStorage.getItem('vipparking-token')}, params: paramsObj
        })
            .then(response => {
                const {data} = response;
                const count = data.count;
                setStaffTotal(count);
                const newData = data.data.map((item, index) => ({
                        ...item,
                        key: index + 1 + (data.current_page - 1) * staffPaginationLimit,
                        fullname: item.fullname,
                        position: item.position,
                        vehicle_number: item.vehicle_number,
                        vehicle_model: item.vehicle_model,
                        tel: item.tel,
                        id: item.id
                    }));
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
    }, [staffPaginationLimit, staffPaginationCurrent, filterInitialValue.searched_data]);



    useEffect(() => {

    }, [initialValues, setInitialValues]);


    const addStaff = (values) => {

        const formData = {
            ...values,
            staff_image: imageState.uploaded ? img.image : initialValues ? initialValues.staff_image : "",
            vehicle_image: imageState2.uploaded ? img2.image : initialValues ? initialValues.vehicle_image : "",
            door_ip: JSON.stringify(doorName)
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
                .catch(err => message.error(err?.response?.data.msg))
        } else {
            axios.post(`${ip}/api/staff`, fd, {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
                .then((res) => {
                    // console.log(res)
                    message.success("Yangi xodim qo'shildi", 5);
                    getStaffData();
                    cancel();
                })
                .catch(err => message.error(err?.response?.data.msg))
        }


    }
    const onFinishFailed = (error) => {
        console.log(error);
    }

    // img
    const [view, setView] = useState(null);
    const [imageState, setImageState] = useState({
        initial: true, uploaded: false, requested: false, check: false
    });
    const [img, setImg] = useState({});
    const upload = (e) => {
        if (e.target.files && e.target.files[0]) {
            // console.log('uploaded')
            setView(URL.createObjectURL(e.target.files[0]))
            setImg({...img, image: e.target.files[0]})
            setImageState({
                initial: false, uploaded: true, requested: false, check: true
            })
        } else {
            setView(null)
            setImageState({
                initial: true, uploaded: false, requested: false, check: false
            })
        }
    }

    // img


    // img car
    const [view2, setView2] = useState(null);
    const [imageState2, setImageState2] = useState({
        initial: true, uploaded: false, requested: false, check: false
    });
    const [img2, setImg2] = useState({})
    const uploadCar = (e) => {
        if (e.target.files && e.target.files[0]) {
            // console.log('uploaded')
            setView2(URL.createObjectURL(e.target.files[0]))
            setImg2({...img2, image: e.target.files[0]})
            setImageState2({
                initial: false, uploaded: true, requested: false, check: true
            })
        } else {
            setView2(null)
            setImageState2({
                initial: true, uploaded: false, requested: false, check: false
            })
        }
    }

    // img car

    const cancel = () => {
        setOpen(!open);
        setImageState({
            initial: true, uploaded: false, requested: false, check: false
        })
        setImageState2({
            initial: true, uploaded: false, requested: false, check: false
        })
        setInitialValues({
            fullname: '',
            staff_image: '',
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


    //eshiklarni yuklab olish
    const getDoors = () => {

    }

// upload excel file
    // img
    const [fileState2, setFileState2] = useState({
        initial: true, uploaded: false, requested: false, check: false
    });
    const [filee2, setFilee2] = useState({});

    const upload2 = (e) => {
        if (e.target.files && e.target.files[0]) {
            // console.log('uploaded')
            setFilee2({...filee2, excel: e.target.files[0]})
            setFileState2({
                initial: false, uploaded: true, requested: false, check: true
            })
        } else {
            setFileState2({
                initial: true, uploaded: false, requested: false, check: false
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
        axios.post(`${ip}/api/excel/staff`, fd, {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
            .then((res) => {
                // console.log(res);
                getStaffData();
                setFileState2({
                    initial: true, uploaded: false, requested: false, check: false
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
            initial: true, uploaded: false, requested: false, check: false
        });
        setFilee2({})
    }


    return (<div className="user_list">
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
                                    ...filterInitialValue, searched_data: event.currentTarget.value,
                                });
                                setStaffPaginationCurrent(1)
                            }}
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



                    
                    {/*<label htmlFor='staff_exel' className="">*/}
                    {/*    <div className="user_list_top_right_excel">*/}
                    {/*        <img src={excelIcon}/>*/}
                    {/*        <div>{fileState2.uploaded ? "Saqlash" : "Import"}</div>*/}
                    {/*    </div>*/}
                    {/*    {fileState2.uploaded ? <input onClick={sendExcel} id="staff_exel" style={{display: 'none'}}/> :*/}
                    {/*        <input onChange={upload2} type="file" id="staff_exel"*/}
                    {/*               style={{display: 'none'}}/>}*/}
                    {/*</label>*/}
                    {/*{fileState2.uploaded ? <div className="excel_exit" onClick={cencelExcel}*/}
                    {/*><MdOutlineCancel style={{fontSize: "20px", marginRight: "5px"}}/>Bekor qilish</div> : ""}*/}



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

            <AddEmployeeModal
                open={open}
                cancel={cancel}
                addStaff={addStaff}
                onFinishFailed={onFinishFailed}
                initialValues={initialValues}
                upload={upload}
                uploadCar={uploadCar}
                imageState={imageState}
                imageState2={imageState2}
                doorName={doorName}
                setDoorName={setDoorName}
                view={view}
                view2={view2}
            />


            <DeleteModal
                deleteOpen={deleteOpen}
                setDeleteOpen={setDeleteOpen}
                deleteData={deleteData}
                setDeleteData={setDeleteData}
                getStaffData={getStaffData}
            />

        </div>);
};

export default UserList;