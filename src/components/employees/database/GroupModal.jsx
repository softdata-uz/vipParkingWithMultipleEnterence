import React, {useEffect, useState} from 'react';
import {Form, Input, message, Select} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";

import {ip} from "../../../ip";
import {EditIcon, PlusIcon, UsersIcon} from "../../../design-system/icons";
import {ModalField, ModalShell} from "../../common/ModalShell";
import {GROUP_TYPES} from "./groupTypes";

/* Xodimlar guruhini (ma'lumotlar bazasini) qo'shish / tahrirlash.
   API: POST /api/staff-group, PUT /api/staff-group/:id — {name, type} */

const GroupModal = ({open, group, onClose, onSaved}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const isEdit = Boolean(group?.id);

    useEffect(() => {
        if (open) form.setFieldsValue({name: group?.name || '', type: group?.type || undefined});
    }, [open, group, form]);

    const save = async (values) => {
        const headers = {'x-access-token': localStorage.getItem('vipparking-token')};
        setSaving(true);
        try {
            if (isEdit) {
                await axios.put(`${ip}/api/staff-group/${group.id}`, values, {headers});
                message.success(t("Guruh ma'lumotlari o'zgartirildi"));
            } else {
                await axios.post(`${ip}/api/staff-group`, values, {headers});
                message.success(t("Yangi guruh qo'shildi"));
            }
            onSaved(!isEdit);
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
            size="sm"
            icon={isEdit ? <EditIcon size={22}/> : <PlusIcon size={22}/>}
            title={isEdit ? t("Guruhni tahrirlash") : t("Yangi guruh")}
            subtitle={t("Guruh nomi va ro'yxat turini kiriting")}
            footer={
                <>
                    <button type="button" className="dsm-btn dsm-btn--secondary" onClick={onClose}>
                        {t("Bekor qilish")}
                    </button>
                    <button type="submit" form="group_form" className="dsm-btn dsm-btn--primary" disabled={saving}>
                        {t("Saqlash")}
                    </button>
                </>
            }
        >
            <Form form={form} name="group_form" layout="vertical" requiredMark="optional" onFinish={save}
                  autoComplete="off">
                <div className="dsm-form">
                    <ModalField label={t("Guruh nomi")} full>
                        <Form.Item name="name" rules={[{required: true, whitespace: true, message: t("Guruh nomini kiriting")}]}>
                            <Input prefix={<UsersIcon size={16}/>} placeholder={t("Kiriting")}/>
                        </Form.Item>
                    </ModalField>
                    <ModalField label={t("Turi")} full>
                        <Form.Item name="type" rules={[{required: true, message: t("Turini tanlang")}]}>
                            <Select
                                placeholder={t("Tanlash")}
                                options={GROUP_TYPES.map(type => ({
                                    value: type.value,
                                    label: (
                                        <span className="grp_option">
                                            <span className={`page_seg_dot grp_dot--${type.tone}`}/>
                                            {t(type.label)}
                                        </span>
                                    ),
                                }))}
                            />
                        </Form.Item>
                    </ModalField>
                </div>
            </Form>
        </ModalShell>
    );
};

export default GroupModal;
