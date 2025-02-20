import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Tag, Space, Tooltip, Popconfirm, Skeleton, Tabs, Popover } from 'antd';
import { MenuOutlined,EditOutlined,PieChartOutlined,EyeOutlined, DeleteOutlined, CalendarOutlined,DownOutlined,EnvironmentOutlined, HomeOutlined, FileTextOutlined, DollarOutlined, BarcodeOutlined,ScheduleOutlined,PlusCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Search } = Input;

const PermissionDeclaration = () => {
    
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
  });

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
            <div className="client-actions">
                  <div className="client-row-left">
                    <Search 
                      placeholder="Recherche..." 
                      enterButton
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>

                  <div className="client-rows-right">

                    <Button
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      onClick={handleAddTemplate}
                    >
                      Ajouter une déclaration
                    </Button>

                    <Button
                      type="default"
                      onClick={handFilter}
                    >
                      {filterVisible ? 'Cacher les filtres' : 'Afficher les filtres'}
                    </Button>

                    <Dropdown overlay={menus} trigger={['click']}>
                      <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                        Colonnes <DownOutlined />
                      </Button>
                    </Dropdown>

                  </div>
                </div>
            <Table
                  columns={columns}
                  dataSource={filteredData}
                  loading={loading}
                  pagination={pagination}
                  onChange={(pagination) => setPagination(pagination)}
                  rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                  rowKey="id"
                  bordered
                  size="small"
                  scroll={scroll}
                />
            </div>
        </div>
    </>
  )
}

export default PermissionDeclaration