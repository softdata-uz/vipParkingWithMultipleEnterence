import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import './vipGateHero.css';

/* Login chap panelining markaziy vizuali — VIP avtoturargohning kirish darvozasi (yuqoridan ko'rinish).
   Ikki polosa (bir nechta kirish), har birida kamera va shlagbaum; tepada VIP joylar qatori.
   Sikl: mashina keladi → kamera raqamni aniqlaydi → oq ro'yxat bo'lsa shlagbaum ochilib, mashina
   bo'sh joyga kiradi; qora ro'yxat bo'lsa kirish taqiqlanadi va mashina orqaga qaytadi.
   Ma'lumotlar namunaviy — serverga so'rov yuborilmaydi. Fondagi modullar — SystemModules.jsx. */

const C = 125;           // sahna markazi (viewBox 250×250)
const R = 96;            // "kamera ko'rinishi" doirasi
const GATE_Y = 138;      // shlagbaumlar chizig'i
const LANES = [100, 150]; // polosalar markazi (x)
const SLOTS_Y = 69;      // joylar qatorining markazi (y)

const VEHICLES = [
    {lane: 0, region: "01", number: "A 777 AA", allow: true},
    {lane: 1, region: "10", number: "B 404 KA", allow: false},
    {lane: 1, region: "30", number: "C 123 DA", allow: true},
    {lane: 0, region: "40", number: "D 555 BB", allow: false},
];

// har bir bosqich davomiyligi (ms) va keyingi bosqich
const PHASE_DURATION = {idle: 350, approach: 1500, scan: 1400, result: 1300, exit: 1800};
const NEXT_PHASE = {idle: "approach", approach: "scan", scan: "result", result: "exit", exit: "idle"};

const reducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const polar = (r, a) => {
    const rad = (a - 90) * Math.PI / 180;
    return [C + r * Math.cos(rad), C + r * Math.sin(rad)];
};

const arc = (r, from, to) => {
    const [x1, y1] = polar(r, from);
    const [x2, y2] = polar(r, to);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

/* yuqoridan ko'rinishdagi mashina — oldi tepaga qaragan, markazi (0, 0) */
const CarShape = ({className = ""}) => (
    <g className={`vg-car-shape ${className}`}>
        <rect x="-11" y="-19" width="22" height="38" rx="6" className="vg-car-body"/>
        <path d="M-8 -8 H8 L6 -2 H-6 Z" className="vg-car-glass"/>
        <path d="M-6 10 H6 L8 14 H-8 Z" className="vg-car-glass"/>
        <path d="M-6 -2 V10 M6 -2 V10" className="vg-car-line"/>
        <rect x="-9" y="-18.5" width="5" height="2" rx="1" className="vg-car-light"/>
        <rect x="4" y="-18.5" width="5" height="2" rx="1" className="vg-car-light"/>
    </g>
);

/* aniqlash ramkasi — mashina atrofidagi burchak qavslari */
const Brackets = () => {
    const w = 16, h = 24, l = 7;
    return (
        <path className="vg-detect" d={[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) =>
            `M${sx * w} ${sy * h + -sy * l} V${sy * h} H${sx * w + -sx * l}`).join(' ')}/>
    );
};

