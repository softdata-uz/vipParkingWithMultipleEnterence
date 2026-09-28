import {useEffect, useLayoutEffect, useRef, useState} from 'react';

/**
 * Kartalar to'rining ustunlar sonini soha kengligiga moslaydi. Qatorlar soni belgilangan (standart 2),
 * kartalar o'z tabiiy balandligida qoladi — sohani to'ldirish uchun cho'zilmaydi.
 * Sahifadagi kartalar soni: perPage = cols × rows.
 *
 * @param minWidth  kartaning eng kichik kengligi
 * @param rows      sahifadagi qatorlar soni
 * @param gap, pad  styles/page.css dagi .page_grid bilan bir xil (spacing-xl = 16, spacing-2xl = 20)
 * @returns {ref, cols, rows, perPage} — ref skroll bo'ladigan sohaga (.admin_body_table) qo'yiladi
 */
const useFitGrid = ({minWidth, rows = 2, gap = 16, pad = 20}) => {
    /* callback ref: soha qayta chizilsa (masalan ichki sahifadan orqaga qaytilganda) yangi element
       darhol kuzatuvga olinadi — oddiy ref bilan eski, sahifadan olib tashlangan element kuzatilib qolardi */
    const [node, setNode] = useState(null);
    const [cols, setCols] = useState(0);

    useLayoutEffect(() => {
        const el = node;
        if (!el) return undefined;

        const measure = () => {
            // yashirin / olib tashlangan element (0 kenglik) — o'lchov hisobga olinmaydi
            if (!el.isConnected || el.clientWidth === 0) return;
            const width = el.clientWidth - 2 * pad;
            setCols(Math.max(1, Math.floor((width + gap) / (minWidth + gap))));
        };

        measure();
        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', measure);
            return () => window.removeEventListener('resize', measure);
        }
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [node, minWidth, gap, pad]);

    return {ref: setNode, cols, rows, perPage: cols * rows};
};

/** O'lchangan ustunlar sonini .page_grid ga beradi (o'lchanmaguncha — CSS dagi auto-fill) */
export const gridStyle = ({cols}) => (cols
    ? {gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`}
    : undefined);

/**
 * useFitGrid ga bog'langan sahifalash: sahifa hajmi — ekranga sig'adigan kartalar soni (perPage)
 * yoki uning karralari (1×, 2×, 3×, 4×). Ekran o'lchami o'zgarib hajm o'zgarsa, foydalanuvchi
 * ko'rayotgan birinchi karta yangi sahifada ham ko'rinadigan qilib sahifa qayta hisoblanadi.
 * limit 0 bo'lsa — hali o'lchanmagan, so'rov yuborilmaydi.
 */
export const useGridPaging = (perPage) => {
    const [page, setPage] = useState(1);
    const [multiplier, setMultiplier] = useState(1);
    const limit = perPage * multiplier;
    const prevLimitRef = useRef(limit);

    useEffect(() => {
        const prev = prevLimitRef.current;
        if (prev && limit && prev !== limit) {
            setPage(p => Math.floor(((p - 1) * prev) / limit) + 1);
        }
        prevLimitRef.current = limit;
    }, [limit]);

    const sizeOptions = perPage ? [1, 2, 3, 4].map(m => perPage * m) : [];

    const onChange = (nextPage, nextSize) => {
        const next = Math.max(1, Math.round(nextSize / perPage));
        if (next !== multiplier) setMultiplier(next);   // sahifa effektda qayta hisoblanadi
        else setPage(nextPage);
    };

    return {page, setPage, limit, sizeOptions, onChange};
};

export default useFitGrid;
