import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Image, message, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import axios from "axios";
import dayjs from "dayjs";

import {ip} from "../../ip";
import {EditIcon, InboxIcon, PlusIcon, SearchIcon, TrashIcon} from "../../design-system/icons";
import {ConfirmDeleteModal} from "../common/ModalShell";
import PagePagination from "../common/PagePagination";
import {getRoleBadgeClass, getRoleLabel} from "../../utils/roleLabel";
import AdminModal from "./AdminModal";
import {getMeAction} from "../../redux/action/action";

/* Adminlar.
   API: GET /api/admin/:limit/:page, POST /api/admin, PUT /api/admin/:id (FormData), DELETE /api/admin/:id
   ⚠ server searched_data ni e'tiborsiz qoldiradi, `count` ham ro'yxatga mos emas (2 / 1) — adminlar kam,
     shuning uchun hammasi olinib, qidiruv va sahifalash brauzerda. Parol serverdan kelmaydi. */

const PAGE_SIZES = [15, 30, 50];
const ALL = 1000;
const auth = () => ({'x-access-token': localStorage.getItem('vipparking-token')});

const fullName = (a) => [a.lastname, a.firstname, a.fathersname].filter(Boolean).join(' ');
const initials = (a) => [a.lastname, a.firstname].filter(Boolean).map(p => p[0]).join('').toUpperCase() || '?';

const AdminAvatar = ({admin}) => {
    const [broken, setBroken] = useState(false);
    return (
        <span className="set_avatar">
            {admin.image && !broken
                ? <Image src={`${ip}/${admin.image}`} alt={fullName(admin)} onError={() => setBroken(true)}
                         preview={{mask: false}} style={{cursor: 'zoom-in'}}/>
                : initials(admin)}
        </span>
    );
};

const AdminsTab = ({tabs}) => {
    const {t} = useTranslation();
    const me = useSelector(store => store.auth.user);
    const dispatch = useDispatch();

    const [admins, setAdmins] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [editAdmin, setEditAdmin] = useState(null);      // {} — yangi, {..} — tahrir
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [busy, setBusy] = useState(false);
    const requestIdRef = useRef(0);

    const load = useCallback(() => {
        const requestId = ++requestIdRef.current;
        return axios.get(`${ip}/api/admin/${ALL}/1`, {headers: auth(), params: {searched_data: ''}})
            .then(({data}) => {
                if (requestId !== requestIdRef.current) return false;
                setAdmins(data?.data || []);
                return true;
            })
            .catch(err => {
                if (requestId !== requestIdRef.current) return false;
                setAdmins(prev => prev ?? []);
                message.error(err?.response?.data?.msg || t("Xatolik"));
                return false;
            });
    }, [t]);

    useEffect(() => {
        load();
    }, [load]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return (admins || []).filter(a => !q
            || fullName(a).toLowerCase().includes(q)
            || (a.login || '').toLowerCase().includes(q)
            || getRoleLabel(a.role, t).toLowerCase().includes(q));
    }, [admins, search, t]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const rows = filtered.slice((page - 1) * limit, page * limit)
        .map((a, i) => ({...a, key: a.id, index: (page - 1) * limit + i + 1}));

    // saqlangandan keyin ro'yxat qayta olinadi; o'z hisobi o'zgargan bo'lsa header ham yangilanadi
    const afterSave = (saved) => {
        load();
        if (saved?.id && saved.id === me?.id) {
            axios.get(`${ip}/api/me`, {headers: auth()})
                .then(({data}) => data?.user && dispatch(getMeAction(data.user)))
                .catch(() => {});
        }
    };

    const confirmDelete = async () => {
        setBusy(true);
        try {
            await axios.delete(`${ip}/api/admin/${deleteTarget.id}`, {headers: auth()});
            message.success(t("O'chirildi"));
            setDeleteTarget(null);
            if (rows.length === 1 && page > 1) setPage(page - 1);
            load();
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
            title: t("F.I.Sh"),
            key: 'name',
            render: (_, a) => (
                <div className="set_person">
                    <AdminAvatar admin={a}/>
                    <div className="set_person_text">
                        <span className="set_person_name">
                            {fullName(a) || '—'}
                            {me?.id === a.id && <span className="ds-badge ds-badge--brand set_me">{t("Siz")}</span>}
                        </span>
                        {a.login && <span className="set_person_login">@{a.login}</span>}
                    </div>
                </div>
            ),
        },
        {
            title: t("Rol"),
            dataIndex: 'role',
            key: 'role',
            render: (role) => <span className={getRoleBadgeClass(role)}>{getRoleLabel(role, t)}</span>,
        },
        {
            title: t("Qo'shilgan sana"),
            dataIndex: 'created_time',
            key: 'created_time',
            render: (v) => (v ? dayjs(v).format('DD.MM.YYYY') : <span className="tc-muted">—</span>),
        },
        {
            title: '',
            key: 'actions',
            width: 110,
            align: 'right',
            render: (_, a) => (
                <div className="tc-actions set_actions">
                    <button type="button" className="tc-icon-btn" onClick={() => setEditAdmin(a)}
                            title={t("Tahrirlash")} aria-label={t("Tahrirlash")}>
                        <EditIcon size={18}/>
                    </button>
                    {/* o'z hisobini o'chirib bo'lmaydi */}
                    {me?.id !== a.id && (
                        <button type="button" className="tc-icon-btn tc-icon-btn--danger"
                                onClick={() => setDeleteTarget(a)}
                                title={t("O'chirish")} aria-label={t("O'chirish")}>
                            <TrashIcon size={18}/>
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="admin content-enter">
            <div className="admin_header">
                <div className="admin_header_left">
                    <p>{t("Sozlamalar")}</p>
                    {tabs}
                </div>
                <div className="admin_header_right">
                    <div className="admin_header_search">
                        <SearchIcon size={18}/>
                        <input type="text" placeholder={t("F.I.Sh, login yoki rol...")} value={search}
                               onChange={e => setSearch(e.target.value)}/>
                    </div>
                    <button type="button" className="admin_header_add" onClick={() => setEditAdmin({})}>
                        <PlusIcon size={20}/>{t("Admin qo'shish")}
                    </button>
                </div>
            </div>

            <div className="admin_body">
                <div className="admin_body_table">
                    <Table
                        columns={columns}
                        dataSource={rows}
                        loading={admins === null}
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
                <PagePagination total={admins ? filtered.length : null} current={page} pageSize={limit}
                                onChange={(p, l) => {
                                    if (l !== limit) {
                                        setLimit(l);
                                        setPage(1);
                                    } else setPage(p);
                                }}
                                pageSizeOptions={PAGE_SIZES}/>
            </div>

            <AdminModal open={editAdmin !== null} admin={editAdmin} onClose={() => setEditAdmin(null)} onSaved={afterSave}/>
            <ConfirmDeleteModal
                open={deleteTarget !== null}
                onClose={() => !busy && setDeleteTarget(null)}
                onConfirm={confirmDelete}
                name={deleteTarget ? fullName(deleteTarget) : ''}
                icon={<TrashIcon size={22}/>}
            />
        </div>
    );
};

export default AdminsTab;
