import React, {useState} from 'react';
import {Image} from "antd";
import dayjs from "dayjs";

import {ip} from "../../ip";
import {CameraIcon, UserIcon} from "../../design-system/icons";
import './vehicleCells.css';

/* Avtomobil jadvallari (Joriy holat, Hisobot) uchun umumiy kataklar. */

/** Davomiylik: "3 kun 4 soat", "2 soat 15 daq", "12 daq", "1 daq dan kam" */
export const formatDuration = (from, to, t) => {
    if (!from) return '—';
    const end = to ? dayjs(to).valueOf() : Date.now();
    const minutes = Math.max(0, Math.floor((end - dayjs(from).valueOf()) / 60000));
    if (minutes < 1) return t("1 daq dan kam");
    const d = Math.floor(minutes / 1440);
    const h = Math.floor((minutes % 1440) / 60);
    const m = minutes % 60;
    if (d) return [t("{{count}} kun", {count: d}), h ? t("{{count}} soat", {count: h}) : null].filter(Boolean).join(' ');
    if (h) return [t("{{count}} soat", {count: h}), m ? t("{{count}} daq", {count: m}) : null].filter(Boolean).join(' ');
    return t("{{count}} daq", {count: m});
};

/** Xodim: rasm (bosilsa kattalashadi) + F.I.Sh. Ro'yxatda yo'q avtomobil — "Aniqlanmagan shaxs" */
export const PersonCell = ({record, t}) => {
    const [broken, setBroken] = useState(false);
    const known = Boolean(record.fullname);
    return (
        <div className="vc_person">
            {record.image && !broken ? (
                <span className="vc_avatar">
                    <Image src={`${ip}/staff/${record.image}`} alt="" onError={() => setBroken(true)}
                           preview={{mask: null}}/>
                </span>
            ) : (
                <span className={`vc_avatar vc_avatar--empty${known ? '' : ' is-unknown'}`}><UserIcon size={18}/></span>
            )}
            <div className="vc_person_text">
                {known
                    ? <span className="vc_person_name">{record.fullname}</span>
                    : <span className="vc_person_name vc_person_name--muted">{t("Aniqlanmagan shaxs")}</span>}
                {!known && <span className="ds-badge ds-badge--warning vc_person_badge">{t("Ro'yxatda yo'q")}</span>}
            </div>
        </div>
    );
};

/** Vaqt: soat (qalin) + sana */
export const TimeCell = ({value}) => (value ? (
    <div className="vc_time">
        <span className="vc_time_clock">{dayjs(value).format('HH:mm:ss')}</span>
        <span className="vc_time_date">{dayjs(value).format('DD.MM.YYYY')}</span>
    </div>
) : <span className="tc-muted">—</span>);

/** Kichik rasm (raqam); bosilsa — to'liq rasm. Rasm yo'q yoki bo'sh bo'lsa — belgi */
export const VehicleImage = ({src, previewSrc, t}) => {
    const [broken, setBroken] = useState(false);
    if (broken) {
        return <span className="vc_photo vc_photo--empty" title={t("Rasm yo'q")}><CameraIcon size={18}/></span>;
    }
    return (
        <span className="vc_photo" title={t("Avtomobil rasmini ko'rish")}>
            <Image src={src} alt="" onError={() => setBroken(true)}
                   preview={{src: previewSrc || src, mask: <CameraIcon size={18}/>}}/>
        </span>
    );
};
