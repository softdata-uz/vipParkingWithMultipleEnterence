import React from 'react';

/* Avtomobil atrofidagi HUD: yumshoq nur, bitta yorqin yoy, ichki uzuq halqa,
   burchak qavslari va skaner chizig'i. */

const polar = (cx, cy, r, a) => {
    const rad = (a - 90) * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

const arc = (cx, cy, r, from, to) => {
    const [x1, y1] = polar(cx, cy, r, from);
    const [x2, y2] = polar(cx, cy, r, to);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

/* yumaloqlangan burchak qavslari */
const bracketPath = (cx, cy, half, len, r) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => {
    const x = cx + sx * half;
    const y = cy + sy * half;
    return `M${x} ${y - sy * len} V${y - sy * r} Q${x} ${y} ${x - sx * r} ${y} H${x - sx * len}`;
}).join(' ');

export const HudRings = ({cx, cy}) => (
    <g className="hud">
        <circle cx={cx} cy={cy} r="140" fill="url(#ph-core)"/>

        {/* bitta yorqin yoy — sekin aylanadi */}
        <g className="hud-rot" style={{transformOrigin: `${cx}px ${cy}px`}}>
            <path d={arc(cx, cy, 100, 215, 400)} className="hud-arc" filter="url(#ph-glow)"/>
        </g>

        {/* ichki uzuq halqa — teskari yo'nalishda */}
        <g className="hud-rot hud-rot--reverse" style={{transformOrigin: `${cx}px ${cy}px`}}>
            <circle cx={cx} cy={cy} r="84" className="hud-dashed"/>
        </g>
    </g>
);

export const ScanCorners = ({cx, cy}) => (
    <path className="hud-corners" d={bracketPath(cx, cy, 92, 22, 5)} filter="url(#ph-glow)"/>
);

export const ScanLine = ({cx, cy}) => (
    <g clipPath="url(#ph-clip)">
        <g className="hud-scan">
            <rect x={cx - 92} y={cy - 116} width="184" height="22" fill="url(#ph-scan)"/>
            <rect x={cx - 98} y={cy - 95} width="196" height="2" fill="url(#ph-scan-line)" filter="url(#ph-glow)"/>
        </g>
    </g>
);
