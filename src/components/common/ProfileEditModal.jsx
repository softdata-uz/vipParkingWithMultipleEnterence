import React, {useEffect, useState} from 'react';
import {Form, Input, message} from 'antd';
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import axios from "axios";

import {ip} from "../../ip";
import {getMeAction} from "../../redux/action/action";
import {EditIcon, LockIcon, UserIcon} from "../../design-system/icons";
import {AvatarUpload, ModalField, ModalShell} from "./ModalShell";
import {Spinner} from "../loading/Loader";

/* Tizimga kirgan adminning o'z profilini tahrirlash — Monitoring.jsx dagi oyna bilan 1:1.
   API: PUT /api/edit/admin/:id (FormData, eski parol bilan tekshiriladi) — "VipParking Camera and Card"
   variantida ham aynan shu so'rov ishlatiladi. Keyin /api/me bilan header yangilanadi. */

const INITIAL_IMAGE_STATE = {initial: true, uploaded: false, requested: false, check: false};

const ProfileEditModal = ({open, onClose, user}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(null);
    const [img, setImg] = useState({});
    const [imageState, setImageState] = useState(INITIAL_IMAGE_STATE);

    // har ochilishda forma joriy ma'lumotlardan boshlanadi, parollar bo'sh
    useEffect(() => {
        if (open) form.setFieldsValue({...user, old_password: '', password: '', confirm_password: ''});
    }, [open, user, form]);

    const upload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setView(URL.createObjectURL(e.target.files[0]));
            setImg({...img, image: e.target.files[0]});
            setImageState({initial: false, uploaded: true, requested: false, check: true});
        } else {
            setView(null);
            setImageState(INITIAL_IMAGE_STATE);
        }
    };

    const cancel = () => {
        onClose();
        setImageState(INITIAL_IMAGE_STATE);
    };

    const save = (values) => {
        const token = localStorage.getItem('vipparking-token');
        setLoading(true);
        const formData = {
            lastname: values?.lastname,
            firstname: values?.firstname,
            fathersname: values?.fathersname,
            login: values?.login,
            password: values?.password,
            old_password: values?.old_password,
            image: imageState.uploaded ? img.image : user ? user?.image : "",
        };
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));
        axios.put(`${ip}/api/edit/admin/${user?.id}`, fd, {headers: {'x-access-token': token}})
            .then(() => axios.get(`${ip}/api/me`, {headers: {'x-access-token': token}}))
            .then(({data}) => {
                // VIP backend: /api/me -> {user} (App.js bilan bir xil)
                if (data?.user) dispatch(getMeAction(data.user));
                setLoading(false);
                cancel();
                message.success(t("Admin ma'lumotlari o'zgartirildi"), 5);
            })
            .catch(err => {
                message.error(err?.response?.data?.msg || t("Xatolik"));
                setLoading(false);
            });
    };

    return (
        <>
            <ModalShell
                open={open}
                onClose={cancel}
                icon={<EditIcon size={22}/>}
                title={t("Admin ma'lumotlarini o'zgartirish")}
                footer={
                    <>
                        <button type="button" className="dsm-btn dsm-btn--secondary" onClick={cancel}>
                            {t("Bekor qilish")}
                        </button>
                        <button type="submit" form="profile_form" className="dsm-btn dsm-btn--primary"
                                disabled={loading}>
                            {loading && <Spinner/>}
                            {t("Saqlash")}
                        </button>
                    </>
                }
            >
                <Form
                    form={form}
                    name="profile_form"
                    layout="vertical"
                    requiredMark='optional'
                    onFinish={save}
                    autoComplete="off"
                    initialValues={user}
                >
                    <AvatarUpload
                        inputId="profile_img"
                        onChange={upload}
                        src={
                            !imageState.check
                                ? (user?.image ? `${ip}/${user.image}` : null)
                                : imageState.uploaded ? view : null
                        }
                    />

                    <div className="dsm-form">
                        <ModalField label={t("Familiya")}>
                            <Form.Item name="lastname" rules={[{required: true, message: t("Familiyani kiriting")}]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </ModalField>
                        <ModalField label={t("Ism")}>
                            <Form.Item name="firstname" rules={[{required: true, message: t("Ism kiriting")}]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </ModalField>
                        <ModalField label={t("Otasining ismi")} full>
                            <Form.Item name="fathersname" rules={[{required: true, message: t("Otasining ismini kiriting")}]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </ModalField>

                        <div className="dsm-divider"/>

                        <ModalField label={t("Login")}>
                            <Form.Item name="login" rules={[{required: true, message: t("Login kiriting")}]}>
                                <Input prefix={<UserIcon size={16}/>} placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </ModalField>
                        <ModalField label={t("Parol")}>
                            <Form.Item name="old_password" rules={[{required: true, message: t("Parol kiriting")}]}>
                                <Input.Password prefix={<LockIcon size={16}/>} placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </ModalField>
                        <ModalField label={t("Yangi parol")}>
                            <Form.Item
                                name="password"
                                rules={[{required: true, message: t("Yangi parolni kiriting")}]}
                                hasFeedback
                            >
                                <Input.Password prefix={<LockIcon size={16}/>} placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </ModalField>
                        <ModalField label={t("Yangi parolni tasdiqlash")}>
                            <Form.Item
                                name="confirm_password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {required: true, message: t("Tasdiqlash parolini kiriting")},
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t("Parol noto'g'ri kiritildi!")));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockIcon size={16}/>} placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </ModalField>
                    </div>
                </Form>
            </ModalShell>
        </>
    );
};

export default ProfileEditModal;
