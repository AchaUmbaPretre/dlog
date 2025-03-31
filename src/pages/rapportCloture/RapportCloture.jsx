import React, { useState } from 'react'
import { Button, Checkbox, Dropdown, Menu, Tooltip, notification, Popover, Skeleton, Space, Table, Tabs, Tag } from 'antd';
import moment from 'moment';
import { MenuOutlined, EditOutlined, LockOutlined, PieChartOutlined, EyeOutlined, DeleteOutlined, CalendarOutlined, DownOutlined, EnvironmentOutlined, HomeOutlined, FileTextOutlined, DollarOutlined, BarcodeOutlined, ScheduleOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';


const RapportCloture = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
      });
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'Periode': true,
        'M² occupe': true,
        "M² facture": true,
        'Total Entr': true,
        "Total Manu": true,

      });  
    const scroll = { x: 400 };

    const toggleColumnVisibility = (columnName, e) => {
        e.stopPropagation();
        setColumnsVisibility(prev => ({
          ...prev,
          [columnName]: !prev[columnName]
        }));
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
                render: (text, record) => {
                const date = text ? new Date(text) : null;
                const mois = date ? date.getMonth() + 1 : null; // getMonth() renvoie 0-11, donc +1 pour avoir 1-12
                const annee = date ? date.getFullYear() : null;
                    
                const formattedDate = date
                      ? date.toLocaleString('default', { month: 'long', year: 'numeric' })
                      : 'Aucun';
                
                    return (
                      <Tag 
                        icon={<CalendarOutlined />} 
                        color="purple" 
                      >
                        {formattedDate}
                      </Tag>
                    );
                },
                ...(columnsVisibility['Periode'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'M² occupe',
            dataIndex: 'm2_occupe',
            key: 'm2_occupe',
                sorter: (a, b) => a.m2_occupe - b.m2_occupe,
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                    <Tag icon={<BarcodeOutlined />} color="cyan">{text ?? '0'}</Tag>
                ),
                align: 'right', 
            ...(columnsVisibility['M² occupe'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'M² facture',
            dataIndex: 'm2_facture',
            key: 'm2_facture',
            sorter: (a, b) => a.m2_facture - b.m2_facture,
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                    <Tag icon={<BarcodeOutlined />} color="cyan">{text?.toLocaleString() ?? '0'}</Tag>
                ),
                align: 'right', 
                ...(columnsVisibility['M² facture'] ? {} : { className: 'hidden-column' }),
            },
            {
                title: 'Total Entr',
                dataIndex: 'total_entreposage',
                key: 'total_entreposage',
                sorter: (a, b) => a.total_entreposage - b.total_entreposage,
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                    <Tag color="gold">
                          {text
                            ? `${parseFloat(text)
                                .toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                    })
                                    .replace(/,/g, " ")} $`
                                : "0.00"}
                        </Tag>
                    ),
                align: 'right', 
                ...(columnsVisibility['Total Entr'] ? {} : { className: 'hidden-column' }),
            },
    ]

  return (
    <>
        <div className="rapport_facture">
            <h2 className="rapport_h2">RAPPORT CLOTURE</h2>
            <div className="rapport_wrapper_facture">
                <Table
                    dataSource={data}
                    columns={columns}
                    bordered
                    scroll={{ x: 'max-content' }}
                    loading={loading}
                    size="small"
                    pagination={pagination}
                    onChange={pagination => setPagination(pagination)}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />
            </div>
        </div>
    </>
  )
}

export default RapportCloture