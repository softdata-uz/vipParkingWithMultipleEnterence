import React from 'react';
import './plateNumber.css';

/**
 * Davlat raqami belgisi (AIS-NewUI-Version, Parking Control modulidagi bilan bir xil). Har bir tur qat'iy andoza bilan tekshiriladi —
 * belgilar soni emas, har bir o'rindagi belgi turi (raqam yoki harf) mos kelishi shart:
 *   oddiy      — 2 raqam + harf + 3 raqam + 2 harf: "01 A 777 AA"; yoki 2 raqam + 3 raqam + 3 harf: "01 777 AAA"
 *   PAA        — PAA + 3..6 raqam: "PAA 123456" (oq; bayroq chapda, kattaroq va "UZ" yozuvisiz)
 *   CMD        — CMD + 4..6 raqam: "CMD 01-234" (yashil, oq ichki hoshiya)
 *   D / T / X  — harf + 6 raqam: "D 123456" (yashil)
 *   M          — 2 raqam + M + 6 raqam: "01 | M 123456" (yashil, hudud kodi alohida katakda)
 *   UN         — U + harf + 4 raqam: "UN 1234" (ko'k)
 *   H          — 2 raqam + H + 6 raqam: "01 | H 123456" (sariq, hudud kodi alohida katakda)
 *   vaqtinchalik — T + 6 raqam + 2 raqam: "T 123456 | 01" (oq, hudud kodi o'ngda)
 * Ko'rinishi O'zbekiston davlat raqamlari namunalariga mos (uz.wikipedia.org — "O'zbekiston avtomobil raqamlari indeksi").
 * Hech bir andozaga tushmasa — aniqlanmagan: matn o'zgarishsiz, punktir ramkada. Shunday qilib kamera
 * noto'g'ri o'qigan yoki chet el raqami ("A123BC77") haqiqiy O'zbekiston raqamidek ko'rinmaydi.
 */
// Kirill harflari lotinchaga o'giriladi (AIS'dagi eski VehicleNumber qoidasi): kamera yoki operator raqamni
// kirillcha yozgan bo'lsa ham tur to'g'ri aniqlanadi (masalan "01М123456" — yashil raqam)
const CYRILLIC = {А: 'A', В: 'B', Е: 'E', К: 'K', М: 'M', Н: 'H', О: 'O', Р: 'P', С: 'C', Т: 'T', Х: 'X'};

export const parsePlate = (raw) => {
    // bo'shliq va chiziqchalar olib tashlanadi: "01 A 777 AA" yoki "CMD 01-234" deb saqlangan raqam ham taniladi
    const tex = (raw || '').toString().toUpperCase()
        .replace(/[\s\-_.]/g, '')
        .replace(/[АВЕКМНОРСТХ]/g, (char) => CYRILLIC[char]);
    // hudud kodi 01..99 (00 bo'lmaydi) — hudud kodi bor barcha turlar uchun
    if (/^00/.test(tex)) return {kind: 'plain', text: (raw || '').toString().trim() || '—'};
    let m;
    if ((m = tex.match(/^(\d{2})([A-Z])(\d{3})([A-Z]{2})$/))) {
        return {kind: 'standard', region: m[1], text: `${m[2]} ${m[3]} ${m[4]}`, flag: true};
    }
    if ((m = tex.match(/^(\d{2})(\d{3})([A-Z]{3})$/))) {
        return {kind: 'standard', region: m[1], text: `${m[2]} ${m[3]}`, flag: true};
    }
    if ((m = tex.match(/^PAA(\d{3,6})$/))) return {kind: 'standard', text: `PAA ${m[1]}`, flag: 'lead'};
    if ((m = tex.match(/^CMD(\d{2})(\d{2,4})$/))) return {kind: 'green', text: `CMD ${m[1]}-${m[2]}`};
    if ((m = tex.match(/^([DTX])(\d{6})$/))) return {kind: 'green', text: `${m[1]} ${m[2]}`};
    if ((m = tex.match(/^(\d{2})M(\d{6})$/))) return {kind: 'green', region: m[1], text: `M ${m[2]}`};
    if ((m = tex.match(/^(U[A-Z])(\d{4})$/))) return {kind: 'blue', text: `${m[1]} ${m[2]}`};
    if ((m = tex.match(/^(\d{2})H(\d{6})$/))) return {kind: 'yellow', region: m[1], text: `H ${m[2]}`};
    // vaqtinchalik raqam: hudud kodi o'ng tomonda (diplomatik "T 123456" dan oxiridagi ikki raqam bilan farqlanadi)
    if ((m = tex.match(/^T(\d{6})(\d{2})$/)) && m[2] !== '00') return {kind: 'standard', text: `T ${m[1]}`, regionEnd: m[2]};
    // noma'lum format — kamera qanday o'qigan bo'lsa shunday (harflar katta-kichikligi ham) ko'rsatiladi
    return {kind: 'plain', text: (raw || '').toString().trim() || '—'};
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
            {plate.flag === 'lead' ? (
                <span className="plate__flag plate__flag--lead" aria-hidden="true"><UzFlag/></span>
            ) : null}
            <span className="plate__text">{plate.text}</span>
            {plate.flag === true ? (
                <span className="plate__flag" aria-hidden="true">
                    <UzFlag/>
                    <b>UZ</b>
                </span>
            ) : null}
            {plate.regionEnd ? <span className="plate__region plate__region--end">{plate.regionEnd}</span> : null}
        </span>
    );
};

export default PlateNumber;
