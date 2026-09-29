import React from 'react';

/**
 * Untitled UI uslubidagi chiziqli ikonkalar (1.5px stroke, 24x24 grid).
 * Rang `currentColor` orqali meros olinadi — token bilan boshqariladi.
 */

const base = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    xmlns: 'http://www.w3.org/2000/svg',
};

export const MonitorIcon = ({size = 18, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="2" y="4" width="20" height="13" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
    </svg>
);

export const GlobeIcon = ({size = 18, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <circle cx="12" cy="12" r="9"/>
        <path d="M3 12h18"/>
        <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z"/>
    </svg>
);

export const ChevronDownIcon = ({size = 16, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="m6 9 6 6 6-6"/>
    </svg>
);

export const ChevronLeftIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="m15 18-6-6 6-6"/>
    </svg>
);

export const ChevronRightIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="m9 18 6-6-6-6"/>
    </svg>
);

export const XCloseIcon = ({size = 16, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
);

export const FilterIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M3 5.5h18M6.5 12h11M10 18.5h4"/>
    </svg>
);

export const DownloadIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M12 3.5v11M7.5 10.5l4.5 4.5 4.5-4.5"/>
        <path d="M3.5 16v2.5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V16"/>
    </svg>
);

export const MailIcon = ({size = 18, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/>
        <path d="m3 7 8.2 5.5a1.5 1.5 0 0 0 1.6 0L21 7"/>
    </svg>
);

export const UserIcon = ({size = 18, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <circle cx="12" cy="8.2" r="3.8"/>
        <path d="M4.6 20.3a7.7 7.7 0 0 1 14.8 0"/>
    </svg>
);

export const LockIcon = ({size = 18, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="4" y="10.5" width="16" height="10" rx="2.5"/>
        <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>
    </svg>
);

export const EyeIcon = ({size = 18, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);

export const EyeOffIcon = ({size = 18, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M10.7 6.2A9.9 9.9 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.8 3.6M6.4 7.6A17 17 0 0 0 2.5 12S6 18 12 18a9.6 9.6 0 0 0 3.9-.8"/>
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
        <path d="m3 3 18 18"/>
    </svg>
);

export const ShieldIcon = ({size = 18, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M12 21s7.5-3.4 7.5-9.4V6.2L12 3.2 4.5 6.2v5.4C4.5 17.6 12 21 12 21Z"/>
    </svg>
);

export const ShieldTickIcon = ({size = 18, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M12 21s7.5-3.4 7.5-9.4V6.2L12 3.2 4.5 6.2v5.4C4.5 17.6 12 21 12 21Z"/>
        <path d="m9.2 11.8 2 2 3.6-3.6"/>
    </svg>
);

export const LockKeyholeIcon = ({size = 14, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/>
        <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/>
        <path d="M12 14.5v2"/>
    </svg>
);

export const CheckIcon = ({size = 14, ...rest}) => (
    <svg {...base} width={size} height={size} strokeWidth={2.4} {...rest}>
        <path d="m4.5 12.5 4.5 4.5 10.5-10.5"/>
    </svg>
);

export const AlertCircleIcon = ({size = 16, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 7.5v5M12 16h.01"/>
    </svg>
);

export const UsersIcon = ({size = 24, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <circle cx="9.5" cy="8" r="3.6"/>
        <path d="M3 20.2a6.8 6.8 0 0 1 13 0"/>
        <path d="M16.5 4.9a3.6 3.6 0 0 1 0 6.9M18 14.2a6.8 6.8 0 0 1 3 6"/>
    </svg>
);

export const MaleIcon = ({size = 24, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <circle cx="10" cy="14" r="6"/>
        <path d="M20 4l-5.8 5.8M15 4h5v5"/>
    </svg>
);

export const FemaleIcon = ({size = 24, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <circle cx="12" cy="9" r="5.6"/>
        <path d="M12 14.6V22M8.6 18.6h6.8"/>
    </svg>
);

export const PlaneIcon = ({size = 24, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M21 13.5 3.5 9.2a.6.6 0 0 1-.1-1.1l2-1.1a1.4 1.4 0 0 1 1.1-.1l3.3 1 4.4-2.5a2.3 2.3 0 0 1 2.3 4l-2 1.2"/>
        <path d="M10.4 15.6 8.7 19a1 1 0 0 1-.9.5H6.2a.6.6 0 0 1-.5-.9l1.7-3.4"/>
    </svg>
);

export const BriefcaseIcon = ({size = 24, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="2.8" y="7.5" width="18.4" height="12.5" rx="2.4"/>
        <path d="M8.4 7.5V6a2 2 0 0 1 2-2h3.2a2 2 0 0 1 2 2v1.5"/>
        <path d="M2.8 12.6h18.4"/>
    </svg>
);

export const GridIcon = ({size = 22, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="3" y="3" width="7.5" height="7.5" rx="2"/>
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/>
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/>
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>
    </svg>
);

export const BarChartIcon = ({size = 22, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M3.5 20.5h17"/>
        <path d="M7 20.5v-6.5M12 20.5v-11M17 20.5v-8"/>
    </svg>
);

export const TableIcon = ({size = 22, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="3" y="4.5" width="18" height="15" rx="2.5"/>
        <path d="M3 9.5h18M9.5 9.5v10M3 14.5h18"/>
    </svg>
);

export const CalendarIcon = ({size = 22, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="3" y="5" width="18" height="16" rx="2.5"/>
        <path d="M3 10h18M8 3v4M16 3v4"/>
    </svg>
);

export const HierarchyIcon = ({size = 22, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="9" y="2.5" width="6" height="5" rx="1.6"/>
        <rect x="2.5" y="16.5" width="6" height="5" rx="1.6"/>
        <rect x="15.5" y="16.5" width="6" height="5" rx="1.6"/>
        <path d="M12 7.5v4.2M5.5 16.5v-2.4a1.4 1.4 0 0 1 1.4-1.4h10.2a1.4 1.4 0 0 1 1.4 1.4v2.4"/>
    </svg>
);

export const UserCheckIcon = ({size = 22, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <circle cx="9.5" cy="8" r="3.8"/>
        <path d="M3 20.4a6.8 6.8 0 0 1 13 0"/>
        <path d="m16.5 11 2 2 4-4"/>
    </svg>
);

export const PanelLeftIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="3" y="4" width="18" height="16" rx="2.5"/>
        <path d="M9.5 4v16"/>
    </svg>
);

export const BellIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M18 9a6 6 0 0 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9Z"/>
        <path d="M13.7 19.5a2 2 0 0 1-3.4 0"/>
    </svg>
);

export const SunIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <circle cx="12" cy="12" r="4.2"/>
        <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
    </svg>
);

export const MoonIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z"/>
    </svg>
);

export const LogOutIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M9.5 20.5H6a2.5 2.5 0 0 1-2.5-2.5V6A2.5 2.5 0 0 1 6 3.5h3.5"/>
        <path d="M16 16.5l4.5-4.5L16 7.5M20.5 12H9.5"/>
    </svg>
);

export const EditIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M16.5 3.9a2.3 2.3 0 0 1 3.3 3.3L8.4 18.6l-4.3 1 1-4.3Z"/>
    </svg>
);

export const SettingsIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <circle cx="12" cy="12" r="3.2"/>
        <path d="M19.4 14.4a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/>
    </svg>
);

export const SearchIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <circle cx="11" cy="11" r="7"/>
        <path d="m20 20-3.6-3.6"/>
    </svg>
);

export const PlusIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M12 4.5v15M4.5 12h15"/>
    </svg>
);

export const TrashIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M3.5 6.5h17M9 6.5V5a1.8 1.8 0 0 1 1.8-1.8h2.4A1.8 1.8 0 0 1 15 5v1.5"/>
        <path d="M18.5 6.5 17.8 19a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5.5 6.5"/>
        <path d="M10 11v5.5M14 11v5.5"/>
    </svg>
);

export const UnlockIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="4" y="10.5" width="16" height="10" rx="2.5"/>
        <path d="M8 10.5V7.5a4 4 0 0 1 7.7-1.5"/>
    </svg>
);

export const ImageUploadIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M20.5 14.5V6.5a2 2 0 0 0-2-2h-13a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h9"/>
        <circle cx="9" cy="9.5" r="1.6"/>
        <path d="m3.8 16.2 4.4-4a2 2 0 0 1 2.7 0l3.4 3.1"/>
        <path d="M18 16v6M15 19h6"/>
    </svg>
);

export const RefreshIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M20 11.5A8 8 0 0 0 6.2 6.3L3.5 9"/>
        <path d="M4 12.5a8 8 0 0 0 13.8 5.2L20.5 15"/>
        <path d="M3.5 4v5h5M20.5 20v-5h-5"/>
    </svg>
);

export const ArrowRightIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M4.5 12h15M13.5 6l6 6-6 6"/>
    </svg>
);

export const ArrowLeftIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>
    </svg>
);

/** O'sish belgisi — ko'rsatkich kartalaridagi "o'tgan oyga nisbatan" o'qi. */
export const ArrowUpRightIcon = ({size = 16, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M6.5 17.5 17.5 6.5M8.5 6.5h9v9"/>
    </svg>
);

export const ArrowDownRightIcon = ({size = 16, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M6.5 6.5 17.5 17.5M17.5 8.5v9h-9"/>
    </svg>
);

/** Google brend belgisi — rasmiy 4 rangli "G". */
export const GoogleIcon = ({size = 20, ...rest}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...rest}>
        <path fill="#4285F4"
              d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.53 5.53 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.8Z"/>
        <path fill="#34A853"
              d="M12 24c3.24 0 5.96-1.08 7.94-2.93l-3.88-3a7.2 7.2 0 0 1-10.72-3.78H1.32v3.09A12 12 0 0 0 12 24Z"/>
        <path fill="#FBBC05"
              d="M5.34 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.32a12 12 0 0 0 0 10.76l4.02-3.09Z"/>
        <path fill="#EA4335"
              d="M12 4.77a6.5 6.5 0 0 1 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.32 6.62l4.02 3.09A7.2 7.2 0 0 1 12 4.77Z"/>
    </svg>
);

export const UploadCloudIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M6.5 16.5a4 4 0 0 1 .4-8A5.5 5.5 0 0 1 17.6 9.6a3.9 3.9 0 0 1-.1 7.8"/>
        <path d="M12 20.5v-8M9 15l3-3 3 3"/>
    </svg>
);

export const FileTextIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M13.5 3.2H7a2 2 0 0 0-2 2v13.6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.7l-5.5-5.5Z"/>
        <path d="M13.5 3.2v5.5H19"/>
        <path d="M8.5 13h7M8.5 16.5h5"/>
    </svg>
);

/** Bo'sh quti — "hali ma'lumot yo'q" holati uchun. */
export const InboxIcon = ({size = 24, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M3.5 13.5 6 5.6A2 2 0 0 1 7.9 4.2h8.2a2 2 0 0 1 1.9 1.4l2.5 7.9"/>
        <path d="M3.5 13.5h4l1.2 2.4h6.6l1.2-2.4h4v4.3a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-4.3Z"/>
    </svg>
);

/** Bayroqcha — kalendarda bayram kunini belgilash uchun. */
export const FlagIcon = ({size = 18, filled = false, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M5.5 3.5v17"/>
        <path
            d="M5.5 4.5h9.8l-1.4 3.6 1.4 3.6H5.5z"
            fill={filled ? 'currentColor' : 'none'}
        />
    </svg>
);

export const ClockIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 7v5.2l3.4 2"/>
    </svg>
);

/** Soat + orqaga qaytish o'qi — "kech ketish / o'tgan vaqt" ma'nosida. */
export const ClockRewindIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/>
        <path d="M3.2 4.5v4.2h4.2"/>
        <path d="M12 7.5v4.8l3.2 1.9"/>
    </svg>
);

/** Qum soati — "kech qolish" ko'rsatkichi uchun. */
export const HourglassIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M6.5 3.5h11M6.5 20.5h11"/>
        <path d="M8 3.5v3.2c0 1.4 1.2 2.4 2.4 3.6L12 12l-1.6 1.7c-1.2 1.2-2.4 2.2-2.4 3.6v3.2"/>
        <path d="M16 3.5v3.2c0 1.4-1.2 2.4-2.4 3.6L12 12l1.6 1.7c1.2 1.2 2.4 2.2 2.4 3.6v3.2"/>
    </svg>
);

/** Slayder tutqichlari — jadval ustunlarini sozlash tugmasi uchun. */
export const SlidersIcon = ({size = 20, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M3.5 7.5h5M13.5 7.5h7M3.5 16.5h7M15.5 16.5h5"/>
        <circle cx="11" cy="7.5" r="2.5"/>
        <circle cx="13" cy="16.5" r="2.5"/>
    </svg>
);


/** "P" belgisi — avtoturargoh. */
export const ParkingIcon = ({size = 22, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="3"/>
        <path d="M9.5 16.5v-9h3.25a2.75 2.75 0 0 1 0 5.5H9.5"/>
    </svg>
);

/** Shlagbaum — sun'iy to'siq: ustun, chiziqli yog'och, tayanch. */
export const BarrierIcon = ({size = 22, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="3" y="8" width="4" height="12.5" rx="1"/>
        <path d="M2 20.5h6"/>
        <path d="M7 9.5h13.5a1.5 1.5 0 0 1 0 3H7"/>
        <path d="M11.5 9.5 10 12.5M15.5 9.5 14 12.5M19.5 9.5 18 12.5"/>
        <path d="M18.5 12.5v8M17 20.5h3"/>
    </svg>
);

/** Ikki varaq — nusxa olish. */
export const CopyIcon = ({size = 16, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <rect x="8.5" y="8.5" width="12" height="12" rx="2"/>
        <path d="M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/>
    </svg>
);

/** Kuzatuv kamerasi. */
export const CameraIcon = ({size = 18, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M15.5 10.5 20.3 7.8a.8.8 0 0 1 1.2.7v7a.8.8 0 0 1-1.2.7l-4.8-2.7"/>
        <rect x="2.5" y="6.5" width="13" height="11" rx="2"/>
    </svg>
);

/** Kuzatuv kamerasi — devordagi kronshteynga o'rnatilgan (chizma: Lucide "cctv", ISC). */
export const CctvIcon = ({size = 22, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="M16.75 12h3.63a1 1 0 0 1 .9 1.45l-2.04 4.07a1 1 0 0 1-1.7.13l-2.13-2.97"/>
        <path d="M17.1 9.05a1 1 0 0 1 .45 1.34l-3.1 6.22a1 1 0 0 1-1.35.44L3.6 12.3a2.92 2.92 0 0 1-1.3-3.91L3.7 5.6a2.92 2.92 0 0 1 3.91-1.3z"/>
        <path d="M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15"/>
        <path d="M2 21v-4"/>
        <path d="M7 9h.01"/>
    </svg>
);

/** Avtomobil — old tomondan (chizma: Lucide "car-front", ISC). */
export const CarFrontIcon = ({size = 22, ...rest}) => (
    <svg {...base} width={size} height={size} {...rest}>
        <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.65 5H8.4a2 2 0 0 0-1.9 1.26L5 10 3 8"/>
        <path d="M7 14h.01M17 14h.01"/>
        <rect x="3" y="10" width="18" height="8" rx="2"/>
        <path d="M5 18v2M19 18v2"/>
    </svg>
);
