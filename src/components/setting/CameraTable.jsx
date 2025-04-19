import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {Image, Table} from "antd";
import {ip} from "../../ip";
import nobody from "../../images/nobody.svg";
import {RiEditLine} from "@react-icons/all-files/ri/RiEditLine";
import {AiOutlineUser} from 'react-icons/ai';
import {RiDeleteBin6Line} from 'react-icons/ri';


const CameraTable = (props) => {

    const dispatch = useDispatch();

    const {
        cameraData,
        filterInitialValue2,
        setFilterInitialValue2,
        setDeleteOpenCamera,
        setDeleteDataCamera,
        setInitialValuesCamera,
        setOpenCamera
    } = props;


    const handleChange = (pagination, filters, sorter) => {
        setFilterInitialValue2({...filterInitialValue2, table_name: sorter.field});
        setFilterInitialValue2({...filterInitialValue2, order_by: sorter?.order?.replace("end", "")});
    };

    const editAddCamera = (value, record) => {
        setOpenCamera(true);
        setInitialValuesCamera({
            ...record,
            edit: true
        })
    }

    const deleteCamera = (text, record) => {
        setDeleteOpenCamera(true);
        setDeleteDataCamera(record);
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
            title: 'Nomi',
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
            title: 'Turi',
            dataIndex: 'type',
            key: 'type',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.type === 'dahua' ? "Dahua" : record?.type === 'hikvision' ? "Hikvision" : "Boshqalar"}
                </div>
            )
        },
        {
            title: 'Guruh',
            dataIndex: 'camera_group',
            key: 'camera_group',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.camera_group?.name}
                </div>
            )
        },
        {
            title: 'Kanal',
            dataIndex: 'channel',
            key: 'channel',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.channel}
                    {/*{record?.brand === 'hikvision' ? 'Hikvision' : record?.brand === 'dahua' ? "Dahua" : "Boshqalar"}*/}
                </div>
            )
        },
        {
            title: "Yo'nalishi",
            dataIndex: 'direction',
            key: 'direction',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.direction === "enter" ? "Kirish" : record.direction === "exit" ? "Chiqish" : "..."}
                </div>
            )
        },
        {
            title: 'IP manzili',
            dataIndex: 'ip_address',
            key: 'ip_address',
            ellipsis: true,
            // sorter: true,
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.ip_address ? record.ip_address : "..."}
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
                    {record?.username ? record.username : "..."}
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
                        <div onClick={() => editAddCamera(text, record)} className='edit_button'>
                            <RiEditLine size={22}/>
                        </div>
                        <div onClick={() => deleteCamera(text, record)} className="dalete_button">
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
            dataSource={cameraData}
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

export default CameraTable;