import {
    GET_THEME,
    IS_REFRESH,
    INPUT_VALUE,
} from "./themeTypes";

const initialState = {
    theme_data: false,
    is_refresh_value: null,
    count : 0,
}

const themeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_THEME:
            return {
                ...state,
                theme_data: action.payload
            }
        case IS_REFRESH:
            return {
                ...state,
                is_refresh_value: action.payload
            }
        case INPUT_VALUE:
            return {
                ...state,
                input_value: action.payload
            }
        default: return state
    }
}

export default themeReducer
