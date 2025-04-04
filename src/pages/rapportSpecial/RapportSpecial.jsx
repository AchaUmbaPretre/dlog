import React, { useEffect, useState } from 'react'
import { Space, Tooltip, Modal, Button, Tabs, Input, Table, notification } from 'antd';
import { AuditOutlined, EyeOutlined, PlusCircleOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import RapportSpecialForm from './rapportSpecialForm/RapportSpecialForm';
import { getContratRapportClient } from '../../services/rapportService';
import TabPane from 'antd/es/tabs/TabPane';
import 'moment/locale/fr'
import RapportContrat from './rapportContrat/RapportContrat';
import RapportSpecialDetail from './rapportSpecialForm/rapportSpecialDetail/RapportSpecialDetail';
const { Search } = Input;

const RapportSpecial = () => {
    const [searchValue, setSearchValue] = useState('');
    const [modalType, setModalType] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 25,
      });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const scroll = { x: 'max-content' };
    const [activeKey, setActiveKey] = useState(['1', '2']);
    const [idClient, setIdClient] = useState('')
    
      const fetchData = async () => {
    
          try {
            const { data } = await getContratRapportClient();
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
      },[]);

    const handleAddRapport = (id) => {
      openModal('Add', id);
    }

    const handleViewDetails = (id) => {
      openModal('Detail', id);
    }

    const closeAllModals = () => {
        setModalType(null);
      };
      
    const openModal = (type, idClient = '') => {
      closeAllModals();
      setModalType(type);
      setIdClient(idClient)
    };

    const handleTabChange = (key) => {
      setActiveKey(key);
    };

const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    render: (text, record, index) => index + 1,
    width: 50
  },
  {
    title: 'Client',
    dataIndex: 'nom',
    key: 'nom',
    render: (text) => (
      <div>
        {text}
      </div>
    )
  },
  {
    title: 'Nombre contrat',
    dataIndex: 'nbre',
    key: 'nbre',
    render: (text) => (
      <div>
        {text}
      </div>
    )
  },
  {
    title:'Action',
    key: 'action',
    width: '10%',
    render: (text, record) => (
      <Space>
        <Tooltip title="Voir les détails">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id_client)}
            aria-label="Voir les détails de la tâche"
            style={{ color: 'blue' }}
          />
        </Tooltip>
      </Space>
    )
  }
];

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
                    <FileTextOutlined
                      style={{
                        color: '#faad14',
                        fontSize: '18px',
                        marginRight: '8px',
                      }}
                    />
                    Rapport
                  </span>
                }
                key="1"
              >
                <div className="client">
                  <div className="client-wrapper">
                      <div className="client-rows">
                          <div className="client-row">
                              <div className="client-row-icon">
                                  <AuditOutlined className='client-icon' />
                              </div>
                              <div className="client-h2">
                                  Rapport spécial
                              </div>
                          </div>
                          <div className="client-row-lefts">

                          </div>
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
                              <Button
                              type="primary"
                              icon={<PlusCircleOutlined />}
                              onClick={handleAddRapport}
                              >
                                  Ajouter un rapport
                              </Button>
                          </div>
                      </div>

                      <Table
                        columns={ columns }
                        dataSource={data}
                        loading={loading}
                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                        rowKey={(record) => `${record.periode}-${record.id_client}`}
                        bordered
                        size="small"
                        scroll={scroll}
                        onChange={(pagination) => setPagination(pagination)}
                      />
                  </div>
                  <Modal
                    title=""
                    visible={modalType === 'Add'}
                    onCancel={closeAllModals}
                    footer={null}
                    width={950}
                    centered
                >
                  <RapportSpecialForm closeModal={() => setModalType(false)} fetchData={fetchData}  />
                  </Modal>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <AuditOutlined
                      style={{
                        color: '#f50',
                        fontSize: '18px',
                        marginRight: '8px',
                      }}
                    />
                    Contrat
                  </span>
                }
                key="2"
              >
                <RapportContrat/>
              </TabPane>
            </Tabs>

            <Modal
              title=""
              visible={modalType === 'Detail'}
              onCancel={closeAllModals}
              footer={null}
              width={1180}
              centered
            >
              <RapportSpecialDetail idClient={idClient} />
            </Modal>
    </>
  )
}

export default RapportSpecial