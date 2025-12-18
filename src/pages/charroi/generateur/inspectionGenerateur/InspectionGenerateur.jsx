import React, { useState } from 'react'
import {
  ThunderboltOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  PlusCircleOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import { Input, Button, Tabs, Menu, Tooltip, Typography, message, Skeleton, Tag, Table, Space, Dropdown, Modal, notification } from 'antd';


const { Text } = Typography;
const { Search } = Input;

const InspectionGenerateur = () => {
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const scroll = { x: 'max-content' };

    const handleAddInspection = () => {

    }

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-rows">
                    <div className="client-row">
                        <div className="client-row-icon">
                            <FileSearchOutlined className='client-icon'/>
                        </div>
                        <h2 className="client-h2">Inspection générateur</h2>
                    </div>
                </div>
                <div className="client-actions">
                    <div className="client-row-left">
                        <Search 
                          placeholder="Recherche..." 
                          onChange={(e) => setSearchValue(e.target.value)}
                          enterButton
                        />
                    </div>
                    <div className="client-rows-right">
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            onClick={handleAddInspection}
                        >
                            Ajouter
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default InspectionGenerateur