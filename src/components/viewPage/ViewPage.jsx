import React, {useEffect, useState} from 'react';
import socketIOClient from "socket.io-client";
import {ip} from "../../ip";
import logo from "../../images/softdataLogo.svg";
import sign from "../../images/signin.svg";
import notCarImg from "../../images/Car.png";
import notnum from "../../images/notnum.svg";
import "./viewPage.css";

import flagUzb from "../../images/flagUzb.png";
import {FaCheck} from "@react-icons/all-files/fa/FaCheck";
import {IoMdInformation} from "@react-icons/all-files/io/IoMdInformation";


const ViewPage = ({setLogin}) => {

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


    const tex = response[0]?.vehicle_data[0]?.vehicle_number;
    const tt = response[0]?.vehicle_data[0]?.vehicle_number;
    const a = !isNaN(tt?.substr(2, 2));

    const handlClickLogin = () => {
        setLogin(true);
    };


    return (
        <div className="view_page">

            <div  className="view_page_header">
                <div className="view_page_header_left">
                    <img className="AirLogo" src={logo}/>
                </div>
                <div onClick={handlClickLogin} className="view_page_header_right">
                    <img src={sign}/>
                    <h4>Tizimga kirish</h4>
                </div>
            </div>


            <div className="view_page_body">
                <div className="view_page_body_inner">
                    <div className="view_page_body_inner_items">
                        <div className="view_page_body_left_item">

                            {
                                response?.length === 0 ? <div></div> :
                                    response[0].staff_data?.length > 0 ?
                                        (
                                            <div className="view_page_body_left_permission">
                                                <div className="view_page_body_left_permission_round">
                                                    <FaCheck size={300} color={'#29B85D'}/>
                                                </div>
                                                <h4 className="view_page_round_title">KIRISHGA RUXSAT</h4>
                                            </div>
                                        )
                                        :
                                        (<div className="view_page_body_left_ban">
                                                <div className="view_page_body_left_permission_round">
                                                    <IoMdInformation size={350} color={'#F53C3C'}/>
                                                </div>
                                                <h4 className="view_page_round_title">
                                                    KIRISHGA RUXSAT YO'Q
                                                </h4>
                                            </div>
                                        )
                            }
                        </div>

                        <div className="view_page_body_right">
                            <div className="view_page_body_right_item">
                                <div className="view_page_body_right_img">
                                    {response?.length === 0 ? (
                                            <div className="view_page_body_right_img">
                                                <img src={notCarImg} className="view_page_notCarImg"/>
                                                <span>Camera 01</span>
                                            </div>
                                        ) :
                                        (

                                            <div className="view_page_body_left_img">
                                                <img src={vehicleImageURL} className="view_page_CarImg"/>
                                                <span>Camera 01</span>
                                            </div>
                                        )
                                    }
                                </div>

                            </div>

                            {response?.length === 0 ?
                                <div className="view_page_body_right_item">
                                    <div className="view_page_body_right_item_inner">
                                        <img className="car_number" src={notnum} alt=""/>
                                    </div>
                                </div>
                                :
                                <div className="view_page_body_right_item">
                                    <div className="view_page_body_right_item_inner">
                                        <img src={plateImageURL} className="have_car_number"/>
                                    </div>
                                </div>
                            }

                            {response?.length === 0 ?
                                <div className="view_page_body_right_item">
                                    <div className="view_page_body_right_item_inner">
                                        <img className="car_number" src={notnum} alt=""/>
                                    </div>
                                </div>
                                :
                                <div className="view_page_body_right_item">
                                    <div className="view_page_body_right_item_inner">
                                        <div className="view_page_body_number_text">
                                            <div className="view_page_number_text">
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
                                                                tt?.substr(0, 2) + " | " +
                                                                tt?.substr(2, 3) + " " +
                                                                tt?.substr(5, tt?.length)
                                                                : response[0]?.vehicle_data[0]?.vehicle_number

                                                }
                                            </div>
                                            <img src={flagUzb}/>
                                        </div>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ViewPage;













// <div className="view_page_body_inner_items">
//     {response?.length === 0 ? (
//             <div className="view_page_body_left">
//                 <div className="view_page_body_left_img">
//                     <img src={notCarImg} className="view_page_notCarImg"/>
//                     <span>Camera 01</span>
//                 </div>
//             </div>
//         ) :
//         (
//             <div className="view_page_body_left">
//                 <div className="view_page_body_left_img">
//                     <img src={vehicleImageURL} className="view_page_CarImg"/>
//                     <span>Camera 01</span>
//                 </div>
//             </div>
//         )
//
//     }
//
//
//     <div className="view_page_body_right">
//         <div className="view_page_body_right_item">
//             <div className="view_page_body_left_img_">
//                 {response?.length === 0 ? (
//                         <div className="view_page_body_left">
//                             <div className="view_page_body_left_img">
//                                 <img src={notCarImg} className="view_page_notCarImg"/>
//                                 <span>Camera 01</span>
//                             </div>
//                         </div>
//                     ) :
//                     (
//                         <div className="view_page_body_left">
//                             <div className="view_page_body_left_img">
//                                 <img src={vehicleImageURL} className="view_page_CarImg"/>
//                                 <span>Camera 01</span>
//                             </div>
//                         </div>
//                     )
//                 }
//             </div>
//
//         </div>
//
//         {response?.length === 0 ?
//             <div className="view_page_body_right_item">
//                 <div className="view_page_body_right_item_inner">
//                     <img className="car_number" src={notnum} alt=""/>
//                 </div>
//             </div>
//             :
//             <div className="view_page_body_right_item">
//                 <div className="view_page_body_right_item_inner">
//                     <img src={plateImageURL} className="have_car_number" />
//                     {/*<img className="car_number" src={notnum} alt=""/>*/}
//                 </div>
//             </div>
//         }
//
//         {response?.length === 0 ?
//             <div className="view_page_body_right_item">
//                 <div className="view_page_body_right_item_inner">
//                     <img className="car_number" src={notnum} alt=""/>
//                 </div>
//             </div>
//             :
//             <div className="view_page_body_right_item">
//                 <div className="view_page_body_right_item_inner">
//                     <div className="view_page_body_number_text">
//                         <div className="view_page_number_text">
//                             {
//                                 tex.length > 8 ?
//                                     tex?.substr(0, 2)
//                                     + " | " + tex?.substr(2, tex.length)
//                                     :
//                                     a == false ?
//                                         tex?.substr(0, 2)
//                                         + " | " + tex?.substr(2, 1) + " " +
//                                         tex?.substr(3, 3) + " " +
//                                         tex?.substr(6, tex?.length)
//                                         :
//                                         a == true ?
//                                             tt?.substr(0, 2) + " | " +
//                                             tt?.substr(2, 3) + " " +
//                                             tt?.substr(5, tt?.length)
//                                             : response[0]?.vehicle_data[0]?.vehicle_number
//
//                             }
//                         </div>
//                         <img src={flagUzb}/>
//                     </div>
//                 </div>
//             </div>
//         }
//
//
//         {/*{response?.length > 0 && response[0].staff_data.length === 0 ?*/}
//         {/*    <div className="view_page_body_right_item_alert_err">*/}
//         {/*        <div className="view_page_body_right_item_round_err">*/}
//         {/*            <AiOutlineInfo color="white" size={40}/>*/}
//         {/*        </div>*/}
//         {/*        <h4>KERAKLI MA’LUMOT TOPILMADI! KIRISH TAQIQLANADI</h4>*/}
//         {/*    </div>*/}
//         {/*    :*/}
//         {/*    <div className="view_page_body_right_item_alert">*/}
//         {/*        <div className="view_page_body_right_item_round">*/}
//         {/*            <AiOutlineInfo color="white" size={40}/>*/}
//         {/*        </div>*/}
//         {/*        <h4>KIRISHGA RUXSAT</h4>*/}
//         {/*    </div>*/}
//         {/*}*/}
{/*    </div>*/
}
{/*</div>*/
}