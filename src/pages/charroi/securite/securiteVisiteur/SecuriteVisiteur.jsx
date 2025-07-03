import { useEffect, useState } from 'react'
import { Input, Button, Tooltip, Typography, Tag, Table, Space, notification } from 'antd';
import moment from 'moment';
import { getVisiteurVehicule } from '../../../../services/charroiService';
import {  SolutionOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Text } = Typography;

const SecuriteVisiteur = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });

    const fetchData = async() => {
        try {
            const { data } = await  getVisiteurVehicule()
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

       const handleReleve = () => {
    
        }

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
      title: (
        <Space>
          <Text strong>Chauffeur</Text>
        </Space>
      ),
      dataIndex: 'nom_chauffeur',
      key: 'nom_chauffeur',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <Text>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: (
        <Space>
          <Text strong>Matricule</Text>
        </Space>
      ),
      dataIndex:'immatriculation',
      key: 'immatriculation',
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <Text  type="secondary">{text}</Text>
        </Tooltip>
      ),
    },
    {
        title : "Motif",
        dataIndex: 'nom_motif',
        key:'nom',
        render : (text) => (
          <Tag color={'green'}>{text}</Tag>
        )
    },
    {
      title : "Proprietaire",
      dataIndex: 'proprietaire',
      key:'proprietaire',
        render : (text) => (
          <Tag color={'geekblue'}>{text}</Tag>
        )
    },
    {
      title : "Entreprise",
      dataIndex: 'entreprise',
      key:'proprietaire',
        render : (text) => (
          <Tag>{text}</Tag>
        )
    },
    {
      title: (
        <Space>
          <CalendarOutlined style={{ color: 'blue' }} />
          <Text strong>Date entree</Text>
        </Space>
      ),
      dataIndex: 'date_entree',
      key: 'date_entree',
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
          <Text strong>Date sortie</Text>
        </Space>
      ),
      dataIndex: 'date_sortie',
      key: 'date_sortie',
      render: (text) => {
        if (!text) {
            return (
                <Tag icon={<CalendarOutlined />} color="red">
                    N'est pas sorti
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
        <Text strong>Securité</Text>
      </Space>
    ),
    dataIndex: 'nom',
    key: 'nom',
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
    },
    {
      title: (
        <Space>
          <Text strong>Connu</Text>
        </Space>
      ),
      dataIndex: 'vehicule_connu',
      key: 'vehicule_connu',
      render: (text) => (
        <Tag color={ text === 1 ? 'blue' : 'red'} >{text === 1 ? 'Oui' : 'Non'}</Tag>
      ),
    },
    {
        title: (
        <Text strong>Actions</Text>
        ),
        key: 'action',
        align: 'center',
        render: (text, record) => (
        <Space size="small">

            <Tooltip title={`Relevé de ${record.immatriculation}`}>
                <Button
                    icon={<FileTextOutlined />}
                    style={{ color: 'blue' }}
                    onClick={() => handleReleve(record.id_registre_visiteur)}
                    aria-label="Relevé"
                />
            </Tooltip>
        </Space>
        ),
    },
   ];

  return (
    <>
        <div className="client">
          <div className="client-wrapper">
            <div className="client-row">
              <div className="client-row-icon">
                <SolutionOutlined className='client-icon' style={{color:'blue'}} />
              </div>
              <h2 className="client-h2">Liste des visiteurs</h2>
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
                dataSource={data}
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

    </>
  )
}

export default SecuriteVisiteur;