const VipGateHero = () => {
    const {t} = useTranslation();
    const [reduced] = useState(reducedMotion);
    const [index, setIndex] = useState(0);
    const [phase, setPhase] = useState(reduced ? "result" : "idle");

    useEffect(() => {
        if (reduced) return undefined;
        const timer = setTimeout(() => {
            if (phase === "exit") setIndex(i => (i + 1) % VEHICLES.length);
            setPhase(NEXT_PHASE[phase]);
        }, PHASE_DURATION[phase]);
        return () => clearTimeout(timer);
    }, [phase, reduced]);

    const vehicle = VEHICLES[index];
    const laneX = LANES[vehicle.lane];
    const verdict = vehicle.allow ? "allow" : "deny";
    const recognized = phase === "result";
    // natija yorlig'i qo'shni polosa ustida chiqadi — mashinani yopmasin
    const tagX = vehicle.lane === 0 ? 128 : 44;

    return (
        <div className="vg" data-phase={phase} data-verdict={verdict} data-lane={vehicle.lane} aria-hidden="true">
            <svg className="vg-svg" viewBox="0 0 250 250" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <radialGradient id="vg-core">
                        <stop offset="0" stopColor="#00e58b" stopOpacity="0.2"/>
                        <stop offset="0.6" stopColor="#00b96b" stopOpacity="0.06"/>
                        <stop offset="1" stopColor="#00b96b" stopOpacity="0"/>
                    </radialGradient>
                    <radialGradient id="vg-ground" cx="0.5" cy="0.45" r="0.6">
                        <stop offset="0" stopColor="#063a25" stopOpacity="0.9"/>
                        <stop offset="1" stopColor="#021810" stopOpacity="0.95"/>
                    </radialGradient>
                    <linearGradient id="vg-ring" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0" stopColor="#00e58b" stopOpacity="0.15"/>
                        <stop offset="0.45" stopColor="#3dffb0"/>
                        <stop offset="1" stopColor="#00e58b" stopOpacity="0.35"/>
                    </linearGradient>
                    <linearGradient id="vg-beam" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0" stopColor="#dfffee" stopOpacity="0.45"/>
                        <stop offset="1" stopColor="#dfffee" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="vg-cone" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#3dffb0" stopOpacity="0.55"/>
                        <stop offset="1" stopColor="#3dffb0" stopOpacity="0.04"/>
                    </linearGradient>
                    <clipPath id="vg-clip">
                        <circle cx={C} cy={C} r={R}/>
                    </clipPath>
                    <filter id="vg-glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="2.2" result="b"/>
                        <feMerge>
                            <feMergeNode in="b"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* HUD: yumshoq nur, aylanuvchi yoy, doira chegarasi */}
                <circle cx={C} cy={C} r="124" fill="url(#vg-core)"/>
                <g className="vg-rot" style={{transformOrigin: `${C}px ${C}px`}}>
                    <path d={arc(106, 215, 400)} className="vg-arc" filter="url(#vg-glow)"/>
                </g>
                <g className="vg-rot vg-rot--reverse" style={{transformOrigin: `${C}px ${C}px`}}>
                    <circle cx={C} cy={C} r="113" className="vg-dashed"/>
                </g>

                <g clipPath="url(#vg-clip)">
                    <circle cx={C} cy={C} r={R} fill="url(#vg-ground)"/>

                    {/* VIP joylar qatori */}
                    <g className="vg-lot">
                        <path d={`M62.5 50 H187.5 ${[62.5, 87.5, 112.5, 137.5, 162.5, 187.5]
                            .map(x => `M${x} 50 V88`).join(' ')}`}/>
                    </g>
                    <text x={C} y="104" className="vg-lot-label">VIP PARKING</text>
                    {[75, 125, 175].map(x => (
                        <g key={x} transform={`translate(${x} ${SLOTS_Y}) rotate(180)`}>
                            <CarShape className="vg-car-shape--parked"/>
                        </g>
                    ))}

                    {/* polosalar, o'rtadagi orolcha, to'xtash chizig'i */}
                    <g className="vg-road">
                        <path d={`M80 ${GATE_Y} V230 M170 ${GATE_Y} V230`}/>
                        <path d={`M82 ${GATE_Y + 4} H119 M131 ${GATE_Y + 4} H168`} className="vg-stopline"/>
                    </g>
                    <rect x="121" y={GATE_Y - 2} width="8" height="92" rx="3" className="vg-island"/>
                    {LANES.map((x, i) => (
                        <text key={x} x={x} y="202" className={`vg-lane-label vg-lane-label--${i}`}>
                            {t("Kirish {{n}}", {n: i + 1}).toLocaleUpperCase()}
                        </text>
                    ))}

                    {/* kamera nuri — faol polosada */}
                    <polygon className="vg-cone vg-cone--0" points="76,143 118,151 92,176" fill="url(#vg-cone)"/>
                    <polygon className="vg-cone vg-cone--1" points="174,143 132,151 158,176" fill="url(#vg-cone)"/>

                    {/* mashina */}
                    <g className="vg-car" key={index} style={{'--x': `${laneX}px`}}>
                        <polygon className="vg-beam" points="-9,-19 9,-19 15,-50 -15,-50" fill="url(#vg-beam)"/>
                        <CarShape/>
                        <g className="vg-scanline">
                            <rect x="-13" y="-0.75" width="26" height="1.5" rx="0.75"/>
                        </g>
                        <Brackets/>
                    </g>

                    {/* taqiq signali */}
                    <circle className="vg-alarm" cx={laneX} cy={GATE_Y + 20} r="22"/>
                </g>

                {/* shlagbaumlar — ustun tashqi tomonda, strela polosa bo'ylab */}
                {[{px: 78, to: 119, lane: 0, dir: -1}, {px: 172, to: 131, lane: 1, dir: 1}].map(b => (
                    <g key={b.lane} className={`vg-barrier vg-barrier--${b.lane}`}
                       style={{transformOrigin: `${b.px}px ${GATE_Y}px`, '--open': `${b.dir * 88}deg`}}>
                        <line x1={b.px} y1={GATE_Y} x2={b.to} y2={GATE_Y} className="vg-arm"/>
                        <line x1={b.px} y1={GATE_Y} x2={b.to} y2={GATE_Y} className="vg-arm-stripes"/>
                    </g>
                ))}
                {[{x: 78, lane: 0}, {x: 172, lane: 1}].map(p => (
                    <g key={p.lane}>
                        <circle cx={p.x} cy={GATE_Y} r="4.2" className="vg-post"/>
                        <circle cx={p.x} cy={GATE_Y} r="1.8" className={`vg-led vg-led--${p.lane}`}/>
                    </g>
                ))}
                {/* kameralar */}
                {[{x: 76, y: 143, r: 35}, {x: 174, y: 143, r: 145}].map((cam, i) => (
                    <g key={i} transform={`translate(${cam.x} ${cam.y}) rotate(${cam.r})`} className="vg-camera">
                        <rect x="-4.5" y="-2.5" width="9" height="5" rx="1.5"/>
                        <circle cx="4.5" cy="0" r="1.2" className="vg-camera-lens"/>
                    </g>
                ))}

                {/* natija yorlig'i: raqam va ro'yxat */}
                <g className="vg-tag" transform={`translate(${tagX} 163)`}>
                    <rect width="78" height="38" rx="5" className="vg-tag-box"/>
                    <rect x="5" y="5" width="68" height="14" rx="2" className="vg-tag-plate"/>
                    <text x="8" y="15.4" className="vg-tag-plate-text">
                        {phase === "scan" ? "·· ··· ··" : vehicle.region}
                    </text>
                    <line x1="20" y1="6" x2="20" y2="18" className="vg-tag-plate-sep"/>
                    <text x="24" y="15.4" className="vg-tag-plate-text">
                        {phase === "scan" ? "" : vehicle.number}
                    </text>
                    <text x="6" y="31" className="vg-tag-status">
                        {recognized
                            ? `${vehicle.allow ? "✓" : "✕"} ${t(vehicle.allow ? "Oq ro'yxat" : "Qora ro'yxat").toLocaleUpperCase()}`
                            : t("Aniqlanmoqda").toLocaleUpperCase() + "…"}
                    </text>
                </g>
            </svg>
        </div>
    );
};

export default VipGateHero;
