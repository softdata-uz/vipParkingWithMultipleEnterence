/* RBAC: har bir bo'lim uchun ruxsat etilgan rollar.
   operator — faqat Joriy holat va Hisobot; admin — bulardan tashqari Xodimlar ham, Sozlamalar yo'q;
   superadmin/king — hammasi. King backend'da alohida yaratiladi (Settings > Adminlar ro'yxatida ko'rinmaydi,
   superadmin uni yarata olmaydi — src/utils/roleLabel.js: ASSIGNABLE_ROLES). */

export const ROLE_HOME = {
    operator: '/status',
    admin: '/employees',
    superadmin: '/employees',
    king: '/employees',
};

const ACCESS = {
    '/employees': ['admin', 'superadmin', 'king'],
    '/status': ['operator', 'admin', 'superadmin', 'king'],
    '/report': ['operator', 'admin', 'superadmin', 'king'],
    '/terminal-report': ['operator', 'admin', 'superadmin', 'king'],
    '/setting': ['superadmin', 'king'],
};

/** Yo'l uchun ro'yxatda yo'q bo'lsa — cheklovsiz (masalan /login) */
export const canAccess = (path, role) => {
    const key = Object.keys(ACCESS).find((p) => path === p || path.startsWith(`${p}/`));
    if (!key) return true;
    return ACCESS[key].includes(role);
};
