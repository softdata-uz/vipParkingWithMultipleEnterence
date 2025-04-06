import React, {useState} from 'react';
import {Modal} from "antd";
import axios from "axios";
import {ip} from "../../../ip";
import {message} from "antd";

import '../userList.css';

const DeleteModal = (props) => {

    const {
        deleteOpen,
        setDeleteOpen,
        deleteData,
        setDeleteData,
        getStaffData
    } = props;

    const deleteStaff = () =>{
        axios.delete(`${ip}/api/staff/${deleteData.id}`, {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
            .then((res) => {
                console.log(res);
                setDeleteOpen(false);
                getStaffData();
                message.success("O'chirildi !", 5);
            })
    }

    return (
        <div>
            <Modal
                centered
                open={deleteOpen}
                onOk={() => setDeleteOpen(false)}
                onCancel={() => setDeleteOpen(false)}
                width={300}>
                <div className="delete_modal">
                    <h3>Haqiqatdan ham o'chirasizmi ?</h3>
                    <div className="delete_modal_button">
                        <div className="">
                            <button type="button" className="delete_modal_button_left"
                                    onClick={() => setDeleteOpen(false)}>Yo'q
                            </button>
                        </div>
                        <div>
                            <button type="submit" className="delete_modal_button_right"

                                onClick={()=>deleteStaff()} >Ha

                        </button>
                    </div>
                </div>
        </div>
</Modal>
</div>
);
};

export default DeleteModal;