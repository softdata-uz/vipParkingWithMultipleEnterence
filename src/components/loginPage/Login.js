import React, {useState} from 'react';
import {ConfigProvider, Form, Input} from 'antd';
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import axios from 'axios';
import {TbAlertCircle, TbArrowLeft, TbListCheck, TbLock, TbScan, TbUser, TbDoorEnter} from "react-icons/tb";

import {ip} from '../../ip';
import {LoginSuccess} from "../../redux/action/action";
import {useTheme} from "../../context/ThemeContext";
import {PrefsSwitch} from "../common/PrefsSwitch";
import {APP_VERSION} from "../../version";
import ParkingHero from "./hero/ParkingHero";
import HeroBackdrop from "./hero/SystemModules";

import logoDark from '../../images/logo_dark.svg';
import logoLight from '../../images/logo_light.svg';
import './login.css';

/* Forma maydonlari — "Kirish" tugmasi bilan bir xil: 48px, 16px (login.css: --login-control) */
const FORM_THEME = {token: {controlHeight: 48, fontSize: 16}};

const FEATURES = [
    {Icon: TbScan, title: "Davlat raqamini aniqlash", text: "Kameralar orqali avtomatik tanish (LPR)"},
    {Icon: TbListCheck, title: "Oq va qora ro'yxat", text: "Ruxsat berilgan va taqiqlangan avtomobillar"},
    {Icon: TbDoorEnter, title: "Bir nechta kirish", text: "Barcha kirish-chiqish nuqtalari bitta ekranda"},
];

const Login = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {theme} = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lang, setLang] = useState(localStorage.getItem('i18nextLng') || i18n.language || 'uz');

    const onChangeLanguage = (next) => {
        setLang(next);
        i18n.changeLanguage(next);
        localStorage.setItem('i18nextLng', next);
    };

    const onFinish = async (values) => {
        if (loading) return;
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${ip}/api/sign-in`, {
                login: values.login.trim(),
                password: values.password
            });
            localStorage.setItem('vipparking-token', res?.data?.accessToken);
            dispatch(LoginSuccess(res?.data));
        } catch (err) {
            // javob kelmagan bo'lsa — server bilan aloqa yo'q
            setError(err?.response
                ? t("Login yoki parol noto'g'ri")
                : t("Server bilan bog'lanib bo'lmadi"));
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <aside className="login_left theme-dark">
                <HeroBackdrop/>
                <div className="login_hero">
                    <ParkingHero/>
                </div>
                <div className="login_left_content">
                    <h2>{t("VIP avtoturargoh")}<br/>{t("kirish nazorati")}</h2>
                    <p>{t("Raqamni aniqlash, oq va qora ro'yxatlar, joriy holat va hisobotlar — bitta tizimda.")}</p>
                    <ul className="login_features">
                        {FEATURES.map(({Icon, title, text}) => (
                            <li key={title}>
                                <span className="login_features_icon"><Icon size={24} strokeWidth={1.7}/></span>
                                <div>
                                    <b>{t(title)}</b>
                                    <span>{t(text)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            <section className="login_right">
                <header className="login_right_top">
                    <img className="login_right_logo" src={theme === 'dark' ? logoDark : logoLight} alt="Soft Data"/>
                    <div className="login_right_actions">
                        <Link to="/" className="login_back" title={t("Kirish ekraniga qaytish")}>
                            <TbArrowLeft size={17}/>
                            <span>{t("Orqaga")}</span>
                        </Link>
                        <PrefsSwitch compact lang={lang} onChangeLanguage={onChangeLanguage}/>
                    </div>
                </header>

                <div className="login_right_body">
                    <div className="login_right_inner">
                        <div className="login_right_inner_text">
                            <h1>{t("Tizimga kirish")}</h1>
                            <p>{t("Davom etish uchun ma'lumotlarni kiriting")}</p>
                        </div>

                        <ConfigProvider theme={FORM_THEME}>
                            <Form
                                name="login_form"
                                className="login_right_inner_form"
                                layout="vertical"
                                requiredMark={(label, {required}) => <>{label}{required && <span className="login_req">*</span>}</>}
                                initialValues={{login: '', password: ''}}
                                onFinish={onFinish}
                                onValuesChange={() => error && setError('')}
                                autoComplete="off"
                            >
                                <Form.Item name="login" label={t("Login")}
                                           rules={[{required: true, whitespace: true, message: t("Login kiriting")}]}>
                                    <Input prefix={<TbUser size={18}/>} placeholder={t("Kiriting")}
                                           autoComplete="username" autoFocus/>
                                </Form.Item>

                                <Form.Item name="password" label={t("Parol")}
                                           rules={[{required: true, message: t("Parol kiriting")}]}>
                                    <Input.Password prefix={<TbLock size={18}/>} placeholder="••••••••"
                                                    autoComplete="current-password"/>
                                </Form.Item>

                                {error && (
                                    <div className="login_error" role="alert">
                                        <TbAlertCircle size={16}/>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button type="submit" className="login_submit" disabled={loading}>
                                    {loading && <span className="login_spinner" aria-hidden="true"/>}
                                    <span>{t("Kirish")}</span>
                                </button>
                            </Form>
                        </ConfigProvider>

                        <div className="login_right_inner_alert">
                            <TbLock size={15}/>
                            <span>{t("Parolni tiklash uchun administratorga murojaat qiling")}</span>
                        </div>
                    </div>
                </div>

                <footer className="login_right_footer">
                    <span>{t("Versiya")} {APP_VERSION}</span>
                </footer>
            </section>
        </div>
    );
};

export default Login;
