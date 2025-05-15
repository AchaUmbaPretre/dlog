import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Tag } from 'antd';
import { ExportOutlined, PrinterOutlined, PlusCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import LocalisationForm from './localisationForm/LocalisationForm';
import { getLocalisation } from '../../../services/transporteurService';

const { Search } = Input;

const Localisation = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const scroll = { x: 'max-content' };
  const [localisationId, setLocalisationId] = useState(null)

    const fetchData = async () => {
      try {
        const { data } = await getLocalisation();

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
  


  const handleAdd = () => openModal('Add');

  const closeAllModals = () => {
    setModalType(null);
  };

    const openModal = (type, localisationId = '') => {
      closeAllModals();
      setModalType(type);
      setLocalisationId(localisationId)
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
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => (
        <div>
            {text}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type_loc',
      key: 'type_loc',
      render: (text) => (
        <div>
            {text}
        </div>
    
      ),
    },
/*     {
      title: 'Parent',
      dataIndex: 'parent',
      key: 'parent',
      render: (text) => (
        <Tag color="blue">{text}</Tag>
      ),
    } */
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <EnvironmentOutlined className='client-icon' style={{color:'red'}} />
            </div>
            <h2 className="client-h2">Localisation</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search placeholder="Recherche..." enterButton />
            </div>
            <div className="client-rows-right">
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleAdd}
              >
                Ajouter
              </Button>
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
            dataSource={data}
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            size="small"
            scroll={scroll}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={950}
        centered
      >
        <LocalisationForm closeModal={() => setModalType(null)} fetchData={fetchData}  localisationId={localisationId} />
      </Modal>
    </>
  );
};

export default Localisation;