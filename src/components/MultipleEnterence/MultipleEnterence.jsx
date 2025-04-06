import React, {useEffect, useState} from 'react';

import './multipleEnterence.css';
import logo from "../../images/softdataLogo.svg";
import {Link} from "react-router-dom";
import enterIcon from "../../images/new/log-in-02.png";
import carFlag from "../../images/new/Group 55888 (4).png";
import carImg from '../../images/new/11012023_162101(712)_full_image 1.png';

const MultipleEnterence = () => {

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}.${month}.${year}, ${hours}:${minutes}`;
    };

    return (
        <div className="multipleEnterence">
            <div className="multipleEnterence_header">
                <div className="multipleEnterence_header_left">
                    <img src={logo}/>
                </div>
                <div className="multipleEnterence_header_right">
                    <div className="multipleEnterence_header_right_inner">
                        <h2>{formatDate(time)}</h2>
                    </div>
                    <div className="multipleEnterence_header_right_inner">
                        <Link to="/login">
                            <img src={enterIcon}/> <span>Tizimga kirish</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="multipleEnterence_body">
                <div className="multipleEnterence_body_card">
                    <div className="multipleEnterence_body_card_information">
                        <div className="multipleEnterence_body_card_information_corridor corridor_green"><p>1-yo‘lak</p></div>
                        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>
                        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>
                        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>
                        <div className="multipleEnterence_body_card_information_inner">
                            <span>Avtomobilning davlat raqami</span>
                            <p>XX X XXX XX <img src={carFlag}/></p>
                        </div>
                        <div className="multipleEnterence_body_card_information_alert activeS">Kirishga ruxsat</div>
                    </div>
                    <div className="multipleEnterence_body_card_img">
                        <img src={carImg} className="car_img_full"/>
                    </div>
                </div>
                <div className="multipleEnterence_body_card">
                    <div className="multipleEnterence_body_card_information">
                        <div className="multipleEnterence_body_card_information_corridor corridor_warning"><p>1-yo‘lak</p></div>
                        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>
                        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>
                        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>
                        <div className="multipleEnterence_body_card_information_inner">
                            <span>Avtomobilning davlat raqami</span>
                            <p>XX X XXX XX <img src={carFlag}/></p>
                        </div>
                        <div className="multipleEnterence_body_card_information_alert activeS">Kirishga ruxsat</div>
                    </div>
                    <div className="multipleEnterence_body_card_img">
                        <img src={carImg} className="car_img_full"/>
                    </div>
                </div>
                <div className="multipleEnterence_body_card">
                    <div className="multipleEnterence_body_card_information">
                        <div className="multipleEnterence_body_card_information_corridor corridor_blue"><p>1-yo‘lak</p></div>
                        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>
                        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>
                        <div className="multipleEnterence_body_card_information_inner"><span>Salom</span><p>Salom</p></div>
                        <div className="multipleEnterence_body_card_information_inner">
                            <span>Avtomobilning davlat raqami</span>
                            <p>XX X XXX XX <img src={carFlag}/></p>
                        </div>
                        <div className="multipleEnterence_body_card_information_alert activeS">Kirishga ruxsat</div>
                    </div>
                    <div className="multipleEnterence_body_card_img">
                        <img src={carImg} className="car_img_full"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultipleEnterence;