import React, {useEffect, useState} from 'react';
import {Form, Input, message, Select} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";

import {ip} from "../../ip";
import {EditIcon, LockIcon, PlusIcon, UserIcon} from "../../design-system/icons";
import {AvatarUpload, ModalField, ModalShell} from "../common/ModalShell";
import {ASSIGNABLE_ROLES, getRoleLabel} from "../../utils/roleLabel";

/* Admin qo'shish / tahrirlash.
   API: POST /api/admin, PUT /api/admin/:id — FormData: lastname, firstname, fathersname, role, login, password, image
   (eski sahifadagi kabi parol ikkala holatda ham majburiy — server shuni kutadi) */

const MAX_IMAGE = 1024 * 1024;

const AdminModal = ({open, admin, onClose, onSaved}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const isEdit = Boolean(admin?.id);

    useEffect(() => {
        if (!open) return;
        setImage(null);
        setPreview(null);
        form.setFieldsValue({
            lastname: admin?.lastname || '',
            firstname: admin?.firstname || '',
            fathersname: admin?.fathersname || '',
            role: admin?.role || undefined,
            login: admin?.login || '',
            password: '',
        });
    }, [open, admin, form]);

    const onImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_IMAGE) {
            message.error(t("Fayl hajmi 1 MB dan oshmasligi kerak"));
            return;
        }
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const save = async (values) => {
        const fd = new FormData();
        Object.entries({...values, image: image || admin?.image || ''}).forEach(([k, v]) => fd.append(k, v ?? ''));
        const headers = {'x-access-token': localStorage.getItem('vipparking-token')};
        setSaving(true);
        try {
            if (isEdit) {
                await axios.put(`${ip}/api/admin/${admin.id}`, fd, {headers});
                message.success(t("Admin ma'lumotlari o'zgartirildi"));
            } else {
                await axios.post(`${ip}/api/admin`, fd, {headers});
                message.success(t("Yangi admin qo'shildi"));
            }
            onSaved();
            onClose();
        } catch (err) {
            message.error(err?.response?.data?.msg || t("Xatolik"));
        } finally {
            setSaving(false);
        }
    };

    const imageSrc = preview || (isEdit && admin?.image ? `${ip}/${admin.image}` : null);

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            icon={isEdit ? <EditIcon size={22}/> : <PlusIcon size={22}/>}
            title={isEdit ? t("Admin ma'lumotlarini o'zgartirish") : t("Admin qo'shish")}
            footer={
                <>
                    <button type="button" className="dsm-btn dsm-btn--secondary" onClick={onClose}>
                        {t("Bekor qilish")}
                    </button>
                    <button type="submit" form="admin_form" className="dsm-btn dsm-btn--primary" disabled={saving}>
                        {t("Saqlash")}
                    </button>
                </>
            }
        >
            <Form form={form} name="admin_form" layout="vertical" requiredMark="optional" onFinish={save}
                  autoComplete="off">
                <AvatarUpload inputId="admin_img" onChange={onImage} src={imageSrc}/>

                <div className="dsm-form">
                    <ModalField label={t("Familiya")}>
                        <Form.Item name="lastname" rules={[{required: true, whitespace: true, message: t("Familiyani kiriting")}]}>
                            <Input placeholder={t("Kiriting")}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Ism")}>
                        <Form.Item name="firstname" rules={[{required: true, whitespace: true, message: t("Ism kiriting")}]}>
                            <Input placeholder={t("Kiriting")}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Otasining ismi")}>
                        <Form.Item name="fathersname" rules={[{required: true, whitespace: true, message: t("Otasining ismini kiriting")}]}>
                            <Input placeholder={t("Kiriting")}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Rol")}>
                        <Form.Item name="role" rules={[{required: true, message: t("Rolni tanlang")}]}>
                            <Select
                                placeholder={t("Tanlash")}
                                options={ASSIGNABLE_ROLES.map(role => ({value: role, label: getRoleLabel(role, t)}))}
                            />
                        </Form.Item>
                    </ModalField>

                    <div className="dsm-divider"/>

                    <ModalField label={t("Login")}>
                        <Form.Item name="login" rules={[{required: true, whitespace: true, message: t("Login kiriting")}]}>
                            <Input prefix={<UserIcon size={16}/>} placeholder={t("Kiriting")}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={isEdit ? t("Yangi parol") : t("Parol")}>
                        <Form.Item name="password" rules={[{required: true, message: t("Parol kiriting")}]}>
                            <Input.Password prefix={<LockIcon size={16}/>} placeholder={t("Kiriting")}
                                            autoComplete="new-password"/>
                        </Form.Item>
                    </ModalField>
                </div>
            </Form>
        </ModalShell>
    );
};

export default AdminModal;
