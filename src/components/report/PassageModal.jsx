import React, {useEffect, useState} from 'react';
import Modal from "react-modal";
import {Image} from "antd";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

import {ip} from "../../ip";
import {
    ArrowRightIcon,
    CameraIcon,
    CarFrontIcon,
    CctvIcon,
    ClockIcon,
    DownloadIcon,
    LogOutIcon,
    XCloseIcon,
} from "../../design-system/icons";
import PlateNumber from "../common/PlateNumber";
import {formatDuration} from "../common/VehicleCells";
import {GroupTypeBadge} from "../employees/database/groupTypes";

import '../../styles/modal.css';
import './passageModal.css';

/* Hisobot → "Avtomobil rasmi" bosilganda: avtomobilning kirgandagi va chiqqandagi suratlari.
   Ikki kartochka yonma-yon (Kirish | Chiqish), tepada — kirish → turgan vaqti → chiqish chizig'i.
   Surat bosilsa — to'liq ekran (kirish va chiqish suratlari orasida ← → bilan o'tiladi).
   Joriy holat sahifasida ham shu oyna ishlatiladi: `entryOnly` — faqat Kirish kartochkasi (avtomobil hali ichkarida,
   chiqish surati bo'lishi mumkin emas), oyna torroq. */

/* Suratlar: GET /api/image/event/:id/:type/:direction
     type      — plate_image | full_image (vehicle_image ham shu fayl)
     direction — enter (entering_time dagi surat) | exit (exiting_time dagi surat)
   Avtomobil hali chiqmagan bo'lsa exit — 404, shuning uchun exiting_time bo'lmasa so'ralmaydi.
   Kamera: record.entering_camera_name / exiting_camera_name (+ ..._ip) — vehicle_log javobida keladi. */
const photoUrl = (id, type, direction) => `${ip}/api/image/event/${id}/${type}/${direction}`;

export const passagePhotos = (record) => ({
    entry: {
        vehicle: photoUrl(record.id, 'full_image', 'enter'),
        plate: photoUrl(record.id, 'plate_image', 'enter'),
        camera: record.entering_camera_name || record.entering_camera_ip || null,
        cameraIp: record.entering_camera_ip || null,
        time: record.entering_time,
    },
    exit: record.exiting_time ? {
        vehicle: photoUrl(record.id, 'full_image', 'exit'),
        plate: photoUrl(record.id, 'plate_image', 'exit'),
        camera: record.exiting_camera_name || record.exiting_camera_ip || null,
        cameraIp: record.exiting_camera_ip || null,
        time: record.exiting_time,
    } : null,
});

const EXT = {'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/bmp': 'bmp'};

