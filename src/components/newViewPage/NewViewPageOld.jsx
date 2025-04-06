// import React, {useEffect, useState} from 'react';
// import logo from '../../images/new/Logo (1).png'
// import enterIcon from '../../images/new/log-in-02.png'
// import emptyIcon from '../../images/new/Group.png';
// import userIcon from '../../images/new/user-03.png';
// import userImg from '../../images/new/Content.png';
// import carFlag from '../../images/new/Group 55888 (4).png';
// import carImg from '../../images/new/11012023_162101(712)_full_image 1.png';
// import notCarImg from "../../images/Car.png";
// import ozimImg from '../../images/ozim.png';
// import moment from "moment";
// import socketIOClient from "socket.io-client";
// import './newViewPage.css';
// import {ip} from "../../ip";
// import {Link} from "react-router-dom";
//
//
// const NewViewPage = ({setLogin}) => {
//
//     const [time, setTime] = useState(new Date());
//
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setTime(new Date());
//         }, 1000);
//
//         return () => clearInterval(interval);
//     }, []);
//
//     const formatDate = (date) => {
//         const day = String(date.getDate()).padStart(2, "0");
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         const year = date.getFullYear();
//         const hours = String(date.getHours()).padStart(2, "0");
//         const minutes = String(date.getMinutes()).padStart(2, "0");
//         return `${day}.${month}.${year}, ${hours}:${minutes}`;
//     };
//
//
//     const handlClickLogin = () => {
//         setLogin(true);
//     };
//
//
//     const [dataLeft, setDataLeft] = useState([]);
//     const [dataRight, setDataRight] = useState([]);
//
//     useEffect(() => {
//         const socket = socketIOClient(ip);
//         socket.on("left", data => {
//             setDataLeft(data);
//             console.log(data)
//         });
//     }, []);
//
//     useEffect(() => {
//         const socket = socketIOClient(ip);
//         socket.on("right", data => {
//             setDataRight(data);
//             console.log(data)
//         });
//     }, []);
//
//     const blobVehicleImage = new Blob([
//         dataLeft?.length > 0 &&
//         dataLeft[0]?.event_data?.vehicle_image_data,
//     ]);
//     const vehicleImageURL = URL.createObjectURL(blobVehicleImage);
//
//
//     const blobVehicleImageRight = new Blob([
//         dataRight?.length > 0 &&
//         dataRight[0]?.event_data?.vehicle_image_data,
//     ]);
//     const vehicleImageURLRight = URL.createObjectURL(blobVehicleImageRight);
//
//
//     const blobFaceImageLeft = new Blob([
//         dataLeft?.length > 0 &&
//         dataLeft[0]?.event_data?.face_image_data,
//     ]);
//     const faceImageURLLeft = URL.createObjectURL(blobFaceImageLeft);
//
//     const blobFaceImageRight = new Blob([
//         dataRight?.length > 0 &&
//         dataRight[0]?.event_data?.face_image_data,
//     ]);
//     const faceImageURLRight = URL.createObjectURL(blobFaceImageRight);
//
//     return (
//         <div className="newViewPage">
//             <div className="newViewPage_header">
//                 <div className="newViewPage_header_left">
//                     <img src={logo}/>
//                 </div>
//                 <div className="newViewPage_header_right">
//                     <div className="newViewPage_header_right_inner">
//                         <h2>{formatDate(time)}</h2>
//                     </div>
//
//                     <div className="newViewPage_header_right_inner">
//                         <Link to="/login">
//                             <img src={enterIcon}/> <span>Tizimga kirish</span>
//                         </Link>
//                     </div>
//
//                 </div>
//             </div>
//             <div className="newViewPage_body">
//
//                 <div className="newViewPage_body_inner">
//                     {
//                         dataLeft.length == 0 ?
//                             <div className="newViewPage_body_inner_empty">
//                                 <div className="newViewPage_body_inner_empty_inner">
//                                     <img src={emptyIcon}/>
//                                     <p>Ma’lumot topilmadi</p>
//                                 </div>
//                             </div>
//                             :
//                             (dataLeft[0]?.device_type === "terminal" ?
//                                     <div className="newViewPage_body_inner_user_data">
//                                         <div className="newViewPage_body_inner_user_data_top">
//                                             <div className="newViewPage_body_inner_user_data_top_left">
//                                                 <img src={faceImageURLLeft}/>
//                                             </div>
//                                             <div className="newViewPage_body_inner_user_data_top_right">
//                                                 <div className="newViewPage_body_inner_user_data_top_right_info">
//                                                     <div className="newViewPage_body_inner_data_information_left_inner">
//                                                         <span>F.I.SH</span>
//                                                         <p>{dataLeft[0]?.staff_data?.length === 0 ? "-" : dataLeft[0]?.staff_data[0]?.fullname}</p>
//                                                     </div>
//                                                     <div className="newViewPage_body_inner_data_information_left_inner">
//                                                         <span>Boshqarma</span>
//                                                         <p>{dataLeft[0]?.staff_data?.length === 0 ? "-" : dataLeft[0]?.staff_data[0]?.position}</p>
//                                                     </div>
//                                                     <div className="newViewPage_body_inner_data_information_left_inner">
//                                                         <span>Kirish vaqti</span>
//                                                         <p>{dataLeft[0]?.event_data?.the_date ?
//                                                             moment(dataLeft[0]?.event_data?.the_date).format('DD.MM.YYYY, HH:mm:ss')
//                                                             : "-"}
//                                                         </p>
//                                                     </div>
//                                                     <div className="newViewPage_body_inner_data_information_left_inner">
//                                                         <span>Avtomobilning davlat raqami</span>
//                                                         <p>{dataLeft[0]?.staff_data?.length === 0 ? "XX X XXX XX" : dataLeft[0]?.staff_data[0]?.vehicle_number} <img src={carFlag}/></p>
//                                                     </div>
//
//                                                 </div>
//                                                 <div className="newViewPage_body_inner_user_data_top_right_img">
//                                                     {dataLeft[0]?.staff_data?.length === 0 ?
//                                                         <img src={userIcon} className=""/>
//                                                         :
//                                                         <img src={`${ip}/${dataLeft[0]?.staff_data[0]?.staff_image}`} className="full_img_user"/>
//                                                     }
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="newViewPage_body_inner_user_data_bottom">
//                                             {dataLeft[0]?.event_data?.access == false ?
//                                                 <div className="newViewPage_body_inner_user_data_bottom_alert noActiveS">Kirish taqiqlanadi</div>
//                                                 :
//                                                 <div className="newViewPage_body_inner_user_data_bottom_alert activeS">Kirishga ruxsat</div>
//                                             }
//                                         </div>
//                                     </div>
//                                     :
//                                     <div className="newViewPage_body_inner_data">
//                                         <div className="newViewPage_body_inner_data_information">
//                                             <div className="newViewPage_body_inner_data_information_left">
//                                                 <div className="newViewPage_body_inner_data_information_left_inner">
//                                                     <span>F.I.SH</span>
//                                                     <p>{dataLeft[0]?.staff_data?.length === 0 ? "-" : dataLeft[0]?.staff_data[0]?.fullname}</p>
//                                                 </div>
//                                                 <div className="newViewPage_body_inner_data_information_left_inner">
//                                                     <span>Boshqarma</span>
//                                                     <p>{dataLeft[0]?.staff_data?.length === 0 ? "-" : dataLeft[0]?.staff_data[0]?.position}</p>
//                                                 </div>
//                                                 <div className="newViewPage_body_inner_data_information_left_inner">
//                                                     <span>Kirish vaqti</span>
//                                                     <p>{dataLeft[0]?.event_data?.the_date ?
//                                                         moment(dataLeft[0]?.event_data?.the_date).format('DD.MM.YYYY, HH:mm:ss')
//                                                         : "-"}
//                                                     </p>
//                                                 </div>
//                                                 <div className="newViewPage_body_inner_data_information_left_inner">
//                                                     <span>Avtomobilning davlat raqami</span>
//                                                     <p>{dataLeft[0]?.event_data?.vehicle_number ?
//                                                         dataLeft[0]?.event_data?.vehicle_number : ""} <img src={carFlag}/></p>
//                                                 </div>
//                                             </div>
//                                             <div className="newViewPage_body_inner_data_information_right">
//                                                 {dataLeft[0]?.staff_data?.length === 0 ?
//                                                     <img src={userIcon}/>
//                                                     :
//                                                     <img src={`${ip}/${dataLeft[0]?.staff_data[0]?.staff_image}`} className="full_img"/>
//                                                 }
//                                             </div>
//                                         </div>
//
//                                         { dataLeft[0]?.staff_data?.length === 0 ?
//                                             <div className="newViewPage_body_inner_data_alert noActiveS">Kirish taqiqlanadi</div>
//                                             :
//                                             <div className="newViewPage_body_inner_data_alert activeS">Kirishga ruxsat</div>
//                                         }
//                                         <div className="newViewPage_body_inner_data_carImg">
//                                             {dataLeft[0]?.staff_data?.length === 0 ?
//                                                 (dataLeft[0]?.event_data?.vehicle_image_data ?
//                                                     <img src={vehicleImageURL} className="full_img_car"/>
//                                                     :
//                                                     <img src={notCarImg} alt=""/>)
//                                                 :
//                                                 (dataLeft[0]?.staff_data?.length === 0 ?
//                                                         <img src={userIcon}/>
//                                                         :
//                                                         <img src={`${ip}/${dataLeft[0]?.staff_data[0]?.vehicle_image}`} className="full_img_car"/>
//                                                 )
//                                             }
//                                         </div>
//                                     </div>
//                             )
//                     }
//                 </div>
//
//
//                 <div className="newViewPage_body_inner">
//                     {
//                         dataRight.length == 0 ?
//                             <div className="newViewPage_body_inner_empty">
//                                 <div className="newViewPage_body_inner_empty_inner">
//                                     <img src={emptyIcon}/>
//                                     <p>Ma’lumot topilmadi</p>
//                                 </div>
//                             </div>
//                             :
//                             (dataRight[0]?.device_type === "terminal" ?
//                                     <div className="newViewPage_body_inner_user_data">
//                                         <div className="newViewPage_body_inner_user_data_top">
//                                             <div className="newViewPage_body_inner_user_data_top_left">
//                                                 <img src={faceImageURLRight}/>
//                                             </div>
//                                             <div className="newViewPage_body_inner_user_data_top_right">
//                                                 <div className="newViewPage_body_inner_user_data_top_right_info">
//                                                     <div className="newViewPage_body_inner_data_information_left_inner">
//                                                         <span>F.I.SH</span>
//                                                         <p>{dataRight[0]?.staff_data?.length === 0 ? "-" : dataRight[0]?.staff_data[0]?.fullname}</p>
//                                                     </div>
//                                                     <div className="newViewPage_body_inner_data_information_left_inner">
//                                                         <span>Boshqarma</span>
//                                                         <p>{dataRight[0]?.staff_data?.length === 0 ? "-" : dataRight[0]?.staff_data[0]?.position}</p>
//                                                     </div>
//                                                     <div className="newViewPage_body_inner_data_information_left_inner">
//                                                         <span>Kirish vaqti</span>
//                                                         <p>{dataRight[0]?.event_data?.the_date ?
//                                                             moment(dataRight[0]?.event_data?.the_date).format('DD.MM.YYYY, HH:mm:ss')
//                                                             : "-"}
//                                                         </p>
//                                                     </div>
//                                                     <div className="newViewPage_body_inner_data_information_left_inner">
//                                                         <span>Avtomobilning davlat raqami</span>
//                                                         <p>{dataRight[0]?.staff_data?.length === 0 ? "XX X XXX XX" : dataRight[0]?.staff_data[0]?.vehicle_number} <img src={carFlag}/></p>
//                                                     </div>
//
//                                                 </div>
//                                                 <div className="newViewPage_body_inner_user_data_top_right_img">
//                                                     {dataRight[0]?.staff_data?.length === 0 ?
//                                                         <img src={userIcon} className=""/>
//                                                         :
//                                                         <img src={`${ip}/${dataRight[0]?.staff_data[0]?.staff_image}`} className="full_img_user"/>
//                                                     }
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="newViewPage_body_inner_user_data_bottom">
//                                             {dataRight[0]?.event_data?.access == false ?
//                                                 <div className="newViewPage_body_inner_user_data_bottom_alert noActiveS">Kirish taqiqlanadi</div>
//                                                 :
//                                                 <div className="newViewPage_body_inner_user_data_bottom_alert activeS">Kirishga ruxsat</div>
//                                             }
//                                         </div>
//                                     </div>
//                                     :
//                                     <div className="newViewPage_body_inner_data">
//                                         <div className="newViewPage_body_inner_data_information">
//                                             <div className="newViewPage_body_inner_data_information_left">
//                                                 <div className="newViewPage_body_inner_data_information_left_inner">
//                                                     <span>F.I.SH</span>
//                                                     <p>{dataRight[0]?.staff_data?.length === 0 ? "-" : dataRight[0]?.staff_data[0]?.fullname}</p>
//                                                 </div>
//                                                 <div className="newViewPage_body_inner_data_information_left_inner">
//                                                     <span>Boshqarma</span>
//                                                     <p>{dataRight[0]?.staff_data?.length === 0 ? "-" : dataRight[0]?.staff_data[0]?.position}</p>
//                                                 </div>
//                                                 <div className="newViewPage_body_inner_data_information_left_inner">
//                                                     <span>Kirish vaqti</span>
//                                                     <p>{dataRight[0]?.event_data?.the_date ?
//                                                         moment(dataRight[0]?.event_data?.the_date).format('DD.MM.YYYY, HH:mm:ss')
//                                                         : "-"}
//                                                     </p>
//                                                 </div>
//                                                 <div className="newViewPage_body_inner_data_information_left_inner">
//                                                     <span>Avtomobilning davlat raqami</span>
//                                                     <p>{dataRight[0]?.event_data?.vehicle_number ?
//                                                         dataRight[0]?.event_data?.vehicle_number : ""} <img src={carFlag}/>
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                             <div className="newViewPage_body_inner_data_information_right">
//                                                 {dataRight[0]?.staff_data?.length === 0 ?
//                                                     <img src={userIcon}/>
//                                                     :
//                                                     <img src={`${ip}/${dataRight[0]?.staff_data[0]?.staff_image}`}
//                                                          className="full_img"/>
//                                                 }
//                                             </div>
//                                         </div>
//
//                                         {dataRight[0]?.staff_data?.length === 0 ?
//                                             <div className="newViewPage_body_inner_data_alert noActiveS">Kirish
//                                                 taqiqlanadi</div>
//                                             :
//                                             <div className="newViewPage_body_inner_data_alert activeS">Kirishga ruxsat</div>
//                                         }
//                                         <div className="newViewPage_body_inner_data_carImg">
//                                             {dataRight[0]?.staff_data?.length == 0 ?
//                                                 (dataRight[0]?.event_data?.vehicle_image_data ?
//                                                     <img src={vehicleImageURLRight} className="full_img_car"/>
//                                                     :
//                                                     <img src={notCarImg} alt=""/>)
//                                                 :
//                                                 (dataRight[0]?.staff_data?.length === 0 ?
//                                                         <img src={userIcon}/>
//                                                         :
//                                                         <img src={`${ip}/${dataRight[0]?.staff_data[0]?.vehicle_image}`}
//                                                              className="full_img_car"/>
//                                                 )
//                                             }
//                                         </div>
//                                     </div>
//                             )
//                     }
//                 </div>
//             </div>
//
//         </div>
//     );
// };
//
// export default NewViewPage;