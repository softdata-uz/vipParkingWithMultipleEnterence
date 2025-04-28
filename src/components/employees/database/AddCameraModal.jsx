import React, {useState} from 'react';
import Modal from "react-modal";
import {Checkbox, Form, message} from "antd";
import {BiCctv} from "react-icons/bi";
import axios from "axios";
import {ip} from "../../../ip";

const AddCameraModal = ({getTestGroup}) => {

    // camera biriktirish
    const [openCamModal, setOpenCamModal] = useState(false);
    const [catId , setCatId] = useState('')
    const [cameraData , setCameraData] = useState([]);

    const [selectedIps, setSelectedIps] = useState([]);

    const changeCheckbox = (e, item) => {
        const { checked } = e.target;
        const ip = item.ip_address;

        if (checked) {
            setSelectedIps(prev => [...prev, ip]);
        } else {
            setSelectedIps(prev => prev.filter(address => address !== ip));
        }
    };

    const openModalCamera = (category_id) => {
        setOpenCamModal(!openCamModal);
        setCatId(category_id);
        axios.get(`${ip}/api/all/cameras`,
            {headers: {'x-access-token': localStorage.getItem('vipparking-token')}})
            .then((res)=>{
                // console.log(res)
                setCameraData(res?.data?.data)
            })
    }


    const onFinish = (values) => {

        axios.put(`${ip}/api/update-camera/staff-group/${catId}`,
            {
                cameras: selectedIps
            },
            {
                headers: { 'x-access-token': localStorage.getItem('vipparking-token') }
            }
        )
            .then((res) => {
                setOpenCamModal(false);
                getTestGroup()
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
                message.error(error.response.data.msg);
            });
    };


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Modal
                isOpen={openCamModal}
                onRequestClose={openModalCamera}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                <div className="camera_lists">
                    <div className="camera_lists_title"><h2>Kameralar ro'yxati</h2></div>

                    <Form
                        name="basic"
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div className="camera_lists_body">

                            {
                                cameraData.map((item,index)=>{
                                    // console.log(item)
                                    return(
                                        <div>
                                            <div className="sdd">
                                                <Form.Item name={item.name} value={index}>
                                                    <Checkbox
                                                        name={item.name}
                                                        defaultChecked={item.added}
                                                        onChange={(e) => changeCheckbox(e, item)}
                                                    >
                                                        <BiCctv style={{marginRight: "5px"}} />
                                                        {item.name}
                                                        <span className='sdd_ip'>{item.ip_address}</span>
                                                    </Checkbox>
                                                </Form.Item>
                                            </div>
                                            <div className="camera_lists_body_line"></div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                        <div className='camera_lists_body_button'>
                            <button type="button" className="camera_lists_body_button_cancel" onClick={()=>setOpenCamModal(!openCamModal)}>
                                Bekor qilish
                            </button>
                            <button type="submit" className="camera_lists_body_button_submit">
                                Saqlash
                            </button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default AddCameraModal;