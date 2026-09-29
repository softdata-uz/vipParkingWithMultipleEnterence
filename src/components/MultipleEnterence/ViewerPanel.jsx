import React, {useEffect, useRef, useState} from "react";
import {Dropdown, Image} from "antd";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

import {ip} from "../../ip";
import PlateNumber from "../common/PlateNumber";
import {formatDuration} from "../common/VehicleCells";
import {GroupTypeBadge} from "../employees/database/groupTypes";
import {
    AlertCircleIcon,
    ArrowDownRightIcon,
    ArrowUpRightIcon,
    CameraIcon,
    CarFrontIcon,
    CctvIcon,
    CheckIcon,
    ImageUploadIcon,
    PlusIcon,
    SearchIcon,
    SlidersIcon,
    TrashIcon,
    UserIcon,
    XCloseIcon,
} from "../../design-system/icons";

/* Bitta monitoring oynasi (viewer). Holatlari:
     loading    — birinchi so'rov hali qaytmagan (skelet)
     unassigned — oynaga kamera guruhi biriktirilmagan
     idle       — guruh bor, lekin hali hodisa yo'q
     event      — oxirgi o'tgan avtomobil: rasm, raqam, shaxs, qaror
   Qaror (backend StaffService.getByVehicleNumber bilan bir xil): eshik faqat
   oq ro'yxat uchun ochiladi — qora ro'yxat, qidiruvdagi va ro'yxatda yo'q avtomobil taqiqlanadi. */

const NEW_EVENT_MS = 4000;          // yangi hodisa ramkasi shuncha vaqt yonib turadi
const TICK_MS = 15 * 1000;          // "N daq oldin" yangilanish oralig'i
const ALARM_MS = 5 * 60 * 1000;     // qidiruvdagi avtomobil ogohlantirishi shuncha vaqt miltillaydi

/** Har TICK_MS da qayta chiziladi — "N daq oldin" va ogohlantirish muddati uchun */
const useTick = () => {
    const [, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick(x => x + 1), TICK_MS);
        return () => clearInterval(id);
    }, []);
};

const slotLabel = (n) => String(n).padStart(2, '0');

/** Hodisa qarori: ton (rang), sarlavha, sabab */
const verdictOf = (staff, t) => {
    if (!staff?.fullname && !staff?.db_type) {
        return {tone: 'denied', title: t("Taqiqlanadi"), reason: t("Ro'yxatda yo'q"), Icon: XCloseIcon};
    }
    if (staff.db_type === 'whitelist') {
        return {tone: 'allowed', title: t("Ruxsat berildi"), reason: t("Oq ro'yxat"), Icon: CheckIcon};
    }
    if (staff.db_type === 'wanted') {
        return {tone: 'wanted', title: t("Qidiruvdagi avtomobil"), reason: t("Qidiruvda"), Icon: AlertCircleIcon};
    }
    if (staff.db_type === 'blacklist') {
        return {tone: 'denied', title: t("Taqiqlanadi"), reason: t("Qora ro'yxat"), Icon: XCloseIcon};
    }
    return {tone: 'denied', title: t("Taqiqlanadi"), reason: staff.db_type || t("Turi noma'lum"), Icon: XCloseIcon};
};

/** "hozirgina" / "5 daq oldin" — o'zi yangilanib turadi */
const TimeAgo = ({value}) => {
    const {t} = useTranslation();
    useTick();
    if (Date.now() - dayjs(value).valueOf() < 60 * 1000) return t("hozirgina");
    return t("{{time}} oldin", {time: formatDuration(value, null, t)});
};

/** Rasm: yuklanguncha shimmer, yuklanmasa — belgi */
const EventImage = ({src, t}) => {
    const [state, setState] = useState('loading');
    useEffect(() => setState('loading'), [src]);
    if (state === 'error') {
        return (
            <div className="lv_media_empty">
                <ImageUploadIcon size={28}/>
                <span>{t("Rasm yuklanmadi")}</span>
            </div>
        );
    }
    return (
        <>
            {state === 'loading' && <div className="lv_media_skeleton"/>}
            <Image
                src={src}
                alt={t("Avtomobil rasmi")}
                rootClassName="lv_media_img"
                onLoad={() => setState('ready')}
                onError={() => setState('error')}
                preview={{mask: <span className="lv_media_zoom"><SearchIcon size={18}/>{t("Kattalashtirish")}</span>}}
            />
        </>
    );
};

