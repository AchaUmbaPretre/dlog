import { useEffect, useState } from 'react'
import { Table, Tag, Space, Modal, Tooltip, Button, Typography, Input, notification } from 'antd';
import {  CarOutlined, FileTextOutlined, TrademarkOutlined, ExportOutlined, CheckCircleOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { statusIcons } from '../../../../utils/prioriteIcons';
import { getBandeSortie } from '../../../../services/charroiService';
import ValidationDemandeForm from '../../demandeVehicule/validationDemande/validationDemandeForm/ValidationDemandeForm';
import ReleveBonDeSortie from './releveBonDeSortie/ReleveBonDeSortie';

const { Search } = Input;
const { Text } = Typography;

const BandeSortie = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
          current: 1,
          pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    const [bonId, setBonId] = useState('');

    const columnStyles = {
      title: {
        maxWidth: '160px',
        whiteSpace: 'nowrap',
        overflowX: 'scroll', 
        overflowY: 'hidden',
        textOverflow: 'ellipsis',
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none', 
      },
      hideScroll: {
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
    };

    const handlSortie = (id) => openModal('validation', id);
    const handleReleve = (id) => openModal('releve', id);

    const closeAllModals = () => {
      setModalType(null);
    };

    const openModal = (type, id = '') => {
      closeAllModals();
      setModalType(type);
      setBonId(id)
    };
        
    const fetchData = async() => {
      try {
        const { data } = await  getBandeSortie()
        setData(data)
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          escription: 'Une erreur est survenue lors du chargement des données.',
        });
                
      } finally{
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, []);

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
        width: "3%"
    },
    {
      title : "Service",
      dataIndex: 'nom_service',
      key:'nom_service',
        render : (text) => (
          <Tag color='purple'>{text}</Tag>
        )
    },
    {
      title: (
        <Space>
          <UserOutlined  style={{color:'orange'}}/>
          <Text strong>Chauffeur</Text>
        </Space>
      ),
      dataIndex: 'nom',
      key: 'nom',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <Text type="secondary">{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: 'red' }} />
          <Text strong>Véhicule</Text>
        </Space>
      ),
      dataIndex:'nom_cat',
      key: 'nom_cat',
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={columnStyles.title} className={columnStyles.hideScroll}>
            <Text  type="secondary">{text}</Text>
          </div>
        </Tooltip>
      ),
    },
    {
    title: (
      <Space>
        <CarOutlined style={{ color: '#2db7f5' }} />
        <Text strong>Marque</Text>
      </Space>
    ),
    dataIndex: 'nom_marque',
    key: 'nom_marque',
    align: 'center',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Tag icon={<TrademarkOutlined />} color="blue">
          {text}
        </Tag>
      </Tooltip>
    ),
    },
    {
      title: (
        <Space>
          <CalendarOutlined style={{ color: 'blue' }} />
          <Text strong>Preuve</Text>
        </Space>
      ),
      dataIndex: 'date_prevue',
      key: '',
      align: 'center',
      render: (text) => {
        if (!text) {
          return (
            <Tag icon={<CalendarOutlined />} color="red">
              Aucune date
            </Tag>
          );
        }
        const date = moment(text);
        const isValid = date.isValid();              
          return (
            <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
              {isValid ? date.format('DD-MM-YYYY HH:mm') : 'Aucune'}
            </Tag>
          );
      },
    },
    {
      title: (
        <Space>
          <CalendarOutlined style={{ color: 'blue' }} />
          <Text strong>Retour</Text>
        </Space>
      ),
      dataIndex: 'date_retour',
      key: 'date_retour',
      render: (text) => {
        if (!text) {
            return (
                <Tag icon={<CalendarOutlined />} color="red">
                    Aucune date
                </Tag>
            );
        }
        const date = moment(text);
        const isValid = date.isValid();              
            return (
                <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
                    {isValid ? date.format('DD-MM-YYYY HH:mm') : 'Aucune'}
                </Tag>
            );
        },
    },
    {
        title: (
        <Space>
            <CheckCircleOutlined style={{ color: '#1890ff' }} />
            <Text strong>Statut</Text>
        </Space>
        ),
        dataIndex: 'nom_type_statut',
        key: 'nom_type_statut',
        render: text => {
            const { icon, color } = statusIcons[text] || {};
            return (
              <div style={columnStyles.title} className={columnStyles.hideScroll}>
                <Tag icon={icon} color={color}>{text}</Tag>
              </div>
            );
        },
    },
    {
        title: (
        <Text strong>Actions</Text>
        ),
        key: 'action',
        align: 'center',
        width : '120px',
        render: (text, record) => (
        <Space size="small">

            <Tooltip title="Relevé des bons de sortie">
                <Button
                    icon={<FileTextOutlined />}
                    style={{ color: 'blue' }}
                    onClick={() => handleReleve(record.id_bande_sortie)}
                    aria-label="Relevé"
                />
            </Tooltip>

            <Tooltip title="valider">
                <Button
                    icon={<CheckCircleOutlined />}
                    style={{ color: 'green' }}
                    onClick={() => handlSortie(record.id_bande_sortie)}
                    aria-label="Valider"
                />
            </Tooltip>
        </Space>
        ),
    },
   ]

    const filteredData = data.filter(item =>
     item.nom?.toLowerCase().includes(searchValue.toLowerCase()) || 
     item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase())
    );
  return (
    <>
        <div className="client">
          <div className="client-wrapper">
            <div className="client-row">
              <div className="client-row-icon">
                <ExportOutlined className='client-icon' style={{color:'blue'}} />
              </div>
              <h2 className="client-h2"> Tableau des bons de sortie</h2>
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
              </div>
              </div>
              <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                onChange={(pagination) => setPagination(pagination)}
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
            visible={modalType === 'validation'}
            onCancel={closeAllModals}
            footer={null}
            width={1020}
            centered
        >
            <ValidationDemandeForm closeModal={() => setModalType(null)} fetchData={fetchData} id_bon={bonId} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'releve'}
            onCancel={closeAllModals}
            footer={null}
            width={800}
            centered
        >
            <ReleveBonDeSortie closeModal={() => setModalType(null)} fetchData={fetchData} id_bon={bonId} />
        </Modal>
    </>
  )
}

export default BandeSortie;