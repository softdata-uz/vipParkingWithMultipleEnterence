
import { ActionType } from "./constants";
import storage from "../services/storage";

const token = storage.local.get("token");
const user = storage.local.get("user");

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
            window.localStorage.clear();
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
