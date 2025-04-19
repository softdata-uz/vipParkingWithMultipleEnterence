import React, {useState} from 'react';
import {Modal} from "antd";
import axios from "axios";
import {ip} from "../../../ip";
import {message} from "antd";

import '../../userList/userList.css';

const DeleteGroupModal = (props) => {

    const {
        deleteOpenGroup,
        setDeleteOpenGroup,
        deleteDataGroup,
        setDeleteDataGroup,
        getGroupData
    } = props;

    const deleteGroup = () => {
        axios.delete(`${ip}/api/camera-group/${deleteDataGroup.id}`,
            {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
            .then((res) => {
                setDeleteOpenGroup(false);
                getGroupData();
                message.success("O'chirildi !", 5);
            })
            .catch((err)=>{
                message.error("Biriktirilgan kamerani birinchi o'chirish kerak!")
            })
    }

    return (
        <div>
            <Modal
                centered
                open={deleteOpenGroup}
                onOk={() => setDeleteOpenGroup(false)}
                onCancel={() => setDeleteOpenGroup(false)}
                width={300}>
                <div className="delete_modal">
                    <h3>Haqiqatdan ham o'chirasizmi ?</h3>
                    <div className="delete_modal_button">
                        <div className="">
                            <button type="button" className="delete_modal_button_left"
                                    onClick={() => setDeleteOpenGroup(false)}>Yo'q
                            </button>
                        </div>
                        <div>
                            <button type="submit" className="delete_modal_button_right"
                                    onClick={() => deleteGroup()}>Ha
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DeleteGroupModal;