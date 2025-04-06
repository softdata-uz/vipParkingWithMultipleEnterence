import React from 'react';
import {Pagination} from "antd";

const CameraPagination = (props) => {

    const {
        cameraTotal,
        cameraPaginationCurrent,
        cameraPaginationLimit,
        cameraPaginationOnchange
    }=props

    return<Pagination
        dropdownRender = {false}
        defaultPageSize={cameraPaginationLimit}
        current={cameraPaginationCurrent}
        onChange={cameraPaginationOnchange}
        showSizeChanger={true}
        total={cameraTotal}
        pageSize={cameraPaginationLimit}
        pageSizeOptions={[15, 30, 50, 100]}
        locale={{ items_per_page: 'sahifa' }}
    />;
};

export default CameraPagination;