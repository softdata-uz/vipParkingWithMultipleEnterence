import {ActionType} from "../constants";

export const LOGIN_REQUEST = () => ({type: ActionType.LOGIN_REQUEST});
export const loginResponse = () => ({type: ActionType.LOGIN_RESPONSE});
export const getMeAction = (user) => ({type: ActionType.GET_ME, payload: user});
export const LoginSuccess = (data) => ({type: ActionType.LOGIN_SUCCESS, data});
export const LoginFailure = () => ({type: ActionType.LOGIN_FAILURE});
export const AvatarChange = (avatarPath) => ({type: ActionType.AVATAR_CHANGE, payload: avatarPath});
