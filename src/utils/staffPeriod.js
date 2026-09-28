import dayjs from "dayjs";

/** Ruxsat muddati tugashiga shuncha kun yoki kamroq qolsa — "tugayotgan" */
export const EXPIRING_DAYS = 7;

/**
 * Xodimning ruxsat muddati holati.
 * @returns {{status: 'active'|'expiring'|'expired'|'upcoming', daysLeft: number|null}}
 *   expiring — bugundan boshlab EXPIRING_DAYS kun ichida tugaydi (daysLeft: 0 — bugun oxirgi kun)
 */
export const periodStatus = (from, to) => {
    const today = dayjs().startOf('day');
    const end = to ? dayjs(to).startOf('day') : null;
    const start = from ? dayjs(from).startOf('day') : null;

    if (end && end.isBefore(today)) return {status: 'expired', daysLeft: null};
    if (start && start.isAfter(today)) return {status: 'upcoming', daysLeft: null};
    const daysLeft = end ? end.diff(today, 'day') : null;
    if (daysLeft !== null && daysLeft <= EXPIRING_DAYS) return {status: 'expiring', daysLeft};
    return {status: 'active', daysLeft};
};

export const formatDate = (d) => (d ? dayjs(d).format("DD.MM.YYYY") : '—');

/** Holat belgisi: [ds-badge klassi, matn] */
export const periodBadge = ({status, daysLeft}, t) => ({
    active: ['ds-badge--success', t("Faol")],
    expiring: ['ds-badge--warning', daysLeft === 0 ? t("Bugun tugaydi") : t("{{count}} kun qoldi", {count: daysLeft})],
    expired: ['ds-badge--error', t("Muddati o'tgan")],
    upcoming: ['ds-badge--blue', t("Kutilmoqda")],
}[status]);
