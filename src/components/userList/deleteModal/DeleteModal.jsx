import React, {useState} from 'react';
import axios from "axios";
import {message} from "antd";
import {ip} from "../../../ip";
import {ConfirmDeleteModal} from "../../common/ModalShell";
import {TbTrash} from "react-icons/tb";

const DeleteModal = ({deleteOpen, setDeleteOpen, deleteData, setDeleteData, getStaffData}) => {
    const [busy, setBusy] = useState(false);

    const close = () => {
        if (busy) return;
        setDeleteOpen(false);
        setDeleteData([]);
    };

    const confirmDelete = () => {
        if (!deleteData?.id) return;
        setBusy(true);
        axios.delete(`${ip}/api/staff/${deleteData.id}`, {
            headers: {'x-access-token': localStorage.getItem('vipparking-token')},
        })
            .then(() => {
                message.success("Xodim o'chirildi");
                getStaffData();
                setDeleteOpen(false);
                setDeleteData([]);
            })
            .catch((err) => {
                message.error(err?.response?.data?.msg || "Xatolik yuz berdi");
            })
            .finally(() => setBusy(false));
    };

    return (
        <ConfirmDeleteModal
            open={deleteOpen}
            onClose={close}
            onConfirm={confirmDelete}
            name={deleteData?.fullname}
            icon={<TbTrash size={22}/>}
        />
    );
};

export default DeleteModal;
