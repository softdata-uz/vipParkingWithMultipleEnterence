import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {message} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import socketIOClient from "socket.io-client";

import {ip} from "../../ip";
import {useTheme} from "../../context/ThemeContext";
import {PrefsSwitch} from "../common/PrefsSwitch";
import {ArrowRightIcon, GridIcon} from "../../design-system/icons";
import ViewerPanel from "./ViewerPanel";
import {GroupPickerModal, RemoveGroupModal} from "./GroupPickerModal";

import logoDark from "../../images/logo_dark.svg";
import logoLight from "../../images/logo_light.svg";

import "../../design-system/ui.css";
import "../../styles/modal.css";
import "../shell.css";
import "./live.css";

/* Bosh ekran — kirish-chiqish nazorati (tizimga kirmasdan ochiladi, post monitori uchun).
   API: GET /api/all/camera-group            -> {data: [{id, name, viewer}]}  (viewer 0 — hech qaysi oynada emas)
        GET /api/temp/:viewer                -> {data: null}  guruh yo'q | {data: []} hodisa yo'q | {data: [{vehicle_data, staff_data}]}
        PUT /api/viewer/camera-group/:id     {viewer}  — guruhni oynaga biriktirish (0 — ajratish)
        GET /api/image/temp/:ip/full_image/:the_date
        socket "enter" (viewerId)            — shu oynada yangi hodisa
   Oynalar soni brauzerda saqlanadi (viewerCount / viewerIds — reducer.js logout'da ham saqlab qoladi). */

const MIN_VIEWERS = 1;
const MAX_VIEWERS = 12;
const DEFAULT_VIEWERS = 3;
const FACTS_MAX_VIEWERS = 6;           // "Vaqt / Yo'nalishi" bloki shu songacha ko'rsatiladi
const FALLBACK_POLL_MS = 15 * 1000;     // socket uzilganda ma'lumot shuncha vaqtda bir so'raladi
const GROUPS_POLL_MS = 60 * 1000;       // oyna-guruh bog'lanishi serverda umumiy — boshqa monitor o'zgartirishi mumkin

// oynalar soni -> [ustun, qator]: ekranni to'liq, skrollsiz to'ldiradi
const GRID = {
    1: [1, 1], 2: [2, 1], 3: [3, 1], 4: [2, 2], 5: [3, 2], 6: [3, 2],
    7: [4, 2], 8: [4, 2], 9: [3, 3], 10: [4, 3], 11: [4, 3], 12: [4, 3],
};

const clampCount = (value) => {
    const n = Math.trunc(Number(value));
    return Number.isFinite(n) ? Math.min(Math.max(n, MIN_VIEWERS), MAX_VIEWERS) : DEFAULT_VIEWERS;
};

const readStoredCount = () => {
    try {
        const ids = JSON.parse(localStorage.getItem('viewerIds'));
        if (Array.isArray(ids) && ids.length) return clampCount(ids.length);
    } catch (e) {
        // buzilgan qiymat — standart son
    }
    return clampCount(localStorage.getItem('viewerCount') ?? DEFAULT_VIEWERS);
};

/** Soat — o'zi alohida yangilanadi, butun sahifa har soniyada qayta chizilmaydi */
const LiveClock = () => {
    const [now, setNow] = useState(() => dayjs());
    useEffect(() => {
        const id = setInterval(() => setNow(dayjs()), 1000);
        return () => clearInterval(id);
    }, []);
    return (
        <div className="lv_clock" aria-label={now.format('DD.MM.YYYY HH:mm')}>
            <span className="lv_clock_time">{now.format('HH:mm')}<small>{now.format(':ss')}</small></span>
            <span className="lv_clock_date">{now.format('DD.MM.YYYY')}</span>
        </div>
    );
};

