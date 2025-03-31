import React, { useState } from 'react'
import { Button, Checkbox, Dropdown, Menu, Tooltip, notification, Popover, Skeleton, Space, Table, Tabs, Tag } from 'antd';
import moment from 'moment';
import { MenuOutlined, EditOutlined, LockOutlined, PieChartOutlined, EyeOutlined, DeleteOutlined, CalendarOutlined, DownOutlined, EnvironmentOutlined, HomeOutlined, FileTextOutlined, DollarOutlined, BarcodeOutlined, ScheduleOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';


const RapportCloture = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
      });
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'Periode': true,
        'M² occupe': false,
        "M² facture": true,
        'Total Entr': true,
        "Total Manu": true,

      });  
    const scroll = { x: 400 };

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