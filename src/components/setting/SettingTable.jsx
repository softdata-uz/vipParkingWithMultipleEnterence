import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {Image, Table} from "antd";
import {ip} from "../../ip";
import nobody from "../../images/nobody.svg";
import {RiEditLine} from "@react-icons/all-files/ri/RiEditLine";
import {AiOutlineUser} from 'react-icons/ai';
import {RiDeleteBin6Line} from 'react-icons/ri';


const SettingTable = (props) => {

    const dispatch = useDispatch();

    const {
        staffData,
        filterInitialValue,
        setFilterInitialValue,
        setOpen,
        setInitialValues,
        setDeleteOpen,
        setDeleteData,
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
            dataIndex: 'fish',
            key: 'fish',
            align: 'center',
            render: (text, record) => (
                <div className='table_user_cell'>
                    {
                        record.image ?
                            <Image
                                className="table_user_cell_img"
                                src={`${ip}/${record.image}`}
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
                        record.lastname ?
                            <p> {record.lastname} {record.firstname} {record.fathersname}</p> : "Aniqlanmagan shaxs"
                    }

                </div>
            ),
        },

        {
            title: 'Boshqarma',
            dataIndex: 'role',
            key: 'role',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.role ? (record.role=="king" ? "King" : record.role=="admin" ? "Admin" : record.role=="operator" ? "Operator" :
                     "Super Admin") : "..."}
                </div>
            )
        },
        {
            title: 'Login',
            dataIndex: 'login',
            key: 'login',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.login ? record.login : "..."}
                </div>
            )
        },
        {
            title: "Parol",
            dataIndex: 'password',
            key: 'password',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.password ? record.password : "..."}
                </div>
            )
        },
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

export default SettingTable;