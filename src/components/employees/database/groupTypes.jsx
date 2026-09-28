import React from 'react';

/* Xodimlar guruhining turi (server qiymati -> ko'rinish). Rang va nom faqat shu yerda:
     whitelist — Oq ro'yxat     — yashil
     blacklist — Qora ro'yxat   — qora
     wanted    — Qidirilmoqda   — qizil
   Noma'lum qiymat — kulrang, server qiymatining o'zi bilan. */

export const GROUP_TYPES = [
    {value: 'whitelist', label: "Oq ro'yxat", tone: 'white'},
    {value: 'blacklist', label: "Qora ro'yxat", tone: 'black'},
    {value: 'wanted', label: "Qidirilmoqda", tone: 'wanted'},
];

export const groupType = (value) =>
    GROUP_TYPES.find(item => item.value === value) || {value, label: value || '—', tone: 'unknown'};

/** Tur belgisi (badge) */
export const GroupTypeBadge = ({type, t, className = ''}) => {
    const info = groupType(type);
    return (
        <span className={`ds-badge grp_badge grp_badge--${info.tone} ${className}`.trim()}>
            <span className="ds-badge__dot"/>
            {info.tone === 'unknown' ? info.label : t(info.label)}
        </span>
    );
};