const StaffAvatar = ({image}) => {
    const [broken, setBroken] = useState(false);
    useEffect(() => setBroken(false), [image]);
    if (!image || broken) return <span className="lv_avatar lv_avatar--empty"><UserIcon size={22}/></span>;
    return (
        <span className="lv_avatar">
            <img src={`${ip}/staff/${image}`} alt="" onError={() => setBroken(true)}/>
        </span>
    );
};

/** Oyna sarlavhasi: raqam, guruh nomi, yo'nalish, amallar menyusi */
const PanelHead = ({slot, group, direction, onChangeGroup, onRemove}) => {
    const {t} = useTranslation();
    const items = [
        {key: 'change', icon: <SlidersIcon size={16}/>, label: t("Guruhni almashtirish"), onClick: onChangeGroup},
        {type: 'divider'},
        {key: 'remove', icon: <TrashIcon size={16}/>, label: t("Oynadan olib tashlash"), danger: true, onClick: onRemove},
    ];
    return (
        <header className="lv_head">
            <span className="lv_slot">{slotLabel(slot)}</span>
            <span className="lv_head_group" title={group?.name}>
                <CameraIcon size={16}/>
                <span>{group?.name || '—'}</span>
            </span>
            {direction && (
                <span className={`lv_dir lv_dir--${direction}`}>
                    {direction === 'enter' ? <ArrowDownRightIcon size={14}/> : <ArrowUpRightIcon size={14}/>}
                    {direction === 'enter' ? t("dir_enter") : t("dir_exit")}
                </span>
            )}
            <Dropdown menu={{items}} trigger={['click']} placement="bottomRight">
                <button type="button" className="lv_head_menu" aria-label={t("Amallar")} title={t("Amallar")}>
                    <span/><span/><span/>
                </button>
            </Dropdown>
        </header>
    );
};

