import React from 'react';
import {Pagination} from "antd";
import {useTranslation} from "react-i18next";


import styled from "styled-components";
export const PaginationStyles = styled(Pagination)`
  .ant-pagination-item, .ant-pagination-item-link, .ant-select-single:not(.ant-select-customize-input) .ant-select-selector  {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;

const DatabaseBlackPagination = (props) => {

    const {
        testTotal,
        testPaginationCurrent,
        testPaginationLimit,
        testPaginationOnchange,
        screenSize
    }=props

    const {t} = useTranslation();

    return<PaginationStyles
        dropdownRender = {false}
        defaultPageSize={testPaginationLimit}
        current={testPaginationCurrent}
        onChange={testPaginationOnchange}
        showSizeChanger={true}
        total={testTotal}
        pageSize={testPaginationLimit}
        pageSizeOptions={screenSize.width < 1500 ? [12, 24, 36, 48] : [20,40,80,100]}
        locale={{ items_per_page: t('sahifa') }}
    />;
};

export default DatabaseBlackPagination;