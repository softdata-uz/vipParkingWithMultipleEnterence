import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BrowserRouter, Link, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {TbCarGarage, TbFileAnalytics, TbSettings, TbUsersGroup} from "react-icons/tb";

import {ip} from "../ip";
import logoDark from "../images/logo_dark.svg";
import logoLight from "../images/logo_light.svg";
import RootPage from "../pages/root";
import {storage} from "../services";
import {LoginFailure} from "../redux/action/action";
import {useTheme} from "../context/ThemeContext";
import {PrefsSwitch} from "./common/PrefsSwitch";
import {ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon, LogOutIcon} from "../design-system/icons";
import {getRoleBadgeClass, getRoleLabel} from "../utils/roleLabel";
import ProfileEditModal from "./common/ProfileEditModal";

import './shell.css';
import '../styles/role-badge.css';
import './layout.css';

/* Header — Monitoring loyihasidagi Monitoring.jsx (TopNav + TopBar + profil oynasi) bilan 1:1.
   Farqi faqat menyu bandlarida: VIP bo'limlari. */

const NAV = [
    {to: '/employees', label: 'Xodimlar', Icon: TbUsersGroup},
    {to: '/status', label: 'Joriy holat', Icon: TbCarGarage},
    {to: '/report', label: 'Hisobot', Icon: TbFileAnalytics},
    // {to: '/terminal-report', label: 'Terminal hisoboti', Icon: TbFileText},
    {to: '/setting', label: 'Sozlamalar', Icon: TbSettings},
];

// bo'lim ichki sahifalarda ham faol qoladi (/setting/12)
const isActive = (to, pathname) => pathname === to || pathname.startsWith(`${to}/`);

const initials = (u) =>
    [u?.lastname, u?.firstname].filter(Boolean).map((p) => p[0]).join('').toUpperCase();

const fullName = (u) => [u?.lastname, u?.firstname, u?.fathersname].filter(Boolean).join(' ');

// Header uchun qisqa: familiya + ism (to'liq F.I.Sh menyuda)
const shortName = (u) => [u?.lastname, u?.firstname].filter(Boolean).join(' ');

// rasm yuklanmasa — bosh harflar
const Avatar = ({user, large = false}) => {
    const [broken, setBroken] = useState(false);
    return (
        <span className={`shell-user__avatar${large ? ' shell-user__avatar--lg' : ''}`}>
            {user?.image && !broken
                ? <img src={`${ip}/${user.image}`} alt="" onError={() => setBroken(true)}/>
                : initials(user)}
        </span>
    );
};

/* Gorizontal menyu — logo yonida: faol bo'lim yumshoq yashil fon + yashil chegara.
   Sig'masa skroll bo'ladi va chekkalarda strelkalar chiqadi. */
const TopNav = () => {
    const {t} = useTranslation();
    const {pathname} = useLocation();
    const scrollRef = useRef(null);
    const linkRefs = useRef({});
    const [overflow, setOverflow] = useState({left: false, right: false});

    const activeTo = NAV.find(item => isActive(item.to, pathname))?.to;

    const update = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setOverflow({
            left: el.scrollLeft > 0,
            right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
        });
    }, []);

    useEffect(() => {
        update();
        const el = scrollRef.current;
        if (!el || typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', update);
            return () => window.removeEventListener('resize', update);
        }
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [update]);

    // Faol bo'lim ko'rinmay qolsa — unga skroll
    useEffect(() => {
        const link = activeTo ? linkRefs.current[activeTo] : null;
        link?.scrollIntoView?.({block: 'nearest', inline: 'nearest'});
    }, [activeTo]);

    const scrollBy = (dir) => scrollRef.current?.scrollBy({left: dir * 200, behavior: 'smooth'});

    return (
        <div className="shell-topnav">
            {overflow.left &&
                <button type="button" className="shell-topnav__arrow shell-topnav__arrow--left"
                        onClick={() => scrollBy(-1)} aria-hidden="true" tabIndex={-1}>
                    <ChevronLeftIcon size={18}/>
                </button>
            }
            <nav className="shell-topnav__scroll" ref={scrollRef} onScroll={update}>
                {NAV.map(({to, label, Icon}) => {
                    const active = to === activeTo;
                    return (
                        <Link
                            key={to}
                            to={to}
                            ref={(el) => {
                                linkRefs.current[to] = el;
                            }}
                            className={`shell-topnav__link${active ? ' is-active' : ''}`}
                            aria-current={active ? 'page' : undefined}
                            title={t(label)}
                        >
                            <Icon size={20}/>
                            <span className="shell-topnav__label">{t(label)}</span>
                        </Link>
                    );
                })}
            </nav>
            {overflow.right &&
                <button type="button" className="shell-topnav__arrow shell-topnav__arrow--right"
                        onClick={() => scrollBy(1)} aria-hidden="true" tabIndex={-1}>
                    <ChevronRightIcon size={18}/>
                </button>
            }
        </div>
    );
};

