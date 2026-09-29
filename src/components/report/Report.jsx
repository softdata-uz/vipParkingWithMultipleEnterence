import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DatePicker, message, Table} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";
import dayjs from "dayjs";

import {ip} from "../../ip";
import {
    CalendarIcon,
    ClockIcon,
    DownloadIcon,
    FileTextIcon,
    InboxIcon,
    SearchIcon,
} from "../../design-system/icons";
import PagePagination from "../common/PagePagination";
import PlateNumber from "../common/PlateNumber";
import {PersonCell, TimeCell, VehicleImage, formatDuration} from "../common/VehicleCells";
import {GroupTypeBadge} from "../employees/database/groupTypes";

import '../../design-system/ui.css';
import '../../styles/table-cells.css';
import '../../styles/page.css';
import './report.css';

/* Hisobot — avtomobillarning kirish-chiqish tarixi.
   API: GET  /api/vehicle_log/:limit/:page?fromDate&toDate&searched_data&db_type  -> {data, count, current_page}
          ⚠ fromDate/toDate bo'lmasa server bo'sh ro'yxat qaytaradi — davr doim yuboriladi.
          ⚠ table_name/order_by ni server e'tiborsiz qoldiradi — ustun bo'yicha saralash yo'q.
        POST /api/report/vehicle_log/excel | pdf  (shu filtr + lang bilan) -> fayl (blob)
        GET  /api/image/event/:id/plate_image | vehicle_image */

const PAGE_SIZES = [15, 30, 50, 100];
const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";          // server kutadigan format
const PDF_TIMEOUT = 90 * 1000;                      // PDF sekin tayyorlanadi
const auth = () => ({'x-access-token': localStorage.getItem('vipparking-token')});

// tayyor davrlar: [boshlanish, tugash]
const PERIODS = {
    today: () => [dayjs().startOf('day'), dayjs().endOf('day')],
    yesterday: () => [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
    week: () => [dayjs().subtract(6, 'day').startOf('day'), dayjs().endOf('day')],
    month30: () => [dayjs().subtract(29, 'day').startOf('day'), dayjs().endOf('day')],
    thisMonth: () => [dayjs().startOf('month'), dayjs().endOf('month')],
};

const saveBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};

