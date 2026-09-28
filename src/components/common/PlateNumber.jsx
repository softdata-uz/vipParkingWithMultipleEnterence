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

    if (tex.length === 8) {
        const region = s(0, 2);
        const rest = isNum(s(2, 2))
            ? `${s(2, 3)} ${s(5)}`
            : `${s(2, 1)} ${s(3, 3)} ${s(6)}`;
        return {kind: 'standard', region, text: rest, flag: true};
    }
    if (s(0, 3) === 'PAA') return {kind: 'standard', text: `PAA ${s(3)}`, flag: true};
    if (s(0, 3) === 'CMD') return {kind: 'green', text: `CMD ${s(3, 2)}-${s(5)}`};
    if (tex.length === 7 && ['D', 'T', 'X'].includes(s(0, 1)) && isNum(s(1))) {
        return {kind: 'green', text: `${s(0, 1)} ${s(1)}`};
    }
    if (tex.length === 9 && s(2, 1) === 'M' && isNum(s(3))) return {kind: 'green', text: `${s(0, 2)} M ${s(3)}`};
    if (tex.length === 6 && s(0, 1) === 'U') return {kind: 'blue', text: `${s(0, 2)} ${s(2)}`};
    if (tex.length === 9 && s(2, 1) === 'H' && isNum(s(3))) return {kind: 'yellow', text: `${s(0, 2)} H ${s(3)}`};
    return {kind: 'plain', text: tex || '—'};
};

const PlateNumber = ({value, size = 'md'}) => {
    const plate = parsePlate(value);
    return (
        <span className={`plate plate--${plate.kind} plate--${size}`} title={value || ''}>
            {plate.region ? <span className="plate__region">{plate.region}</span> : null}
            <span className="plate__text">{plate.text}</span>
            {plate.flag ? (
                <span className="plate__flag" aria-hidden="true">
                    <i/><i/><i/>
                    <b>UZ</b>
                </span>
            ) : null}
        </span>
    );
};

export default PlateNumber;
