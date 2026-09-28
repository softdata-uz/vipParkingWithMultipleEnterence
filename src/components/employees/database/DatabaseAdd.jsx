import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Checkbox, Image, message} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {ip} from "../../../ip";
import {
    AlertCircleIcon,
    ArrowLeftIcon,
    BriefcaseIcon,
    CalendarIcon,
    CheckIcon,
    EditIcon,
    InboxIcon,
    PlusIcon,
    RefreshIcon,
    SearchIcon,
    TrashIcon,
    UploadCloudIcon,
    UserIcon,
} from "../../../design-system/icons";
import {ConfirmDeleteModal} from "../../common/ModalShell";
import PagePagination from "../../common/PagePagination";
import PlateNumber from "../../common/PlateNumber";
import useFitGrid, {gridStyle, useGridPaging} from "../../../hooks/useFitGrid";
import {formatDate as fmt, periodBadge, periodStatus} from "../../../utils/staffPeriod";
import StaffModal from "./StaffModal";
import {normalizePlate} from "./staffIndex";
import {GroupTypeBadge} from "./groupTypes";

import '../../../design-system/ui.css';
import '../../../styles/table-cells.css';
import '../../../styles/page.css';
import './employees.css';

/* Guruh ichidagi xodimlar (avtomobillar).
   API: GET  /api/staff/:groupId/:limit/:page?searched_data= -> {data, count}
        DELETE /api/delete/staff — body: [id]
        POST /api/excel/staff/:groupId — Excel import (yozuvlar accepted=false bo'lib keladi)
        PUT  /api/update/vehicle_list — {data: [id]} tanlangan import yozuvlarini tasdiqlash */

// ustunlar soni kartaning eng kichik kengligidan hisoblanadi; sahifada 2 qator
const CARD = {minWidth: 320, rows: 2};
const auth = () => ({'x-access-token': localStorage.getItem('vipparking-token')});

/* Jami xodimlar soni (qidiruvsiz). /api/staff javobidagi `count` guruhniki emas — barcha guruhlar
   bo'yicha umumiy. Shuning uchun: sahifa to'lmagan bo'lsa (oxirgi sahifa) — aniq hisoblanadi,
   aks holda — guruhning o'z item_count qiymati. */
const staffTotal = ({rows, page, limit, groupCount}) => {
    if (rows < limit) return (page - 1) * limit + rows;
    return Math.max(page * limit, Number(groupCount) || 0);
};

const SEARCH_ALL = 1000;   // qidiruvda guruhning barcha xodimlari olinadi

// qidiruv: F.I.Sh, boshqarma, telefon (bo'shliqsiz) va raqam (bo'shliqsiz, katta harf)
const matchesSearch = (s, query) => {
    const q = query.toLowerCase();
    const compact = normalizePlate(query);
    return [s.fullname, s.position].some(v => (v || '').toLowerCase().includes(q))
        || normalizePlate(s.vehicle_number).includes(compact)
        || (s.tel || '').replace(/\s+/g, '').includes(query.replace(/\s+/g, ''));
};

/* Sahifa: /employees/:groupId. Guruh manzildagi id bo'yicha yuklanadi — sahifa yangilanganda (F5) ham
   shu guruhda qoladi. Alohida "bitta guruh" API yo'q, shuning uchun ro'yxatdan topiladi. */
const DatabaseAdd = () => {
    const {t} = useTranslation();
    const {groupId} = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);

    const loadGroup = useCallback(() =>
        axios.get(`${ip}/api/staff-group/1000/1`, {headers: auth()})
            .then(({data}) => {
                const found = (data?.data || []).find(g => String(g.id) === String(groupId));
                if (found) {
                    setGroup(found);
                } else {
                    message.error(t("Guruh topilmadi"));
                    navigate('/employees', {replace: true});
                }
            })
            .catch(err => message.error(err?.response?.data?.msg || t("Xatolik"))),
    [groupId, navigate, t]);

    useEffect(() => {
        setGroup(null);
        loadGroup();
    }, [loadGroup]);

    const onBack = () => navigate('/employees');

    if (!group) {
        return (
            <div className="admin content-enter">
                <div className="admin_header">
                    <div className="admin_header_left">
                        <button type="button" className="admin_header_btn admin_header_btn--icon" onClick={onBack}
                                title={t("Orqaga")} aria-label={t("Orqaga")}>
                            <ArrowLeftIcon size={18}/>
                        </button>
                        <span className="emp_crumb" onClick={onBack}>{t("Xodimlar")}</span>
                        <span className="emp_crumb_sep">/</span>
                        <span className="emp_title_skeleton"/>
                    </div>
                </div>
                <div className="admin_body">
                    <div className="page_grid emp_grid emp_grid--staff">
                        {Array.from({length: 6}).map((_, i) => <div key={i} className="page_skeleton_card"/>)}
                    </div>
                </div>
            </div>
        );
    }

    return <StaffList group={group} onBack={onBack} onGroupChanged={loadGroup}/>;
};

