import React from 'react';
import {
    TbBan,
    TbBarrierBlock,
    TbCar,
    TbClock,
    TbListCheck,
    TbParking,
    TbReportAnalytics,
    TbScan,
    TbUsers,
} from "react-icons/tb";

/* Chap panel fonidagi modullar: dastur asosiy bo'limlarining kichik ikonkali kartalari,
   orqada xira bo'sh panellar va oqib turuvchi nuqtali ulanishlar. 800×800 maydon panel markaziga bog'langan;
   markaz (400, 400) atrofidagi HUD hududi (~230..570) bo'sh qoldiriladi. */

// kichik ikonkali kartalar — VIP Parking'ning asosiy bo'limlari
/* devorga o'rnatilgan "bullet" kuzatuv kamerasi (Lucide "cctv" ikonkasi, ISC litsenziyasi),
   gorizontal ko'zgulangan — mahkamlagich o'ng tomonda */
const CctvIcon = ({size, ...props}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
         strokeLinecap="round" strokeLinejoin="round" {...props}>
        <g transform="translate(24 0) scale(-1 1)">
            <path d="M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97"/>
            <path d="M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z"/>
            <path d="M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15"/>
            <path d="M2 21v-4"/>
            <path d="M7 9h.01"/>
        </g>
    </svg>
);

/* Joylashuv namunadagidek: kichik ikonkali kartalar xira panellar ustida, burchak qavslari atrofida
   zich joylashadi. Koordinatalar 800×800 maydonda, markaz (400, 400) — panel markazi.
   link: ulanish shakli — 'h' (avval gorizontal), 'v' (avval vertikal), yo'q — ulanmaydi */
const C = 400;
// joylashuv markazdan shu koeffitsient bilan yoyiladi (kartalar va panellar o'lchami o'zgarmaydi)
const SPREAD = 1.25;
const spread = (v) => Math.round(C + (v - C) * SPREAD);

/* har bir karta o'z paneli (pw×ph) ustida turadi; link: true — panel chetidan markazga ulanish */
const TILES = [
    {cx: 240, cy: 284, Icon: TbParking, pw: 84, ph: 58, link: true},
    {cx: 303, cy: 250, Icon: TbReportAnalytics, pw: 56, ph: 50},
    {cx: 387, cy: 245, Icon: TbUsers, pw: 64, ph: 56, link: true},
    {cx: 492, cy: 255, Icon: TbBan, pw: 56, ph: 50},
    {cx: 560, cy: 290, Icon: TbScan, pw: 76, ph: 64, link: true},
    {cx: 215, cy: 392, Icon: CctvIcon, pw: 72, ph: 58, link: true},
    {cx: 585, cy: 410, Icon: TbCar, pw: 66, ph: 80, link: true},
    {cx: 255, cy: 468, Icon: TbListCheck, pw: 60, ph: 56, link: true},
    {cx: 530, cy: 490, Icon: TbClock, pw: 60, ph: 68, link: true},
    {cx: 590, cy: 560, Icon: TbBarrierBlock, pw: 84, ph: 56},
].map(t => ({...t, cx: spread(t.cx), cy: spread(t.cy)}));
const TILE = 40;
const ICON = 21;

// qo'shimcha bezak panellari
const PANELS = [
    ...TILES.map(({cx, cy, pw, ph}) => [cx - pw / 2, cy - ph / 2, pw, ph]),
    ...[[300, 190, 70, 34], [432, 552, 96, 36], [340, 596, 84, 36], [150, 470, 70, 60], [528, 318, 52, 32]]
        .map(([x, y, w, h]) => [spread(x + w / 2) - w / 2, spread(y + h / 2) - h / 2, w, h]),
];

/* ulanish karta panelining markazga qaragan chetidan boshlanadi (avval gorizontal yoki vertikal —
   qaysi yo'nalish ustun bo'lsa) va HUD halqasi yonida (markazdan LINK_END) tugaydi */
const LINK_END = 125;
const LINKS = TILES.filter(t => t.link).map(({cx, cy, pw, ph}) => {
    const dx = cx - C;
    const dy = cy - C;
    const dist = Math.hypot(dx, dy);
    const ex = Math.round(C + dx * (LINK_END / dist));
    const ey = Math.round(C + dy * (LINK_END / dist));
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const d = horizontal
        ? `M${cx - Math.sign(dx) * pw / 2} ${cy} H${ex} V${ey}`
        : `M${cx} ${cy - Math.sign(dy) * ph / 2} V${ey} H${ex}`;
    return {d, end: [ex, ey]};
});

const renderTile = ({cx, cy, Icon}, i) => {
    const c = TILE / 2;
    return (
        <g key={`${cx}-${cy}`} transform={`translate(${cx - c} ${cy - c})`}>
            <g className="bd-tile" style={{animationDelay: `${(i % 5) * -1.4}s`}}>
                <rect width={TILE} height={TILE} rx="10" fill="url(#bd-fill)" stroke="url(#bd-stroke)"
                      className="bd-tile__box"/>
                <Icon x={c - ICON / 2} y={c - ICON / 2} size={ICON} className="bd-tile__icon"/>
            </g>
        </g>
    );
};

const HeroBackdrop = () => {
    const animate = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    return (
        <div className="bd" aria-hidden="true">
            <svg className="bd-svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <linearGradient id="bd-fill" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#00e58b" stopOpacity="0.14"/>
                        <stop offset="1" stopColor="#00e58b" stopOpacity="0.02"/>
                    </linearGradient>
                    <linearGradient id="bd-stroke" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#6dffc4" stopOpacity="0.6"/>
                        <stop offset="0.5" stopColor="#00e58b" stopOpacity="0.18"/>
                        <stop offset="1" stopColor="#00e58b" stopOpacity="0.32"/>
                    </linearGradient>
                </defs>
                <g>
                    {PANELS.map(([x, y, w, h], i) => (
                        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="8" className="bd-panel"
                              style={{animationDelay: `${i * -1.2}s`}}/>
                    ))}
                </g>
                <g>
                    {/* ulanishlar: shtrixlar oqadi, har biri bo'ylab nurli nuqta yuradi */}
                    <g className="bd-links">
                        {LINKS.map(({d}, i) => (
                            <path key={d} id={`bd-link-${i}`} d={d} style={{animationDelay: `${i * -0.3}s`}}/>
                        ))}
                    </g>
                    {animate && LINKS.map(({d}, i) => (
                        <circle key={d} r="2.6" className="bd-runner">
                            <animateMotion dur={`${2.4 + (i % 4) * 0.5}s`} begin={`${i * -0.7}s`}
                                           repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                                <mpath href={`#bd-link-${i}`}/>
                            </animateMotion>
                        </circle>
                    ))}
                    {TILES.map(renderTile)}
                    {LINKS.map(({end: [cx, cy]}, i) => (
                        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.4" className="bd-dot"
                                style={{animationDelay: `${i * -0.6}s`}}/>
                    ))}
                </g>
            </svg>
        </div>
    );
};

export default HeroBackdrop;
