import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Tabs } from 'antd';
import { ExportOutlined, MoreOutlined,HomeOutlined,DatabaseOutlined,LineChartOutlined,TeamOutlined, ApartmentOutlined, EditOutlined,ToolOutlined, ContainerOutlined, PrinterOutlined,BankOutlined, DashboardOutlined, EnvironmentOutlined, PlusCircleOutlined,EyeOutlined, CloudDownloadOutlined, FileTextOutlined, DeleteOutlined} from '@ant-design/icons';
import BatimentForm from './batimentForm/BatimentForm';
import { getBatiment, putDeleteBatiment } from '../../services/typeService';
import UploadBatimentForm from './uploadBatimentForm/UploadBatimentForm';
import DetailUpload from './uploadBatimentForm/detailUpload/DetailUpload';
import TableauBord from './tableauBord/TableauBord';
import ListeDocumentBatiment from './document/ListeDocumentBatiment';
import DocFormBatiment from './document/docFormBatiment/DocFormBatiment';
import Bureaux from './bureaux/Bureaux';
import BureauForm from './bureaux/bureauForm/BureauForm';
import Bins from './bins/Bins';
import BinForm from './bins/binsForm/BinForm';
import EquipementForm from './equipement/equipementForm/EquipementForm';
import ListeEquipement from './equipement/listeEquipement/ListeEquipement';
import Entrepots from './entrepots/Entrepots';
import FormEntrepots from './entrepots/formEntrepots/FormEntreports';
import { useSelector } from 'react-redux';
import NiveauForm from './niveau/niveauForm/NiveauForm';
import Denomination from './denomination/Denomination';
import DenominationForm from './denomination/denominationForm/DenominationForm';
import InstructionOne from '../instructions/instructionOne/InstructionOne';
import InstructionFormOne from '../instructions/instructionForm/InstructionFormOne';
import NiveauOne from './niveau/NiveauOne';
import DenominationOne from './denomination/DenominationOne';
import TabPane from 'antd/es/tabs/TabPane';
import ListBureaux from '../Listbureaux/ListBureaux';
import Niveau from './niveau/Niveau';
import Adresse from '../adresse/Adresse';
import Instructions from '../instructions/Instructions';

const { Search } = Input;

