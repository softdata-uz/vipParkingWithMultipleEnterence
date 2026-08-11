import React, {useState} from 'react';
import Modal from "react-modal";
import {DatePicker, Input, message} from "antd";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {ip} from "../../../../ip";
import modalImg from '../../../../images/gallery-add.png';
import {CiImageOn} from "react-icons/ci";
import moment from 'moment';
import 'antd/dist/reset.css';
import './addModal.css';

const AddModal = (props) => {
    const {isModalOpen, setIsModalOpen, getListGroup, categoryId, listInitialValues, setListInitialValues} = props;

    const [view, setView] = useState(null);
    const [img, setImg] = useState(null);

    const validationSchema = Yup.object({
        fullname: Yup.string().required("F.I.SH majburiy"),
        position: Yup.string(),
        tel: Yup.string(),
        vehicle_number: Yup.string().required("Avtomobil raqami majburiy"),
        from_date: Yup.date().required("Boshlanish sanasini tanlang"),
        to_date: Yup.date().required("Tugash sanasini tanlang"),
    });

    const formik = useFormik({
        initialValues: {
            fullname: listInitialValues.fullname || '',
            position: listInitialValues.position || '',
            tel: listInitialValues.tel || '',
            vehicle_number: listInitialValues.vehicle_number || '',
            from_date: listInitialValues.from_date ? moment(listInitialValues.from_date) : null,
            to_date: listInitialValues.to_date ? moment(listInitialValues.to_date) : null,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('fullname', values.fullname);
            formData.append('position', values.position);
            formData.append('tel', values.tel);
            formData.append('vehicle_number', values.vehicle_number);
            formData.append('from_date', values.from_date.format("YYYY-MM-DD"));
            formData.append('to_date', values.to_date.format("YYYY-MM-DD"));
            formData.append('staff_group_id', categoryId.id);

            if (img) {
                formData.append('image', img);
            }

            try {
                if (listInitialValues.edit) {
                    await axios.put(`${ip}/api/staff/${listInitialValues.id}`, formData, {
                        headers: {'x-access-token': localStorage.getItem('vipparking-token')}
                    });
                    message.success("Ma'lumot yangilandi!");
                } else {
                    await axios.post(`${ip}/api/staff`, formData, {
                        headers: {'x-access-token': localStorage.getItem('vipparking-token')}
                    });
                    message.success("Xodim muvaffaqiyatli qo'shildi!");
                }
                getListGroup();
                cancel();
            } catch (error) {
                message.error(error?.response?.data?.msg || "Xatolik yuz berdi");
            }
        }
    });

    const cancel = () => {
        setIsModalOpen(false);
        setView(null);
        setImg(null);
        setListInitialValues({
            fullname: "",
            position: '',
            tel: '',
            staff_group_id: "",
            from_date: "",
            to_date: "",
            vehicle_number: "",
            image: "",
        });
    };

    const uploadUser = (e) => {
        if (e.target.files && e.target.files[0]) {
            if (e.target.files[0].size > 1024 * 1024) {
                message.error("Fayl hajmi 1MB dan oshmasligi kerak");
                return;
            }
            setView(URL.createObjectURL(e.target.files[0]));
            setImg(e.target.files[0]);
        }
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={cancel}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={0}

        >
            <form onSubmit={formik.handleSubmit}  className="user_list_modal">
                <div className="user_list_modal_head">
                    <h2>{listInitialValues.edit ? "Xodim ma'lumotlarini o'zgartirish" : "Xodim qo‘shish"}</h2>
                </div>

                <div className="user_list_modal_form_inner">

                    {/* Rasm yuklash */}
                    <div className="user_list_modal_form_input">
                        <span >Xodim rasmi</span>
                        <div className="user_list_modal_uploadImg">
                            <div className="user_list_modal_uploadImg_left">
                                <div className="user_list_modal_uploadImg_left_inner">
                                    {view ? (
                                        <img src={view} className="img1"/>
                                    ) : listInitialValues.edit && listInitialValues.image ? (
                                        <img src={`${ip}/staff/${listInitialValues.image}`} className="img1"/>
                                    ) : (
                                        <img src={modalImg} className="img2"/>
                                    )}
                                </div>
                            </div>
                            <div className="user_list_modal_uploadImg_right">
                                <label htmlFor='add_image' className="upload_button">
                                    <div className="upload_button_icon">
                                        <CiImageOn size={22} style={{marginRight: "8px"}}/>
                                        Rasm yuklash
                                    </div>
                                    <input onChange={uploadUser} type="file" id="add_image" style={{display: 'none'}}/>
                                </label>
                                <div className="upload_button_text">
                                    <span>Maksimal fayl hajmi 1 Mb 500x500 o‘lchamda</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="user_list_modal_form_input_two_item">
                        <div className="user_list_modal_form_input">
                            <span>F.I.SH</span>
                            <Input
                                {...formik.getFieldProps('fullname')}
                                placeholder="Kiriting"
                            />
                            {formik.touched.fullname && formik.errors.fullname &&
                                <div className="error">{formik.errors.fullname}</div>}
                        </div>

                        <div className="user_list_modal_form_input">
                            <span>Boshqarma</span>
                            <Input
                                {...formik.getFieldProps('position')}
                                placeholder="Kiriting"
                            />
                        </div>
                    </div>

                    <div className="user_list_modal_form_input_two_item">
                        <div className="user_list_modal_form_input">
                            <span>Telefon raqami</span>
                            <Input
                                {...formik.getFieldProps('tel')}
                                placeholder="+998"
                            />
                        </div>

                        <div className="user_list_modal_form_input">
                            <span>Avtomobil raqami</span>
                            <Input
                                {...formik.getFieldProps('vehicle_number')}
                                placeholder="Kiriting"
                                style={{textTransform: 'uppercase'}}
                            />
                            {formik.touched.vehicle_number && formik.errors.vehicle_number &&
                                <div className="error">{formik.errors.vehicle_number}</div>}
                        </div>
                    </div>

                    <div className="user_list_modal_form_input_two_item">
                        <div className="user_list_modal_form_input">
                            <span>Boshlanish sanasi</span>
                            <DatePicker
                                // value={formik.values.from_date}
                                value={formik.values.from_date ? moment(formik.values.from_date) : null}
                                onChange={(date) => formik.setFieldValue('from_date', date ? date : null)}
                                format="YYYY-MM-DD"
                                size="large"
                                style={{width: "100%"}}
                                placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                                inputReadOnly={true}
                                allowClear={false}
                            />
                            {formik.touched.from_date && formik.errors.from_date &&
                                <div className="error">{formik.errors.from_date}</div>}
                        </div>

                        <div className="user_list_modal_form_input">
                            <span>Tugash sanasi</span>
                            <DatePicker
                                value={formik.values.to_date}
                                onChange={(date) => formik.setFieldValue('to_date', date ? date : null)}
                                format="YYYY-MM-DD"
                                size="large"
                                style={{width: "100%"}}
                                placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                                inputReadOnly={true}
                                allowClear={false}
                            />

                            {formik.touched.to_date && formik.errors.to_date &&
                                <div className="error">{formik.errors.to_date}</div>}
                        </div>
                    </div>


                </div>


                <div className="user_list_modal_form_buttons">
                    <div className="user_list_modal_form_buttons_one">
                        <button type="button" className="user_list_modal_form_buttons_left" onClick={cancel}>Bekor
                            qilish
                        </button>
                    </div>
                    <div>
                        <button type="submit" className="user_list_modal_form_buttons_right">Saqlash</button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AddModal;

