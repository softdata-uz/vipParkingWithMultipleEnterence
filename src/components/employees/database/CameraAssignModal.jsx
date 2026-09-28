import React, {useEffect, useState} from 'react';
import {Checkbox, message} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";

import {ip} from "../../../ip";
import {CameraIcon, InboxIcon} from "../../../design-system/icons";
import {ModalShell} from "../../common/ModalShell";

/* Guruhga kameralarni biriktirish.
   API: GET /api/all/cameras, PUT /api/update-camera/staff-group/:id — {cameras: [ip_address]} */

const CameraAssignModal = ({open, group, onClose, onSaved}) => {
    const {t} = useTranslation();
    const [cameras, setCameras] = useState(null);
    const [selected, setSelected] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        // tanlanganlar guruhning o'zidan — sahifani qayta yuklash shart emas
        setSelected((group?.cameras || []).map(cam => cam.ip_address));
        setCameras(null);
        axios.get(`${ip}/api/all/cameras`, {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
            .then(res => setCameras(res?.data?.data || []))
            .catch(err => {
                setCameras([]);
                message.error(err?.response?.data?.msg || t("Xatolik"));
            });
    }, [open, group, t]);

    const toggle = (address) => setSelected(prev =>
        prev.includes(address) ? prev.filter(a => a !== address) : [...prev, address]);

    const allChecked = cameras?.length > 0 && cameras.every(cam => selected.includes(cam.ip_address));
    const someChecked = !allChecked && cameras?.some(cam => selected.includes(cam.ip_address));
    const toggleAll = () => setSelected(allChecked ? [] : cameras.map(cam => cam.ip_address));

    const save = async () => {
        setSaving(true);
        try {
            await axios.put(`${ip}/api/update-camera/staff-group/${group.id}`, {cameras: selected},
                {headers: {'x-access-token': localStorage.getItem('vipparking-token')}});
            message.success(t("Kameralar biriktirildi"));
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
            icon={<CameraIcon size={22}/>}
            title={t("Kameralarni biriktirish")}
            subtitle={group?.name}
            footer={
                <>
                    <button type="button" className="dsm-btn dsm-btn--secondary" onClick={onClose}>
                        {t("Bekor qilish")}
                    </button>
                    <button type="button" className="dsm-btn dsm-btn--primary" onClick={save}
                            disabled={saving || cameras === null}>
                        {t("Saqlash")}
                    </button>
                </>
            }
        >
            <div className="cam_assign">
                {cameras?.length > 0 && (
                    <div className="cam_assign_head">
                        <Checkbox checked={allChecked} indeterminate={someChecked} onChange={toggleAll}>
                            {t("Barchasini belgilash")}
                        </Checkbox>
                        <span className="cam_assign_count">
                            {t("Tanlangan")}: <b>{selected.length}</b> / {cameras.length}
                        </span>
                    </div>
                )}

                {cameras === null && Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="page_skeleton_card cam_assign_skeleton"/>
                ))}

                {cameras?.length === 0 && (
                    <div className="page_empty">
                        <span className="page_empty_icon"><InboxIcon size={24}/></span>
                        <p>{t("Kameralar topilmadi")}</p>
                    </div>
                )}

                <div className="cam_assign_list">
                    {cameras?.map(cam => {
                        const checked = selected.includes(cam.ip_address);
                        return (
                            <div key={cam.id || cam.ip_address}
                                 className={`cam_assign_item${checked ? ' is-checked' : ''}`}
                                 onClick={() => toggle(cam.ip_address)}>
                                {/* qatorning o'zi bosiladi — checkbox bosilishi qatorga ikkinchi marta yetmasin */}
                                <span onClick={e => e.stopPropagation()}>
                                    <Checkbox checked={checked} onChange={() => toggle(cam.ip_address)}/>
                                </span>
                                <span className="cam_assign_icon"><CameraIcon size={18}/></span>
                                <span className="cam_assign_text">
                                    <span className="cam_assign_name">{cam.name}</span>
                                    <span className="cam_assign_ip">{cam.ip_address}</span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ModalShell>
    );
};

export default CameraAssignModal;
