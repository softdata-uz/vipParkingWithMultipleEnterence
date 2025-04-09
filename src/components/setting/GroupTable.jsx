import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {Image, Table} from "antd";
import {ip} from "../../ip";
import nobody from "../../images/nobody.svg";
import {RiEditLine} from "@react-icons/all-files/ri/RiEditLine";
import {AiOutlineUser} from 'react-icons/ai';
import {RiDeleteBin6Line} from 'react-icons/ri';


const GroupTable = (props) => {

    const dispatch = useDispatch();

    const {
        groupData,
        filterInitialValueGroup,
        setFilterInitialValueGroup,
        setDeleteOpenGroup,
        setDeleteDataGroup,
        setInitialValuesGroup,
        setOpenGroup
    } = props;


    const handleChange = (pagination, filters, sorter) => {
        setFilterInitialValueGroup({...filterInitialValueGroup, table_name: sorter.field});
        setFilterInitialValueGroup({...filterInitialValueGroup, order_by: sorter?.order?.replace("end", "")});
    };

    const editAddGroup = (value, record) => {
        setOpenGroup(true);
        setInitialValuesGroup({
            ...record,
            edit: true
        })
    }

    const deleteGroup = (text, record) => {
        setDeleteOpenGroup(true);
        setDeleteDataGroup(record);
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
            title: 'Guruh nomi',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.name}
                </div>
            )
        },
        {
            title: 'Tahrir',
            dataIndex: '',
            render: (text, record) => (
                <div className="tahrirlash">
                    <div className="tahrirlash_inner">
                        <div onClick={() => editAddGroup(text, record)} className='edit_button'>
                            <RiEditLine size={22}/>
                        </div>
                        <div onClick={() => deleteGroup(text, record)} className="dalete_button">
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
            dataSource={groupData}
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

export default GroupTable;