import axios from "axios";
import {message} from "antd";
import i18n from "../i18n";
import {store} from "../redux/store";
import {LoginFailure} from "../redux/action/action";

/* Barcha axios so'rovlari uchun umumiy javob qoidalari (komponentlar axios'ni to'g'ridan-to'g'ri ishlatadi —
   interceptor global instansiyaga qo'yilgani uchun hammasiga ta'sir qiladi).

   401 — token eskirgan yoki yaroqsiz: foydalanuvchi tizimdan chiqariladi va kirish sahifasiga qaytadi.
         (aks holda har bir amal "Xatolik" berib, sahifa "kirgan" holatda osilib qolardi)
         /api/sign-in bundan mustasno — u yerda 401 "login yoki parol noto'g'ri" degani.
   5xx — server ichki xatosi: matni (masalan SQL xatosi) foydalanuvchiga ko'rsatilmaydi,
         sahifalar o'zining umumiy "Xatolik" xabarini chiqaradi. */

const TOKEN_KEY = 'vipparking-token';

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url || '';

        if (status === 401 && !url.includes('/api/sign-in') && localStorage.getItem(TOKEN_KEY)) {
            // bir vaqtda ketgan bir nechta so'rov uchun xabar bir marta chiqadi (token birinchisida o'chadi)
            localStorage.removeItem(TOKEN_KEY);
            store.dispatch(LoginFailure());
            message.warning(i18n.t("Sessiya muddati tugadi. Qaytadan kiring."));
        }

        const data = error?.response?.data;
        if (status >= 500 && data && typeof data === 'object' && !(data instanceof Blob) && 'msg' in data) {
            delete data.msg;
        }

        return Promise.reject(error);
    },
);
