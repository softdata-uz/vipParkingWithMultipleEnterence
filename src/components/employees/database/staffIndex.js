import axios from "axios";
import {ip} from "../../../ip";

/* Barcha guruhlardagi xodimlar indeksi — muddati tugayotgan xodimlarni aniqlash uchun.
   Guruhlar odatda o'nlab, xodimlar yuzlab bo'ladi: xodimi bor guruhlar parallel so'raladi. */

const ALL = 1000;
const auth = () => ({'x-access-token': localStorage.getItem('vipparking-token')});

/** Raqamni solishtirish uchun: bo'shliqsiz, katta harfda */
export const normalizePlate = (plate) => (plate || '').toString().replace(/\s+/g, '').toUpperCase();

/** @returns {Promise<Array>} har bir xodim + uning guruhi: {...staff, group} */
export const fetchAllStaff = async (groups) => {
    const withStaff = (groups || []).filter(g => Number(g.item_count) > 0);
    const results = await Promise.all(withStaff.map(g =>
        axios.get(`${ip}/api/staff/${g.id}/${ALL}/1`, {params: {searched_data: ''}, headers: auth()})
            .then(({data}) => (data?.data || []).map(s => ({...s, group: g})))
            .catch(() => [])));
    return results.flat();
};