/** Oynalar soni: − N + (darhol qo'llanadi) */
const ViewerStepper = ({value, onChange}) => {
    const {t} = useTranslation();
    return (
        <div className="lv_stepper" role="group" aria-label={t("Oynalar soni")}>
            <span className="lv_stepper_label"><GridIcon size={16}/>{t("Oynalar")}</span>
            <button type="button" onClick={() => onChange(value - 1)} disabled={value <= MIN_VIEWERS}
                    aria-label={t("Kamaytirish")}>−</button>
            <span className="lv_stepper_value" aria-live="polite">{value}</span>
            <button type="button" onClick={() => onChange(value + 1)} disabled={value >= MAX_VIEWERS}
                    aria-label={t("Ko'paytirish")}>+</button>
        </div>
    );
};

/** Katak o'lchamiga qarab oyna joylashuvi: keng — rasm chapda, ma'lumot o'ngda; past — ixcham */
const useCellLayout = (cols, rows, count) => {
    const [size, setSize] = useState({w: 0, h: 0});
    const observer = useRef(null);
    // callback ref: tugun ulanganda kuzatuv boshlanadi, ajralganda (node = null) to'xtaydi.
    // ⚠ alohida useEffect cleanup qo'yilmaydi — StrictMode'da effekt qayta ishga tushganda u
    //   kuzatuvchini uzib qo'yardi, ref esa qayta chaqirilmaydi va o'lcham hech qachon yangilanmasdi
    const ref = useCallback((node) => {
        observer.current?.disconnect();
        observer.current = null;
        if (!node) return;
        observer.current = new ResizeObserver(([entry]) => {
            const {width, height} = entry.contentRect;
            setSize({w: width, h: height});
        });
        observer.current.observe(node);
    }, []);

    const gap = 16;
    const cellW = (size.w - gap * (cols - 1)) / cols;
    const cellH = (size.h - gap * (rows - 1)) / rows;
    const layout = useMemo(() => ({
        // keng katak: rasm chapda, ma'lumot o'ngda (past kataklarda tik joylashuvga rasm sig'maydi)
        orientation: cellW >= 560 && cellW / cellH > 1.25 ? 'wide' : 'tall',
        compact: cellH > 0 && cellH < 520,
        // juda past katak (8–12 oyna, kichik ekran): rasm chapda, ma'lumot o'ngda, qaror bir qatorda
        mini: cellH > 0 && cellH < 340,
        // eng past katak (9–12 oyna, ~600px ekran): sarlavha va qaror qatori ingichkalashadi —
        // raqam, ism, turi va boshqarma sig'ishi uchun
        tiny: cellH > 0 && cellH < 200,
        // "Vaqt / Yo'nalishi" bloki — faqat 1–6 oynada (joy yetsa); 7+ oynada yashirin
        facts: count <= FACTS_MAX_VIEWERS && cellW >= 400 && cellH >= 200,
        // 5+ oynada ma'lumot tomoni kengroq (rasm 44%) — uzun ism bitta qatorga sig'sin; 1–4 da 1:1
        dense: count > 4,
    }), [cellW, cellH, count]);
    return [ref, layout];
};

