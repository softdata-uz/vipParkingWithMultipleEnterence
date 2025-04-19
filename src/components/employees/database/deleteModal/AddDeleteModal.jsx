import React from 'react';
import Modal from "react-modal";
import axios from "axios";
import {ip} from "../../../../ip";
import {useTranslation} from "react-i18next";
import '../database.css';

const AddDeleteModal = (props) => {

    const {t} = useTranslation();

    const {
        getListGroup,
        setDeleteModal,
        checkedList,
        setCheckedList,
        deleteModal,
        setFileState
    } = props;

    const deleteAdd = () => {
        axios.delete(`${ip}/api/delete/vehicle_list`,
            {
                data: checkedList,
                headers: {'x-access-token': localStorage.getItem('vipparking-token')}
            }
        )
            .then((res) => {
                setCheckedList([]);
                getListGroup();
                setDeleteModal(false);
                setFileState({
                    initial: true,
                    uploaded: false,
                    requested: false,
                    check: false
                });
            })
    }
    const cencel = () => {
        setDeleteModal(false);
        setCheckedList([]);
    }

    return (
        <div>
            <Modal
                isOpen={deleteModal}
                onRequestClose={cencel}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                <div className="delete_modal">
                    <h3>{t("Haqiqatdan ham o'chirasizmi ?")}</h3>
                    <div className="delete_modal_button">
                        <div className="">
                            <button type="button" className="delete_modal_button_left"
                                    onClick={cencel}>{t("Yo'q")}
                            </button>
                        </div>
                        <div>
                            <button type="button" className="delete_modal_button_right"
                                    onClick={() => deleteAdd()}>{t("Ha")}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AddDeleteModal;