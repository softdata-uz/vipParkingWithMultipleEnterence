import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Checkbox, message} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {TbAlarm, TbCar, TbClearAll} from "react-icons/tb";

import {ip} from "../../../ip";
import {
    CameraIcon,
    ChevronRightIcon,
    EditIcon,
    InboxIcon,
    PlusIcon,
    RefreshIcon,
    SearchIcon,
    TrashIcon,
    UsersIcon,
} from "../../../design-system/icons";
import {ConfirmDeleteModal, ModalShell} from "../../common/ModalShell";
import PagePagination from "../../common/PagePagination";
import useFitGrid, {gridStyle, useGridPaging} from "../../../hooks/useFitGrid";
import {EXPIRING_DAYS, periodStatus} from "../../../utils/staffPeriod";
import GroupModal from "./GroupModal";
import CameraAssignModal from "./CameraAssignModal";
import ExpiringModal from "./ExpiringModal";
import {fetchExpiringSummary} from "./staffIndex";
import {GROUP_TYPES, GroupTypeBadge, groupType} from "./groupTypes";

import '../../../design-system/ui.css';
import '../../../styles/table-cells.css';
import '../../../styles/page.css';
import './employees.css';

/* Xodimlar — guruhlar (ma'lumotlar bazalari) ro'yxati. Karta bosilsa /employees/:id — guruh ichidagi xodimlar (DatabaseAdd),
   o'sha guruhning xodimlari FAQAT shu yerda, kartasi ochilganda yuklanadi.
   Guruhlar bir so'rovda to'liq yuklanadi (odatda o'nlab): tur bo'yicha filtr serverda yo'q, statistika esa
   barcha guruhlardan hisoblanadi — filtr, nom bo'yicha qidiruv va sahifalash brauzerda.
   API: GET /api/staff-group/:limit/:page -> {data, count}
        GET /api/staff-expiring-summary?days= — muddati tugayotgan/o'tgan xodimlar (barcha guruh xodimlarini
          alohida-alohida yuklamasdan, bitta yengil so'rov bilan)
        DELETE /api/delete/staff-group, DELETE /api/clear/staff-group — body: [id] */

const ALL = 1000;                             // bitta so'rovda olinadigan guruhlar/xodimlar chegarasi
const CARD = {minWidth: 300, rows: 2};        // ustunlar kartaning eng kichik kengligidan; sahifada 2 qator
const auth = () => ({'x-access-token': localStorage.getItem('vipparking-token')});