const download = async (url, name) => {
    try {
        const res = await fetch(url, {headers: {'x-access-token': localStorage.getItem('vipparking-token') || ''}});
        if (!res.ok) throw new Error();
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${name}.${EXT[blob.type] || 'jpg'}`;     // kengaytma server qaytargan turga qarab
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
        window.open(url, '_blank', 'noopener');
    }
};

/** Surat: yuklanguncha shimmer, topilmasa — bo'sh holat */
const Photo = ({src, className, alt, emptyText, preview = true, onStatus}) => {
    // holat qaysi src uchunligi bilan saqlanadi: src o'zgarsa o'zi "loading" bo'ladi.
    // (effekt bilan tozalash keshdagi surat onLoad'idan keyin ishlab, uni yashirib qo'yardi)
    const [status, setStatus] = useState({src, state: 'loading'});
    const state = status.src === src ? status.state : 'loading';     // loading | ready | broken
    useEffect(() => {
        if (onStatus) onStatus(state);
    }, [state, onStatus]);
    return (
        <div className={`pm_photo ${className || ''} is-${state}`}>
            {state !== 'broken' && (
                // preview doim yoqiq: PreviewGroup tartibi yuklanish tezligiga emas, joylashuvga bog'liq (Kirish → Chiqish)
                <Image src={src} alt={alt}
                       onLoad={() => setStatus({src, state: 'ready'})}
                       onError={() => setStatus({src, state: 'broken'})}
                       preview={preview ? {mask: null} : false}/>
            )}
            {state === 'broken' && (
                <span className="pm_photo_empty">
                    <CameraIcon size={20}/>
                    {emptyText && <span>{emptyText}</span>}
                </span>
            )}
        </div>
    );
};

/** Bitta tomon: Kirish yoki Chiqish */
const PassageCard = ({kind, side, plateValue, t}) => {
    const isEntry = kind === 'entry';
    const label = isEntry ? t("Kirish") : t("Chiqish");
    const [photoState, setPhotoState] = useState('loading');   // yuklab olish faqat surat bor bo'lsa

    return (
        <section className={`pm_card pm_card--${kind}`}>
            <header className="pm_card_head">
                <span className="pm_card_icon">
                    {isEntry ? <ArrowRightIcon size={16}/> : <LogOutIcon size={16}/>}
                </span>
                <div className="pm_card_title">
                    <span className="pm_card_label">{label}</span>
                    {side ? (
                        <span className="pm_card_time">
                            <b>{dayjs(side.time).format('HH:mm:ss')}</b>
                            <span>{dayjs(side.time).format('DD.MM.YYYY')}</span>
                        </span>
                    ) : <span className="pm_card_time"><span>—</span></span>}
                </div>
                {side?.camera && (
                    <span className="pm_chip"
                          title={side.cameraIp && side.cameraIp !== side.camera
                              ? `${t("Kamera")}: ${side.cameraIp}` : t("Kamera")}>
                        <CctvIcon size={14}/><span className="pm_chip_text">{side.camera}</span>
                    </span>
                )}
            </header>

            {side ? (
                <>
                    <div className="pm_stage">
                        <Photo src={side.vehicle} className="pm_photo--vehicle" alt={label}
                               emptyText={t("Rasm yo'q")} onStatus={setPhotoState}/>
                        {photoState === 'ready' && <div className="pm_stage_actions">
                            <button type="button" className="pm_icon_btn" title={t("Yuklab olish")}
                                    onClick={() => download(side.vehicle,
                                        `${plateValue || 'avto'}_${kind}_${dayjs(side.time).format('YYYYMMDD_HHmmss')}`)}>
                                <DownloadIcon size={16}/>
                            </button>
                        </div>}
                    </div>
                    <div className="pm_plate_row">
                        <span className="pm_plate_label">{t("Aniqlangan raqam")}</span>
                        <Photo src={side.plate} className="pm_photo--plate" alt="" preview={false}/>
                    </div>
                </>
            ) : (
                <>
                    <div className="pm_stage pm_stage--waiting">
                        <span className="pm_waiting_icon"><CarFrontIcon size={26}/></span>
                        <b>{t("Avtomobil hali ichkarida")}</b>
                        <span>{t("Chiqish surati avtomobil chiqqanda paydo bo'ladi")}</span>
                    </div>
                    <div className="pm_plate_row">
                        <span className="pm_plate_label">{t("Aniqlangan raqam")}</span>
                        <span className="pm_plate_slot"/>
                    </div>
                </>
            )}
        </section>
    );
};

export const PassageModal = ({record, onClose, entryOnly = false}) => {
    const {t} = useTranslation();
    const open = Boolean(record);

    // yopilish animatsiyasi paytida kontent yo'qolib qolmasligi uchun oxirgi yozuv saqlanadi
    const [last, setLast] = useState(record);
    useEffect(() => {
        if (record) setLast(record);
    }, [record]);
    const shown = record || last;       // qayta ochilganda oldingi yozuv bir lahza ham ko'rinmaydi
    if (!shown) return null;

    const photos = passagePhotos(shown);
    const inside = !shown.exiting_time;
    const known = Boolean(shown.fullname);

    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            contentLabel={entryOnly ? t("Kirish surati") : t("Kirish va chiqish suratlari")}
            className={{base: `dsm dsm--xl pm${entryOnly ? ' pm--single' : ''}`, afterOpen: 'dsm--open', beforeClose: 'dsm--closing'}}
            overlayClassName={{base: 'dsm-overlay', afterOpen: 'dsm-overlay--open', beforeClose: 'dsm-overlay--closing'}}
            closeTimeoutMS={180}
            ariaHideApp={false}
        >
            <header className="pm_head">
                <div className="pm_identity">
                    <PlateNumber value={shown.vehicle_number}/>
                    <div className="pm_who">
                        <span className={`pm_who_name${known ? '' : ' is-muted'}`}>
                            {known ? shown.fullname : t("Aniqlanmagan shaxs")}
                        </span>
                        <span className="pm_who_meta">
                            {shown.db_type && <GroupTypeBadge type={shown.db_type} t={t}/>}
                            {shown.position && <span>{shown.position}</span>}
                        </span>
                    </div>
                </div>
                <button type="button" className="dsm__close" onClick={onClose} aria-label={t("Yopish")}>
                    <XCloseIcon size={20}/>
                </button>
            </header>

            {/* kirish → turgan vaqti → chiqish */}
            <div className={`pm_track${inside ? ' is-inside' : ''}`}>
                <span className="pm_track_node pm_track_node--entry">
                    <i/>{t("Kirish")}
                    <b>{dayjs(shown.entering_time).format('HH:mm')}</b>
                </span>
                <span className="pm_track_line"/>
                <span className="pm_track_duration">
                    <ClockIcon size={14}/>
                    {formatDuration(shown.entering_time, shown.exiting_time, t)}
                </span>
                <span className="pm_track_line"/>
                <span className="pm_track_node pm_track_node--exit">
                    <i/>{inside ? t("Ichkarida") : t("Chiqish")}
                    {!inside && <b>{dayjs(shown.exiting_time).format('HH:mm')}</b>}
                </span>
            </div>

            <div className="pm_body">
                <Image.PreviewGroup>
                    <div className="pm_grid">
                        <PassageCard kind="entry" side={photos.entry} plateValue={shown.vehicle_number} t={t}/>
                        {!entryOnly &&
                            <PassageCard kind="exit" side={photos.exit} plateValue={shown.vehicle_number} t={t}/>}
                    </div>
                </Image.PreviewGroup>
            </div>
        </Modal>
    );
};

/** Jadval katagi: raqam surati; bosilsa — kirish/chiqish oynasi */
export const PassageThumb = ({record, onOpen, t, entryOnly = false}) => {
    const [broken, setBroken] = useState(false);
    const {entry, exit} = passagePhotos(record);
    return (
        <button type="button" className={`pm_thumb${broken ? ' is-empty' : ''}`} onClick={() => onOpen(record)}
                title={entryOnly ? t("Kirish surati") : t("Kirish va chiqish suratlari")}>
            {broken
                ? <CameraIcon size={18}/>
                : <img src={entry.plate} alt="" loading="lazy" onError={() => setBroken(true)}/>}
            <span className="pm_thumb_mask"><CameraIcon size={16}/></span>
            {!entryOnly && <span className="pm_thumb_count">{exit ? 2 : 1}</span>}
        </button>
    );
};
