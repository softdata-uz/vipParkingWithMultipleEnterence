/* localStorage ustidan yupqa wrapper. Login.js token'ni to'g'ridan-to'g'ri
   'vipparking-token' kaliti bilan yozadi (localStorage.setItem) — shuning uchun
   "token" mantiqiy kaliti xuddi shu haqiqiy kalitga moslanadi, aks holda
   App.js sahifa yangilanganda tokenni topa olmay qoladi. */
const KEY_MAP = {
    token: "vipparking-token",
    user: "vipparking-user",
};

const resolveKey = (key) => KEY_MAP[key] || key;

const get = (key) => {
    const raw = window.localStorage.getItem(resolveKey(key));
    if (raw === null) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return raw;
    }
};

const set = (key, value) => {
    const raw = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(resolveKey(key), raw);
};

const remove = (key) => {
    window.localStorage.removeItem(resolveKey(key));
};

const storage = {
    local: {get, set, remove},
};

export default storage;
