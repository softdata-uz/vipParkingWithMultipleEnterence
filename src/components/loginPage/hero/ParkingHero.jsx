import React from 'react';
import {HudRings, ScanCorners, ScanLine} from "./HudRings";
import carImage from '../../../images/caricon.webp';
import './hero.css';

/* Login chap panelining markaziy vizuali: HUD ichidagi raqamli (low-poly) avtomobil.
   caricon.webp — "caricon.png" ning siqilgan nusxasi: qora fon shaffofga aylantirilgan,
   nur esa saqlangan. Fondagi modullar — SystemModules.jsx. */

const CX = 220;
const CY = 196;
const CAR_W = 132; // ichki uzuq halqa (r=84) ichiga to'liq sig'adi
const CAR_H = CAR_W * (626 / 900);

const ParkingHero = () => (
    <div className="ph" aria-hidden="true">
        <svg className="ph-svg" viewBox={`${CX - 125} ${CY - 125} 250 250`} preserveAspectRatio="xMidYMid meet">
            <defs>
                <radialGradient id="ph-core">
                    <stop offset="0" stopColor="#00e58b" stopOpacity="0.32"/>
                    <stop offset="0.5" stopColor="#00b96b" stopOpacity="0.1"/>
                    <stop offset="1" stopColor="#00b96b" stopOpacity="0"/>
                </radialGradient>
                <linearGradient id="ph-ring" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stopColor="#00e58b" stopOpacity="0.15"/>
                    <stop offset="0.45" stopColor="#3dffb0"/>
                    <stop offset="1" stopColor="#00e58b" stopOpacity="0.35"/>
                </linearGradient>
                <linearGradient id="ph-scan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#18e3b0" stopOpacity="0"/>
                    <stop offset="1" stopColor="#18e3b0" stopOpacity="0.22"/>
                </linearGradient>
                <linearGradient id="ph-scan-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#b8ffe4" stopOpacity="0"/>
                    <stop offset="0.15" stopColor="#b8ffe4"/>
                    <stop offset="0.85" stopColor="#b8ffe4"/>
                    <stop offset="1" stopColor="#b8ffe4" stopOpacity="0"/>
                </linearGradient>
                <clipPath id="ph-clip">
                    <rect x={CX - 92} y={CY - 92} width="184" height="184"/>
                </clipPath>
                <filter id="ph-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2.6" result="b"/>
                    <feMerge>
                        <feMergeNode in="b"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <HudRings cx={CX} cy={CY}/>
            <ScanCorners cx={CX} cy={CY}/>
            <image href={carImage} className="ph-car"
                   x={CX - CAR_W / 2} y={CY - CAR_H / 2 + 2} width={CAR_W} height={CAR_H}/>
            <ScanLine cx={CX} cy={CY}/>
        </svg>
    </div>
);

export default ParkingHero;
