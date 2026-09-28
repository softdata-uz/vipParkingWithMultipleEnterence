import axios from "axios";
import {ip} from "../../../ip";
import {EXPIRING_DAYS} from "../../../utils/staffPeriod";

const auth = () => ({'x-access-token': localStorage.getItem('vipparking-token')});

/** Raqamni solishtirish uchun: bo'shliqsiz, katta harfda */
export const normalizePlate = (plate) => (plate || '').toString().replace(/\s+/g, '').toUpperCase();

/* Muddati tugayotgan (EXPIRING_DAYS kun ichida) / o'tgan xodimlar — bitta yengil so'rov bilan
   (backend: GET /api/staff-expiring-summary?days=). Avval har bir guruh uchun alohida
   /api/staff/:groupId so'rovi yuborilardi — karta ro'yxati ochilganda ham barcha xodimlar
   yuklanardi, endi shart emas: DatabaseAdd.jsx guruh xodimlarini faqat o'sha guruh kartasi
   ochilganda (drill-down) o'zi alohida yuklaydi. */
export const fetchExpiringSummary = async () => {
    const {data} = await axios.get(`${ip}/api/staff-expiring-summary`, {
        params: {days: EXPIRING_DAYS},
        headers: auth(),
    });
    return (data?.data || []).map(s => ({...s, group: {id: s.group_id, name: s.group_name}}));
};
