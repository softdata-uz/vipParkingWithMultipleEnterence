import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import axios from "axios";
import user from "../../images/Rectangle 698.png";
import notInformation from "../../images/Doctor_Search.png";
import socketIOClient from "socket.io-client";
import {useNavigate} from "react-router-dom";
import "./dashboard.css";
import { ip } from "../../ip";
import notCarImg from "../../images/Car.png";
import flagUzb from "../../images/flagUzb.png";
import notnum from "../../images/notnum.svg"


const Dashboard = (props) => {

    // const navigate = useNavigate();
    // console.log(navigate)

    const [response, setResponse] = useState([]);

    useEffect(() => {
        const socket = socketIOClient(ip);
        socket.on("enter", (data) => {
            setResponse(data);
        });
    }, []);

    const blobVehicleImage = new Blob([
        response?.length > 0 &&
        response[0].vehicle_data.length > 0 &&
        response[0]?.vehicle_data[0]?.vehicle_image_data,
    ]);
    const vehicleImageURL = URL.createObjectURL(blobVehicleImage);

    const blobPlateImage = new Blob([
        response?.length > 0 &&
        response[0].vehicle_data.length > 0 &&
        response[0]?.vehicle_data[0]?.plate_image_data,
    ]);
    const plateImageURL = URL.createObjectURL(blobPlateImage);

    const confirmOpenDoor = () => {
        axios
            .post(
                `${ip}/api/confirm-open`,
                {
                    vehicle_number: response[0]?.vehicle_data[0]?.vehicle_number,
                    vehicle_image: response[0]?.vehicle_data[0]?.vehicle_image,
                    plate_image: response[0]?.vehicle_data[0]?.plate_image,
                    full_image: response[0]?.vehicle_data[0]?.full_image,
                    the_date: response[0]?.vehicle_data[0]?.the_date,
                    ip_address: response[0]?.vehicle_data[0]?.ip_address,
                },
                {
                    headers: {
                        "x-access-token": localStorage.getItem("vipparking-token"),
                    },
                }
            )
            .then((res) => setResponse([]))
            .catch((error) => {});
    };

    const tex = response[0]?.vehicle_data[0]?.vehicle_number;
    const tt = response[0]?.vehicle_data[0]?.vehicle_number;
    const a = !isNaN(tt?.substr(2,2));

    // console.log(tt.substr(2,2));
    // console.log(tt.substr(0,2));
    // console.log(tt.substr(2,3));
    // console.log(tt.substr(5,3));
    // console.log();

    return (
            <div className="dashboard">
                <div className="dashboard_top">
                    <h2>XODIM HAQIDA MA’LUMOT</h2>
            
                </div>
                <div className="dashboard_body">
                    {response?.length > 0 && response[0].staff_data.length === 0 ? (
                        // malumot topilmasa leftni orniga chiqadi
                        <div className="dashboard_body_left_notInformation">
                            <div className="dashboard_body_left_notInformation_inner">
                                <div className="dashboard_body_left_notInformation_img">
                                    <img src={notInformation} />
                                </div>
                                <div className="dashboard_body_left_notInformation_text">
                                    <h2>Ma’lumot topilmadi!</h2>
                                </div>
                                <div className="dashboard_body_left_notInformation_button">
                                    <button
                                        onClick={confirmOpenDoor}
                                        type="button"
                                        className="oneButton"
                                    >
                                        Ruxsat berish
                                    </button>
                                    <button
                                        onclick={() => setResponse([])}
                                        type="button"
                                        className="twoButton"
                                    >
                                        Bekor qilish
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="dashboard_body_left">
                            {response?.length > 0 &&
                            response[0].staff_data.length &&
                            response[0]?.staff_data[0]?.image ? (
                                <img
                                    src={`${ip}/staff/${
                                        response?.length > 0 &&
                                        response[0].staff_data.length > 0 &&
                                        response[0]?.staff_data[0]?.image
                                    }`}
                                    className="user"
                                />
                            ) : (
                                <img src={user} className="user" />
                            )}
                            <div className="dashboard_body_right_inner_one">
                                <table>
                                    <tr>
                                        <td>Familiya</td>
                                        <td>
                                            {response?.length > 0 &&
                                            response[0].staff_data.length > 0 &&
                                            response[0]?.staff_data[0]?.fullname}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Ism</td>
                                        <td>
                                            {response?.length > 0 &&
                                            response[0].staff_data.length > 0 &&
                                            response[0]?.staff_data[0]?.fullname}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Otasining ismi</td>
                                        <td>
                                            {response?.length > 0 &&
                                            response[0].staff_data.length > 0 &&
                                            response[0]?.staff_data[0]?.fullname}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Boshqarma</td>
                                        <td>
                                            {response?.length > 0 &&
                                            response[0].staff_data.length > 0 &&
                                            response[0]?.staff_data[0]?.position}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Telefon raqami</td>
                                        <td>
                                            {response?.length > 0 &&
                                            response[0].staff_data.length > 0 &&
                                            response[0]?.staff_data[0]?.tel}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="dashboard_body_right">
                        {response?.length === 0 ? (
                            <div className="dashboard_body_right_inner_two">
                                <div className="dashboard_body_right_inner_two_top">
                                    <img src={notCarImg} className="notCarImg" />
                                    <span>Camera 01</span>
                                </div>
                                <div className="dashboard_body_right_inner_two_number">
                                    <img src={notnum} alt=""/>
                                </div>
                                <div className="dashboard_body_right_inner_two_number">
                                    <img src={notnum} alt=""/>
                                </div>
                            </div>
                        ) : (
                            <div className="dashboard_body_right_inner_two">
                                <div className="dashboard_body_right_inner_two_top">
                                    <img src={vehicleImageURL} className="CarImg" />
                                    <span>Camera 01</span>
                                </div>
                                <div className="dashboard_body_right_inner_two_number">
                                    <img src={plateImageURL} />
                                </div>
                                <div className="dashboard_body_right_inner_two_number_text">
                                    <div className="number_text">
                                        {
                                            tex.length > 8 ?
                                                tex?.substr(0, 2)
                                                + " | " + tex?.substr(2, tex.length)
                                                :
                                            a == false ?
                                            tex?.substr(0, 2)
                                            + " | " + tex?.substr(2, 1) + " " +
                                            tex?.substr(3, 3) + " " +
                                            tex?.substr(6, tex?.length)
                                            :
                                                a == true ?
                                                tt?.substr(0,2) + " | " +
                                                tt?.substr(2,3) + " " +
                                                tt?.substr(5,tt?.length)
                                            : response[0]?.vehicle_data[0]?.vehicle_number

                                        }

                                    </div>
                                    <img src={flagUzb} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    );
};

export default Dashboard;