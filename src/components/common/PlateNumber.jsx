import React from 'react';
import './plateNumber.css';

/**
 * Davlat raqami belgisi. Qoidalar eski DatabaseAdd.jsx dagi bilan bir xil:
 *   8 belgi  — oddiy: "01 A 777 AA" (3-4 belgilar harf) yoki "01 777 AAA" (raqam), bayroq bilan
 *   PAA...   — oq, bayroq bilan: "PAA 123456"
 *   CMD...   — yashil: "CMD 01-234"
 *   D/T/X + 6 raqam — yashil: "D 123456"
 *   9 belgi, 3-belgi M — yashil: "01 M 123456"
 *   6 belgi, U bilan boshlanadi — ko'k: "UN 1234"
 *   9 belgi, 3-belgi H — sariq: "01 H 123456"
 *   boshqalari — o'zgarishsiz
 */
const isNum = (s) => s !== '' && !isNaN(s);

export const parsePlate = (raw) => {
    const tex = (raw || '').toString().trim().toUpperCase();
    const s = (from, len) => tex.substr(from, len);

    // prefiksli raqamlar birinchi: "CMD01234" ham 8 belgi — aks holda oddiy raqam deb o'qilardi
    if (s(0, 3) === 'PAA') return {kind: 'standard', text: `PAA ${s(3)}`, flag: true};
    if (s(0, 3) === 'CMD') return {kind: 'green', text: `CMD ${s(3, 2)}-${s(5)}`};
    if (tex.length === 8) {
        const region = s(0, 2);
        const rest = isNum(s(2, 2))
            ? `${s(2, 3)} ${s(5)}`
            : `${s(2, 1)} ${s(3, 3)} ${s(6)}`;
        return {kind: 'standard', region, text: rest, flag: true};
    }
    if (tex.length === 7 && ['D', 'T', 'X'].includes(s(0, 1)) && isNum(s(1))) {
        return {kind: 'green', text: `${s(0, 1)} ${s(1)}`};
    }
    if (tex.length === 9 && s(2, 1) === 'M' && isNum(s(3))) return {kind: 'green', text: `${s(0, 2)} M ${s(3)}`};
    if (tex.length === 6 && s(0, 1) === 'U') return {kind: 'blue', text: `${s(0, 2)} ${s(2)}`};
    if (tex.length === 9 && s(2, 1) === 'H' && isNum(s(3))) return {kind: 'yellow', text: `${s(0, 2)} H ${s(3)}`};
    return {kind: 'plain', text: tex || '—'};
};

/* O'zbekiston bayrog'i — Vikimedia'dagi rasmiy "Flag_of_Uzbekistan.svg" geometriyasi (1000×500):
   ko'k / oq / yashil yo'llar, ular orasida ingichka qizil chiziqlar, ko'k yo'lda oq yarim oy va 12 yulduz
   (3 + 4 + 5, o'ngga tekislangan). SVG — har qanday o'lchamda tiniq. */
const FLAG_STARS = "M272.00 20.00L274.69 28.29L283.41 28.29L276.36 33.42L279.05 41.71L272.00 36.58L264.95 41.71L267.64 33.42L260.59 28.29L269.31 28.29ZM320.00 20.00L322.69 28.29L331.41 28.29L324.36 33.42L327.05 41.71L320.00 36.58L312.95 41.71L315.64 33.42L308.59 28.29L317.31 28.29ZM368.00 20.00L370.69 28.29L379.41 28.29L372.36 33.42L375.05 41.71L368.00 36.58L360.95 41.71L363.64 33.42L356.59 28.29L365.31 28.29ZM224.00 68.00L226.69 76.29L235.41 76.29L228.36 81.42L231.05 89.71L224.00 84.58L216.95 89.71L219.64 81.42L212.59 76.29L221.31 76.29ZM272.00 68.00L274.69 76.29L283.41 76.29L276.36 81.42L279.05 89.71L272.00 84.58L264.95 89.71L267.64 81.42L260.59 76.29L269.31 76.29ZM320.00 68.00L322.69 76.29L331.41 76.29L324.36 81.42L327.05 89.71L320.00 84.58L312.95 89.71L315.64 81.42L308.59 76.29L317.31 76.29ZM368.00 68.00L370.69 76.29L379.41 76.29L372.36 81.42L375.05 89.71L368.00 84.58L360.95 89.71L363.64 81.42L356.59 76.29L365.31 76.29ZM176.00 116.00L178.69 124.29L187.41 124.29L180.36 129.42L183.05 137.71L176.00 132.58L168.95 137.71L171.64 129.42L164.59 124.29L173.31 124.29ZM224.00 116.00L226.69 124.29L235.41 124.29L228.36 129.42L231.05 137.71L224.00 132.58L216.95 137.71L219.64 129.42L212.59 124.29L221.31 124.29ZM272.00 116.00L274.69 124.29L283.41 124.29L276.36 129.42L279.05 137.71L272.00 132.58L264.95 137.71L267.64 129.42L260.59 124.29L269.31 124.29ZM320.00 116.00L322.69 124.29L331.41 124.29L324.36 129.42L327.05 137.71L320.00 132.58L312.95 137.71L315.64 129.42L308.59 124.29L317.31 124.29ZM368.00 116.00L370.69 124.29L379.41 124.29L372.36 129.42L375.05 137.71L368.00 132.58L360.95 137.71L363.64 129.42L356.59 124.29L365.31 124.29Z";

const UzFlag = () => (
    <svg className="plate__flag-svg" viewBox="0 0 1000 500" aria-hidden="true">
        <rect width="1000" height="500" fill="#1EB53A"/>
        <rect width="1000" height="250" fill="#0099B5"/>
        <rect y="160" width="1000" height="180" fill="#CE1126"/>
        <rect y="170" width="1000" height="160" fill="#FFFFFF"/>
        <circle cx="140" cy="80" r="60" fill="#FFFFFF"/>
        <circle cx="160" cy="80" r="60" fill="#0099B5"/>
        <path d={FLAG_STARS} fill="#FFFFFF"/>
        <rect x="8" y="8" width="984" height="484" rx="30" fill="none"
              stroke="rgba(11, 15, 20, .28)" strokeWidth="16"/>
    </svg>
);

const PlateNumber = ({value, size = 'md'}) => {
    const plate = parsePlate(value);
    return (
        <span className={`plate plate--${plate.kind} plate--${size}`} title={value || ''}>
            {plate.region ? <span className="plate__region">{plate.region}</span> : null}
            <span className="plate__text">{plate.text}</span>
            {plate.flag ? (
                <span className="plate__flag" aria-hidden="true">
                    <UzFlag/>
                    <b>UZ</b>
                </span>
            ) : null}
        </span>
    );
};

export default PlateNumber;
