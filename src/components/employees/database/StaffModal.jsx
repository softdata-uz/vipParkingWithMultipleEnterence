import React, {useEffect, useState} from 'react';
import {DatePicker, Form, Input, message} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";
import dayjs from "dayjs";

import {ip} from "../../../ip";
import {BriefcaseIcon, CalendarIcon, EditIcon, PlusIcon, UserIcon} from "../../../design-system/icons";
import {AvatarUpload, ModalField, ModalShell} from "../../common/ModalShell";

/* Guruhga xodim (avtomobil) qo'shish / tahrirlash.
   API: POST /api/staff, PUT /api/staff/:id — FormData:
   fullname, position, tel, vehicle_number, from_date, to_date (YYYY-MM-DD), staff_group_id, image? */

const MAX_IMAGE = 1024 * 1024;
const DATE_FORMAT = "DD.MM.YYYY";

const toDay = (value) => (value ? dayjs(value) : null);

const StaffModal = ({open, staff, groupId, onClose, onSaved}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const isEdit = Boolean(staff?.id);

    useEffect(() => {
        if (!open) return;
        setImage(null);
        setPreview(null);
        form.setFieldsValue({
            fullname: staff?.fullname || '',
            position: staff?.position || '',
            tel: staff?.tel || '',
            vehicle_number: staff?.vehicle_number || '',
            from_date: toDay(staff?.from_date),
            to_date: toDay(staff?.to_date),
        });
    }, [open, staff, form]);

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
        fd.append('fullname', values.fullname.trim());
        fd.append('position', values.position.trim());
        fd.append('tel', values.tel.trim());
        fd.append('vehicle_number', values.vehicle_number.replace(/\s+/g, '').toUpperCase());
        fd.append('from_date', values.from_date.format("YYYY-MM-DD"));
        fd.append('to_date', values.to_date.format("YYYY-MM-DD"));
        fd.append('staff_group_id', groupId);
        if (image) fd.append('image', image);

        const headers = {'x-access-token': localStorage.getItem('vipparking-token')};
        setSaving(true);
        try {
            if (isEdit) {
                await axios.put(`${ip}/api/staff/${staff.id}`, fd, {headers});
                message.success(t("Xodim ma'lumotlari o'zgartirildi"));
            } else {
                await axios.post(`${ip}/api/staff`, fd, {headers});
                message.success(t("Xodim qo'shildi"));
            }
            onSaved(!isEdit);
            onClose();
        } catch (err) {
            message.error(err?.response?.data?.msg || t("Xatolik"));
        } finally {
            setSaving(false);
        }
    };

    const imageSrc = preview || (isEdit && staff?.image ? `${ip}/staff/${staff.image}` : null);

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            icon={isEdit ? <EditIcon size={22}/> : <PlusIcon size={22}/>}
            title={isEdit ? t("Xodim ma'lumotlarini o'zgartirish") : t("Xodim qo'shish")}
            footer={
                <>
                    <button type="button" className="dsm-btn dsm-btn--secondary" onClick={onClose}>
                        {t("Bekor qilish")}
                    </button>
                    <button type="submit" form="staff_form" className="dsm-btn dsm-btn--primary" disabled={saving}>
                        {t("Saqlash")}
                    </button>
                </>
            }
        >
            <Form form={form} name="staff_form" layout="vertical" requiredMark="optional" onFinish={save}
                  autoComplete="off">
                <AvatarUpload inputId="staff_img" onChange={onImage} src={imageSrc}/>

                <div className="dsm-form">
                    <ModalField label={t("F.I.Sh")} full>
                        <Form.Item name="fullname" rules={[{required: true, whitespace: true, message: t("F.I.Sh kiriting")}]}>
                            <Input prefix={<UserIcon size={16}/>} placeholder={t("Kiriting")}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Boshqarma")}>
                        <Form.Item name="position" rules={[{required: true, whitespace: true, message: t("Boshqarmani kiriting")}]}>
                            <Input prefix={<BriefcaseIcon size={16}/>} placeholder={t("Kiriting")}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Telefon raqami")}>
                        <Form.Item name="tel" rules={[{required: true, whitespace: true, message: t("Telefon raqamini kiriting")}]}>
                            <Input placeholder="+998 90 123 45 67"/>
                        </Form.Item>
                    </ModalField>

                    <div className="dsm-divider"/>

                    <ModalField label={t("Avtomobil raqami")} full>
                        <Form.Item
                            name="vehicle_number"
                            rules={[{required: true, whitespace: true, message: t("Avtomobil raqamini kiriting")}]}
                            normalize={(v) => (v || '').toUpperCase()}
                        >
                            <Input placeholder="01A777AA" className="staff_plate_input"/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Boshlanish sanasi")}>
                        <Form.Item name="from_date" rules={[{required: true, message: t("Boshlanish sanasini tanlang")}]}>
                            <DatePicker format={DATE_FORMAT} style={{width: '100%'}} inputReadOnly
                                        suffixIcon={<CalendarIcon size={16}/>}
                                        placeholder={dayjs().format(DATE_FORMAT)}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Tugash sanasi")}>
                        <Form.Item
                            name="to_date"
                            dependencies={['from_date']}
                            rules={[
                                {required: true, message: t("Tugash sanasini tanlang")},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        const from = getFieldValue('from_date');
                                        if (!value || !from || !value.isBefore(from, 'day')) return Promise.resolve();
                                        return Promise.reject(new Error(t("Tugash sanasi boshlanishidan oldin bo'lmasin")));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker format={DATE_FORMAT} style={{width: '100%'}} inputReadOnly
                                        suffixIcon={<CalendarIcon size={16}/>}
                                        placeholder={dayjs().format(DATE_FORMAT)}/>
                        </Form.Item>
                    </ModalField>
                </div>
            </Form>
        </ModalShell>
    );
};

export default StaffModal;
