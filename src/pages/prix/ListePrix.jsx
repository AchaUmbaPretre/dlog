import { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Dropdown, Menu, notification, Tag, Select } from 'antd';
import { ExportOutlined, ShoppingOutlined, DollarOutlined, UserOutlined, PrinterOutlined } from '@ant-design/icons';
import { getOffreArticle } from '../../services/offreService';

const { Option } = Select;

const ListePrix = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOffreArticle({});
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
      }
    };
    
    fetchData();
  }, []);

  const handleArticleFilter = (value) => {
    setSelectedArticle(value);

    if (value) {
      const filtered = data.filter(item => item.nom_article === value);
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
        <Tag icon={<ExportOutlined />} color="green">Export to Excel</Tag>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        <Tag icon={<ExportOutlined />} color="blue">Export to PDF</Tag>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    {
      title: 'Nom',
      dataIndex: 'nom_fournisseur',
      key: 'nom',
      render: (text) => (
        <Tag icon={<UserOutlined />} color="green">{text}</Tag>
      ),
    },
    {
      title: 'Article',
      dataIndex: 'nom_article',
      key: 'article',
      render: (text) => (
        <Tag icon={<ShoppingOutlined />} color="purple">{text}</Tag>
      ),
    },
    {
      title: 'Prix',
      dataIndex: 'prix',
      key: 'prix',
      sorter: (a, b) => a.prix - b.prix,
      render: (text) => (
        <Tag color="gold">{text} $</Tag>
      ),
    }
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <DollarOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Liste des prix</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
            <Select
                showSearch
                placeholder="Filtrer par article"
                style={{ width: 200, marginRight: 16 }}
                allowClear
                onChange={handleArticleFilter}
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                }
                >
                {[...new Set(data.map(item => item.nom_article))].map((article) => (
                    <Option key={article} value={article}>
                    {article}
                    </Option>
                ))}
                </Select>

            </div>
            <div className="client-rows-right">
              <Dropdown overlay={menu} trigger={['click']}>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Dropdown>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 15 }}
            rowKey="id"
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>
      </div>

      <Modal
        title="Ajouter un fournisseur"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        {/* <FournisseurForm modalOff={setIsModalVisible} /> */}
      </Modal>
    </>
  );
};

export default ListePrix;
