import React from 'react';
import Modal from "react-modal";
import { DatePicker, Form, Radio } from "antd";
import moment from "moment";

import './filterModal.css';


Modal.setAppElement("#root");

const FilterModal = (props) => {

    const {
        isOpenFilter,
        setIsOpenFilter,
        filterInitialValue,
        setFilterInitialValue,
        getReportData,
    } = props


    const onChangeDateFrom = (e, a) => {
        setFilterInitialValue({...filterInitialValue, fromDate: a});
    };

    const onChangeDateTo = (e, a) => {
        setFilterInitialValue({...filterInitialValue, toDate: a});
    };

    const onChange = (e, a) => {
        setFilterInitialValue({
            ...filterInitialValue,
            type: e.target.value,
        });
    };


    const onFinish = (values) => {
        getReportData(filterInitialValue);
        setIsOpenFilter(!isOpenFilter)
    }

    const onFinishFailed = (error) => {
        console.log(error)
    }

    const cancel = () => {
        setIsOpenFilter(!isOpenFilter);
    };

    return (
        <div>
            <Modal
                isOpen={isOpenFilter}
                onRequestClose={() => setIsOpenFilter(!isOpenFilter)}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={filterInitialValue}
                    requiredMark='optional'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <div className="filter_report_modal">
                        <div className="filter_report_modal_tile">
                            Saralash
                        </div>

                        <div className="filter_report_modal_inputs">
                            <div className="filter_report_modal_inputs_line">

                                <div className="filter_report_input_lebel_groups">
                                    <DatePicker
                                        placeholder={`${moment(new Date()).format(
                                            "YYYY.DD.MM, 00:00:00"
                                        )}`}
                                        onChange={onChangeDateFrom}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px', marginBottom: '15px'}}
                                        showTime
                                        value={!filterInitialValue.fromDate ? "" : moment(filterInitialValue.fromDate)}
                                    />
                                    <DatePicker
                                        placeholder={`${moment(new Date()).format(
                                            "YYYY.DD.MM, 23:59:59"
                                        )}`}
                                        onChange={onChangeDateTo}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                        showTime
                                        value={!filterInitialValue.toDate ? "" : moment(filterInitialValue.toDate)}
                                    />
                                </div>

                                <Radio.Group onChange={onChange} value={filterInitialValue.type}>
                                    <Radio value={"all"}>Barchasi</Radio>
                                    <Radio value={"staff"}>Xodim</Radio>
                                    <Radio value={"stranger"}>Begona shaxs</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                        <div className="add_camera_buttons">
                            <button type="button" onClick={cancel}
                                    className="add_camera_buttons_cancle">Bekor qilish</button>
                            <button type="submit" className="add_camera_buttons_save">Saqlash</button>
                        </div>
                    </div>
                </Form>
            </Modal>
        </div>
    )
        ;
};

export default FilterModal;