import React, {useCallback, useEffect, useRef, useState} from 'react';
import {message, Table} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";

import {ip} from "../../ip";
import {
    CameraIcon,
    EditIcon,
    EyeIcon,
    EyeOffIcon,
    InboxIcon,
    PlusIcon,
    SearchIcon,
    TrashIcon,
} from "../../design-system/icons";
import {ConfirmDeleteModal} from "../common/ModalShell";
import PagePagination from "../common/PagePagination";
import CameraModal, {CAMERA_BRANDS} from "./CameraModal";

/* Kameralar.
   API: GET /api/cameras/:limit/:page?searched_data= -> {data, count}  (qidiruv serverda ishlaydi)
        GET /api/camera-group -> {data}  (guruhlar — oynadagi tanlash uchun)
        POST /api/cameras, PUT /api/cameras/:id (FormData), DELETE /api/cameras/:id */

const PAGE_SIZES = [15, 30, 50, 100];
const auth = () => ({'x-access-token': localStorage.getItem('vipparking-token')});

// kamera qurilmasining paroli — server ochiq qaytaradi; jadvalda yashirin, ko'z tugmasi bilan ko'rinadi
const SecretCell = ({value, t}) => {
    const [shown, setShown] = useState(false);
    if (!value) return <span className="tc-muted">—</span>;
    return (
        <span className="set_secret">
            <span className="set_secret_value">{shown ? value : '••••••••'}</span>
            <button type="button" className="tc-icon-btn tc-icon-btn--sm" onClick={() => setShown(v => !v)}
                    title={shown ? t("Yashirish") : t("Ko'rsatish")} aria-label={shown ? t("Yashirish") : t("Ko'rsatish")}>
                {shown ? <EyeOffIcon size={16}/> : <EyeIcon size={16}/>}
            </button>
        </span>
    );
};

