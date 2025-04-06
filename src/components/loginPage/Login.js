import React, {useState, useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {useDispatch} from "react-redux";
import * as Yup from 'yup';
import axios from 'axios';
import {Alert} from "antd";

import {ip} from '../../ip';

import loginImg from '../../images/photo.jpg';
import loginIcon from '../../images/password.svg';
import lickIcon from '../../images/lock.svg';
import logo from '../../images/vplogo.svg';

import {getMeAction, LoginSuccess} from "../../redux/action/action";

import './login.css';
import {IoMdArrowBack} from "@react-icons/all-files/io/IoMdArrowBack";
import {Link} from "react-router-dom";

const Login = () => {


    const dispatch = useDispatch();
    const [errorDiv, setErrorDiv] = useState(false)


    const initialValues = {
        login: '',
        password: ''
    }

    const validationSchema = Yup.object({
        login: Yup.string().required('Login kiritilmagan ...'),
        password: Yup.string().required('Parol kiritilmagan...'),
    });

    const onSubmit = (values) => {
        axios.post(`${ip}/api/sign-in`, {
            login: values.login,
            password: values.password
        })
            .then(res => {
                localStorage.setItem('vipparking-token', res?.data?.accessToken);
                dispatch(LoginSuccess(res?.data));
                // console.log(res)
            })
            .catch((error) => {
                // console.log(error)
                    if (error && error.request && error.request.status !== 200) {
                        setErrorDiv(true)
                    }
                }
            )
    }

    return (

        <div className="login_page">
            <div className="page_left">
                <div className="page_left_img">
                    <img className="left_img" src={loginImg} alt=""/>
                </div>
            </div>

            <div className="page_right">

                    <div className="page_right_back">
                        <Link to="/"><IoMdArrowBack /><span style={{marginLeft: 5}}>Orqaga</span></Link>
                    </div>
                <div className="rihgt_inner">
                    <div className="vipparking_logo">
                        <img src={logo} alt="logo"/>
                    </div>
                    <div className="titles">
                        <div className="title">VIP PARKING TIZIMIGA KIRISH</div>
                    </div>


                    <div className="login_forms">

                        {errorDiv && <div className="error_message">
                            <Alert message="Login yoki Parolda xatolik!" type="error" showIcon/>
                        </div>
                        }

                        <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                            validationSchema={validationSchema}
                        >
                            {
                                formik => {
                                    return <Form>
                                        <div className="login_page_inputs">
                                            <div className="login_inputs_wrapper">
                                                <div className="login_control">
                                                    <label className="login_label">Login</label>
                                                    <div className="login_input">
                                                        <img className="login_icon" src={loginIcon} alt=""/>
                                                        <Field
                                                            type="login"
                                                            id="login"
                                                            name="login"
                                                            placeholder="Loginni kiriting"
                                                            autoComplete="off"
                                                        />
                                                        <ErrorMessage name="login" component='div'
                                                                      style={{color: 'red'}} className="error"/>
                                                    </div>
                                                </div>
                                                <div className="login_control">
                                                    <label className="login_label">Parol</label>
                                                    <div className="parol_input">
                                                        <img className="login_icon" src={lickIcon} alt=""/>
                                                        <Field
                                                            type="password"
                                                            id="password"
                                                            name="password"
                                                            placeholder="Parolni kiriting"
                                                            autoComplete="off"
                                                        />
                                                        <ErrorMessage name="password" component='div'
                                                                      style={{color: 'red'}} className="error"/>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>


                                        <button
                                            type='submit'
                                            className="in_button"
                                        >
                                            Tizimga kirish
                                        </button>
                                    </Form>
                                }
                            }
                        </Formik>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default Login;