const DatabaseBlack = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const openGroup = (group) => navigate(`/employees/${group.id}`);

    const [groups, setGroups] = useState(null);      // null — yuklanmoqda; barcha guruhlar
    const [expiry, setExpiry] = useState(null);      // {expiring: [...], expired: [...]} | null
    const [typeFilter, setTypeFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const grid = useFitGrid(CARD);
    const {page, setPage, limit, sizeOptions, onChange: onPagingChange} = useGridPaging(grid.perPage);

    const [editGroup, setEditGroup] = useState(null);   // GroupModal: {} — yangi, {..} — tahrir
    const [cameraGroup, setCameraGroup] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null); // {ids, name}
    const [clearTarget, setClearTarget] = useState(null);   // {ids, name}
    const [expiringOpen, setExpiringOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    // faqat eng oxirgi so'rov javobi qo'llanadi
    const requestIdRef = useRef(0);

    // muddati tugayotgan / o'tgan xodimlar — bitta yengil backend so'rovi bilan
    // (avval har bir guruh uchun alohida /api/staff/:id so'rovi yuborilardi)
    const loadInsights = useCallback(async (requestId) => {
        const rows = await fetchExpiringSummary();
        if (requestId !== requestIdRef.current) return;
        const expiring = [];
        const expired = [];
        rows.forEach(s => {
            const period = periodStatus(s.from_date, s.to_date);
            if (period.status === 'expiring') expiring.push({...s, period});
            if (period.status === 'expired') expired.push({...s, period});
        });
        expiring.sort((a, b) => a.period.daysLeft - b.period.daysLeft);
        expired.sort((a, b) => (a.to_date < b.to_date ? 1 : -1));
        setExpiry({expiring, expired});
    }, []);

    // true — ma'lumot yangilandi; false — xato (xabar shu yerda ko'rsatiladi) yoki eskirgan so'rov
    const load = useCallback(() => {
        const requestId = ++requestIdRef.current;
        return axios.get(`${ip}/api/staff-group/${ALL}/1`, {headers: auth()})
            .then(({data}) => {
                if (requestId !== requestIdRef.current) return false;
                const list = data?.data || [];
                setGroups(list);
                setSelected(prev => prev.filter(id => list.some(g => g.id === id)));
                loadInsights(requestId);
                return true;
            })
            .catch(err => {
                if (requestId !== requestIdRef.current) return false;
                setGroups(prev => prev ?? []);
                message.error(err?.response?.data?.msg || t("Xatolik"));
                return false;
            });
    }, [loadInsights, t]);

    useEffect(() => {
        load();
    }, [load]);

    // --- filtr sonlari, filtr, qidiruv ---
    // har bir tur bo'yicha guruhlar soni (filtr tugmalaridagi raqamlar)
    const counts = useMemo(() => {
        const result = {all: (groups || []).length};
        GROUP_TYPES.forEach(({value}) => {
            result[value] = (groups || []).filter(g => g.type === value).length;
        });
        return result;
    }, [groups]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return (groups || []).filter(g =>
            (typeFilter === 'all' || g.type === typeFilter) &&
            (!q || (g.name || '').toLowerCase().includes(q)));
    }, [groups, typeFilter, search]);

    const total = groups ? filtered.length : null;
    const visible = useMemo(
        () => (groups && limit ? filtered.slice((page - 1) * limit, page * limit) : null),
        [groups, filtered, page, limit]);
        
    // filtr yoki qidiruv o'zgarsa — 1-sahifa; o'chirishdan keyin sahifa bo'shab qolsa — oxirgisiga
    useEffect(() => {
        setPage(1);
        setSelected([]);
    }, [typeFilter, search, setPage]);

    useEffect(() => {
        if (!limit || total == null) return;
        const last = Math.max(1, Math.ceil(total / limit));
        if (page > last) setPage(last);
    }, [total, limit, page, setPage]);

    const onPageChange = (nextPage, nextSize) => {
        onPagingChange(nextPage, nextSize);
        setSelected([]);
    };

    // qo'lda yangilash — ikonka aylanadi va natija xabar bilan bildiriladi
    const refresh = async () => {
        if (refreshing) return;
        setRefreshing(true);
        try {
            // server tez javob bersa ham aylanish ko'rinsin — kamida 600ms
            const [ok] = await Promise.all([load(), new Promise(r => setTimeout(r, 600))]);
            if (ok) message.success(t("Yangilandi"));
        } finally {
            setRefreshing(false);
        }
    };

    // tanlash — joriy sahifadagi kartalar bo'yicha
    const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const allChecked = visible?.length > 0 && visible.every(g => selected.includes(g.id));
    const toggleAll = () => setSelected(allChecked ? [] : (visible || []).map(g => g.id));

    const selectionName = (ids) => ids.length === 1
        ? groups?.find(g => g.id === ids[0])?.name
        : t("{{count}} ta guruh", {count: ids.length});

    const confirmDelete = async () => {
        const {ids} = deleteTarget;
        setBusy(true);
        try {
            await axios.delete(`${ip}/api/delete/staff-group`, {data: ids, headers: auth()});
            message.success(t("O'chirildi"));
            setDeleteTarget(null);
            setSelected(prev => prev.filter(id => !ids.includes(id)));
            load();
        } catch (err) {
            message.error(err?.response?.data?.msg || t("Xatolik"));
        } finally {
            setBusy(false);
        }
    };

    const confirmClear = async () => {
        const {ids} = clearTarget;
        setBusy(true);
        try {
            await axios.delete(`${ip}/api/clear/staff-group`, {data: ids, headers: auth()});
            message.success(t("Guruhlar tozalandi"));
            setClearTarget(null);
            setSelected([]);
            load();
        } catch (err) {
            message.error(err?.response?.data?.msg || t("Xatolik"));
        } finally {
            setBusy(false);
        }
    };

    const FILTERS = [
        {value: 'all', label: t("Barchasi"), count: counts.all},
        ...GROUP_TYPES.map(type => ({value: type.value, tone: type.tone, label: t(type.label), count: counts[type.value]})),
    ];

    const expiringCount = expiry?.expiring.length;

    return (
        <div className="admin content-enter">
            <div className="admin_header">
                <div className="admin_header_left">
                    <p>{t("Xodimlar")}</p>
                </div>
                <div className="admin_header_right">
                    <div className="admin_header_search">
                        <SearchIcon size={18}/>
                        <input type="text" placeholder={t("Guruh nomi bo'yicha izlash...")} value={search}
                               onChange={e => setSearch(e.target.value)}/>
                    </div>
                    <button type="button"
                            className={`admin_header_btn admin_header_btn--icon${refreshing ? ' is-spinning' : ''}`}
                            onClick={refresh} disabled={refreshing}
                            title={t("Yangilash")} aria-label={t("Yangilash")}>
                        <RefreshIcon size={18}/>
                    </button>
                    <button type="button" className="admin_header_add" onClick={() => setEditGroup({})}>
                        <PlusIcon size={20}/>{t("Guruh qo'shish")}
                    </button>
                </div>
            </div>

            <div className="admin_body">
                <div className="admin_toolbar">
                    <div className="admin_toolbar_left">
                        <Checkbox
                            checked={allChecked}
                            indeterminate={selected.length > 0 && !allChecked}
                            onChange={toggleAll}
                            disabled={!visible?.length}
                            aria-label={t("Barchasini belgilash")}
                        />
                        {/* tur bo'yicha filtr */}
                        <div className="page_seg" role="tablist" aria-label={t("Turi")}>
                            {FILTERS.map(f => (
                                <button key={f.value} type="button" role="tab" aria-selected={typeFilter === f.value}
                                        className={`page_seg_item${typeFilter === f.value ? ' is-active' : ''}`}
                                        onClick={() => setTypeFilter(f.value)}>
                                    {f.tone && <span className={`page_seg_dot grp_dot--${f.tone}`}/>}
                                    {f.label}
                                    <span className="page_seg_count">{groups ? f.count : '–'}</span>
                                </button>
                            ))}
                        </div>
                        {/* ruxsat muddati tugayotgan / o'tgan xodimlar — bosilsa ro'yxat oynasi */}
                        {expiry && (
                            <button
                                type="button"
                                className={`emp_expiry${expiringCount ? ' is-warning' : ''}${expiry.expired.length ? ' has-expired' : ''}`}
                                onClick={() => setExpiringOpen(true)}
                                disabled={!expiringCount && !expiry.expired.length}
                                title={t("{{count}} kun ichida tugaydigan va muddati o'tgan xodimlar", {count: EXPIRING_DAYS})}
                            >
                                <TbAlarm size={16} strokeWidth={1.8}/>
                                {t("Muddati tugayotgan")}
                                <span className="emp_expiry_count">{expiringCount}</span>
                                {expiry.expired.length > 0 && (
                                    <span className="emp_expiry_expired">
                                        {t("{{count}} ta muddati o'tgan", {count: expiry.expired.length})}
                                    </span>
                                )}
                            </button>
                        )}
                        {selected.length > 0 && (
                            <span className="admin_toolbar_selected">{t("Tanlangan")}: {selected.length}</span>
                        )}
                    </div>
                    <div className="admin_toolbar_right">
                        <button type="button" className="admin_toolbar_btn" disabled={!selected.length}
                                onClick={() => setClearTarget({ids: selected, name: selectionName(selected)})}>
                            <TbClearAll size={18} strokeWidth={1.6}/>{t("Tozalash")}
                        </button>
                        <button type="button" className="admin_toolbar_btn admin_toolbar_btn--danger"
                                disabled={!selected.length}
                                onClick={() => setDeleteTarget({ids: selected, name: selectionName(selected)})}>
                            <TrashIcon size={18}/>{t("O'chirish")}
                        </button>
                    </div>
                </div>

                <div className="admin_body_table" ref={grid.ref}>
                    <div className="page_grid emp_grid" style={gridStyle(grid)}>
                        {!visible && Array.from({length: grid.perPage || 6}).map((_, i) => (
                            <div key={i} className="page_skeleton_card"/>
                        ))}
                        {visible?.length === 0 && (
                            <div className="page_empty">
                                <span className="page_empty_icon"><InboxIcon size={24}/></span>
                                <p>{search || typeFilter !== 'all'
                                    ? t("Qidiruv bo'yicha hech narsa topilmadi")
                                    : t("Ma'lumot topilmadi")}</p>
                                {!search && typeFilter === 'all' && (
                                    <button type="button" className="admin_header_add" onClick={() => setEditGroup({})}>
                                        <PlusIcon size={20}/>{t("Birinchi guruhni qo'shing")}
                                    </button>
                                )}
                            </div>
                        )}
                        {visible?.map(group => {
                            const checked = selected.includes(group.id);
                            const tone = groupType(group.type).tone;
                            const stop = (fn) => (e) => {
                                e.stopPropagation();
                                fn();
                            };
                            return (
                                <div
                                    key={group.id}
                                    className={`emp_card${checked ? ' is-selected' : ''}`}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => openGroup(group)}
                                    onKeyDown={(e) => {
                                        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                                            e.preventDefault();
                                            openGroup(group);
                                        }
                                    }}
                                >
                                    <div className="emp_card_top">
                                        <span className="emp_card_check" onClick={e => e.stopPropagation()}>
                                            <Checkbox checked={checked} onChange={() => toggle(group.id)}
                                                      aria-label={group.name}/>
                                        </span>
                                        <span className={`emp_card_icon grp_icon--${tone}`}>
                                            <UsersIcon size={24}/>
                                        </span>
                                        <div className="emp_card_heading">
                                            <h2 className="emp_card_name" title={group.name}>{group.name}</h2>
                                            <GroupTypeBadge type={group.type} t={t} className="emp_card_type"/>
                                        </div>
                                        <div className="tc-actions">
                                            <button type="button" className="tc-icon-btn"
                                                    onClick={stop(() => setEditGroup(group))}
                                                    title={t("Tahrirlash")} aria-label={t("Tahrirlash")}>
                                                <EditIcon size={18}/>
                                            </button>
                                            <button type="button" className="tc-icon-btn tc-icon-btn--danger"
                                                    onClick={stop(() => setDeleteTarget({ids: [group.id], name: group.name}))}
                                                    title={t("O'chirish")} aria-label={t("O'chirish")}>
                                                <TrashIcon size={18}/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="emp_card_stats">
                                        <span className="emp_card_stat" title={t("Avtomobillar")}>
                                            <TbCar size={18} strokeWidth={1.6}/>
                                            <b>{group.item_count ?? 0}</b> {t("avtomobil")}
                                        </span>
                                        <span className="emp_card_stat" title={t("Kameralar")}>
                                            <CameraIcon size={18}/>
                                            <b>{group.cameras?.length ?? 0}</b> {t("kamera")}
                                        </span>
                                    </div>

                                    <div className="emp_card_bottom">
                                        <button type="button" className="emp_card_cam_btn"
                                                onClick={stop(() => setCameraGroup(group))}>
                                            <CameraIcon size={16}/>{t("Kamera biriktirish")}
                                        </button>
                                        <span className="emp_card_open"><ChevronRightIcon size={20}/></span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <PagePagination total={total} current={page} pageSize={limit} onChange={onPageChange}
                                pageSizeOptions={sizeOptions}/>
            </div>

            <GroupModal
                open={editGroup !== null}
                group={editGroup}
                onClose={() => setEditGroup(null)}
                onSaved={load}
            />
            <CameraAssignModal
                open={cameraGroup !== null}
                group={cameraGroup}
                onClose={() => setCameraGroup(null)}
                onSaved={load}
            />
            <ExpiringModal
                open={expiringOpen}
                data={expiry}
                onClose={() => setExpiringOpen(false)}
                onOpenGroup={(group) => {
                    setExpiringOpen(false);
                    openGroup(group);
                }}
            />
            <ConfirmDeleteModal
                open={deleteTarget !== null}
                onClose={() => !busy && setDeleteTarget(null)}
                onConfirm={confirmDelete}
                name={deleteTarget?.name}
                icon={<TrashIcon size={22}/>}
            />
            <ModalShell
                open={clearTarget !== null}
                onClose={() => !busy && setClearTarget(null)}
                size="sm"
                tone="danger"
                icon={<TbClearAll size={22} strokeWidth={1.6}/>}
                title={t("Guruhlarni tozalash")}
                subtitle={
                    <>
                        {clearTarget?.name ? <b className="dsm__name">{clearTarget.name}</b> : null}
                        {t("clear_confirm_text")}
                    </>
                }
                footer={
                    <>
                        <button type="button" className="dsm-btn dsm-btn--secondary" onClick={() => setClearTarget(null)}>
                            {t("Bekor qilish")}
                        </button>
                        <button type="button" className="dsm-btn dsm-btn--destructive" onClick={confirmClear}
                                disabled={busy}>
                            {t("Tozalash")}
                        </button>
                    </>
                }
            />
        </div>
    );
};

export default DatabaseBlack;