const CamerasTab = ({tabs}) => {
    const {t} = useTranslation();
    const [rows, setRows] = useState(null);
    const [total, setTotal] = useState(null);
    const [groups, setGroups] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [editCamera, setEditCamera] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [busy, setBusy] = useState(false);
    const requestIdRef = useRef(0);

    const load = useCallback(() => {
        const requestId = ++requestIdRef.current;
        return axios.get(`${ip}/api/cameras/${limit}/${page}`, {headers: auth(), params: {searched_data: search}})
            .then(({data}) => {
                if (requestId !== requestIdRef.current) return false;
                const offset = (Number(data?.current_page || page) - 1) * limit;
                setRows((data?.data || []).map((c, i) => ({...c, key: c.id, index: offset + i + 1})));
                setTotal(data?.count ?? 0);
                return true;
            })
            .catch(err => {
                if (requestId !== requestIdRef.current) return false;
                setRows(prev => prev ?? []);
                message.error(err?.response?.data?.msg || t("Xatolik"));
                return false;
            });
    }, [limit, page, search, t]);

    const loadGroups = useCallback(() =>
        axios.get(`${ip}/api/camera-group`, {headers: auth()})
            .then(({data}) => setGroups(data?.data || []))
            .catch(() => setGroups([])), []);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        loadGroups();
    }, [loadGroups]);

    useEffect(() => {
        const value = searchInput.trim();
        if (value === search) return undefined;
        const timer = setTimeout(() => {
            setSearch(value);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput, search]);


    const confirmDelete = async () => {
        setBusy(true);
        try {
            await axios.delete(`${ip}/api/cameras/${deleteTarget.id}`, {headers: auth()});
            message.success(t("O'chirildi"));
            setDeleteTarget(null);
            if (rows?.length === 1 && page > 1) setPage(page - 1);
            else load();
        } catch (err) {
            message.error(err?.response?.data?.msg || t("Xatolik"));
        } finally {
            setBusy(false);
        }
    };

    const columns = [
        {
            title: t("T/r"), dataIndex: 'index', key: 'index', width: 64, align: 'center',
            render: (v) => <span className="set_index">{v}</span>,
        },
        {
            title: t("Nomi"),
            dataIndex: 'name',
            key: 'name',
            render: (name, c) => (
                <div className="set_camera">
                    <span className="set_camera_icon"><CameraIcon size={18}/></span>
                    <div className="set_person_text">
                        <span className="set_person_name">{name || '—'}</span>
                        <span className="set_camera_ip">{c.ip_address}</span>
                    </div>
                </div>
            ),
        },
        {
            title: t("Yo'nalishi"),
            dataIndex: 'direction',
            key: 'direction',
            render: (d) => (d === 'enter'
                ? <span className="ds-badge ds-badge--success set_badge"><span className="ds-badge__dot"/>{t("dir_enter")}</span>
                : d === 'exit'
                    ? <span className="ds-badge ds-badge--blue set_badge"><span className="ds-badge__dot"/>{t("dir_exit")}</span>
                    : <span className="tc-muted">—</span>),
        },
        {
            title: t("Guruh"),
            key: 'group',
            render: (_, c) => c.camera_group?.name || <span className="tc-muted">—</span>,
        },
        {
            title: t("Turi"),
            dataIndex: 'type',
            key: 'type',
            render: (type) => t(CAMERA_BRANDS.find(b => b.value === type)?.label || "Boshqalar"),
        },
        {
            title: t("Kanal"),
            dataIndex: 'channel',
            key: 'channel',
            align: 'center',
            render: (v) => <span className="tc-mono">{v ?? '—'}</span>,
        },
        {
            title: t("Login"),
            dataIndex: 'username',
            key: 'username',
            render: (v) => (v ? <span className="tc-mono">{v}</span> : <span className="tc-muted">—</span>),
        },
        {
            title: t("Parol"),
            dataIndex: 'password',
            key: 'password',
            render: (v) => <SecretCell value={v} t={t}/>,
        },
        {
            title: '',
            key: 'actions',
            width: 110,
            align: 'right',
            render: (_, c) => (
                <div className="tc-actions set_actions">
                    <button type="button" className="tc-icon-btn" onClick={() => setEditCamera(c)}
                            title={t("Tahrirlash")} aria-label={t("Tahrirlash")}>
                        <EditIcon size={18}/>
                    </button>
                    <button type="button" className="tc-icon-btn tc-icon-btn--danger" onClick={() => setDeleteTarget(c)}
                            title={t("O'chirish")} aria-label={t("O'chirish")}>
                        <TrashIcon size={18}/>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="admin content-enter">
            <div className="admin_header">
                <div className="admin_header_left">
                    <p>{t("Sozlamalar")}</p>
                </div>
                <div className="admin_header_right">
                    <div className="admin_header_search">
                        <SearchIcon size={18}/>
                        <input type="text" placeholder={t("Nomi yoki IP manzili...")} value={searchInput}
                               onChange={e => setSearchInput(e.target.value)}/>
                    </div>
                    <button type="button" className="admin_header_add" onClick={() => setEditCamera({})}>
                        <PlusIcon size={20}/>{t("Kamera qo'shish")}
                    </button>
                </div>
            </div>

            <div className="admin_body">
                <div className="admin_toolbar">
                    <div className="admin_toolbar_left">{tabs}</div>
                </div>
                <div className="admin_body_table">
                    <Table
                        columns={columns}
                        dataSource={rows || []}
                        loading={rows === null}
                        pagination={false}
                        locale={{
                            emptyText: (
                                <div className="page_empty">
                                    <span className="page_empty_icon"><InboxIcon size={24}/></span>
                                    <p>{search ? t("Qidiruv bo'yicha hech narsa topilmadi") : t("Ma'lumot topilmadi")}</p>
                                </div>
                            ),
                        }}
                    />
                </div>
                <PagePagination total={total} current={page} pageSize={limit}
                                onChange={(p, l) => {
                                    if (l !== limit) {
                                        setLimit(l);
                                        setPage(1);
                                    } else setPage(p);
                                }}
                                pageSizeOptions={PAGE_SIZES}/>
            </div>

            <CameraModal open={editCamera !== null} camera={editCamera} groups={groups}
                         onClose={() => setEditCamera(null)} onSaved={load}/>
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

export default CamerasTab;
