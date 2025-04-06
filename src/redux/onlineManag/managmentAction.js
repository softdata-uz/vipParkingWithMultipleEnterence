
import axios from "axios";
import {ONLINE_MANAG} from "./managmentTypes";
import {ip} from "../../ip";

export function updateState(data) {
    return {
        type: ONLINE_MANAG,
        payload: data
    }
}

export const getManag = () => (dispatch) => {
    axios.get(ip + "/api/viewercount")
        .then((res)=>{
            // console.log(res)
            dispatch(updateState({count : res.data[0].count}));
        })
}

export const putManag = (index) => (dispatch) => {
    axios.put(ip + "/api/viewer/" + index, {count: index})
        .then((res) => {
            // console.log(res);
        })
}
