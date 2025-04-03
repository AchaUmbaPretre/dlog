import React, { useEffect, useState } from 'react'
import { Modal, Button, Tag, Tabs, Input, Table, notification } from 'antd';
import { AuditOutlined, PlusCircleOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import RapportSpecialForm from './rapportSpecialForm/RapportSpecialForm';
import { getRapport } from '../../services/rapportService';
import TabPane from 'antd/es/tabs/TabPane';
import moment from 'moment';
import 'moment/locale/fr'
import RapportContrat from './rapportContrat/RapportContrat';
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
    
    
      const fetchData = async () => {
    
          try {
            const { data } = await getRapport();
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

    const closeAllModals = () => {
        setModalType(null);
      };
      
    const openModal = (type, idDeclaration = '') => {
      closeAllModals();
      setModalType(type);
    };

    const handleTabChange = (key) => {
      setActiveKey(key);
    };

    const groupedData = data.reduce((result, item) => {
      // Si la catégorie n'existe pas encore, on l'initialise
      if (!result[item.nom_cat]) {
        result[item.nom_cat] = {};
      }
    
      // Si le contrat n'existe pas encore dans la catégorie, on l'initialise
      if (!result[item.nom_cat][item.nom_contrat]) {
        result[item.nom_cat][item.nom_contrat] = [];
      }
    
      // Vérification si le paramètre existe déjà dans le contrat, pour éviter les doublons
      const existingParam = result[item.nom_cat][item.nom_contrat].some(
        (param) => param.nom_parametre === item.nom_parametre
      );
    
      if (!existingParam) {
        // Ajout du paramètre s'il n'existe pas déjà
        result[item.nom_cat][item.nom_contrat].push({
          nom_parametre: item.nom_parametre,
          valeur_parametre: item.valeur_parametre,
          periode: item.periode,
        });
      }
    
      return result;
    }, {});
    
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
        width: "2%"
      },
      {
        title: 'Periode',
        dataIndex: 'periode',
        width: 90,
        key: 'periode',
        render: (text) => (
          <Tag icon={<CalendarOutlined />} color="purple">
            {moment(text).format('MMM YYYY')}
          </Tag>
        )
      },
      {
        title: 'Client',
        dataIndex: 'nom',
        width: 90,
        key: 'nom',
        render: (text, record) => (
          <div>{text}</div>
        )
      },
      ...Object.keys(groupedData).map((nom_cat) => ({
        title: nom_cat,
        children: Object.keys(groupedData[nom_cat]).map((nom_contrat) => ({
          title: nom_contrat,
          children: groupedData[nom_cat][nom_contrat].map((param) => ({
            title: param.nom_parametre,
            dataIndex: param.nom_parametre,
            key: param.nom_parametre,
            render: () => (
              <div>{param.valeur_parametre}</div>
            )
          }))
        }))
      }))
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
                        rowKey="periode"
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
    </>
  )
}

export default RapportSpecial