import React, {useEffect, useState} from 'react';
import Layout from "../Layout";
import {Link} from "react-router-dom";
import {ip} from "../../ip";
import axios from "axios";
import moment from "moment";

import prev from "../../images/Vector.png";
import search from "../../images/tabler-icon-search (1).png";
import filter from "../../images/filter_icon.svg";
import exel from "../../images/exel.svg";
import pdf from "../../images/pdf.svg";
import './status.css';
import StatusTable from "./StatusTable";
import StatusPagenation from "./StatusPagenation";
import FilterModal from "./filterModal/FilterModal";


const Status = (props) => {

    const [reportData, setReportData] = useState();
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [reportTotal, setReportTotal] = useState(null);
    const [reportPaginationLimit, setReportPaginationLimit] = useState(15);
    const [reportPaginationCurrent, setReportPaginationCurrent] = useState(1);
    const [filterInitialValue, setFilterInitialValue] = useState({
        // fromDate: '',
        // toDate: '',
        searched_data: '',
        // type: 'all',
        table_name: '',
        order_by: '',
        // fullname: '',
        // position: '',
        // vehicle_number: '',
        // the_date: '',

        // searched_data, table_name, order_by
    })


    const getReportData = async (paramsObj) => {
        await axios
            .get(`${ip}/api/event/${reportPaginationLimit}/${reportPaginationCurrent}`,
                // .get(`${ip}/api/vehicle_log/${reportPaginationLimit}/${reportPaginationCurrent}`,
                {
                    headers: {'x-access-token': localStorage.getItem('vipparking-token')},
                    params: paramsObj
                })
            .then(response => {
                // console.log(response)
                const {data} = response;
                const count = data.count;
                setReportTotal(count)
                const newData = data.data.map((item, index) => (
                    {
                        ...item,
                        key: index + 1 + (data.current_page - 1) * reportPaginationLimit,
                        fullname: item.fullname,
                        position: item.position,
                        vehicle_number: item.vehicle_number,
                        the_date: moment(item.entering_time).format('DD.MM.YYYY, HH:mm:ss'),
                        // exiting_time: moment(item.exiting_time).format('DD.MM.YYYY, HH:mm:ss'),
                        id: item.id
                    }
                ));
                setReportData(newData)
                // console.log(reportData)
            })
            .catch(error => {
                // console.log(error.response);
            })
    }

    const getExcelReport = async (type, paramsObj) => {
        const lang = localStorage.getItem('i18nextLng');
        await axios
            .get(`${ip}/api/report/${type}`, {
                headers: {'x-access-token': localStorage.getItem('vipparking-token')},
                params: {...paramsObj, lang}
            })
            .then(res => {
                const {filename, secret} = res?.data;

                const myInterval = setInterval(async () => {
                    await axios
                        .get(`${ip}/api/report/loading/${type}/${secret}`, {
                            headers: {'x-access-token': localStorage.getItem('vipparking-token')},
                        })
                        .then(async res => {
                            if (res.data !== "wait") {
                                clearInterval(myInterval);
                                window.open(`${ip}/${type}/${filename}`, '_blank', 'noopener,noreferrer');
                            }
                        })
                        .catch(err => {
                            clearInterval(myInterval);
                        })
                }, 3000)
            })
            .catch(err => {

            })
    }


    const reportPaginationOnchange = (e = 1, option) => {
        // getReportData(e)
        setReportPaginationCurrent(e)
        setReportPaginationLimit(option)
    }

    useEffect(() => {
        getReportData(filterInitialValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        reportPaginationLimit,
        reportPaginationCurrent,
        filterInitialValue.table_name,
        filterInitialValue.order_by,
        filterInitialValue.searched_data
    ]);

    const handlclicFilter = () => {
        setIsOpenFilter(true)
    }

    return (
            <div className="user_list">

                <div className="user_list_top">
                    <div className="user_list_top_left">
                        <Link to="/" className="user_list_top_left_prev"><img src={prev}/></Link>
                        <div className="user_list_top_left_text">
                            <span>Asosiy »</span>
                            <p>Joriy holat</p>
                        </div>
                    </div>
                    <div className="user_list_top_right">
                        <div className="user_list_top_right_search" style={{marginRight: "0"}}>
                            <img src={search}/>
                            <input
                                type="text"
                                placeholder="Izlash"
                                onChange={
                                    (event) => {
                                        setFilterInitialValue({
                                            ...filterInitialValue,
                                            searched_data: event.currentTarget.value
                                        });
                                        setReportPaginationCurrent(1);
                                    }}
                            />
                        </div>

                        {/*<div onClick={handlclicFilter} className="report_content_top_filter">*/}
                        {/*    <img src={filter}/>*/}
                        {/*    <p>Filterlash</p>*/}
                        {/*</div>*/}
                        {/*<div className="download_buttons">*/}
                        {/*    <button onClick={() => getExcelReport('excel', filterInitialValue)}*/}
                        {/*            className="download_btn">*/}
                        {/*        <img src={exel}/>*/}
                        {/*        Yuklash*/}
                        {/*    </button>*/}
                        {/*    <button onClick={() => getExcelReport('pdf', filterInitialValue)}*/}
                        {/*            className="download_btn_pdf">*/}
                        {/*        <img src={pdf}/>*/}
                        {/*        Yuklash*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </div>
                </div>

                <div className="user_list_body">
                    <div className="report_section">
                        <div className="report_table">
                            <StatusTable
                                reportData={reportData}
                                filterInitialValue={filterInitialValue}
                                setFilterInitialValue={setFilterInitialValue}
                            />
                        </div>

                    </div>
                    <div className="report_content_pagination">
                        <p className='content_total'>Jami: {reportTotal}</p>
                        <StatusPagenation
                            reportPaginationLimit={reportPaginationLimit}
                            reportPaginationCurrent={reportPaginationCurrent}
                            reportPaginationOnchange={reportPaginationOnchange}
                            reportTotal={reportTotal}
                        />
                    </div>

                </div>
                <FilterModal
                    isOpenFilter={isOpenFilter}
                    setIsOpenFilter={setIsOpenFilter}
                    filterInitialValue={filterInitialValue}
                    setFilterInitialValue={setFilterInitialValue}
                    reportPaginationLimit={reportPaginationLimit}
                    reportPaginationCurrent={reportPaginationCurrent}
                    getReportData={getReportData}
                />
            </div>
    );
};

export default Status;