const MultipleEnterence = () => {
    const {t, i18n} = useTranslation();
    const {theme} = useTheme();
    const navigate = useNavigate();

    const [lang, setLang] = useState(localStorage.getItem('i18nextLng') || i18n.language || 'uz');
    const onChangeLanguage = (next) => {
        setLang(next);
        i18n.changeLanguage(next);
        localStorage.setItem('i18nextLng', next);
    };

    const [count, setCount] = useState(readStoredCount);
    const [groups, setGroups] = useState(null);              // null — hali yuklanmagan
    const [events, setEvents] = useState({});                // {viewer: [] | null}
    const [socketState, setSocketState] = useState('connecting');   // connecting | live | lost
    const [groupsError, setGroupsError] = useState(false);
    const [viewerError, setViewerError] = useState(false);
    const [pickSlot, setPickSlot] = useState(null);
    const [removeSlot, setRemoveSlot] = useState(null);
    const [removing, setRemoving] = useState(false);

    const slots = useMemo(() => Array.from({length: count}, (_, i) => i + 1), [count]);
    const [cols, rows] = GRID[count] || GRID[DEFAULT_VIEWERS];
    const [gridRef, layout] = useCellLayout(cols, rows, count);

    // oyna -> guruh
    const bySlot = useMemo(() => {
        const map = {};
        (groups || []).forEach(g => {
            if (g.viewer) map[g.viewer] = g;
        });
        return map;
    }, [groups]);

    const bySlotRef = useRef(bySlot);
    bySlotRef.current = bySlot;

    // ⚠ xato bo'lsa oldingi ro'yxat saqlanadi: bo'sh ro'yxat qo'yilsa, barcha oynalar
    //   "Guruh biriktirilmagan" bo'lib, aslida band oynalarga ham "biriktirish" taklif qilinardi
    const groupsReq = useRef(0);
    const loadGroups = useCallback(() => {
        const id = ++groupsReq.current;
        return axios.get(`${ip}/api/all/camera-group`)
            .then(({data}) => {
                if (id !== groupsReq.current) return;
                setGroups(data?.data || []);
                setGroupsError(false);
            })
            .catch(() => {
                if (id === groupsReq.current) setGroupsError(true);
            });
    }, []);

    // har oyna uchun faqat eng oxirgi so'rov javobi qabul qilinadi — socket ketma-ket ikki
    // hodisa yuborsa, kechikib kelgan eski javob yangisining ustiga yozilmaydi
    const viewerReq = useRef({});
    const loadViewer = useCallback((viewer) => {
        const id = (viewerReq.current[viewer] || 0) + 1;
        viewerReq.current[viewer] = id;
        return axios.get(`${ip}/api/temp/${viewer}`)
            .then(({data}) => {
                if (id !== viewerReq.current[viewer]) return;
                const value = data?.data ?? null;
                setEvents(prev => ({...prev, [viewer]: value}));
                setViewerError(false);
                // server "guruh yo'q/bor" deydi, bizdagi ro'yxat esa boshqacha — bog'lanishni
                // boshqa monitor o'zgartirgan: ro'yxat yangilanadi
                if ((value === null) !== !bySlotRef.current[viewer]) loadGroups();
            })
            .catch(() => {
                if (id !== viewerReq.current[viewer]) return;
                // skelet osilib qolmasin — oyna guruh ma'lumotiga qarab chiziladi
                setEvents(prev => (viewer in prev ? prev : {...prev, [viewer]: []}));
                setViewerError(true);
            });
    }, [loadGroups]);

    const loadAll = useCallback(() => {
        loadGroups();
        slots.forEach(loadViewer);
    }, [loadGroups, loadViewer, slots]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    // jonli hodisalar
    const slotsRef = useRef(slots);
    slotsRef.current = slots;
    useEffect(() => {
        const socket = socketIOClient(ip);
        let wasDisconnected = false;
        socket.on('connect', () => {
            setSocketState('live');
            // uzilish paytida o'tkazib yuborilgan hodisalar
            if (wasDisconnected) {
                loadGroups();
                slotsRef.current.forEach(loadViewer);
            }
        });
        socket.on('disconnect', () => {
            wasDisconnected = true;
            setSocketState('lost');
        });
        socket.on('connect_error', () => {
            wasDisconnected = true;
            setSocketState('lost');
        });
        socket.on('enter', (viewer) => {
            const n = Number(viewer);
            if (slotsRef.current.includes(n)) loadViewer(n);
        });
        return () => socket.disconnect();
    }, [loadGroups, loadViewer]);

    // socket ishlamasa — zaxira so'rov
    useEffect(() => {
        if (socketState === 'live') return undefined;
        const id = setInterval(() => {
            if (document.visibilityState === 'visible') loadAll();
        }, FALLBACK_POLL_MS);
        return () => clearInterval(id);
    }, [socketState, loadAll]);

    // oyna-guruh bog'lanishi boshqa monitordan ham o'zgarishi mumkin — vaqti-vaqti bilan tekshiriladi
    useEffect(() => {
        const id = setInterval(() => {
            if (document.visibilityState === 'visible') loadGroups();
        }, GROUPS_POLL_MS);
        return () => clearInterval(id);
    }, [loadGroups]);

    const changeCount = (next) => {
        const value = clampCount(next);
        setCount(value);
        localStorage.setItem('viewerCount', String(value));
        localStorage.setItem('viewerIds', JSON.stringify(Array.from({length: value}, (_, i) => i + 1)));
    };

    const setViewer = (groupId, viewer) =>
        axios.put(`${ip}/api/viewer/camera-group/${groupId}`, {viewer});

    // guruhni oynaga biriktirish; oynada boshqa guruh bo'lsa — avval u ajratiladi
    const assign = async (group) => {
        const slot = pickSlot;
        const current = bySlot[slot];
        const from = group.viewer;
        let detached = false;
        try {
            if (current) {
                await setViewer(current.id, 0);
                detached = true;
            }
            await setViewer(group.id, slot);
            message.success(t("{{name}} guruhi {{n}}-oynaga biriktirildi", {name: group.name, n: slot}));
            setPickSlot(null);
        } catch (err) {
            // eski guruh ajratilib, yangisi biriktirilmay qolsa — oyna bo'sh qolmasin, eskisi qaytariladi
            if (detached) await setViewer(current.id, slot).catch(() => {});
            message.error(err?.response?.data?.msg || t("Xatolik"));
        } finally {
            loadGroups();
            loadViewer(slot);
            if (from && from !== slot && slotsRef.current.includes(from)) loadViewer(from);
        }
    };

    const remove = async () => {
        const slot = removeSlot;
        const group = bySlot[slot];
        if (!group) return;
        setRemoving(true);
        try {
            await setViewer(group.id, 0);
            message.success(t("Guruh oynadan olib tashlandi"));
            setRemoveSlot(null);
        } catch (err) {
            message.error(err?.response?.data?.msg || t("Xatolik"));
        } finally {
            setRemoving(false);
            loadGroups();
            loadViewer(slot);
        }
    };

    const status = groupsError || viewerError ? 'error' : socketState;
    const STATUS_TEXT = {
        live: t("Jonli"),
        connecting: t("Ulanmoqda..."),
        lost: t("Qayta ulanmoqda..."),
        error: t("Server bilan aloqa yo'q"),
    };

    return (
        <div className="lv">
            <header className="shell-top lv_top">
                <span className="shell-top__logo">
                    <img src={theme === 'dark' ? logoDark : logoLight} alt="SoftData"/>
                </span>

                <div className="lv_title">
                    <h1>{t("Kirish-chiqish nazorati")}</h1>
                    <span className={`lv_live is-${status}`} role="status">
                        <span className="lv_live_dot"/>
                        {STATUS_TEXT[status]}
                    </span>
                </div>

                <div className="shell-top__right">
                    <ViewerStepper value={count} onChange={changeCount}/>
                    <span className="shell-top__sep" aria-hidden="true"/>
                    <LiveClock/>
                    <span className="shell-top__sep" aria-hidden="true"/>
                    <PrefsSwitch lang={lang} onChangeLanguage={onChangeLanguage}/>
                    <button type="button" className="lv_btn lv_btn--primary lv_login" onClick={() => navigate('/login')}>
                        {t("Tizimga kirish")}<ArrowRightIcon size={18}/>
                    </button>
                </div>
            </header>

            <main className="lv_grid" ref={gridRef}
                  style={{'--lv-cols': cols, '--lv-rows': rows}}>
                {slots.map(slot => (
                    <ViewerPanel
                        key={slot}
                        slot={slot}
                        group={bySlot[slot]}
                        events={events[slot]}
                        loading={(groups === null && !groupsError) || !(slot in events)}
                        unavailable={groups === null && groupsError}
                        layout={layout}
                        onAssign={() => setPickSlot(slot)}
                        onRemove={() => setRemoveSlot(slot)}
                    />
                ))}
            </main>

            <GroupPickerModal
                open={pickSlot !== null}
                slot={pickSlot}
                current={bySlot[pickSlot]}
                groups={groups}
                visibleCount={count}
                onClose={() => setPickSlot(null)}
                onPick={assign}
            />
            <RemoveGroupModal
                open={removeSlot !== null}
                slot={removeSlot}
                group={bySlot[removeSlot]}
                busy={removing}
                onClose={() => !removing && setRemoveSlot(null)}
                onConfirm={remove}
            />
        </div>
    );
};

export default MultipleEnterence;
