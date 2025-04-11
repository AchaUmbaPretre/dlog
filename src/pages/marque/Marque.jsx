import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Form, Popover } from 'antd';


const Marque = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    
    const columns = [
        { 
            title: '#', 
            dataIndex: 'id', 
            key: 'id', 
            render: (text, record, index) => index + 1, 
            width: "3%" 
          },
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
        },
        {
            title: 'Modele',
            dataIndex: 'nom_modele',
            render: (text) => (
                <Tag color="green">
                    {text}
                </Tag>
            )
        }        
/*         {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
              <Dropdown overlay={getActionMenu(record, openModal)} trigger={['click']}>
                <Button icon={<MoreOutlined />} style={{ color: 'blue' }} />
              </Dropdown>
            )
          } */
      ];

  return (
    <>

    </>
  )
}

export default Marque