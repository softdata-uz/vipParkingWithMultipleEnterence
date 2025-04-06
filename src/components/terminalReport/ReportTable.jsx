import React from 'react';
import {Image, Space, Table} from "antd";
import {AiOutlineUser} from 'react-icons/ai'
import {BiCamera} from "@react-icons/all-files/bi/BiCamera";
import {ip} from "../../ip";
import nobody from "../../images/nobody.svg";
import './report.css';

const ReportTable = (props) => {

    const {
        reportData,
        filterInitialValue,
        setFilterInitialValue,
    } = props;

    const handleChange = (pagination, filters, sorter) => {
        setFilterInitialValue({...filterInitialValue, table_name: sorter.field});
        setFilterInitialValue({...filterInitialValue, order_by: sorter?.order?.replace("end", "")});
    };


    const columns = [
        {
            title: 'T/r',
            dataIndex: 'key',
            key: 'key',
            width: 50,
            align: 'center'
        },
        {
            title: 'F.I.Sh',
            dataIndex: 'fullname',
            key: 'fullname',
            align: 'center',
            render: (text, record) => (
                <div className='table_user_cell'>
                    {
                        record.staff_image ?
                            <Image
                                className="table_user_cell_img"
                                src={`${ip}/staff/${record.staff_image}`}
                                preview={{
                                    mask: (
                                        <AiOutlineUser size={20}/>
                                    ),
                                    imageRender : ()=>(
                                        <img src={`${ip}/api/image/terminal-history-log/${record.id}`}/>
                                    ),
                                    maskClassName: 'customize-mask',
                                }}
                            />
                            :
                            <Image
                                className="table_user_cell_img"
                                src={nobody}
                                preview={{
                                    mask: (
                                        <AiOutlineUser size={20}/>
                                    ),
                                    imageRender : ()=>(
                                        <img src={`${ip}/api/image/terminal-history-log/${record.id}`}/>
                                    ),
                                    maskClassName: 'customize-mask',
                                }}
                            />
                    }

                    {
                        record.fullname ?
                            <p> {record?.fullname}</p> : "Aniqlanmagan shaxs"
                    }

                </div>
            ),
        },

        {
            title: 'Boshqarma',
            dataIndex: 'position',
            key: 'position',
            ellipsis: true,
            sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.position ? record.position : "..."}
                </div>
            )
        },
        {
            title: 'Davlat raqami',
            dataIndex: 'vehicle_number',
            key: 'vehicle_number',
            ellipsis: true,
            sorter: true,
            align: 'center',
        },
        {
            title: "Eshik nomi",
            dataIndex: 'door_name',
            key: 'door_name',
            ellipsis: true,
            sorter: true,
            align: 'center',
        },
        {
            title: "Holati",
            dataIndex: 'access',
            key: 'access',
            ellipsis: true,
            sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.access ? <p className="terminla_report_true">Kirishga ruxsat</p> : <p className="terminla_report_false">Kirish taqiqlanadi</p>}
                </div>
            )
        },
        {
            title: "Vaqt",
            dataIndex: 'created_time',
            key: 'created_time',
            ellipsis: true,
            sorter: true,
            align: 'center',
        },
        {
            title: "Kirgan vaqti",
            dataIndex: 'entering_time',
            key: 'entering_time',
            ellipsis: true,
            sorter: true,
            align: 'center',
        },
        {
            title: 'Avtomobil rasmi',
            dataIndex: 'avto_num',
            key: 'avto_num',
            ellipsis: true,
            // sorter:true,
            align: 'center',
            render: (text, record) => (
                <div className='table_report_cell'>
                    {
                        record.vehicle_log_id ?
                            <Image
                                className="table_report_cell_img"
                                // src={`${ip}/api/image/event/${record.id}/vehicle_image`}
                                src={`${ip}/api/image/event/${record.vehicle_log_id}/plate_image`}
                                preview={{
                                    src: `${ip}/api/image/event/${record.vehicle_log_id}/vehicle_image`,
                                    maskClassName: 'customize-mask',
                                    mask: (
                                        <Space direction="horizontal" align="center">
                                            <BiCamera size={20}/>
                                            {/*Ko'rish*/}
                                        </Space>
                                    ),
                                }}
                            />
                            :
                            "..."
                    }
                </div>
            ), 
        },
    ];


    return (
        <Table
            rowSelection={false}
            columns={columns}
            dataSource={reportData}
            onChange={handleChange}
            pagination={false}
            locale={{
                triggerDesc: `Kamayish bo'yicha`,
                triggerAsc: `O'sish bo'yicha`,
                cancelSort: 'Saralashni bekor qilish'
            }}
        />
    );
};

export default ReportTable;