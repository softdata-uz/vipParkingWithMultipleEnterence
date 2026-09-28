import React, {useEffect, useState} from 'react';
import {Form, Input, InputNumber, message, Select} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";

import {ip} from "../../ip";
import {CameraIcon, EditIcon, LockIcon, PlusIcon, UserIcon} from "../../design-system/icons";
import {ModalField, ModalShell} from "../common/ModalShell";

/* Kamera qo'shish / tahrirlash.
   API: POST /api/cameras, PUT /api/cameras/:id — FormData:
   name, camera_group_id, type, channel, direction (enter|exit), ip_address, username, password */

export const CAMERA_BRANDS = [
    {value: 'dahua', label: "Dahua"},
    {value: 'hikvision', label: "Hikvision"},
    {value: 'other', label: "Boshqalar"},
];

const IPV4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

const CameraModal = ({open, camera, groups, onClose, onSaved}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const isEdit = Boolean(camera?.id);

    useEffect(() => {
        if (!open) return;
        form.setFieldsValue({
            name: camera?.name || '',
            camera_group_id: camera?.camera_group_id ?? undefined,
            type: camera?.type || undefined,
            channel: camera?.channel ?? undefined,
            direction: camera?.direction || undefined,
            ip_address: camera?.ip_address || '',
            username: camera?.username || '',
            password: camera?.password || '',
        });
    }, [open, camera, form]);

    const save = async (values) => {
        const fd = new FormData();
        Object.entries(values).forEach(([k, v]) => fd.append(k, typeof v === 'string' ? v.trim() : (v ?? '')));
        const headers = {'x-access-token': localStorage.getItem('vipparking-token')};
        setSaving(true);
        try {
            if (isEdit) {
                await axios.put(`${ip}/api/cameras/${camera.id}`, fd, {headers});
                message.success(t("Kamera ma'lumotlari o'zgartirildi"));
            } else {
                await axios.post(`${ip}/api/cameras`, fd, {headers});
                message.success(t("Yangi kamera qo'shildi"));
            }
            onSaved();
            onClose();
        } catch (err) {
            message.error(err?.response?.data?.msg || t("Xatolik"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            icon={isEdit ? <EditIcon size={22}/> : <PlusIcon size={22}/>}
            title={isEdit ? t("Kamera ma'lumotlarini o'zgartirish") : t("Kamera qo'shish")}
            footer={
                <>
                    <button type="button" className="dsm-btn dsm-btn--secondary" onClick={onClose}>
                        {t("Bekor qilish")}
                    </button>
                    <button type="submit" form="camera_form" className="dsm-btn dsm-btn--primary" disabled={saving}>
                        {t("Saqlash")}
                    </button>
                </>
            }
        >
            <Form form={form} name="camera_form" layout="vertical" requiredMark="optional" onFinish={save}
                  autoComplete="off">
                <div className="dsm-form">
                    <ModalField label={t("Nomi")} full>
                        <Form.Item name="name" rules={[{required: true, whitespace: true, message: t("Kamera nomini kiriting")}]}>
                            <Input prefix={<CameraIcon size={16}/>} placeholder={t("Masalan: Asosiy kirish")}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Guruh")}>
                        <Form.Item name="camera_group_id" rules={[{required: true, message: t("Guruhni tanlang")}]}>
                            <Select placeholder={t("Tanlash")}
                                    options={(groups || []).map(g => ({value: g.id, label: g.name}))}
                                    notFoundContent={t("Avval kamera guruhini qo'shing")}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Yo'nalishi")}>
                        <Form.Item name="direction" rules={[{required: true, message: t("Yo'nalishini tanlang")}]}>
                            <Select placeholder={t("Tanlash")}
                                    options={[{value: 'enter', label: t("dir_enter")}, {value: 'exit', label: t("dir_exit")}]}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Turi")}>
                        <Form.Item name="type" rules={[{required: true, message: t("Turini tanlang")}]}>
                            <Select placeholder={t("Tanlash")}
                                    options={CAMERA_BRANDS.map(b => ({value: b.value, label: t(b.label)}))}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Kanal")}>
                        <Form.Item name="channel" rules={[{required: true, message: t("Kanalni kiriting")}]}>
                            <InputNumber min={0} precision={0} placeholder="1" style={{width: '100%'}}/>
                        </Form.Item>
                    </ModalField>

                    <div className="dsm-divider"/>

                    <ModalField label={t("IP manzili")} full>
                        <Form.Item
                            name="ip_address"
                            rules={[
                                {required: true, whitespace: true, message: t("IP manzilini kiriting")},
                                {pattern: IPV4, message: t("IP manzil noto'g'ri (masalan: 192.168.1.10)")},
                            ]}
                        >
                            <Input placeholder="192.168.1.10" className="tc-mono"/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Login")}>
                        <Form.Item name="username" rules={[{required: true, whitespace: true, message: t("Login kiriting")}]}>
                            <Input prefix={<UserIcon size={16}/>} placeholder="admin"/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Parol")}>
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

export default CameraModal;
