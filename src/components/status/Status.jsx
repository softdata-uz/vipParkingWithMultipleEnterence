import React, {useCallback, useEffect, useRef, useState} from 'react';
import {message, Table} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";

import {ip} from "../../ip";
import {ClockIcon, InboxIcon, SearchIcon} from "../../design-system/icons";
import PagePagination from "../common/PagePagination";
import PlateNumber from "../common/PlateNumber";
import {PersonCell, personColumnWidth, TimeCell, VehicleImage, formatDuration} from "../common/VehicleCells";
import {GroupTypeBadge} from "../employees/database/groupTypes";

import '../../design-system/ui.css';
import '../../styles/table-cells.css';
import '../../styles/page.css';
import './status.css';

/* Joriy holat — hozir turargoh ichidagi avtomobillar.
   API: GET /api/event/:limit/:page?searched_data=  -> {data, count, current_page}
        ⚠ table_name/order_by ni server e'tiborsiz qoldiradi — ustun bo'yicha saralash yo'q (Hisobotdagi kabi).
        ⚠ searched_data (bo'sh bo'lsa ham) doim yuborilishi kerak — busiz server bo'sh ro'yxat qaytaradi.
        GET /api/image/event/:id/:type/enter — kirgandagi raqam (plate_image) va avtomobil (full_image) rasmlari */

const PAGE_SIZES = [15, 30, 50, 100];
const LIVE_INTERVAL = 30 * 1000;           // jonli sahifa — har 30 soniyada jim yangilanadi
const auth = () => ({'x-access-token': localStorage.getItem('vipparking-token')});

const Status = () => {
    const {t} = useTranslation();

    const [rows, setRows] = useState(null);          // null — yuklanmoqda
    const [total, setTotal] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [now, setNow] = useState(() => Date.now());
    const requestIdRef = useRef(0);

    // true — yangilandi; false — xato (xabar ko'rsatiladi) yoki eskirgan so'rov
    const load = useCallback(({silent = false} = {}) => {
        const requestId = ++requestIdRef.current;
        return axios.get(`${ip}/api/event/${limit}/${page}`, {
            headers: auth(),
            params: {searched_data: search},
        })
            .then(({data}) => {
                if (requestId !== requestIdRef.current) return false;
                const offset = (Number(data?.current_page || page) - 1) * limit;
                setRows((data?.data || []).map((item, i) => ({...item, key: item.id, index: offset + i + 1})));
                setTotal(data?.count ?? 0);
                setNow(Date.now());
                return true;
            })
            .catch(err => {
                if (requestId !== requestIdRef.current) return false;
                setRows(prev => prev ?? []);
                if (!silent) message.error(err?.response?.data?.msg || t("Xatolik"));
                return false;
            });
    }, [limit, page, search, t]);

    useEffect(() => {
        load();
    }, [load]);

    // jonli yangilanish: ro'yxat va "turish vaqti" — sahifa ko'rinib turganda
    useEffect(() => {
        const timer = setInterval(() => {
            if (document.visibilityState === 'visible') load({silent: true});
        }, LIVE_INTERVAL);
        return () => clearInterval(timer);
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

    const onPageChange = (nextPage, nextLimit) => {
        if (nextLimit !== limit) {
            setLimit(nextLimit);
            setPage(1);
        } else {
            setPage(nextPage);
        }
    };

    const columns = [
        {
            title: t("T/r"),
            dataIndex: 'index',
            key: 'index',
            width: 64,
            align: 'center',
            render: (value) => <span className="st_index">{value}</span>,
        },
        {
            title: t("F.I.Sh"),
            dataIndex: 'fullname',
            key: 'fullname',
            width: personColumnWidth(rows, t),   // eng uzun ismga moslanadi (280px .. ekranning 30%)
            render: (_, record) => <PersonCell record={record} t={t}/>,
        },
        {
            title: t("Boshqarma"),
            dataIndex: 'position',
            key: 'position',
            ellipsis: true,
            render: (value) => value || <span className="tc-muted">—</span>,
        },
        {
            title: t("DB turi"),
            dataIndex: 'db_type',
            key: 'db_type',
            align: 'center',
            render: (value) => value
                ? <GroupTypeBadge type={value} t={t}/>
                : <span className="tc-muted">—</span>,
        },
        {
            title: t("Davlat raqami"),
            dataIndex: 'vehicle_number',
            key: 'vehicle_number',
            render: (value) => <PlateNumber value={value}/>,
        },
        {
            title: t("Kirgan vaqti"),
            dataIndex: 'entering_time',
            key: 'entering_time',
            render: (value) => <TimeCell value={value}/>,
        },
        {
            title: t("Turish vaqti"),
            key: 'stay',
            render: (_, record) => (
                <span className="st_stay">
                    <ClockIcon size={15}/>
                    {formatDuration(record.entering_time, now, t)}
                </span>
            ),
        },
        {
            title: t("Avtomobil rasmi"),
            key: 'image',
            align: 'center',
            width: 170,
            render: (_, record) => (
                <VehicleImage t={t}
                              src={`${ip}/api/image/event/${record.id}/plate_image/enter`}
                              previewSrc={`${ip}/api/image/event/${record.id}/full_image/enter`}/>
            ),
        },
    ];

    return (
        <div className="admin content-enter">
            <div className="admin_header">
                <div className="admin_header_left">
                    <p>{t("Joriy holat")}</p>
                    {total != null && <span className="ds-badge ds-badge--gray page_count_badge">{total}</span>}
                    <span className="ds-badge ds-badge--brand st_live" title={t("Har 30 soniyada avtomatik yangilanadi")}>
                        <span className="ds-badge__dot"/>{t("Jonli")}
                    </span>
                </div>
                <div className="admin_header_right">
                    <div className="admin_header_search">
                        <SearchIcon size={18}/>
                        <input type="text" placeholder={t("F.I.Sh yoki raqam bo'yicha izlash...")} value={searchInput}
                               onChange={e => setSearchInput(e.target.value)}/>
                    </div>
                </div>
            </div>

            <div className="admin_body">
                <div className="admin_body_table">
                    <Table
                        className="st_table"
                        columns={columns}
                        dataSource={rows || []}
                        loading={rows === null}
                        pagination={false}
                        locale={{
                            emptyText: (
                                <div className="page_empty">
                                    <span className="page_empty_icon"><InboxIcon size={24}/></span>
                                    <p>{search
                                        ? t("Qidiruv bo'yicha hech narsa topilmadi")
                                        : t("Hozir turargohda avtomobil yo'q")}</p>
                                </div>
                            ),
                        }}
                    />
                </div>

                <PagePagination total={total} current={page} pageSize={limit} onChange={onPageChange}
                                pageSizeOptions={PAGE_SIZES}/>
            </div>
        </div>
    );
};

export default Status;
