import React, {useEffect, useState} from 'react';
import Modal from "react-modal";
import {Form, Input, Progress, Select} from "antd";
import axios from "axios";
import {ip} from "../../../ip";
import upload_i from '../../../images/upload_i.svg'

import './addEmployee.css';


import useri from '../../../images/new/user-03.png'
import car from '../../../images/Car.png'

const AddEmployeeModal = (props) => {
    const {
        open,
        cancel,
        addStaff,
        onFinishFailed,
        initialValues,
        upload,
        uploadCar,
        imageState,
        imageState2,
        doorName,
        setDoorName,
        view,
        view2
    } = props



    const [doorType, setDoorType] = useState([]);
    // console.log(doorName)

    useEffect(() => {
        const getData = () => {
            axios.get(`${ip}/api/all/devices`, {
                params: {type: "terminal"},
                headers: {'x-access-token': localStorage.getItem('vipparking-token')}
            })
                .then(res => {
                    const {data} = res;
                    setDoorType(data.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        getData()
    }, [])

    const handleChangeDoorName = (e) => {
        setDoorName(e)
    };

    useEffect(() => {
        // console.log("initialValues.door_ip:", initialValues?.door_ip);
        if (initialValues?.door_ip) {
            setDoorName(initialValues.door_ip);
        }
    }, [initialValues]);



    return (
        <div>
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
                    <div className="employee_modal">
                        <div className="employee_modal_title">
                            Yangi qo'shish
                        </div>
                        <div className="title_note">
                            Kerakli maydonlarni to'g'ri to'ldiring
                        </div>

                        <div className="employee_modal_forms">
                            <div className="employee_modal_form_input">
                                <span>Eshik turi</span>
                                <Form.Item name="door_ip" rules={[{
                                    required: true,
                                    message: "Tanlanmagan"
                                }]}>

                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{width: '100%'}}
                                        placeholder="Tanlash"
                                        value={doorName}
                                        onChange={handleChangeDoorName}
                                        options={doorType?.map((item) => ({
                                            value: item.ip_address,
                                            label: item.name
                                        }))}

                                    />

                                </Form.Item>
                            </div>
                            <div className="employee_modal_forms_inner">

                                <div className="employee_modal_forms_inner_items">
                                    <div className="employee_modal_title">
                                        Xodim ma'lumotlari
                                    </div>
                                    <div className="employee_modal_form_input">
                                        <span>F.I.SH</span>
                                        <Form.Item name="fullname" rules={[{
                                            required: true,
                                            message: "To'ldirilmagan"
                                        }]}>
                                            <Input placeholder="Kiriting"/>
                                        </Form.Item>
                                    </div>
                                    <div className="employee_modal_form_input">
                                        <span>Boshqarma</span>
                                        <Form.Item name="position" rules={[{
                                            required: true,
                                            message: "To'ldirilmagan"
                                        }]}>
                                            <Input placeholder="Kiriting"/>
                                        </Form.Item>
                                    </div>

                                    <div className="upload_img_content">
                                        {
                                            initialValues.edit && !imageState.check ?
                                                <img src={`${ip}/${initialValues.staff_image}`} className="view_img"/>
                                                :
                                                imageState.uploaded ?
                                                    <img src={view} className="view_img"/>
                                                    :
                                                    <div className="img_change">
                                                        <img src={useri} alt=""/>
                                                    </div>
                                        }

                                        <div className="upload_img_button">
                                            <div className="upload_image">
                                                <label htmlFor='add_staff_img'
                                                       className="upload_button">

                                                    <img src={upload_i} alt=""/>
                                                    <input onChange={upload} name='image' type="file"
                                                           id="add_staff_img"
                                                           style={{display: 'none'}}
                                                           className=""/>
                                                </label>
                                                <div className="upload_image_title">
                                                    <span>Yuklash</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="employee_modal_forms_inner_items">
                                    <div className="employee_modal_title">
                                        Avtomobil ma'lumotlari
                                    </div>
                                    <div className="employee_modal_form_input">
                                        <span>Davlat raqami</span>
                                        <Form.Item name="vehicle_number" rules={[{
                                            required: true,
                                            message: "To'ldirilmagan"
                                        }]}>
                                            <Input
                                                placeholder="Kiriting"
                                                style={{textTransform: 'uppercase'}}
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className="employee_modal_form_input">
                                        <span>Avtomobil modeli</span>
                                        <Form.Item name="vehicle_model" rules={[{
                                            required: true,
                                            message: "To'ldirilmagan"
                                        }]}>
                                            <Input
                                                placeholder="Kiriting"
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className="upload_img_content">
                                        {
                                            initialValues.edit && !imageState2.check ?
                                                <img src={`${ip}/${initialValues.vehicle_image}`} className="view_img"/>
                                                :
                                                imageState2.uploaded ?
                                                    <img src={view2} className="view_img"/>
                                                    :
                                                    <div className="img_change">
                                                        <img src={car} alt=""/>
                                                    </div>
                                        }

                                        <div className="upload_img_button">
                                            <div className="upload_image">
                                                <label htmlFor='add_staff_img_car'
                                                       className="upload_button">

                                                    <img src={upload_i} alt=""/>
                                                    <input onChange={uploadCar} name='vehicle_image' type="file"
                                                           id="add_staff_img_car"
                                                           style={{display: 'none'}}
                                                    />
                                                </label>
                                                <div className="upload_image_title">
                                                    <span>Yuklash</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="employee_modal_save_cancel_button">
                                <button type="button" className="employee_modal_cancel_button" onClick={cancel}>
                                    Bekor qilish
                                </button>

                                <button type="submit" className="employee_modal_save_button">
                                    Saqlash
                                </button>
                            </div>
                        </div>

                    </div>
                </Form>

            </Modal>
        </div>
    );
};

export default AddEmployeeModal;