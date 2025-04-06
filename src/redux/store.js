
import themeReducer from './theme/themeReducer';
import {managmentReducer} from "./onlineManag/managmentReducer";
import {createStore, combineReducers} from "redux";
import {Reducer} from "./reducer";


const allReducers = combineReducers({
    theme: themeReducer,
    terminal: managmentReducer,
    auth: Reducer,
});

export const store = createStore(allReducers);
