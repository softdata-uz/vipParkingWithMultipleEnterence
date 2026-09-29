import React from 'react';
import {Pagination} from "antd";

const UserListPagination = ({staffPaginationLimit, staffPaginationCurrent, staffPaginationOnchange, staffTotal}) => {
    return (
        <Pagination
            current={staffPaginationCurrent}
            pageSize={staffPaginationLimit}
            total={staffTotal ?? 0}
            onChange={staffPaginationOnchange}
            showSizeChanger
            pageSizeOptions={[15, 30, 50, 100]}
        />
    );
};

export default UserListPagination;
