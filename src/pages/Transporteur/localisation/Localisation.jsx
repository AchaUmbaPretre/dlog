import { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Tag } from 'antd';
import { ExportOutlined, PrinterOutlined, PlusOutlined, MoreOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getLocalisation } from '../../../services/transporteurService';
import LocalisationFormMulti from './localisationForm/LocalisationFormMulti';
import LocalisationForm from './localisationForm/LocalisationForm';

const { Search } = Input;

const Localisation = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const scroll = { x: 'max-content' };
  const [localisationId, setLocalisationId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  
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
            {text.toUpperCase()}
        </div>
      ),
    },
    {
      title: 'Parent',
      dataIndex: 'parent',
      key: 'parent',
      render: (text) => (
        <div>{text}</div>
      ),
    }
  ];

  const  getActionMenu = (openModal) => {
    const handleClick = ({ key }) => {
        switch (key) {
            case 'add' : 
                openModal('Add')
                break
            case 'addMulti' :
                openModal('AddMulti')
                break
            default : 
                break;
        }
    };

    return (
        <Menu onClick={handleClick}>
            <Menu.Item key="add">
                <PlusOutlined style={{ color: 'orange' }} /> Ajouter
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="addMulti">
                <PlusOutlined style={{ color: 'orange' }} /> Ajouter Multi
            </Menu.Item>
        </Menu>
    )
  }

    const filteredData = data.filter(item =>
    item.nom?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.type_loc?.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.parent?.toLowerCase().includes(searchValue.toLowerCase())
  );

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
                <Search 
                    placeholder="Recherche..." 
                    enterButton 
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div className="client-rows-right">
                <Dropdown overlay={getActionMenu(openModal)} trigger={['click']}>
                    <Button
                        type="primary"
                        icon={<MoreOutlined />}
                    >
                    </Button>   
                </Dropdown>
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
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            size="small"
            scroll={scroll}
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <LocalisationForm closeModal={() => setModalType(null)} fetchData={fetchData}  localisationId={localisationId} />
      </Modal>

       <Modal
        title=""
        visible={modalType === 'AddMulti'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <LocalisationFormMulti closeModal={() => setModalType(null)} fetchData={fetchData}  localisationId={localisationId} />
      </Modal>
    </>
  );
};

export default Localisation;