const StaffList = ({group, onBack, onGroupChanged}) => {
    const {t} = useTranslation();
    const [staff, setStaff] = useState(null);
    const [total, setTotal] = useState(null);
    const [selected, setSelected] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // sahifa hajmi = ekranga sig'adigan kartalar (ustun × qator) yoki uning karralari
    const grid = useFitGrid(CARD);
    const {page, setPage, limit, sizeOptions, onChange: onPagingChange} = useGridPaging(grid.perPage);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const [editStaff, setEditStaff] = useState(null);     // {} — yangi, {..} — tahrir
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [busy, setBusy] = useState(false);
    const fileRef = useRef(null);
    const requestIdRef = useRef(0);

    // true — ma'lumot yangilandi; false — xato (xabar shu yerda ko'rsatiladi) yoki eskirgan so'rov
    const load = useCallback(() => {
        if (!limit) return Promise.resolve(false);      // to'r hali o'lchanmagan
        const requestId = ++requestIdRef.current;
        /* Qidiruv brauzerda: server searched_data ni faqat `count` ga qo'llaydi, ro'yxatni esa
           filtrlamaydi (har qanday so'zga guruhning hamma xodimi qaytadi). Shuning uchun qidiruvda
           guruhning barcha xodimlari olinib, F.I.Sh / raqam / boshqarma / telefon bo'yicha filtrlanadi. */
        const url = search
            ? `${ip}/api/staff/${group.id}/${SEARCH_ALL}/1`
            : `${ip}/api/staff/${group.id}/${limit}/${page}`;
        return axios.get(url, {params: {searched_data: ''}, headers: auth()})
            .then(({data}) => {
                if (requestId !== requestIdRef.current) return false;
                let rows = data?.data || [];
                if (search) {
                    const matched = rows.filter(s => matchesSearch(s, search));
                    rows = matched.slice((page - 1) * limit, page * limit);
                    setTotal(matched.length);
                } else {
                    setTotal(staffTotal({rows: rows.length, page, limit, groupCount: group.item_count}));
                }
                setStaff(rows);
                setSelected(prev => prev.filter(id => rows.some(s => s.id === id)));
                return true;
            })
            .catch(err => {
                if (requestId !== requestIdRef.current) return false;
                setStaff(prev => prev ?? []);
                message.error(err?.response?.data?.msg || t("Xodimlar ro'yxatini yuklashda xatolik"));
                return false;
            });
    }, [group.id, group.item_count, limit, page, search, t]);

    // qo'lda yangilash — ikonka aylanadi va natija xabar bilan bildiriladi
    const refresh = async () => {
        if (refreshing) return;
        setRefreshing(true);
        try {
            // server tez javob bersa ham aylanish ko'rinsin — kamida 600ms
            const [ok] = await Promise.all([load(), onGroupChanged(), new Promise(r => setTimeout(r, 600))]);
            if (ok) message.success(t("Yangilandi"));
        } finally {
            setRefreshing(false);
        }
    };

    // ma'lumot o'zgargach: guruh (item_count — "Jami" uchun) va ro'yxat qayta yuklanadi
    const reload = () => {
        onGroupChanged();
        load();
    };

    useEffect(() => {
        load();
    }, [load]);

    // qidiruv 400ms kechiktirib yuboriladi va 1-sahifadan boshlanadi
    useEffect(() => {
        const value = searchInput.trim();
        if (value === search) return undefined;
        const timer = setTimeout(() => {
            setSearch(value);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput, search]);

    const onPageChange = (nextPage, nextSize) => {
        onPagingChange(nextPage, nextSize);
        setSelected([]);
    };

    const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const allChecked = staff?.length > 0 && selected.length === staff.length;
    const toggleAll = () => setSelected(allChecked ? [] : (staff || []).map(s => s.id));

    const pending = (staff || []).filter(s => s.accepted === false);
    const selectedPending = selected.filter(id => pending.some(p => p.id === id));

    const confirmDelete = async () => {
        const {ids} = deleteTarget;
        setBusy(true);
        try {
            await axios.delete(`${ip}/api/delete/staff`, {data: ids, headers: auth()});
            message.success(t("O'chirildi"));
            setDeleteTarget(null);
            setSelected(prev => prev.filter(id => !ids.includes(id)));
            if (staff && ids.length >= staff.length && page > 1) {
                onGroupChanged();
                setPage(page - 1);
            } else {
                reload();
            }
        } catch (err) {
            message.error(err?.response?.data?.msg || t("Xatolik"));
        } finally {
            setBusy(false);
        }
    };

    const importExcel = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';           // xuddi shu faylni qayta tanlash mumkin bo'lsin
        if (!file) return;
        const fd = new FormData();
        fd.append('file', file);
        setBusy(true);
        try {
            const {data} = await axios.post(`${ip}/api/excel/staff/${group.id}`, fd, {headers: auth()});
            message.success(data?.msg ? t(data.msg) : t("Fayl yuklandi"));
            reload();
        } catch (err) {
            message.error(err?.response?.data?.msg || t("Xatolik"));
        } finally {
            setBusy(false);
        }
    };

    const acceptImported = async () => {
        setBusy(true);
        try {
            await axios.put(`${ip}/api/update/vehicle_list`, {data: selectedPending}, {headers: auth()});
            message.success(t("Tanlangan yozuvlar tasdiqlandi"));
            setSelected([]);
            reload();
        } catch (err) {
            message.error(err?.response?.data?.msg || t("Xatolik"));
        } finally {
            setBusy(false);
        }
    };

    const selectionName = (ids) => ids.length === 1
        ? staff?.find(s => s.id === ids[0])?.fullname
        : t("{{count}} ta xodim", {count: ids.length});

    return (
        <div className="admin content-enter">
            <div className="admin_header">
                <div className="admin_header_left">
                    <button type="button" className="admin_header_btn admin_header_btn--icon" onClick={onBack}
                            title={t("Orqaga")} aria-label={t("Orqaga")}>
                        <ArrowLeftIcon size={18}/>
                    </button>
                    <span className="emp_crumb" onClick={onBack}>{t("Xodimlar")}</span>
                    <span className="emp_crumb_sep">/</span>
                    <p title={group.name}>{group.name}</p>
                    <GroupTypeBadge type={group.type} t={t}/>
                    {total != null && <span className="ds-badge ds-badge--gray page_count_badge">{total}</span>}
                </div>
                <div className="admin_header_right">
                    <div className="admin_header_search">
                        <SearchIcon size={18}/>
                        <input type="text" placeholder={t("Izlash...")} value={searchInput}
                               onChange={e => setSearchInput(e.target.value)}/>
                    </div>
                    <button type="button"
                            className={`admin_header_btn admin_header_btn--icon${refreshing ? ' is-spinning' : ''}`}
                            onClick={refresh} disabled={refreshing}
                            title={t("Yangilash")} aria-label={t("Yangilash")}>
                        <RefreshIcon size={18}/>
                    </button>
                    <button type="button" className="admin_header_btn" onClick={() => fileRef.current?.click()}
                            disabled={busy} title={t("Excel fayldan import")}>
                        <UploadCloudIcon size={18}/>{t("Import")}
                    </button>
                    <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={importExcel} hidden/>
                    <button type="button" className="admin_header_add" onClick={() => setEditStaff({})}>
                        <PlusIcon size={20}/>{t("Xodim qo'shish")}
                    </button>
                </div>
            </div>

            <div className="admin_body">
                <div className="admin_toolbar">
                    <div className="admin_toolbar_left">
                        <Checkbox checked={allChecked} indeterminate={selected.length > 0 && !allChecked}
                                  onChange={toggleAll} disabled={!staff?.length}>
                            {t("Barchasini belgilash")}
                        </Checkbox>
                        {selected.length > 0 && (
                            <span className="admin_toolbar_selected">{t("Tanlangan")}: {selected.length}</span>
                        )}
                    </div>
                    <div className="admin_toolbar_right">
                        {pending.length > 0 && (
                            <>
                                <span className="emp_pending_note">
                                    <AlertCircleIcon size={16}/>
                                    {t("{{count}} ta import yozuvi tasdiqlanmagan", {count: pending.length})}
                                </span>
                                <button type="button" className="admin_toolbar_btn admin_toolbar_btn--brand"
                                        disabled={!selectedPending.length || busy} onClick={acceptImported}>
                                    <CheckIcon size={16}/>{t("Tanlanganlarni tasdiqlash")}
                                </button>
                            </>
                        )}
                        <button type="button" className="admin_toolbar_btn admin_toolbar_btn--danger"
                                disabled={!selected.length}
                                onClick={() => setDeleteTarget({ids: selected, name: selectionName(selected)})}>
                            <TrashIcon size={18}/>{t("O'chirish")}
                        </button>
                    </div>
                </div>

                <div className="admin_body_table" ref={grid.ref}>
                    <div className="page_grid emp_grid emp_grid--staff" style={gridStyle(grid)}>
                        {!staff && Array.from({length: grid.perPage || 6}).map((_, i) => (
                            <div key={i} className="page_skeleton_card"/>
                        ))}
                        {staff?.length === 0 && (
                            <div className="page_empty">
                                <span className="page_empty_icon"><InboxIcon size={24}/></span>
                                <p>{search ? t("Qidiruv bo'yicha hech narsa topilmadi") : t("Ma'lumot topilmadi")}</p>
                            </div>
                        )}
                        {staff?.map(item => {
                            const checked = selected.includes(item.id);
                            const period = periodStatus(item.from_date, item.to_date);
                            const statusBadge = periodBadge(period, t);
                            return (
                                <div key={item.id}
                                     className={`emp_staff${checked ? ' is-selected' : ''}${item.accepted === false ? ' is-pending' : ''}`}>
                                    <div className="emp_staff_top">
                                        <Checkbox checked={checked} onChange={() => toggle(item.id)}
                                                  aria-label={item.fullname}/>
                                        <StaffPhoto item={item} t={t}/>
                                        <div className="emp_staff_heading">
                                            <h3 className="emp_staff_name" title={item.fullname}>{item.fullname || '—'}</h3>
                                            <span className={`ds-badge ${statusBadge[0]} emp_staff_status`}>
                                                <span className="ds-badge__dot"/>{statusBadge[1]}
                                            </span>
                                        </div>
                                        <div className="tc-actions">
                                            <button type="button" className="tc-icon-btn" onClick={() => setEditStaff(item)}
                                                    title={t("Tahrirlash")} aria-label={t("Tahrirlash")}>
                                                <EditIcon size={18}/>
                                            </button>
                                            <button type="button" className="tc-icon-btn tc-icon-btn--danger"
                                                    onClick={() => setDeleteTarget({ids: [item.id], name: item.fullname})}
                                                    title={t("O'chirish")} aria-label={t("O'chirish")}>
                                                <TrashIcon size={18}/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="emp_staff_plate">
                                        <PlateNumber value={item.vehicle_number} size="lg"/>
                                        {item.accepted === false && (
                                            <span className="ds-badge ds-badge--warning">{t("Tasdiqlanmagan")}</span>
                                        )}
                                    </div>

                                    <dl className="emp_staff_meta">
                                        <div>
                                            <dt>{t("Boshqarma")}</dt>
                                            <dd title={item.position}>
                                                <BriefcaseIcon size={14}/>{item.position || '—'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>{t("Telefon")}</dt>
                                            <dd>{item.tel || '—'}</dd>
                                        </div>
                                        <div className="emp_staff_meta_full">
                                            <dt>{t("Ruxsat muddati")}</dt>
                                            <dd>
                                                <CalendarIcon size={14}/>
                                                {fmt(item.from_date)} – {fmt(item.to_date)}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <PagePagination total={total} current={page} pageSize={limit} onChange={onPageChange}
                                pageSizeOptions={sizeOptions}/>
            </div>

            <StaffModal
                open={editStaff !== null}
                staff={editStaff}
                groupId={group.id}
                onClose={() => setEditStaff(null)}
                onSaved={(created) => {
                    onGroupChanged();
                    if (created && page !== 1) setPage(1); else load();
                }}
            />
            <ConfirmDeleteModal
                open={deleteTarget !== null}
                onClose={() => !busy && setDeleteTarget(null)}
                onConfirm={confirmDelete}
                name={deleteTarget?.name}
                icon={<TrashIcon size={22}/>}
            />
        </div>
    );
};

/* Xodim rasmi: bosilsa katta ko'rinishda ochiladi (antd Image preview — kattalashtirish, burish).
   Rasm bo'lmasa yoki yuklanmasa — ikonka. */
const StaffPhoto = ({item, t}) => {
    const [broken, setBroken] = useState(false);
    if (!item.image || broken) {
        return <span className="emp_staff_photo"><UserIcon size={22}/></span>;
    }
    return (
        <span className="emp_staff_photo emp_staff_photo--zoom" title={t("Rasmni kattalashtirish")}>
            <Image
                src={`${ip}/staff/${item.image}`}
                alt={item.fullname || ''}
                onError={() => setBroken(true)}
                preview={{mask: <ZoomInIcon size={18}/>}}
            />
        </span>
    );
};

const ZoomInIcon = ({size = 18}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7"/>
        <path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/>
    </svg>
);

export default DatabaseAdd;
