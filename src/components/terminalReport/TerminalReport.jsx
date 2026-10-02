import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {Table, message} from "antd";
import axios from "axios";
import moment from "moment";

import {ip} from "../../ip";
import {TbChevronLeft, TbSearch, TbFileSpreadsheet, TbFileTypePdf} from "react-icons/tb";
import PlateNumber from "../common/PlateNumber";
import {PersonCell} from "../common/VehicleCells";
import PagePagination from "../common/PagePagination";

import "./report.css";

/* Terminal hisoboti — vehicle_log tarixi, hozircha eski (LightZone) ko'rinishda.
   API: GET /api/vehicle_log/:limit/:page?searched_data= -> {data, count, current_page}
        POST /api/report/vehicle_log/excel | pdf (searched_data bilan) -> fayl (blob) */

const auth = () => ({'x-access-token': localStorage.getItem('vipparking-token')});

const TerminalReport = () => {
    const [reportData, setReportData] = useState([]);
    const [total, setTotal] = useState(null);
    const [limit, setLimit] = useState(15);
    const [current, setCurrent] = useState(1);
    const [searchedData, setSearchedData] = useState('');

    const getReportData = () => {
        axios.get(`${ip}/api/vehicle_log/${limit}/${current}`, {
            headers: auth(),
            params: {searched_data: searchedData},
        })
            .then(({data}) => {
                const offset = (Number(data?.current_page || current) - 1) * limit;
                setTotal(data?.count ?? 0);
                setReportData((data?.data || []).map((item, i) => ({
                    ...item,
                    key: offset + i + 1,
                    entering_time: item.entering_time ? moment(item.entering_time).format('DD.MM.YYYY HH:mm:ss') : '',
                    exiting_time: item.exiting_time ? moment(item.exiting_time).format('DD.MM.YYYY HH:mm:ss') : '',
                })));
            })
            .catch(() => {
                setReportData([]);
                setTotal(0);
            });
    };

    useEffect(() => {
        getReportData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, current, searchedData]);

    const onPageChange = (nextPage, nextLimit) => {
        if (nextLimit !== limit) {
            setLimit(nextLimit);
            setCurrent(1);
        } else {
            setCurrent(nextPage);
        }
    };

    const download = (kind) => {
        axios.post(`${ip}/api/report/vehicle_log/${kind}`, {searched_data: searchedData}, {
            headers: auth(),
            responseType: 'blob',
        })
            .then((res) => {
                const blob = new Blob([res.data]);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = kind === 'pdf' ? 'terminal-report.pdf' : 'terminal-report.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => message.error("Faylni yuklab bo'lmadi"));
    };

    const columns = [
        {title: 'T/r', dataIndex: 'key', key: 'key', width: 60, align: 'center'},
        {
            title: 'F.I.SH',
            dataIndex: 'fullname',
            key: 'fullname',
            render: (_, record) => <PersonCell record={record} t={(s) => s}/>,
        },
        {
            title: 'Boshqarma',
            dataIndex: 'position',
            key: 'position',
            render: (value) => value || <span className="tc-muted">—</span>,
        },
        {
            title: 'Davlat raqami',
            dataIndex: 'vehicle_number',
            key: 'vehicle_number',
            render: (value) => <PlateNumber value={value}/>,
        },
        {title: 'Kirgan vaqti', dataIndex: 'entering_time', key: 'entering_time'},
        {title: 'Chiqqan vaqti', dataIndex: 'exiting_time', key: 'exiting_time'},
        {
            title: 'Avtomobil rasmi',
            key: 'image',
            align: 'center',
            render: (_, record) => (
                <div className="table_report_cell">
                    <img className="table_report_cell_img"
                         src={`${ip}/api/image/event/${record.id}/plate_image/enter`}
                         alt=""/>
                </div>
            ),
        },
    ];

    return (
        <div className="user_list">
            <div className="user_list_top">
                <div className="user_list_top_left">
                    <Link to="/" className="user_list_top_left_prev"><TbChevronLeft size={18}/></Link>
                    <div className="user_list_top_left_text">
                        <span>Asosiy »</span>
                        <p>Terminal hisoboti</p>
                    </div>
                </div>
                <div className="user_list_top_right">
                    <div className="user_list_top_right_search">
                        <TbSearch size={16}/>
                        <input
                            type="text"
                            placeholder="Izlash"
                            value={searchedData}
                            onChange={(e) => {
                                setSearchedData(e.currentTarget.value);
                                setCurrent(1);
                            }}
                        />
                    </div>
                    <div className="download_buttons">
                        <button className="download_btn" onClick={() => download('excel')}>
                            <TbFileSpreadsheet size={18} style={{marginRight: 5}}/>Yuklash
                        </button>
                        <button className="download_btn_pdf" onClick={() => download('pdf')}>
                            <TbFileTypePdf size={18} style={{marginRight: 5}}/>Yuklash
                        </button>
                    </div>
                </div>
            </div>

            <div className="user_list_body">
                <div className="report_section">
                    <div className="report_table">
                        <Table
                            rowSelection={false}
                            columns={columns}
                            dataSource={reportData}
                            pagination={false}
                        />
                    </div>
                </div>
            </div>
            <PagePagination total={total} current={current} pageSize={limit} onChange={onPageChange}/>
        </div>
    );
};

export default TerminalReport;
