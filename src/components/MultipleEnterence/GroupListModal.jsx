import React, {useState} from 'react';
import Modal from "react-modal";
import axios from "axios";
import {ip} from "../../ip";


import './groupListModal.css';

const GroupListModal = (props) => {

    const {
        openGroup,
        setOpenGroup,
        groupData,
        setGroupData,
        screenViewerNum,
        getEventDataByViewerId,
        setDataGroupViewer
    } = props;


    const selectedGroup = (item) => {
        axios.put(`${ip}/api/viewer/camera-group/${item.id}`, { viewer: screenViewerNum })
            .then((res) => {
                setGroupData(groupData.filter(group => group.id !== item.id));
                getEventDataByViewerId(screenViewerNum);
                setDataGroupViewer((prev) => {
                    const newData = {
                        ...prev,
                        [screenViewerNum]: item,
                    };
                    return newData;
                });
                setOpenGroup(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    // const selectedGroup = (item) => {
    //     axios.put(`${ip}/api/viewer/camera-group/${item.id}`, {viewer : screenViewerNum})
    //         .then((res) => {
    //
    //             getEventDataByViewerId(screenViewerNum)
    //             setOpenGroup(false);
    //         })
    //         .catch((err)=>{
    //             console.log(err)
    //         })
    // }


    return (
        <Modal
            isOpen={openGroup}
            onRequestClose={() => setOpenGroup(false)}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={0}
        >
            <div className="group_list_modal">
                <div className="group_list_modal_title">
                    <p>Guruhlar ro'yxati</p>
                </div>
                <div className="group_list_modal_body">
                    {groupData.map((item, index) => {
                        return (
                            <div className="group_list_modal_body_inner"
                                 onClick={() => selectedGroup(item)}>{index + 1}. {item.name}
                            </div>
                        )
                    })}
                </div>
            </div>
        </Modal>
    );
};

export default GroupListModal;