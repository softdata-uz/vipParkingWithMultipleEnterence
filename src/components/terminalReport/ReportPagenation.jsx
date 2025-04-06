import React from 'react';
import {Pagination} from "antd";

const ReportPagenation = (props) => {

    const {
        reportTotal,
        reportPaginationCurrent,
        reportPaginationLimit,
        reportPaginationOnchange
    }=props

    return<Pagination
        dropdownRender = {false}
        defaultPageSize={reportPaginationLimit}
        current={reportPaginationCurrent}
        onChange={reportPaginationOnchange}
        showSizeChanger={true}
        total={reportTotal}
        pageSize={reportPaginationLimit}
        pageSizeOptions={[15, 30, 50, 100]}
        locale={{ items_per_page: 'sahifa' }}
    />;
};

export default ReportPagenation;