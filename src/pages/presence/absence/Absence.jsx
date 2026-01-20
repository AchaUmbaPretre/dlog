import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, Typography, message, Menu, notification, Tag } from 'antd';
import { ExportOutlined, ToolOutlined, PrinterOutlined, PlusOutlined } from '@ant-design/icons';


const { Search } = Input;
const { Text } = Typography

const Absence = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroll = { x: 400 };
  const [searchValue, setSearchValue] = useState('');

   const fetchData = async () => {
      try {
        const { data } = await getPersonne();
        setData(data);
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
  

  const handleAddClient = () => {
    setIsModalVisible(true);
  };


  const handlePrint = () => {
    window.print();
  };

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
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => (
        <Text>{text}</Text>
      ),
    },
    {
      title: 'Type absence',
      dataIndex: 'type_absence',
      key: 'type_absence',
      render: (text) => (
        <Text>{text}</Text>
      ),
    },
    {
      title: 'Date debut',
      dataIndex: 'date_debut',
      key: 'date_debut',
      render: (text) => (
        <Text>{text}</Text>
      ),
    },
    {
      title: 'Date fin',
      dataIndex: 'date_fin',
      key: 'date_fin',
      render: (text) => (
        <Text>{text}</Text>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (text) => (
        <Text>{text}</Text>
      ),
    }
  ];

  const filteredData = data?.filter(item =>
    item.nom?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <ToolOutlined className='client-icon' />
            </div>
            <h2 className="client-h2">Personnel</h2>
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
                icon={<PlusOutlined />}
                onClick={handleAddClient}
              >
                Ajouter
              </Button>
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

{/*       <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={750}
        centered
      >
        <PersonnelForm fetchData={fetchData} modalOff={setIsModalVisible} />
      </Modal> */}
    </>
  );
};

export default Absence;
