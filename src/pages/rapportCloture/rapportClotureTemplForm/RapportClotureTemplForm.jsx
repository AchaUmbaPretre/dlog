import React, { useState } from 'react'
import { Tag, Modal, Dropdown, Menu } from 'antd';
import {  CalendarOutlined, BarcodeOutlined, ScheduleOutlined } from '@ant-design/icons';
import moment from 'moment';


const RapportClotureTemplForm = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 20,
          });

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
            },
            {
                title: 'Total Manu',
                dataIndex: 'total_manutation',
                key: 'total_manutation',
                sorter: (a, b) => a.total_manutation - b.total_manutation,
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
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                sorter: (a, b) => a.total - b.total,
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                    <Tag color="cyan">
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
                align: 'right'            
            },
    ]

  return (
    <>
        <div className="rapportClotureTemplForm">
            <div className="rapportCloture_wrapper">
                <div className="rapportCloture_top">

                </div>
                <div className="rapportCloture_bottom">
                    
                </div>
            </div>
        </div>
    </>
  )
}

export default RapportClotureTemplForm