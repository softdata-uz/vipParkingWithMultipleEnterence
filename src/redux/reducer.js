import { ActionType } from "./constants";
import storage from "../services/storage";

const token = storage.local.get("token");
const user = storage.local.get("user");

/**
 * Logout paytida SAQLANIB QOLADIGAN kalitlar.
 *
 * Muammo: LOGIN_FAILURE da window.localStorage.clear() chaqirilardi va u
 * BUTUN localStorage'ni tozalardi — token/user bilan birga ekran
 * sozlamalari ham o'chib ketardi. Shuning uchun tizimdan chiqib qayta
 * kirganda MultipleEnterence sahifasidagi oynalar soni default (3) ga
 * qaytib qolardi.
 *
 * Yangi kalit qo'shilsa — faqat shu ro'yxatga yoziladi.
 * Manba: src/components/.../MultipleEnterence.jsx
 */
const PRESERVED_KEYS = ["viewerCount", "viewerIds"];

/**
 * clear() ning o'zi o'zgarmaydi — qolgan barcha kalitlar avvalgidek
 * o'chiriladi, shuning uchun loyihaning boshqa qismlariga ta'sir qilmaydi.
 * Faqat yuqoridagi ro'yxatdagi kalitlar tozalashdan oldin olinib,
 * keyin joyiga qaytariladi.
 */
const clearStorageExceptPreserved = () => {
    const preserved = [];

    PRESERVED_KEYS.forEach((key) => {
        const value = window.localStorage.getItem(key);
        if (value !== null) preserved.push([key, value]);
    });

    window.localStorage.clear();

    preserved.forEach(([key, value]) => {
        window.localStorage.setItem(key, value);
    });
};

const initialState = {
    user,
    token: token ?? "",
    isFetched: true,
    isAuthenticated: !! token,
};

export const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.LOGIN_REQUEST:
            return {
                ...state,
                isFetched: false,
            };
        case ActionType.LOGIN_RESPONSE:
            return {
                ...state,
                isFetched: true,
            };
        case ActionType.GET_ME: {
            const user = action.payload;
            storage.local.set("user", user);
            return {
                ...state,
                user: user,
                isAuthenticated : true
            };
        }
        case ActionType.LOGIN_SUCCESS: {
            const { accessToken , user } = action.data;
            storage.local.set("user", user);
            storage.local.set("token", accessToken);
            return {
                ...state,
                user : user,
                token: accessToken,
                isFetched: true,
                isAuthenticated: true,
            };
        }
        case ActionType.LOGIN_FAILURE:
            clearStorageExceptPreserved();
            return {
                ...state,
                user: {},
                token: "",
                isFetched: true,
                isAuthenticated: false,
            };
        case ActionType.AVATAR_CHANGE:
            return {
                ...state,
                user: {
                    ...state.user,
                    avatar_path: action.payload,
                },
            };
        default:
            return state;
    }
};