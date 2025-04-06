import React from 'react';
import {Pagination} from "antd";

const UserListPagination = (props) => {

    const {
        staffTotal,
        staffPaginationCurrent,
        staffPaginationLimit,
        staffPaginationOnchange
    } = props;

    return<Pagination
        dropdownRender = {false}
        defaultPageSize={staffPaginationLimit}
        current={staffPaginationCurrent}
        onChange={staffPaginationOnchange}
        showSizeChanger={true}
        total={staffTotal}
        pageSize={staffPaginationLimit}
        pageSizeOptions={[15, 30, 50, 100]}
        locale={{ items_per_page: 'sahifa' }}
    />;
};

export default UserListPagination;