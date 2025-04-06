import React, {useState} from 'react';
import {Modal} from "antd";
import axios from "axios";
import {ip} from "../../../ip";
import {message} from "antd";

import '../../userList/userList.css';

const DeleteCameraModal = (props) => {

    const {
        deleteOpenCamera,
        setDeleteOpenCamera,
        deleteDataCamera,
        setDeleteDataCamera,
        getCameraData
    } = props;

    const deleteCamera = () =>{
        axios.delete(`${ip}/api/devices/${deleteDataCamera.id}`, {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
            .then((res) => {
                console.log(res);
                setDeleteOpenCamera(false);
                getCameraData();
                message.success("O'chirildi !", 5);
            })
    }

    return (
        <div>
            <Modal
                centered
                open={deleteOpenCamera}
                onOk={() => setDeleteOpenCamera(false)}
                onCancel={() => setDeleteOpenCamera(false)}
                width={300}>
                <div className="delete_modal">
                    <h3>Haqiqatdan ham o'chirasizmi ?</h3>
                    <div className="delete_modal_button">
                        <div className="">
                            <button type="button" className="delete_modal_button_left"
                                    onClick={() => setDeleteOpenCamera(false)}>Yo'q
                            </button>
                        </div>
                        <div>
                            <button type="submit" className="delete_modal_button_right"

                                onClick={()=>deleteCamera()} >Ha

                        </button>
                    </div>
                </div>
        </div>
</Modal>
</div>
);
};

export default DeleteCameraModal;