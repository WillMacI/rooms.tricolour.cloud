import React from 'react';
import { Table } from 'antd';

const DataTable = ({ columns, data, loading }) => {
    return <Table columns={columns} dataSource={data} loading={loading} rowKey="uuid" />;
};

export default DataTable;
