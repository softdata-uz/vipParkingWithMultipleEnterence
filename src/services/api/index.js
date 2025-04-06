import qs from "qs";
import axios from "axios";
import {ip} from "../../ip";
import {store} from '../../redux/store';

const api = axios.create({
    baseURL: ip,
});

const createExtraParams = (config) => {
    const { url = "", params = {} } = config;
    if (params.extra !== undefined) {
        const { extra, ...restParams } = params;
        const mergedParams = { ...restParams, ...(extra || {}), extra: undefined };

        return `${url}?${qs.stringify(mergedParams)}`;
    }
    return url;
};
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.token;

        const updatedConfig = {
            ...config,
            url: createExtraParams(config),
            params: {},
            headers: {
                ...config.headers,
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        };
        return updatedConfig;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { status } = error.response;

        if (status === 401) {
            window.localStorage.clear();
            window.location.reload();
        }

        return Promise.reject(error);
    }
);

export default api;
