import axios from "axios";
import {message} from "antd";
import i18n from "../i18n";
import {ip} from "../ip";
import {store} from "../redux/store";
import {LoginFailure} from "../redux/action/action";

/* Barcha axios so'rovlari uchun umumiy javob qoidalari (komponentlar axios'ni to'g'ridan-to'g'ri ishlatadi —
   interceptor global instansiyaga qo'yilgani uchun hammasiga ta'sir qiladi).

   401 — token eskirgan yoki yaroqsiz: foydalanuvchi tizimdan chiqariladi va /login sahifasiga o'tkaziladi.
         (aks holda har bir amal "Xatolik" berib, sahifa "kirgan" holatda osilib qolardi)
         /api/sign-in bundan mustasno — u yerda 401 "login yoki parol noto'g'ri" degani.
   5xx — server ichki xatosi: matni (masalan SQL xatosi) foydalanuvchiga ko'rsatilmaydi,
         sahifalar o'zining umumiy "Xatolik" xabarini chiqaradi. */

const TOKEN_KEY = 'vipparking-token';

const EXPIRY_QUIET_MS = 5000;
let expiredAt = 0;

const expireSession = () => {
    // bir vaqtda ketgan bir nechta so'rov uchun xabar bir marta chiqadi (token birinchisida o'chadi)
    if (!localStorage.getItem(TOKEN_KEY)) return;
    expiredAt = Date.now();
    localStorage.removeItem(TOKEN_KEY);
    // manzil dispatch'dan OLDIN almashtiriladi: LoginFailure'dan keyin App.js yangi BrowserRouter'ni
    // o'rnatadi va u joriy manzilni o'qiydi — shu sabab ochiq sahifa ('/') emas, to'g'ridan-to'g'ri /login ochiladi
    window.history.replaceState(null, '', '/login');
    store.dispatch(LoginFailure());
    message.warning(i18n.t("Sessiya muddati tugadi. Qaytadan kiring."));
};

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url || '';

        if (status === 401 && !url.includes('/api/sign-in')) {
            expireSession();
            // sessiya tugashi bilan bog'liq 401 sahifaga yetkazilmaydi (promise ochiq qoladi): aks holda sahifaning
            // o'z catch'i "Sessiya muddati tugadi" yoniga backend matnini ("Fail to authentification") ham chiqarardi
            if (Date.now() - expiredAt < EXPIRY_QUIET_MS) return new Promise(() => {});
        }

        const data = error?.response?.data;
        if (status >= 500 && data && typeof data === 'object' && !(data instanceof Blob) && 'msg' in data) {
            delete data.msg;
        }

        return Promise.reject(error);
    },
);

/* So'rovsiz ham chiqarish: token JWT bo'lsa, ichidagi `exp` vaqtiga taymer qo'yiladi — foydalanuvchi hech narsa
   bosmasa ham muddat tugaganda /login ochiladi. Doimiy so'rov yuborilmaydi.

   Muddat kelganda brauzer soatiga ishonilmaydi (kompyuter soati oldinda bo'lsa, yaroqli token bilan ham
   chiqarib yuborardi): /api/me ga BITTA so'rov ketadi, 401 kelsa yuqoridagi interceptor chiqaradi.
   Server tokenni hali yaroqli desa, MAX_VERIFY martagacha qayta tekshiriladi, so'ng taymer to'xtaydi.

   Token JWT bo'lmasa yoki `exp` bo'lmasa — taymer qo'yilmaydi, faqat 401 qoidasi ishlaydi. */

const MAX_TIMEOUT = 2147483647; // setTimeout chegarasi (~24.8 kun)
const VERIFY_RETRY_MS = 60000;
const MAX_VERIFY = 5;

let watchedToken = null;
let timer = null;
let verifyCount = 0;

const getTokenExpiry = (token) => {
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const {exp} = JSON.parse(atob(payload));
        return typeof exp === 'number' ? exp * 1000 : null;
    } catch {
        return null;
    }
};

const verifySession = (token) => {
    if (verifyCount >= MAX_VERIFY) return;
    verifyCount += 1;
    axios.get(`${ip}/api/me`, {headers: {'x-access-token': token}})
        .then(() => {
            if (watchedToken === token) timer = setTimeout(checkSession, VERIFY_RETRY_MS);
        })
        .catch(() => {
        });
};

function checkSession() {
    clearTimeout(timer);
    timer = null;

    const token = localStorage.getItem(TOKEN_KEY);
    if (token !== watchedToken) {
        watchedToken = token;
        verifyCount = 0;
    }
    if (!token) return;

    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    const left = expiry - Date.now();
    if (left > 0) {
        timer = setTimeout(checkSession, Math.min(left + 1000, MAX_TIMEOUT));
    } else {
        verifySession(token);
    }
}

// login / logout — token almashganda taymer qayta quriladi
store.subscribe(() => {
    if (localStorage.getItem(TOKEN_KEY) !== watchedToken) checkSession();
});

// tab fonda yoki kompyuter uyquda bo'lsa taymer kechikadi — qaytganda qayta tekshiriladi
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && timer) checkSession();
});

checkSession();
