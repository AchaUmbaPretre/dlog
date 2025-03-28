import React, { useEffect, useState } from 'react'
import { Modal, Button, Tag, Input, Table, notification } from 'antd';
import { AuditOutlined, PlusCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import RapportSpecialForm from './rapportSpecialForm/RapportSpecialForm';
import { getRapport } from '../../services/rapportService';
import moment from 'moment';
import 'moment/locale/fr'
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
              <Tag 
                icon={<CalendarOutlined />} 
                color="purple" 
              >
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
              <div>
                {text}
              </div>
            )
          },
          {
            title: 'ENTREPOSAGE GLOBAL',
            children : [
                {
                    title: 'Superficie',
                    dataIndex: 'superficie',
                    width: 100,
                    key: 'superficie',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                },
                {
                    title: 'Entreposage',
                    dataIndex: 'entreposage',
                    width: 100,
                    key: 'entreposage',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                }
            ]
          },
          {
            title: 'TRANSPORT NRJ',
            children : [
                {
                    title: 'Trans NRJ',
                    dataIndex: 'transp_nrj',
                    width: 100,
                    key: 'transp_nrj',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: 'TEU',
                    dataIndex: 'teu',
                    width: 90,
                    key: 'teu',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "20' LOURDS",
                    dataIndex: 'lourd',
                    width: 100,
                    key: 'lourd',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Tonnage",
                    dataIndex: 'tonnage',
                    width: 100,
                    key: 'tonnage',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Peage",
                    dataIndex: 'peage_camion',
                    width: 100,
                    key: 'peage_camion',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "TEU retour",
                    dataIndex: 'teu_retour',
                    width: 100,
                    key: 'teu_retour',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
            ]
          },
          {
            title: 'MANUTENTION',
            children: [
                {

                    title: "Manut",
                    dataIndex: 'manut',
                    width: 100,
                    key: 'manut',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Manut1",
                    dataIndex: 'manut1',
                    width: 100,
                    key: 'manut1',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>  
                    )
                  },
                  {
                    title: "Camions Manut",
                    dataIndex: 'camions_manut',
                    width: 100,
                    key: 'camions_manut',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Sacs manut IN",
                    dataIndex: 'sacs_manut_IN',
                    width: 100,
                    key: 'sacs_manut_IN',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Sacs manut OUT",
                    dataIndex: 'sacs_manut_OUT',
                    width: 100,
                    key: 'sacs_manut_OUT',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Manut2",
                    dataIndex: 'manut2',
                    width: 100,
                    key: 'manut2',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Bout. /Intrants (T)",
                    dataIndex: 'bouteilles_intrants',
                    width: 100,
                    key: 'bouteilles_intrants',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Camion charge/décharge",
                    dataIndex: 'camions_charge_decharge',
                    width: 100,
                    key: 'camions_charge_decharge',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Sacs",
                    dataIndex: 'sacs_tonne',
                    width: 100,
                    key: 'sacs_tonne',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Palettes (mise en bac)",
                    dataIndex: 'palettes_mise_en_bac',
                    width: 130,
                    key: 'palettes_mise_en_bac',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Manut3",
                    dataIndex: 'manut3',
                    width: 100,
                    key: 'manut3',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Bout. (T)",
                    dataIndex: 'bout',
                    width: 100,
                    key: 'bout',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Palettes",
                    dataIndex: 'palettes_avenant',
                    width: 100,
                    key: 'palettes_avenant',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
            ]
          },
          {
            title: 'LIVRAISON',
            children : [
                {
                    title: "Liv locale",
                    dataIndex: 'liv_locale',
                    key: 'liv_locale',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                },
                {
                  title: "Camions livrés",
                  dataIndex: 'camions_livres',
                  width: 100,
                  key: '',
                  render: (text, record) => (
                    <div>
                      {text}
                    </div>
                  )
                }
            ]
          }
      ]
    
  return (
    <>
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
                  rowKey="id"
                  bordered
                  size="small"
                  scroll={scroll}
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
    </>
  )
}

export default RapportSpecial