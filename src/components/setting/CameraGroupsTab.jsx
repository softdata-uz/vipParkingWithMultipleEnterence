import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Form, Input, message, Table} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";
import dayjs from "dayjs";

import {ip} from "../../ip";
import {
    CameraIcon,
    EditIcon,
    GridIcon,
    InboxIcon,
    PlusIcon,
    SearchIcon,
    TrashIcon,
} from "../../design-system/icons";
import {ConfirmDeleteModal, ModalField, ModalShell} from "../common/ModalShell";
import PagePagination from "../common/PagePagination";

/* Kamera guruhlari.
   API: GET /api/camera-group -> {data} (sahifasiz, hammasi), POST /api/camera-group {name},
        PUT /api/camera-group/:id {name}, DELETE /api/camera-group/:id
        Guruhdagi kameralar soni — GET /api/cameras/1000/1 dan hisoblanadi. */

const PAGE_SIZES = [15, 30, 50];
const auth = () => ({'x-access-token': localStorage.getItem('vipparking-token')});

const CameraGroupsTab = ({tabs}) => {
    const {t} = useTranslation();
    const [groups, setGroups] = useState(null);
    const [cameraCounts, setCameraCounts] = useState({});
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [editGroup, setEditGroup] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [busy, setBusy] = useState(false);
    const requestIdRef = useRef(0);

    const load = useCallback(() => {
        const requestId = ++requestIdRef.current;
        const groupsReq = axios.get(`${ip}/api/camera-group`, {headers: auth()});
        const camerasReq = axios.get(`${ip}/api/cameras/1000/1`, {headers: auth(), params: {searched_data: ''}})
            .catch(() => ({data: {data: []}}));
        return Promise.all([groupsReq, camerasReq])
            .then(([g, c]) => {
                if (requestId !== requestIdRef.current) return false;
                setGroups(g.data?.data || []);
                const counts = {};
                (c.data?.data || []).forEach(cam => {
                    counts[cam.camera_group_id] = (counts[cam.camera_group_id] || 0) + 1;
                });
                setCameraCounts(counts);
                return true;
            })
            .catch(err => {
                if (requestId !== requestIdRef.current) return false;
                setGroups(prev => prev ?? []);
                message.error(err?.response?.data?.msg || t("Xatolik"));
                return false;
            });
    }, [t]);

    useEffect(() => {
        load();
    }, [load]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return (groups || []).filter(g => !q || (g.name || '').toLowerCase().includes(q));
    }, [groups, search]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const rows = filtered.slice((page - 1) * limit, page * limit)
        .map((g, i) => ({...g, key: g.id, index: (page - 1) * limit + i + 1}));


    const confirmDelete = async () => {
        setBusy(true);
        try {
            await axios.delete(`${ip}/api/camera-group/${deleteTarget.id}`, {headers: auth()});
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
            title: t("Guruh nomi"),
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <div className="set_camera">
                    <span className="set_camera_icon"><GridIcon size={18}/></span>
                    <span className="set_person_name">{name || '—'}</span>
                </div>
            ),
        },
        {
            title: t("Kameralar"),
            key: 'cameras',
            render: (_, g) => (
                <span className="ds-badge ds-badge--gray set_badge">
                    <CameraIcon size={14}/>{cameraCounts[g.id] || 0}
                </span>
            ),
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
            render: (_, g) => (
                <div className="tc-actions set_actions">
                    <button type="button" className="tc-icon-btn" onClick={() => setEditGroup(g)}
                            title={t("Tahrirlash")} aria-label={t("Tahrirlash")}>
                        <EditIcon size={18}/>
                    </button>
                    <button type="button" className="tc-icon-btn tc-icon-btn--danger" onClick={() => setDeleteTarget(g)}
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
                    {tabs}
                </div>
                <div className="admin_header_right">
                    <div className="admin_header_search">
                        <SearchIcon size={18}/>
                        <input type="text" placeholder={t("Guruh nomi bo'yicha izlash...")} value={search}
                               onChange={e => setSearch(e.target.value)}/>
                    </div>
                    <button type="button" className="admin_header_add" onClick={() => setEditGroup({})}>
                        <PlusIcon size={20}/>{t("Guruh qo'shish")}
                    </button>
                </div>
            </div>

            <div className="admin_body">
                <div className="admin_body_table">
                    <Table
                        columns={columns}
                        dataSource={rows}
                        loading={groups === null}
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
                <PagePagination total={groups ? filtered.length : null} current={page} pageSize={limit}
                                onChange={(p, l) => {
                                    if (l !== limit) {
                                        setLimit(l);
                                        setPage(1);
                                    } else setPage(p);
                                }}
                                pageSizeOptions={PAGE_SIZES}/>
            </div>

            <CameraGroupModal open={editGroup !== null} group={editGroup}
                              onClose={() => setEditGroup(null)} onSaved={load}/>
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

/* Kamera guruhini qo'shish / tahrirlash — faqat nom */
const CameraGroupModal = ({open, group, onClose, onSaved}) => {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const isEdit = Boolean(group?.id);

    useEffect(() => {
        if (open) form.setFieldsValue({name: group?.name || ''});
    }, [open, group, form]);

    const save = async ({name}) => {
        const headers = {'x-access-token': localStorage.getItem('vipparking-token')};
        setSaving(true);
        try {
            if (isEdit) {
                await axios.put(`${ip}/api/camera-group/${group.id}`, {name: name.trim()}, {headers});
                message.success(t("Guruh ma'lumotlari o'zgartirildi"));
            } else {
                await axios.post(`${ip}/api/camera-group`, {name: name.trim()}, {headers});
                message.success(t("Yangi guruh qo'shildi"));
            }
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
            size="sm"
            icon={isEdit ? <EditIcon size={22}/> : <PlusIcon size={22}/>}
            title={isEdit ? t("Guruhni tahrirlash") : t("Yangi guruh")}
            footer={
                <>
                    <button type="button" className="dsm-btn dsm-btn--secondary" onClick={onClose}>
                        {t("Bekor qilish")}
                    </button>
                    <button type="submit" form="camera_group_form" className="dsm-btn dsm-btn--primary" disabled={saving}>
                        {t("Saqlash")}
                    </button>
                </>
            }
        >
            <Form form={form} name="camera_group_form" layout="vertical" requiredMark="optional" onFinish={save}
                  autoComplete="off">
                <div className="dsm-form">
                    <ModalField label={t("Guruh nomi")} full>
                        <Form.Item name="name" rules={[{required: true, whitespace: true, message: t("Guruh nomini kiriting")}]}>
                            <Input prefix={<GridIcon size={16}/>} placeholder={t("Masalan: Asosiy kirish")}/>
                        </Form.Item>
                    </ModalField>
                </div>
            </Form>
        </ModalShell>
    );
};

export default CameraGroupsTab;
