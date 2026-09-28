import React, {useEffect, useState} from 'react';
import Modal from "react-modal";
import {ConfigProvider} from "antd";
import {useTranslation} from "react-i18next";
import {ImageUploadIcon, XCloseIcon} from "../../design-system/icons";
import '../../styles/modal.css';

/* Modal ichidagi antd maydonlari design system balandligida (40px) */
const FORM_THEME = {token: {controlHeight: 40, fontSize: 14}};

/**
 * "Green" design system anatomiyasidagi modal: sarlavha (ikonka + nom + izoh + yopish),
 * skroll bo'ladigan tana va pastki tugmalar qatori.
 * Forma tugmalari footer'da bo'lgani uchun submit tugmasi `form="<Form name>"` bilan bog'lanadi.
 */
export const ModalShell = ({open, onClose, icon, tone = 'brand', title, subtitle, footer, size = 'md', children}) => {
    const {t} = useTranslation();
    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            contentLabel={typeof title === 'string' ? title : ''}
            className={{base: `dsm dsm--${size}`, afterOpen: 'dsm--open', beforeClose: 'dsm--closing'}}
            overlayClassName={{base: 'dsm-overlay', afterOpen: 'dsm-overlay--open', beforeClose: 'dsm-overlay--closing'}}
            closeTimeoutMS={180}
            ariaHideApp={false}
        >
            <header className="dsm__header">
                {icon ? <span className={`dsm__icon dsm__icon--${tone}`}>{icon}</span> : null}
                <div className="dsm__heading">
                    {title ? <h2 className="dsm__title">{title}</h2> : null}
                    {subtitle ? <p className="dsm__subtitle">{subtitle}</p> : null}
                </div>
                <button type="button" className="dsm__close" onClick={onClose} aria-label={t("Yopish")}>
                    <XCloseIcon size={20}/>
                </button>
            </header>

            {children ? (
                <div className="dsm__body">
                    <ConfigProvider theme={FORM_THEME}>{children}</ConfigProvider>
                </div>
            ) : null}

            {footer ? <footer className="dsm__footer">{footer}</footer> : null}
        </Modal>
    );
};

/** Forma maydoni: yorliq + antd Form.Item */
export const ModalField = ({label, children, full = false}) => (
    <div className={`dsm-field${full ? ' dsm-field--full' : ''}`}>
        <span className="dsm-label">{label}</span>
        {children}
    </div>
);

/** Rasm yuklash qatori: yumaloq-kvadrat ko'rinish + tugma + izoh.
    Surat serverda topilmasa buzilgan rasm belgisi o'rniga bo'sh holat ko'rinadi. */
export const AvatarUpload = ({src, inputId, onChange}) => {
    const {t} = useTranslation();
    const [broken, setBroken] = useState(false);
    useEffect(() => setBroken(false), [src]);
    return (
        <div className="dsm-avatar">
            <span className="dsm-avatar__preview">
                {src && !broken
                    ? <img src={src} alt="" onError={() => setBroken(true)}/>
                    : <ImageUploadIcon size={26}/>}
            </span>
            <div className="dsm-avatar__body">
                <label htmlFor={inputId} className="dsm-btn dsm-btn--secondary dsm-btn--sm">
                    <ImageUploadIcon size={18}/>
                    {t("Rasm yuklash")}
                    <input id={inputId} name="image" type="file" accept="image/*" onChange={onChange}
                           style={{display: 'none'}}/>
                </label>
                <span className="dsm-avatar__hint">{t("Maksimal fayl hajmi 1 Mb 500х500 o'lchamda")}</span>
            </div>
        </div>
    );
};

/** O'chirishni tasdiqlash oynasi */
export const ConfirmDeleteModal = ({open, onClose, onConfirm, name, icon}) => {
    const {t} = useTranslation();
    return (
        <ModalShell
            open={open}
            onClose={onClose}
            size="sm"
            tone="danger"
            icon={icon}
            title={t("O'chirishni tasdiqlang")}
            subtitle={
                <>
                    {name ? <b className="dsm__name">{name}</b> : null}
                    {t("delete_confirm_text")}
                </>
            }
            footer={
                <>
                    <button type="button" className="dsm-btn dsm-btn--secondary" onClick={onClose}>
                        {t("Bekor qilish")}
                    </button>
                    <button type="button" className="dsm-btn dsm-btn--destructive" onClick={onConfirm}>
                        {t("O'chirish")}
                    </button>
                </>
            }
        />
    );
};
