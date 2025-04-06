import {ONLINE_MANAG} from "./managmentTypes";

const initialState = {
    count : 0
}

export const managmentReducer = (state= initialState , action)=>{
    if (action.types = ONLINE_MANAG){
        return{
            ...state,
            ...action.payload
        }
    }
    return state
}

