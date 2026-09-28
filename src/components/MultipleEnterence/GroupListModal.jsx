import React from "react";
import Modal from "react-modal";
import axios from "axios";
import { ip } from "../../ip";

import "./groupListModal.css";

const GroupListModal = ({
    openGroup,
    setOpenGroup,
    groupData,
    setGroupData,
    screenViewerNum,
    getEventDataByViewerId,
    setDataGroupViewer,
}) => {

    const close = () => setOpenGroup(false);

    const assignGroup = (group) => {
        axios
            .put(`${ip}/api/viewer/camera-group/${group.id}`, {
                viewer: screenViewerNum,
            })
            .then(() => {
                setGroupData((prev) => prev.filter((item) => item.id !== group.id));
                setDataGroupViewer((prev) => ({
                    ...prev,
                    [screenViewerNum]: { ...group, viewer: screenViewerNum },
                }));
                getEventDataByViewerId(screenViewerNum);
                close();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Modal
            isOpen={openGroup}
            onRequestClose={close}
            contentLabel="Group list"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={0}
        >
            <div className="group_list_modal">
                <div className="group_list_modal_title">
                    <p>Guruhni tanlang</p>
                </div>
                <div className="group_list_modal_body">
                    {groupData?.length ? (
                        groupData.map((item) => (
                            <div
                                className="group_list_modal_body_inner"
                                key={item.id}
                                onClick={() => assignGroup(item)}
                            >
                                {item.name}
                            </div>
                        ))
                    ) : (
                        <div className="group_list_modal_body_inner">Guruh topilmadi</div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default GroupListModal;
