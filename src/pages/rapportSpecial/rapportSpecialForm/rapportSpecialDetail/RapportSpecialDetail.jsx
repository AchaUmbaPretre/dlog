import React, { useEffect, useState } from 'react'
import { Modal, Tag, Tabs, Input, Table, notification } from 'antd';
import { AuditOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import TabPane from 'antd/es/tabs/TabPane';
import moment from 'moment';
import 'moment/locale/fr'
import { getRapport } from '../../../../services/rapportService';
import RapportSpecialForm from '../RapportSpecialForm';

const RapportSpecialDetail = () => {
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

// Étape 1: Grouper les données par période et client
const regroupedData = {};

data.forEach(item => {
  const normalizedPeriode = moment(item.periode).startOf('day').format('YYYY-MM-DD');
  const key = `${normalizedPeriode}_${item.id_client}`;

  if (!regroupedData[key]) {
    regroupedData[key] = {
      periode: normalizedPeriode,
      params: {}
    };
  }

  // Stocke les valeurs par catégorie > contrat > paramètre
  if (!regroupedData[key].params[item.nom_cat]) {
    regroupedData[key].params[item.nom_cat] = {};
  }

  if (!regroupedData[key].params[item.nom_cat][item.nom_contrat]) {
    regroupedData[key].params[item.nom_cat][item.nom_contrat] = {};
  }

  regroupedData[key].params[item.nom_cat][item.nom_contrat][item.nom_parametre] = item.valeur_parametre;
});

// Étape 2: Générer la liste des colonnes dynamiquement
const groupedData = {};
data.forEach(item => {
  if (!groupedData[item.nom_cat]) {
    groupedData[item.nom_cat] = {};
  }

  if (!groupedData[item.nom_cat][item.nom_contrat]) {
    groupedData[item.nom_cat][item.nom_contrat] = new Set();
  }
  groupedData[item.nom_cat][item.nom_contrat].add(item.nom_parametre);
});

// Étape 3: Générer la structure des colonnes
const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    render: (text, record, index) => index + 1,
    width: 50
  },
  {
    title: 'Période',
    dataIndex: 'periode',
    key: 'periode',
    render: (text) => (
      <Tag icon={<CalendarOutlined />} color="purple">
        {moment(text).format('MMM YYYY')}
      </Tag>
    ),
    width: 120
  },
  // Colonnes dynamiques
  ...Object.keys(groupedData).map(nom_cat => ({
    title: nom_cat,
    children: Object.keys(groupedData[nom_cat]).map(nom_contrat => ({
      title: nom_contrat,
      children: Array.from(groupedData[nom_cat][nom_contrat]).map(nom_parametre => ({
        title: nom_parametre,
        dataIndex: `${nom_cat}.${nom_contrat}.${nom_parametre}`,
        key: `${nom_cat}.${nom_contrat}.${nom_parametre}`,
        render: (value) => <div>{value ?? '-'}</div>,
      }))
    }))
  }))
];

// Étape 4: Construire le tableau de données à partir du regroupement
const dataSource = Object.values(regroupedData).map((item, index) => {
  const row = {
    key: index,
    periode: item.periode,
    id_client: item.id_client,
  };

  Object.keys(item.params).forEach(nom_cat => {
    Object.keys(item.params[nom_cat]).forEach(nom_contrat => {
      Object.keys(item.params[nom_cat][nom_contrat]).forEach(nom_parametre => {
        const value = item.params[nom_cat][nom_contrat][nom_parametre];
        row[`${nom_cat}.${nom_contrat}.${nom_parametre}`] = value;
      });
    });
  });

  return row;
});
    
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
                      </div>

                      <Table
                        columns={ columns }
                        dataSource={dataSource}
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
            </Tabs>
    </>
  )
}

export default RapportSpecialDetail;