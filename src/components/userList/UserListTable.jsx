import React, {useEffect, useState} from 'react';
import {Image, Table} from "antd";
import {AiOutlineUser} from 'react-icons/ai';
import {RiDeleteBin6Line} from 'react-icons/ri';
import img from "../../images/img.jpg";
import camera from "../../images/camer.svg";
import car from "../../images/Car.png"
import {BiCamera} from "@react-icons/all-files/bi/BiCamera";
import {RiEditLine} from "@react-icons/all-files/ri/RiEditLine";
import axios from "axios";
import {ip} from "../../ip";
import nobody from "../../images/nobody.svg";
import {message} from "antd";
import {useSelector, useDispatch} from "react-redux";
// import 'userList.css';

const UserListTable = (props) => {

    const dispatch = useDispatch();

    const {
        staffData,
        filterInitialValue,
        setFilterInitialValue,
        getStaffData,
        open,
        setOpen,
        setDeleteOpen,
        setDeleteData,
        setEditOpen,
        setEditData,
        editData,
        setInitialValues
    } = props;


    const handleChange = (pagination, filters, sorter) => {
        setFilterInitialValue({...filterInitialValue, table_name: sorter.field});
        setFilterInitialValue({...filterInitialValue, order_by: sorter?.order?.replace("end", "")});
    };

    const editAddStaff = (value, record) => {
        setOpen(true);
        setInitialValues({
            ...record,
            edit : true
        });
    }
    useEffect(()=>{

    },[editData]);

    const deleteStaff = (text, record) => {
        setDeleteOpen(true);
        setDeleteData(record);
    }

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
                        record.image ?
                            <Image
                                className="table_user_cell_img"
                                src={`${ip}/staff/${record.image}`}
                                preview={{
                                    mask: (
                                        <AiOutlineUser size={20}/>
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
                                    maskClassName: 'customize-mask',
                                }}
                            />
                    }

                    {
                        record.fullname ?
                            <p>{record.fullname}</p> : "Aniqlanmagan shaxs"
                    }

                </div>
            ),
        },

        {
            title: 'Boshqarma',
            dataIndex: 'lav',
            key: 'lav',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.position ? record.position : "..."}
                </div>
            )
        },
        {
            title: 'Mashina raqami',
            dataIndex: 'num',
            key: 'num',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.vehicle_number ? record.vehicle_number : "..."}
                </div>
            )
        },
        {
            title: "Telefon raqami",
            dataIndex: 'enter_time',
            key: 'enter_time',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.tel ? record.tel : "..."}
                </div>
            )
        },
        // {
        //     title: 'Mashina rasmi',
        //     dataIndex: 'img',
        //     key: 'img',
        //     align: 'center',
        //     render: (text, record) => (
        //         <div className=''>
        //             {
        //                 record.vehicle_image ?
        //                     <Image
        //                         className="table_user_cell_img"
        //                         src={`${ip}/staff/${record.vehicle_image}`}
        //                         preview={{
        //                             mask: (
        //                                 <AiOutlineUser size={20}/>
        //                             ),
        //                             maskClassName: 'customize-mask',
        //                         }}
        //                     />
        //                     :
        //                     <Image
        //                         className="table_user_cell_img"
        //                         src={nobody}
        //
        //                         preview={{
        //                             mask: (
        //                                 <AiOutlineUser size={20}/>
        //                             ),
        //                             maskClassName: 'customize-mask',
        //                         }}
        //                     />
        //             }
        //         </div>
        //     ),
        // },
        {
            title: 'Tahrir',
            dataIndex: '',
            render: (text, record) => (
                <div className="tahrirlash">
                    <div className="tahrirlash_inner">
                        <div onClick={() => editAddStaff(text, record)} className='edit_button'>
                            <RiEditLine size={22}/>
                        </div>
                        <div onClick={() => deleteStaff(text, record)} className="dalete_button">
                            <RiDeleteBin6Line size={18}/>
                        </div>
                    </div>
                </div>

            ),
            align: 'center'
        },
    ];

    return (
        <Table
            rowSelection={false}
            columns={columns}
            dataSource={staffData}
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

export default UserListTable;