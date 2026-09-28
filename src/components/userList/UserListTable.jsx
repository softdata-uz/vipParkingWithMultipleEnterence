import React from 'react';
import {Table} from "antd";
import {TbEdit, TbTrash} from "react-icons/tb";

import PlateNumber from "../common/PlateNumber";
import {PersonCell} from "../common/VehicleCells";

const UserListTable = ({staffData, getStaffData, setOpen, setDeleteOpen, setDeleteData, setInitialValues}) => {

    const onEdit = (record) => {
        setInitialValues({...record, edit: true});
        setOpen(true);
    };

    const onDelete = (record) => {
        setDeleteData(record);
        setDeleteOpen(true);
    };

    const columns = [
        {
            title: 'T/r',
            dataIndex: 'key',
            key: 'key',
            width: 60,
            align: 'center',
        },
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
            title: 'Telefon raqami',
            dataIndex: 'tel',
            key: 'tel',
            render: (value) => value || <span className="tc-muted">—</span>,
        },
        {
            title: 'Avtomobil raqami',
            dataIndex: 'vehicle_number',
            key: 'vehicle_number',
            render: (value) => <PlateNumber value={value}/>,
        },
        {
            title: '',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <div className="tahrirlash">
                    <div className="tahrirlash_inner" onClick={() => onEdit(record)}>
                        <TbEdit size={18} style={{cursor: 'pointer'}}/>
                    </div>
                    <div className="dalete_button" onClick={() => onDelete(record)}>
                        <TbTrash size={18}/>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Table
            rowSelection={false}
            columns={columns}
            dataSource={staffData}
            pagination={false}
        />
    );
};

export default UserListTable;