const Report = () => {
    const {t} = useTranslation();

    const [rows, setRows] = useState(null);
    const [total, setTotal] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(PAGE_SIZES[0]);
    const [period, setPeriod] = useState('today');
    const [customRange, setCustomRange] = useState(null);   // [dayjs, dayjs] — "Oraliq" tanlanganda
    const [dbType, setDbType] = useState('all');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [exporting, setExporting] = useState(null);       // 'excel' | 'pdf' | null
    const requestIdRef = useRef(0);

    const range = useMemo(
        () => (period === 'custom' ? customRange : PERIODS[period]()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [period, customRange]);

    // serverga yuboriladigan filtr — jadval ham, Excel/PDF ham shu bilan
    const filter = useMemo(() => ({
        fromDate: range ? range[0].format(DATE_FORMAT) : '',
        toDate: range ? range[1].format(DATE_FORMAT) : '',
        searched_data: search,
        db_type: dbType === 'all' ? '' : dbType,
    }), [range, search, dbType]);

    const load = useCallback((silent = false) => {
        if (!range) return Promise.resolve(false);          // "Oraliq" hali tanlanmagan
        const requestId = ++requestIdRef.current;
        return axios.get(`${ip}/api/vehicle_log/${limit}/${page}`, {headers: auth(), params: filter})
            .then(({data}) => {
                if (requestId !== requestIdRef.current) return false;
                const offset = (Number(data?.current_page || page) - 1) * limit;
                setRows((data?.data || []).map((item, i) => ({...item, key: item.id, index: offset + i + 1})));
                setTotal(data?.count ?? 0);
                return true;
            })
            .catch(err => {
                if (requestId !== requestIdRef.current) return false;
                if (silent) return false;                   // jim yangilashda jadval saqlanib qoladi
                setRows([]);
                setTotal(0);
                message.error(err?.response?.data?.msg || t("Xatolik"));
                return false;
            });
    }, [filter, limit, page, range, t]);

    useEffect(() => {
        load();
    }, [load]);

    // yangi yozuvlar o'zi keladi: har 30 soniyada jim yangilanadi (sahifa ko'rinib turganda)
    useEffect(() => {
        const timer = setInterval(() => {
            if (document.visibilityState === 'visible') load(true);
        }, 30 * 1000);
        return () => clearInterval(timer);
    }, [load]);

    // filtr o'zgarsa — 1-sahifa
    useEffect(() => {
        setPage(1);
    }, [period, customRange, dbType, search]);

    // qidiruv 400ms kechiktirib yuboriladi
    useEffect(() => {
        const value = searchInput.trim();
        if (value === search) return undefined;
        const timer = setTimeout(() => setSearch(value), 400);
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

    // Excel / PDF — joriy filtr bilan; tugma yuklanish holatida, xato bo'lsa xabar
    const exportFile = async (kind) => {
        if (exporting || !range) return;
        setExporting(kind);
        try {
            const lang = localStorage.getItem('i18nextLng');
            const res = await axios.post(`${ip}/api/report/vehicle_log/${kind}`, {...filter, lang}, {
                headers: auth(),
                responseType: 'blob',
                timeout: kind === 'pdf' ? PDF_TIMEOUT : 60 * 1000,
            });
            const name = `hisobot_${range[0].format('YYYY-MM-DD')}_${range[1].format('YYYY-MM-DD')}`;
            saveBlob(res.data, kind === 'pdf' ? `${name}.pdf` : `${name}.xlsx`);
        } catch (err) {
            message.error(err?.code === 'ECONNABORTED'
                ? t("Server faylni o'z vaqtida tayyorlamadi. Qisqaroq davr tanlab qayta urinib ko'ring.")
                : t("Faylni yuklab bo'lmadi"));
        } finally {
            setExporting(null);
        }
    };

    const PERIOD_OPTIONS = [
        {value: 'today', label: t("Bugun")},
        {value: 'yesterday', label: t("Kecha")},
        {value: 'week', label: t("7 kun")},
        {value: 'month30', label: t("30 kun")},
        {value: 'thisMonth', label: t("Bu oy")},
        {value: 'custom', label: t("Oraliq")},
    ];
    const DB_TYPE_OPTIONS = [
        {value: 'all', label: t("Barchasi")},
        {value: 'whitelist', label: t("Oq ro'yxat")},
        {value: 'blacklist', label: t("Qora ro'yxat")},
        {value: 'wanted', label: t("Qidiruvda")},
    ];

    const columns = [
        {
            title: t("T/r"),
            dataIndex: 'index',
            key: 'index',
            width: 64,
            align: 'center',
            render: (value) => <span className="rp_index">{value}</span>,
        },
        {
            title: t("F.I.Sh"),
            dataIndex: 'fullname',
            key: 'fullname',
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
            title: t("Chiqqan vaqti"),
            dataIndex: 'exiting_time',
            key: 'exiting_time',
            render: (value) => (value
                ? <TimeCell value={value}/>
                : <span className="ds-badge ds-badge--brand rp_inside"><span className="ds-badge__dot"/>{t("Ichkarida")}</span>),
        },
        {
            title: t("Turgan vaqti"),
            key: 'duration',
            render: (_, record) => (
                <span className="rp_duration">
                    <ClockIcon size={15}/>
                    {formatDuration(record.entering_time, record.exiting_time, t)}
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
                              src={`${ip}/api/image/event/${record.id}/plate_image`}
                              previewSrc={`${ip}/api/image/event/${record.id}/vehicle_image`}/>
            ),
        },
    ];

    return (
        <div className="admin content-enter">
            <div className="admin_header">
                <div className="admin_header_left">
                    <p>{t("Hisobot")}</p>
                    {total != null && range && <span className="ds-badge ds-badge--gray page_count_badge">{total}</span>}
                </div>
                <div className="admin_header_right">
                    <div className="admin_header_search">
                        <SearchIcon size={18}/>
                        <input type="text" placeholder={t("F.I.Sh yoki raqam bo'yicha izlash...")} value={searchInput}
                               onChange={e => setSearchInput(e.target.value)}/>
                    </div>
                    <button type="button" className={`admin_header_btn rp_export${exporting === 'excel' ? ' is-loading' : ''}`}
                            onClick={() => exportFile('excel')} disabled={!!exporting || !range}
                            title={t("Joriy filtr bo'yicha Excel fayl")}>
                        {exporting === 'excel' ? <span className="rp_spinner"/> : <DownloadIcon size={18}/>}
                        Excel
                    </button>
                    <button type="button" className={`admin_header_btn rp_export${exporting === 'pdf' ? ' is-loading' : ''}`}
                            onClick={() => exportFile('pdf')} disabled={!!exporting || !range}
                            title={t("Joriy filtr bo'yicha PDF fayl")}>
                        {exporting === 'pdf' ? <span className="rp_spinner"/> : <FileTextIcon size={18}/>}
                        PDF
                    </button>
                </div>
            </div>

            <div className="admin_body">
                <div className="admin_toolbar">
                    <div className="admin_toolbar_left">
                        {/* davr */}
                        <div className="page_seg" role="tablist" aria-label={t("Davr")}>
                            {PERIOD_OPTIONS.map(o => (
                                <button key={o.value} type="button" role="tab" aria-selected={period === o.value}
                                        className={`page_seg_item${period === o.value ? ' is-active' : ''}`}
                                        onClick={() => setPeriod(o.value)}>
                                    {o.value === 'custom' && <CalendarIcon size={14}/>}
                                    {o.label}
                                </button>
                            ))}
                        </div>
                        {period === 'custom' && (
                            <DatePicker.RangePicker
                                className="rp_range"
                                value={customRange}
                                onChange={(value) => setCustomRange(value && value[0] && value[1] ? value : null)}
                                showTime={{
                                    format: 'HH:mm',
                                    defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
                                }}
                                format="DD.MM.YYYY HH:mm"
                                placeholder={[t("Boshlanish"), t("Tugash")]}
                                allowClear
                            />
                        )}
                        {period !== 'custom' && range && (
                            <span className="rp_range_text">
                                {range[0].format('DD.MM.YYYY')}
                                {!range[0].isSame(range[1], 'day') && ` – ${range[1].format('DD.MM.YYYY')}`}
                            </span>
                        )}
                    </div>
                    <div className="admin_toolbar_right">
                        {/* DB turi */}
                        <div className="page_seg" role="tablist" aria-label={t("DB turi")}>
                            {DB_TYPE_OPTIONS.map(o => (
                                <button key={o.value} type="button" role="tab" aria-selected={dbType === o.value}
                                        className={`page_seg_item${dbType === o.value ? ' is-active' : ''}`}
                                        onClick={() => setDbType(o.value)}>
                                    {o.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="admin_body_table">
                    <Table
                        className="rp_table"
                        columns={columns}
                        // "Oraliq" sanalari hali tanlanmagan — oldingi davr natijasi ko'rsatilmaydi
                        dataSource={range ? (rows || []) : []}
                        loading={rows === null && !!range}
                        pagination={false}
                        locale={{
                            emptyText: (
                                <div className="page_empty">
                                    <span className="page_empty_icon"><InboxIcon size={24}/></span>
                                    <p>{!range
                                        ? t("Oraliqni tanlang")
                                        : search
                                            ? t("Qidiruv bo'yicha hech narsa topilmadi")
                                            : t("Bu davrda kirish-chiqish yo'q")}</p>
                                </div>
                            ),
                        }}
                    />
                </div>

                <PagePagination total={range ? total : 0} current={page} pageSize={limit} onChange={onPageChange}
                                pageSizeOptions={PAGE_SIZES}/>
            </div>
        </div>
    );
};

export default Report;