const TopBar = ({user, lang, onChangeLanguage, onEditProfile, onLogout}) => {
    const {t} = useTranslation();
    const {theme} = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const userRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const onDown = (e) => {
            if (userRef.current && !userRef.current.contains(e.target)) setMenuOpen(false);
        };
        const onKey = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [menuOpen]);

    return (
        <header className="shell-top">
            <Link to="/employees" className="shell-top__logo">
                <img src={theme === 'dark' ? logoDark : logoLight} alt=""/>
            </Link>

            <TopNav/>

            <div className="shell-top__right">
                {/* mavzu, til va foydalanuvchi — ingichka ustunchalar bilan ajratilgan guruhlar */}
                <PrefsSwitch lang={lang} onChangeLanguage={onChangeLanguage}/>
                <span className="shell-top__sep" aria-hidden="true"/>

                <div className="shell-user" ref={userRef}>
                    <button
                        type="button"
                        className={`shell-user__trigger${menuOpen ? ' is-open' : ''}`}
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                    >
                        <Avatar user={user}/>
                        <span className="shell-user__text">
                            <span className="shell-user__name">{shortName(user)}</span>
                            {user?.role ? <span className="shell-user__role">{getRoleLabel(user.role, t)}</span> : null}
                        </span>
                        <ChevronDownIcon size={16} className="shell-user__chevron"/>
                    </button>

                    {menuOpen && (
                        <div className="shell-menu" role="menu">
                            <div className="shell-menu__head">
                                <Avatar user={user} large/>
                                <span className="shell-menu__head-text">
                                    <span className="shell-menu__head-name" title={fullName(user)}>{fullName(user)}</span>
                                    <span className="shell-menu__head-meta">
                                        {user?.role ? (
                                            <span className={getRoleBadgeClass(user.role)}>{getRoleLabel(user.role, t)}</span>
                                        ) : null}
                                        {user?.login ? <span className="shell-menu__head-login">@{user.login}</span> : null}
                                    </span>
                                </span>
                            </div>
                            <button
                                type="button"
                                role="menuitem"
                                className="shell-menu__item"
                                onClick={() => {
                                    setMenuOpen(false);
                                    onEditProfile();
                                }}
                            >
                                <span className="shell-menu__item-icon"><EditIcon size={16}/></span>
                                {t('Tahrirlash')}
                            </button>
                            <button
                                type="button"
                                role="menuitem"
                                className="shell-menu__item shell-menu__item--danger"
                                onClick={onLogout}
                            >
                                <span className="shell-menu__item-icon"><LogOutIcon size={16}/></span>
                                {t('Chiqish')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const Layout = () => {
    const {i18n} = useTranslation();
    const dispatch = useDispatch();
    // Redux'dan — profil tahrirlangach header darhol yangilanadi
    const user = useSelector(store => store.auth.user) || storage.local.get("user");
    const [profileOpen, setProfileOpen] = useState(false);
    const [lang, setLang] = useState(localStorage.getItem('i18nextLng') || i18n.language || 'uz');

    const onChangeLanguage = (next) => {
        setLang(next);
        i18n.changeLanguage(next);
        localStorage.setItem('i18nextLng', next);
    };

    const logout = () => {
        dispatch(LoginFailure());
        localStorage.removeItem('vipparking-token');
    };

    return (
        <BrowserRouter>
            <div className="layout">
                <TopBar user={user} lang={lang} onChangeLanguage={onChangeLanguage}
                        onEditProfile={() => setProfileOpen(true)} onLogout={logout}/>

                <main className="layout_body">
                    <RootPage/>
                </main>
            </div>
            <ProfileEditModal open={profileOpen} onClose={() => setProfileOpen(false)} user={user}/>
        </BrowserRouter>
    );
};

export default Layout;
