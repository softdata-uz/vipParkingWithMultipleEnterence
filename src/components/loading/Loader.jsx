import React from 'react';

import BrandMark from "../common/BrandMark";
import './loader.css';

/**
 * Ilova yuklanayotganda ko'rinadigan ekran: SoftData emblemasi va uning atrofida aylanuvchi
 * yashil yoy, ostida ingichka "oqib turuvchi" chiziq.
 * - 200ms kechikib paydo bo'ladi: tez yuklanishda ekran "miltillamaydi".
 * - Matnsiz: tarjimalar (i18n) hali yuklanmagan bo'lishi mumkin (index.js Suspense fallback).
 * - Ranglar tokenlardan — yorug' va qorong'i mavzuda bir xil ishlaydi.
 *
 * `overlay` — butun ekran emas, o'z konteynerini (position: relative) qoplaydi.
 */
const Loader = ({overlay = false}) => (
    <div className={`app-loader${overlay ? ' app-loader--overlay' : ''}`} role="status" aria-live="polite"
         aria-label="Loading">
        <div className="app-loader__mark">
            <svg className="app-loader__ring" viewBox="0 0 100 100" aria-hidden="true">
                <circle className="app-loader__track" cx="50" cy="50" r="46"/>
                <circle className="app-loader__arc" cx="50" cy="50" r="46"/>
            </svg>
            <BrandMark size={40} className="app-loader__emblem"/>
        </div>
        <div className="app-loader__bar" aria-hidden="true"><span/></div>
    </div>
);

/** Tugma ichidagi kichik aylanuvchi belgi (rang — matn rangi) */
export const Spinner = ({size = 16}) => (
    <span className="app-spinner" style={{width: size, height: size}} aria-hidden="true"/>
);

export default Loader;
