import React from 'react';
import {Pagination} from "antd";
import {useTranslation} from "react-i18next";

/**
 * Sahifaning pastki paneli: chapda "Jami: N", o'ngda pagination.
 * Barcha sahifalarda pagination shu komponent orqali PASTDA turadi (styles/page.css: .admin_body_pagination).
 */
const PagePagination = ({total, current, pageSize, onChange, pageSizeOptions = [20, 40, 60, 100]}) => {
    const {t} = useTranslation();
    // sahifa hajmi hali o'lchanmagan (useFitGrid) — panel baribir chiziladi, aks holda keyin paydo bo'lib
    // kontent sohasini qisqartiradi va birinchi o'lchov noto'g'ri chiqadi
    if (!pageSize) {
        return <div className="admin_body_pagination"><p>{t("Jami")}: <b>{total ?? 0}</b></p></div>;
    }

    return (
        <div className="admin_body_pagination">
            <p>{t("Jami")}: <b>{total ?? 0}</b></p>
            <Pagination
                current={current}
                pageSize={pageSize}
                total={total ?? 0}
                onChange={onChange}
                showSizeChanger
                pageSizeOptions={pageSizeOptions}
                locale={{items_per_page: t("sahifa")}}
            />
        </div>
    );
};

export default PagePagination;