const ViewerPanel = ({slot, group, events, loading, unavailable, layout, onAssign, onRemove}) => {
    const {t} = useTranslation();
    useTick();
    const event = events?.[0];
    const vehicle = event?.vehicle_data;
    const staff = event?.staff_data;

    // yangi hodisa kelganda ramka qisqa vaqt yonadi (birinchi yuklashda emas)
    const [fresh, setFresh] = useState(false);
    // (oldingi hodisa bo'lmasa — birinchi yuklash yoki bo'sh oynaga birinchi hodisa — yonmaydi)
    const lastKey = useRef(null);
    const eventKey = vehicle ? `${vehicle.ip_address}|${vehicle.the_date}` : null;
    const lastGroup = useRef(group?.id);
    useEffect(() => {
        const sameGroup = lastGroup.current === group?.id;
        lastGroup.current = group?.id;
        // guruh almashtirilganda uning oxirgi hodisasi "yangi" emas — yonmaydi
        if (sameGroup && lastKey.current && eventKey && eventKey !== lastKey.current) {
            setFresh(true);
            const id = setTimeout(() => setFresh(false), NEW_EVENT_MS);
            lastKey.current = eventKey;
            return () => clearTimeout(id);
        }
        lastKey.current = eventKey;
        return undefined;
    }, [eventKey, group?.id]);

    const cls = `lv_panel lv_panel--${layout.orientation}${layout.compact ? ' is-compact' : ''}${layout.mini ? ' is-mini' : ''}${layout.tiny ? ' is-tiny' : ''}${layout.facts ? '' : ' no-facts'}${layout.dense ? ' is-dense' : ''}`;

    if (loading) {
        return (
            <article className={`${cls} lv_panel--loading`} aria-busy="true">
                <div className="lv_skel lv_skel--head"/>
                <div className="lv_skel lv_skel--media"/>
                <div className="lv_skel lv_skel--line"/>
            </article>
        );
    }

    // guruhlar ro'yxati olinmadi — oyna band yoki bo'shligi noma'lum, "biriktirish" taklif qilinmaydi
    if (unavailable && !group) {
        return (
            <article className={`${cls} lv_panel--empty`}>
                <span className="lv_empty_slot">{slotLabel(slot)}</span>
                <div className="lv_empty">
                    <span className="lv_empty_art" aria-hidden="true">
                        <span className="lv_empty_icon lv_empty_icon--cam"><AlertCircleIcon size={26}/></span>
                    </span>
                    <p className="lv_empty_title">{t("Ma'lumot olinmadi")}</p>
                    <span className="lv_empty_text">{t("Server bilan aloqa tiklanganda oyna o'zi yangilanadi")}</span>
                </div>
            </article>
        );
    }

    // guruh biriktirilmagan
    if (!group) {
        return (
            <article className={`${cls} lv_panel--empty`}>
                <span className="lv_empty_slot">{slotLabel(slot)}</span>
                <div className="lv_empty">
                    <span className="lv_empty_art" aria-hidden="true">
                        <span className="lv_empty_icon lv_empty_icon--cam">
                            <CctvIcon size={28}/>
                        </span>
                    </span>
                    <p className="lv_empty_title">{t("Guruh biriktirilmagan")}</p>
                    <span className="lv_empty_text">{t("Bu oynada kamera guruhining hodisalari ko'rinadi")}</span>
                    <button type="button" className="lv_btn lv_btn--primary" onClick={onAssign}>
                        <PlusIcon size={18}/>{t("Guruh biriktirish")}
                    </button>
                </div>
            </article>
        );
    }

    const head = (
        <PanelHead slot={slot} group={group} direction={vehicle?.direction}
                   onChangeGroup={onAssign} onRemove={onRemove}/>
    );

    // guruh bor, hodisa yo'q
    if (!vehicle) {
        return (
            <article className={cls}>
                {head}
                <div className="lv_empty">
                    <span className="lv_empty_art lv_empty_art--live" aria-hidden="true">
                        <span className="lv_empty_icon lv_empty_icon--cam">
                            <CarFrontIcon size={28}/>
                        </span>
                    </span>
                    <p className="lv_empty_title">{t("Hodisa kutilmoqda")}</p>
                    <span className="lv_empty_text">{t("Avtomobil kamera oldidan o'tganda shu yerda paydo bo'ladi")}</span>
                </div>
            </article>
        );
    }

    const verdict = verdictOf(staff, t);
    const alarm = verdict.tone === 'wanted' && Date.now() - dayjs(vehicle.the_date).valueOf() < ALARM_MS;
    const known = Boolean(staff?.fullname);
    const imageBase = `${ip}/api/image/temp/${vehicle.ip_address}`;

    return (
        <article className={`${cls} lv_panel--${verdict.tone}${fresh ? ' is-fresh' : ''}${alarm ? ' is-alarm' : ''}`}>
            {head}

            <div className="lv_body">
                <div className="lv_media">
                    <EventImage key={eventKey} src={`${imageBase}/full_image/${vehicle.the_date}`} t={t}/>
                    <span className="lv_media_time">
                        <b>{dayjs(vehicle.the_date).format('HH:mm:ss')}</b>
                        <span className="lv_media_ago"><TimeAgo value={vehicle.the_date}/></span>
                    </span>
                </div>

                <div className="lv_info">
                    <div className="lv_plate">
                        <PlateNumber value={vehicle.vehicle_number} size={layout.mini ? 'md' : 'lg'}/>
                    </div>

                    <div className="lv_person">
                        <StaffAvatar image={staff?.image}/>
                        <div className="lv_person_text">
                            <span className={`lv_person_name${known ? '' : ' is-muted'}`} title={staff?.fullname}>
                                {known ? staff.fullname : t("Aniqlanmagan shaxs")}
                            </span>
                            <span className="lv_person_meta">
                                {!known
                                    ? <span className="ds-badge ds-badge--warning">{t("Ro'yxatda yo'q")}</span>
                                    : staff.db_type
                                        ? <GroupTypeBadge type={staff.db_type} t={t}/>
                                        : <span className="ds-badge ds-badge--gray">{t("Turi noma'lum")}</span>}
                                {staff?.position && <span className="lv_person_pos" title={staff.position}>{staff.position}</span>}
                            </span>
                        </div>
                    </div>

                    <dl className="lv_facts">
                        <div>
                            <dt>{t("Vaqt")}</dt>
                            <dd>{dayjs(vehicle.the_date).format('DD.MM.YYYY, HH:mm:ss')}</dd>
                        </div>
                        <div>
                            <dt>{t("Yo'nalishi")}</dt>
                            <dd>{vehicle.direction === 'enter' ? t("dir_enter") : t("dir_exit")}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <footer className={`lv_verdict lv_verdict--${verdict.tone}`} role="status">
                <span className="lv_verdict_icon"><verdict.Icon size={22}/></span>
                <span className="lv_verdict_text">
                    <span className="lv_verdict_title">{verdict.title}</span>
                    <span className="lv_verdict_reason">
                        {vehicle.direction === 'enter' ? t("dir_enter") : t("dir_exit")} · {verdict.reason}
                    </span>
                </span>
            </footer>
        </article>
    );
};

export default ViewerPanel;
