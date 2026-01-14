import React, { useEffect, useState } from 'react';
import { Table, Button, Input, message, Dropdown, Menu, Tooltip, Tag, notification } from 'antd';
import { ExportOutlined, SwapOutlined, BarcodeOutlined, HomeOutlined, TruckOutlined, PrinterOutlined } from '@ant-design/icons';
import { getSiteUser } from '../../../../services/charroiService';
const { Search } = Input;

const SiteUser = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const scroll = { x: 'max-content' };

    const fetchData = async () => {
      try {
        const res = await getSiteUser();
        setData(res?.data.data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);


  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting to PDF...');
  };

  const handlePrint = () => {
    window.print();
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        Export to Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        Export to PDF
      </Menu.Item>
    </Menu>
  );

  const columns = [
    { 
        title: '#', 
        dataIndex: 'id', 
        key: 'id', 
        render: (text, record, index) => (
          <Tooltip title={`Ligne ${index + 1}`}>
            <Tag color="blue">{index + 1}</Tag>
          </Tooltip>
        ), 
        width: "3%" 
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => (
        <div>
          {text}
        </div>
      ),
    },
    {
        title: 'Code site',
        dataIndex: 'CodeSite',
        key: 'CodeSite',
        render: (text) => (
          <div>
            <BarcodeOutlined style={{ color: '#1890ff', marginRight: 4 }} />
            {text}
          </div>
        ),
      },
    {
      title: 'Nom site',
      dataIndex: 'nom_site',
      key: 'nom_site',
      render: (text) => (
        <div>
          <HomeOutlined style={{ color: '#1890ff', marginRight: 4 }} />
          {text}
        </div>
      ),
    }
  ];

  const filteredData = data.filter(item =>
    item.nom_site?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <SwapOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Liste d'affectations</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." 
                enterButton 
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="client-rows-right">
              <Dropdown overlay={menu} trigger={['click']} className='client-export'>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                className='client-export'
              >
                Print
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            rowKey="key"
            bordered
            size="small" 
            scroll={scroll}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default SiteUser;