import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {ConfigProvider, message, theme as antdTheme} from 'antd';
import i18n from '../i18n';
import {applyLocale} from '../utils/antdLocale';
import '../styles/toast.css';

const ThemeContext = createContext(null);

// Bildirishnomalar header (72px) ostida chiqadi, bir vaqtda ko'pi bilan 3 ta
message.config({top: 84, duration: 4, maxCount: 3});

const STORAGE_KEY = 'theme';
const MODES = ['light', 'dark'];

// Standart — yorug' rejim: ichki sahifalar hali qorong'i rejimga to'liq o'tkazilmagan
const getInitialMode = () => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return MODES.includes(stored) ? stored : 'light';
};

// Monitoring loyihasidan ko'chirilgan. Mirrors src/design-system/tokens.css so antd's own popups (Select/DatePicker dropdowns,
// Popover, Modal, Image preview, Pagination, Empty...) follow the active theme.
const ANTD_TOKENS = {
    light: {
        colorPrimary: '#099250',
        colorBgBase: '#FFFFFF',
        colorBgLayout: '#FAFAFA',
        colorBgContainer: '#FFFFFF',
        colorBgElevated: '#FFFFFF',
        colorBorder: '#D5D7DA',
        colorBorderSecondary: '#E9EAEB',
        colorText: '#181D27',
        colorTextSecondary: '#535862',
        colorTextPlaceholder: '#717680',
        colorSuccess: '#079455',
        colorError: '#D92D20',
        colorWarning: '#DC6803',
    },
    dark: {
        colorPrimary: '#16B364',
        colorBgBase: '#0C0E12',
        colorBgLayout: '#13161B',
        colorBgContainer: '#0C0E12',
        colorBgElevated: '#13161B',
        colorBorder: '#373A41',
        colorBorderSecondary: '#22262F',
        colorText: '#FFFFFF',
        colorTextSecondary: '#94979C',
        colorTextPlaceholder: '#85888E',
        colorSuccess: '#47CD89',
        colorError: '#F97066',
        colorWarning: '#FDB022',
    },
};

const buildAntdConfig = (theme) => ({
    algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
        ...ANTD_TOKENS[theme],
        borderRadius: 8,
        // checkbox/radio: 20px (Untitled UI "md") — antd standarti 16px juda kichik
        controlInteractiveSize: 20,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif",
    },
});

const LIGHT_ANTD_CONFIG = buildAntdConfig('light');

export const ThemeProvider = ({children}) => {
    const [mode, setMode] = useState(getInitialMode);
    const theme = mode;

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, mode);
    }, [mode]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const antdConfig = useMemo(() => buildAntdConfig(theme), [theme]);

    // til: antd komponentlari (sana tanlagich va h.k.), dayjs va <html lang> ilova tili bilan birga almashadi
    const [lang, setLang] = useState(() => localStorage.getItem('i18nextLng') || i18n.language || 'uz');
    useEffect(() => {
        i18n.on('languageChanged', setLang);
        return () => i18n.off('languageChanged', setLang);
    }, []);
    const antdLocale = useMemo(() => applyLocale(lang), [lang]);

    // `message.success(...)` kabi statik chaqiruvlar React daraxtidan tashqarida
    // chiziladi va ConfigProvider'ni ko'rmaydi — shu orqali ularga ham mavzu beriladi
    useEffect(() => {
        ConfigProvider.config({
            holderRender: (children) => (
                <ConfigProvider theme={antdConfig} locale={antdLocale}>{children}</ConfigProvider>
            ),
        });
    }, [antdConfig, antdLocale]);

    return (
        <ThemeContext.Provider value={{theme, mode, setMode}}>
            <ConfigProvider theme={antdConfig} locale={antdLocale}>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

/**
 * Doim yorug' mavzuda qoladigan hudud.
 * Ichki sahifalar hali qattiq yozilgan ranglarda (oq fon, qora matn) — ular qorong'i
 * rejimga o'tkazilmaguncha shu zonaga o'raladi: CSS tokenlari (.theme-light) va antd
 * komponentlari (popuplar ham) yorug' bo'lib qoladi. Sahifa tokenlarga o'tkazilgach,
 * o'ramni olib tashlash kifoya.
 */
export const LightZone = ({children, className = '', ...rest}) => (
    <ConfigProvider theme={LIGHT_ANTD_CONFIG}>
        <div className={`theme-light ${className}`.trim()} {...rest}>
            {children}
        </div>
    </ConfigProvider>
);
