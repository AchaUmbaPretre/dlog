import React, { useState } from 'react';
import { Tag, Table, Input, Select, Button, Popconfirm } from 'antd';
import { CalendarOutlined, BarcodeOutlined } from '@ant-design/icons';
import moment from 'moment';

const RapportClotureTemplForm = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
    });
    const scroll = { x: 'max-content' };

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        setEditingKey(record.key);
    };

    const save = (key, newData) => {
        setData((prevData) => prevData.map((item) => (item.key === key ? { ...item, ...newData } : item)));
        setEditingKey(null);
    };

    const cancel = () => {
        setEditingKey(null);
    };

    const editableCell = (text, record, dataIndex) => {
        return isEditing(record) ? (
            <Input
                defaultValue={text}
                onChange={(e) => record[dataIndex] = e.target.value}
                onPressEnter={() => save(record.key, record)}
            />
        ) : (
            <Tag icon={<BarcodeOutlined />} color="cyan" onClick={() => edit(record)} style={{ cursor: 'pointer' }}>
                {text ?? '0'}
            </Tag>
        );
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => {
                const pageSize = pagination.pageSize || 10;
                const pageIndex = pagination.current || 1;
                return (pageIndex - 1) * pageSize + index + 1;
            },
            width: "4%"
        },
        {
            title: 'Periode',
            dataIndex: 'periode',
            key: 'periode',
            sorter: (a, b) => moment(a.periode) - moment(b.periode),
            sortDirections: ['descend', 'ascend'],
            render: (text) => {
                const date = text ? new Date(text) : null;
                const formattedDate = date ? date.toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Aucun';
                return <Tag icon={<CalendarOutlined />} color="purple">{formattedDate}</Tag>;
            },
        },
        {
            title: 'M² occupe',
            dataIndex: 'm2_occupe',
            key: 'm2_occupe',
            sorter: (a, b) => a.m2_occupe - b.m2_occupe,
            render: (text, record) => editableCell(text, record, 'm2_occupe'),
            align: 'right',
        },
        {
            title: 'M² facture',
            dataIndex: 'm2_facture',
            key: 'm2_facture',
            sorter: (a, b) => a.m2_facture - b.m2_facture,
            render: (text, record) => editableCell(text, record, 'm2_facture'),
            align: 'right',
        },
        {
            title: 'Total Entr',
            dataIndex: 'total_entreposage',
            key: 'total_entreposage',
            sorter: (a, b) => a.total_entreposage - b.total_entreposage,
            render: (text, record) => editableCell(text, record, 'total_entreposage'),
            align: 'right',
        },
        {
            title: 'Total Manu',
            dataIndex: 'total_manutation',
            key: 'total_manutation',
            sorter: (a, b) => a.total_manutation - b.total_manutation,
            render: (text, record) => editableCell(text, record, 'total_manutation'),
            align: 'right',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
            render: (text, record) => editableCell(text, record, 'total'),
            align: 'right'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                isEditing(record) ? (
                    <>
                        <Button type="link" onClick={() => save(record.key, record)}>Sauvegarder</Button>
                        <Popconfirm title="Annuler ?" onConfirm={cancel}>
                            <Button type="link">Annuler</Button>
                        </Popconfirm>
                    </>
                ) : (
                    <Button type="link" onClick={() => edit(record)}>Modifier</Button>
                )
            ),
        },
    ];

    return (
        <div className="rapportClotureTemplForm">
            <div className="rapportCloture_wrapper">
                <div className="rapportCloture_top">

                </div>
                <div className="rapportCloture_bottom">
                    <Table
                        dataSource={data}
                        columns={columns}
                        bordered
                        scroll={scroll}
                        loading={loading}
                        size="small"
                        pagination={pagination}
                        onChange={pagination => setPagination(pagination)}
                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    />
                </div>
            </div>
        </div>
    );
};

export default RapportClotureTemplForm;
