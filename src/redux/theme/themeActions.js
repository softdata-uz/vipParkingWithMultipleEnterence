import axios from "axios";
import {ip} from "../../ip";
import {
    GET_THEME,
    IS_REFRESH,
    INPUT_VALUE,

} from "./themeTypes";


export const getTheme =(data) =>{
    return {
        type: GET_THEME,
        payload: data
    }
}

export const isRefresh =(data) =>{
    return {
        type: IS_REFRESH,
        payload: data
    }
}

export const inputValue = (data) =>{
    return{
        type: INPUT_VALUE,
        payload:data
    }
}

export const getManagment = () =>{
    axios.get(ip + "/api/viewercount")
        .then((res)=>{
            // console.log(res)
        })
}

export const putManagment =(index)=>{
    // console.log("redux ga keldi :" + index)
}

