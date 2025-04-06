
import { ActionType } from "../constants";

const LoginFailure = () => {
    return { type: ActionType.LOGIN_FAILURE };
};

const LOGIN_REQUEST = () => {
    return { type: ActionType.LOGIN_REQUEST };
};
const loginResponse = () => {
    return { type: ActionType.LOGIN_RESPONSE };
};

const LoginSuccess = (data) => {
    return {
        type: ActionType.LOGIN_SUCCESS,
        data,
    };
};
const getMeAction = (data) => {
    return {
        payload: data,
        type: ActionType.GET_ME,
    };
};

const changeAvatar = (path) => {
    return {
        payload: path,
        type: ActionType.AVATAR_CHANGE,
    };
};

export {
    LoginSuccess,
    LoginFailure,
    LOGIN_REQUEST,
    loginResponse,
    getMeAction,
    changeAvatar,
};