const Batiment = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [modalType, setModalType] = useState(null);
  const [idBatiment, setIdBatiment] = useState('');
  const scroll = { x: 400 };
  const role = useSelector((state) => state.user?.currentUser.role);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [activeKey, setActiveKey] = useState(['1', '2']);

  const handleDelete = async (id) => {
    try {
        await putDeleteBatiment(id);
      setData(data.filter((item) => item.id_batiment !== id));
      message.success('Batiment supprimé avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du client.',
      });
    }
  };

    const fetchData = async () => {
      try {
        const { data } = await getBatiment();
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

  const openModal = (type, idBatiment = '') => {
    closeAllModals();
    setIdBatiment(idBatiment);
    setModalType(type);
  };

  const handleAddCroquis = ( idBatiment) =>{
    openModal('addCroquis', idBatiment)
  }

  const handleDetailCroquis = ( idBatiment) =>{
    openModal('detailCroquis', idBatiment)
  }

  const handleTableauBord = ( idBatiment) =>{
    openModal('tableauBord', idBatiment)
  }

  const handleDetailDoc = (idBatiment) => {
    openModal('ListeDoc', idBatiment);
  };

  const handleAjouterDoc = (idBatiment) => {
    openModal('DocumentBatimentForm', idBatiment);
  };

  const handleAddEntrepot = (idBatiment) => {
    openModal('FormEntrepot', idBatiment);
  };

  const handleListEntrepot = (idBatiment) => {
    openModal('ListEntrepot', idBatiment);
  };

  const handleListBureau = (idBatiment) => {
    openModal('ListBureau', idBatiment)
  }

  const handleAddBureau = (idBatiment) => {
    openModal('FormBureau', idBatiment)
  }

  const handleEdit = (idBatiment) => {
    openModal('editBatiment', idBatiment)
  }

  const handleAddBin = (idBatiment) => {
    openModal('AddBin', idBatiment)
  }

  const handleListBin = (idBatiment) => {
    openModal('ListBin', idBatiment)
  }

  const handleListeEquipement = ( idBatiment) =>{
    openModal('listeEquipement', idBatiment)
  }
  const handleAddEquipement = ( idBatiment) =>{
    openModal('addEquipement', idBatiment)
  }

  const handListeNiveau = ( idBatiment) =>{
    openModal('listeNiveau', idBatiment)
  }

  const handleAddNiveau = ( idBatiment) =>{
    openModal('addNiveau', idBatiment)
  }

  const handListeDenomination = ( idBatiment) =>{
    openModal('listeDenomination', idBatiment)
  }

  const handleAddDenomination = ( idBatiment) =>{
    openModal('addDenomination', idBatiment)
  }

  const handListeInstruction = ( idBatiment) =>{
    openModal('listeInstruction', idBatiment)
  }

  const handleAddInstruction = ( idBatiment) =>{
    openModal('addInstruction', idBatiment)
  }

  const handleAddClient = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleExportExcel = () => {
    message.success('Exporting to Excel...');
  };

  const handleExportPDF = () => {
    // Logic to export data to PDF
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
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "4%"
    },
    { 
      title: 'Nom', 
      dataIndex: 'nom_batiment', 
      key: 'nom_batiment',
      render: text => (
        <Space>
          <Tag icon={<BankOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Site', 
      dataIndex: 'site',
      key: 'site',
      render: text => (
        <Space>
          <Tag icon={<EnvironmentOutlined />} color='blue'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Type batiment', 
      dataIndex: 'type_batiment', 
      key: 'type_batiment',
      render: text => (
        <Space>
          <Tag icon={<BankOutlined />} color='cyan'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
    },
    { 
      title: 'Ville', 
      dataIndex: 'name', 
      key: 'name',
      render: text => (
        <Tag icon={<EnvironmentOutlined />} color='magenta'>{text ?? "Aucun"}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        role === 'Admin' && 
        (
          <Space size="middle">
          <Tooltip title="Modifier">
            <Button
              icon={<EditOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleEdit(record.id_batiment)}
              aria-label="Edit department"
            />
          </Tooltip>
          <Tooltip title="Voir les croquis">
            <Button
              icon={<EyeOutlined />}
              style={{ color: 'blue' }}
              onClick={() => handleDetailCroquis(record.id_batiment)}
              aria-label="Voir les croquis"
            />
          </Tooltip>
          <Tooltip title="Upload de croquis">
            <Button
              icon={<CloudDownloadOutlined />}
              style={{ color: 'blue' }}
              onClick={() => handleAddCroquis(record.id_batiment)}
              aria-label="Upload de croquis"
            />
          </Tooltip>
          <Dropdown
            overlay={(
              <Menu>
                {/* Actions Document */}
                <Menu.Item onClick={() => handleDetailDoc(record.id_batiment)}>
                  <FileTextOutlined /> Liste des docs
                </Menu.Item>
                <Menu.Item onClick={() => handleAjouterDoc(record.id_batiment)}>
                  <FileTextOutlined /> Créer un doc
                </Menu.Item>
                <Menu.Divider />
                {/* Actions Entrepot */}
                {
                  record.type_batiment === 'entrepot' &&
                  <div>
                      {/* Actions Bin */}
                    <Menu.Item onClick={() => handleListBin(record.id_batiment)}>
                      <ContainerOutlined /> Liste des bins
                    </Menu.Item>
                    <Menu.Item onClick={() => handleAddBin(record.id_batiment)}>
                      <ContainerOutlined /> Nouveau Bin
                    </Menu.Item>
                    <Menu.Divider />
                  </div>
                }
                {/* Actions Équipement */}
                <Menu.Item onClick={() => handleListeEquipement(record.id_batiment)}>
                  <ToolOutlined /> Liste d'équipement
                </Menu.Item>
                <Menu.Item onClick={() => handleAddEquipement(record.id_batiment)}>
                  <ToolOutlined /> Nouveau équipement
                </Menu.Item>
                <Menu.Divider />
                {/* Actions Bins */}
    {/*             <Menu.Item onClick={() => handleListBin(record.id_batiment)}>
                  <ContainerOutlined /> Liste des bins
                </Menu.Item>
                <Menu.Item onClick={() => handleAddBin(record.id_batiment)}>
                  <ContainerOutlined /> Nouveau Bin
                </Menu.Item>
                <Menu.Divider /> */}
                {/* Actions Bureau */}
                {record.type_batiment === "bureaux" &&
                  <div>
                    <Menu.Item onClick={() => handleListBureau(record.id_batiment)}>
                      <BankOutlined /> Liste de bureau
                    </Menu.Item>
                    <Menu.Item onClick={() => handleAddBureau(record.id_batiment)}>
                      <BankOutlined /> Créer un bureau
                    </Menu.Item>
                    <Menu.Divider />
                  </div>
                }
                    <Menu.Item onClick={() => handListeNiveau(record.id_batiment)}>
                      <ApartmentOutlined /> Liste des niveaux
                    </Menu.Item>
                    <Menu.Item onClick={() => handleAddNiveau(record.id_batiment)}>
                      <ApartmentOutlined /> Créer un niveau
                    </Menu.Item>
                    <Menu.Divider />

                    <Menu.Item onClick={() => handListeDenomination(record.id_batiment)}>
                      <FileTextOutlined /> Liste des denominations
                    </Menu.Item>
                    <Menu.Item onClick={() => handleAddDenomination(record.id_batiment)}>
                      <FileTextOutlined /> Créer une denomination
                    </Menu.Item>
                    <Menu.Divider />
    
                    <Menu.Item onClick={() => handListeInstruction(record.id_batiment)}>
                      <FileTextOutlined /> Liste d'instructions
                    </Menu.Item>
                    <Menu.Item onClick={() => handleAddInstruction(record.id_batiment)}>
                      <FileTextOutlined /> Nouvel instruction
                    </Menu.Item>
              </Menu>
            )}
            trigger={['click']}
          >
            <Button
              icon={<MoreOutlined />}
              style={{ color: 'black', padding: '0' }}
              aria-label="Menu actions"
            />
          </Dropdown>
          <Tooltip title="Tableau de bord">
            <Button
              onClick={() => handleTableauBord(record.id_batiment)}
              icon={<DashboardOutlined />}
              style={{ color: '#2db7f5' }}
              aria-label="Tableau de bord"
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Etes-vous sûr de vouloir supprimer ce batiment ?"
              onConfirm={() => handleDelete(record.id_batiment)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                icon={<DeleteOutlined />}
                style={{ color: 'red' }}
                aria-label="Supprimer le département"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
        )
      ),
    }
  ];

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const filteredData = data.filter(item =>
    item.nom_batiment?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <Tabs
          activeKey={activeKey[0]}
          onChange={handleTabChange}
          type="card"
          tabPosition="top"
          renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} />}
        >
          <TabPane
            tab={
              <span>
                <BankOutlined style={{ color: '#1890ff' }} /> Liste des bâtiments
              </span>
            }
            key="1"
          >
        <div className="client">
          <div className="client-wrapper">
            <div className="client-row">
              <div className="client-row-icon">
                <BankOutlined className='client-icon'/>
              </div>
              <h2 className="client-h2">Bâtiment</h2>
            </div>
            <div className="client-actions">
              <div className="client-row-left">
                <Search placeholder="Recherche..." 
                  enterButton 
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className="client-rows-right">
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={handleAddClient}
                >
                  Batiment
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
              dataSource={filteredData}
              rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
              rowKey="key"
              scroll={scroll}
              size="small"
              bordered
              loading={loading}
              pagination={pagination}
              onChange={(pagination) => setPagination(pagination)}
            />
          </div>
        </div>
      
      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        centered
      >
        <BatimentForm idBatiment={idBatiment} closeModal={()=>setIsModalVisible(false)} fetchData={fetchData}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'editBatiment'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <BatimentForm idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'addCroquis'}
        onCancel={closeAllModals}
        footer={null}
        width={550}
        centered
      >
        <UploadBatimentForm idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'detailCroquis'}
        onCancel={closeAllModals}
        footer={null}
        width={1050}
        centered
      >
        <DetailUpload idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'tableauBord'}
        onCancel={closeAllModals}
        footer={null}
        width={1050}
        centered
      >
        <TableauBord idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'DocumentBatimentForm'}
        onCancel={closeAllModals}
        footer={null}
        centered
      >
        <DocFormBatiment idBatiment={idBatiment} fetchData={fetchData} closeModal={()=>setModalType(null)} />
      </Modal>

      <Modal
        title="Liste des documents"
        visible={modalType === 'ListeDoc'}
        onCancel={closeAllModals}
        footer={null}
        width={850}
        centered
      >
        <ListeDocumentBatiment idBatiment={idBatiment} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'ListBureau'}
        onCancel={closeAllModals}
        footer={null}
        width={1050}
        centered
      >
        <Bureaux idBatiment={idBatiment} closeModal={()=>setModalType(null)}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'FormBureau'}
        onCancel={closeAllModals}
        footer={null}
        width={600}
        centered
      >
        <BureauForm idBatiment={idBatiment} closeModal={()=>setModalType(null)}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'ListBin'}
        onCancel={closeAllModals}
        footer={null}
        width={1025}
        centered
      >
        <Bins idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData}/>
     </Modal>

      <Modal
        title=""
        visible={modalType === 'AddBin'}
        onCancel={closeAllModals}
        footer={null}
        width={650}
        centered
      >
        <BinForm idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData}/>
     </Modal>

     <Modal
        title=""
        visible={modalType === 'addEquipement'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <EquipementForm idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData} />
      </Modal>

       <Modal
          title=""
          visible={modalType === 'listeEquipement'}
          onCancel={closeAllModals}
          footer={null}
          width={1050}
          centered
        >
          <ListeEquipement idBatiment={idBatiment} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'FormEntrepot'}
          onCancel={closeAllModals}
          footer={null}
          width={490}
          centered
        >
          <FormEntrepots idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData} />
        </Modal>

       <Modal
          title=""
          visible={modalType === 'ListEntrepot'}
          onCancel={closeAllModals}
          footer={null}
          width={1050}
          centered
        >
          <Entrepots idBatiment={idBatiment} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'listeNiveau'}
          onCancel={closeAllModals}
          footer={null}
          width={900}
          centered
        >
          <NiveauOne idBatiment={idBatiment} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'addNiveau'}
          onCancel={closeAllModals}
          footer={null}
          width={600}
          centered
        >
          <NiveauForm idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData} />
        </Modal>
        <Modal
          title=""
          visible={modalType === 'listeDenomination'}
          onCancel={closeAllModals}
          footer={null}
          width={900}
          centered
        >
          <DenominationOne idBatiment={idBatiment} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'addDenomination'}
          onCancel={closeAllModals}
          footer={null}
          width={600}
          centered
        >
          <DenominationForm idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'listeInstruction'}
          onCancel={closeAllModals}
          footer={null}
          width={900}
          centered
        >
          <InstructionOne idBatiment={idBatiment} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'addInstruction'}
          onCancel={closeAllModals}
          footer={null}
          width={700}
          centered
        >
          <InstructionFormOne idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchData} />
        </Modal>
          </TabPane>

          <TabPane
            tab={
              <span>
                <ApartmentOutlined style={{ color: '#52c41a' }} /> Liste des bureaux
              </span>
            }
            key="2"
          >
            <ListBureaux/>
          </TabPane>

          <TabPane
            tab={
              <span>
                <ApartmentOutlined style={{ color: '#eb2f96' }} /> Liste des niveaux
              </span>
            }
            key="3"
          >
            <Niveau/>
          </TabPane>

          <TabPane
            tab={
              <span>
                <LineChartOutlined style={{ color: '#fa8c16' }} /> Liste des dénominations
              </span>
            }
            key="4"
          >
            <Denomination/>
          </TabPane>

          <TabPane
            tab={
              <span>
                <HomeOutlined style={{ color: '#13c2c2' }} /> Liste des adresses
              </span>
            }
            key="5"
          >
            <Adresse/>
          </TabPane>

          <TabPane
            tab={
              <span>
                <EnvironmentOutlined style={{ color: '#722ed1' }} /> Liste des inspections
              </span>
            }
            key="6"
          >
            <Instructions/>
          </TabPane>
      </Tabs>
    </>
  );
};

export default Batiment;
