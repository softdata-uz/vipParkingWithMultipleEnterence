import React from 'react';
import {Pagination} from "antd";
import {useTranslation} from "react-i18next";
import {PaginationStyles} from "../DatabaseBlackPagination";

const DatabaseAddPagination = (props) => {

    const {
        listTotal,
        listPaginationCurrent,
        listPaginationLimit,
        listPaginationOnchange,
        screenSize
    } = props

    const {t} = useTranslation();

    return <Pagination
        dropdownRender={false}
        defaultPageSize={listPaginationLimit}
        current={listPaginationCurrent}
        onChange={listPaginationOnchange}
        showSizeChanger={true}
        total={listTotal}
        pageSize={listPaginationLimit}
        pageSizeOptions={screenSize.width < 1500 ? [12, 24, 36, 48] : [20,40,80,100]}
        locale={{items_per_page: t('sahifa')}}
    />;
};

export default DatabaseAddPagination;