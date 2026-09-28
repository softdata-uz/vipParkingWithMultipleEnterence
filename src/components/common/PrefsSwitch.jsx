import React, {useMemo} from 'react';
import {useTranslation} from "react-i18next";
import {useTheme} from "../../context/ThemeContext";
import {TbWorld} from "react-icons/tb";
import {MoonIcon, SunIcon} from "../../design-system/icons";
import '../../styles/prefs.css';

export const LANGUAGES = [
    {value: 'uz', short: 'UZ', label: "O'zbekcha"},
    {value: 'uz-Cyrl', short: 'ЎЗ', label: 'Ўзбекча (кирилл)'},
    {value: 'ru', short: 'RU', label: 'Русский'},
    {value: 'en', short: 'EN', label: 'English'},
];

const THEME_MODES = [
    {value: 'light', labelKey: "Yorug'", Icon: SunIcon},
    {value: 'dark', labelKey: "Qorong'i", Icon: MoonIcon},
];

/* Bir bosishda tanlanadigan segmentli guruh (radio-guruh semantikasi, ←/→ bilan ham) */
const Segmented = ({label, value, options, onChange, variant}) => {
    const onKeyDown = (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const i = options.findIndex(o => o.value === value);
        const next = options[(i + (e.key === 'ArrowRight' ? 1 : options.length - 1)) % options.length];
        onChange(next.value);
        e.currentTarget.parentElement
            .querySelector(`[data-value="${next.value}"]`)?.focus();
    };
    return (
        <div className={`shell-seg shell-seg--${variant}`} role="radiogroup" aria-label={label}>
            {options.map(option => {
                const active = option.value === value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={option.title}
                        title={option.title}
                        data-value={option.value}
                        tabIndex={active ? 0 : -1}
                        className={`shell-seg__item${active ? ' is-active' : ''}`}
                        onClick={() => onChange(option.value)}
                        onKeyDown={onKeyDown}
                    >
                        {option.content}
                    </button>
                );
            })}
        </div>
    );
};

/** Mavzu (yorug'/qorong'i) va til tanlagichi. Header va login sahifasida ishlatiladi. */
export const PrefsSwitch = ({lang, onChangeLanguage, className, compact}) => {
    const {t} = useTranslation();
    const {mode, setMode} = useTheme();

    const themeOptions = useMemo(() => THEME_MODES.map(({value, labelKey, Icon}) => ({
        value, title: t(labelKey), content: <Icon size={17}/>,
    })), [t]);
    const languageOptions = useMemo(() => LANGUAGES.map(({value, short, label}) => ({
        value, title: label, content: short,
    })), []);

    // ixcham: mavzu bitta tugma bilan almashadi (login sahifasi)
    if (compact) {
        const next = THEME_MODES.find(m => m.value !== mode);
        const Current = (THEME_MODES.find(m => m.value === mode) || THEME_MODES[1]).Icon;
        return (
            <div className={`shell-prefs-compact${className ? ` ${className}` : ''}`}>
                <button type="button" className="shell-theme-btn" onClick={() => setMode(next.value)}
                        title={t(next.labelKey)} aria-label={t(next.labelKey)}>
                    <Current size={17}/>
                </button>
                <div className="shell-prefs">
                    <Segmented variant="text" label={t('Til')} value={lang} onChange={onChangeLanguage}
                               options={languageOptions}/>
                </div>
            </div>
        );
    }

    // header: mavzu va til — ikki alohida guruh (til guruhi globus belgisi bilan)
    return (
        <>
            <div className={`shell-prefs${className ? ` ${className}` : ''}`}>
                <Segmented variant="icon" label={t('Mavzu')} value={mode} onChange={setMode}
                           options={themeOptions}/>
            </div>
            <span className="shell-top__sep" aria-hidden="true"/>
            <div className="shell-prefs shell-prefs--lang">
                <TbWorld size={18} className="shell-prefs__globe" aria-hidden="true"/>
                <span className="shell-prefs__divider" aria-hidden="true"/>
                <Segmented variant="text" label={t('Til')} value={lang} onChange={onChangeLanguage}
                           options={languageOptions}/>
            </div>
        </>
    );
};
