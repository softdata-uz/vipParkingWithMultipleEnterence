import React from 'react';
import Modal from "react-modal";
import {Form, Input, message, Select} from "antd";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {ip} from "../../../../ip";
import uzbek from "../../../../images/uzbek.svg";

import './addModalBlack.css';


import styled from "styled-components";
import {useSelector} from "react-redux";

export const SelectStyles = styled(Select)`
  .ant-select-selector {
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }

  .ant-select-selection-item {
    color: ${({theme}) => theme.text} !important;
  }
`;

export const InputStyles = styled(Input)`
  .ant-input {
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;

const AddModalBlack = (props) => {
    const {
        modalOpenBlack, setModalOpenBlack, testInitialValues, setTestInitialValues, getTestGroup
    } = props;
    const {t} = useTranslation();
    const isDarkMode = useSelector(state => state.theme.theme_data);

    const onFinish = (values) => {
        if (testInitialValues.edit) {
            axios.put(`${ip}/api/staff-group/${testInitialValues.id}`, {
                ...values,
            }, {
                headers: {'x-access-token': localStorage.getItem('vipparking-token')}
            })
                .then(response => {
                    setTestInitialValues({
                        name: '', type: '',
                    })
                    getTestGroup();
                    setModalOpenBlack(false);
                })
                .catch(err => {
                    alert.error(err?.response?.data?.msg)
                    // console.log(err?.response?.data)
                })
        } else {
            axios.post(`${ip}/api/staff-group`, {
                ...values,
            }, {
                headers: {'x-access-token': localStorage.getItem('vipparking-token')}
            })
                .then(response => {
                    getTestGroup();
                    setModalOpenBlack(false);
                })
                .catch(err => {
                    message.error(err.response.data.msg);
                    console.log(err?.response?.data)
                })
        }
    }

    const onFinishFailed = (e) => {
        // console.log(e)
    }

    return (<>
        <Modal
            isOpen={modalOpenBlack}
            onRequestClose={() => setModalOpenBlack(!modalOpenBlack)}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={0}
        >
            <div className={`database_modalBlack ${isDarkMode && 'darkModeCard'}`}>
                <div className="database_modalBlack_top">
                    <h2 className={` ${isDarkMode && 'darkModeColor'}`}>
                        {testInitialValues.edit ? t("Tahrirlash") : t("Yangi qo'shish")}
                    </h2>
                </div>

                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={testInitialValues}
                    requiredMark='optional'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <div className="database_modalBlack_form">
                        <div className="database_modalBlack_form_inner1">
                            <div className="database_modalBlack_form_inner1_input">
                                <span>Ma'lumotlar bazasi nomi</span>
                                <Form.Item
                                    label={false}
                                    name="name"
                                    rules={[{
                                        required: true, message: t("Ma'lumotlar bazasi nomini kiriting"),
                                    },]}
                                >
                                    <Input
                                        placeholder={t('Kiriting')}
                                        size={"large"}
                                        // prefix={<img src={uzbek} alt="uz"/>}
                                    />
                                </Form.Item>

                            </div>
                            <div className="database_modalBlack_form_inner1_input">
                                <span className={`${isDarkMode && 'darkModeColor'}`}>{t("Turi")}</span>
                                <Form.Item
                                    className="settings_modal_input_label"
                                    label={false}
                                    name="type"
                                    rules={[{
                                        required: true, message: t("Turini tanlang"),
                                    },]}
                                >
                                    <SelectStyles
                                        className="settings_modal_select"
                                        placeholder={t("Tanlash")}
                                        // size="large"
                                    >
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            disabled value="">
                                            <span style={{color: "#bfbfbf"}}>{t("Tanlash")}</span>
                                        </Select.Option>
                                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`} value="blacklist">{t("Qora ro'yxat")}</Select.Option>
                                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`} value="whitelist">{t("Oq ro'yxat")}</Select.Option>
                                        {/*<Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`} value="alarm">{t("Qidiruvda")}</Select.Option>*/}

                                    </SelectStyles>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div className="database_modalBlack_line"></div>

                    <div className="user_list_modal_form_buttons">
                        <div className="user_list_modal_form_buttons_one">
                            <button type="button" className="user_list_modal_form_buttons_left"
                                    onClick={() => setModalOpenBlack(false)}>
                                Bekor qilish
                            </button>
                        </div>
                        <div>
                            <button type="submit" className="user_list_modal_form_buttons_right">
                                Saqlash
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>
    </>);
};

export default AddModalBlack;