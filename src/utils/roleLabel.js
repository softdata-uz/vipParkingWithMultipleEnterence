/* Admin rollari (Monitoring'dagi utils/roleLabel.js asosida).
   VIP'da "admin" alohida rol — "Admin" deb ko'rsatiladi (Monitoring'da "Operator" edi). */
const ROLE_LABELS = {
    king: 'King',
    superadmin: 'Super Admin',
    admin: 'Admin',
    operator: 'Operator',
};

/** Admin qo'shish/tahrirlash oynasida tanlanadigan rollar (King — faqat tizimda) */
export const ASSIGNABLE_ROLES = ['superadmin', 'admin', 'operator'];

export const getRoleLabel = (role, t) => {
    const key = ROLE_LABELS[role];
    return key ? t(key) : '...';
};

export const getRoleBadgeClass = (role) => {
    const known = ROLE_LABELS[role] ? role : 'superadmin';
    return `role-badge role-badge--${known}`;
};
