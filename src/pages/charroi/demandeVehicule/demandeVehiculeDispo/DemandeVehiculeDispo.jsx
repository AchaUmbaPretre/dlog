import { useEffect, useState } from 'react'
import { CarOutlined, TruckOutlined } from '@ant-design/icons';
import { Table, Image, Tooltip, Input, Tag, notification } from 'antd';
import vehiculeImg from './../../../../assets/vehicule.png'
import config from '../../../../config';
import { getVehiculeDispo } from '../../../../services/charroiService';

const { Search } = Input;

const DemandeVehiculeDispo = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [searchValue, setSearchValue] = useState('');
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const scroll = { x: 'max-content' };

     const fetchData = async () => {
        try {
            const { data } = await getVehiculeDispo()
            setData(data)
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
            setLoading(false);
        } finally {
            setLoading(false)
        }
    }

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
          render: (text, record, index) => (
            <Tooltip title={`Ligne ${index + 1}`}>
              <Tag color="blue">{index + 1}</Tag>
            </Tooltip>
          ),
          width: "4%" 
        },
        {
            title: 'Matricule',
            dataIndex: 'immatriculation',
            render: (text) => (
                <div className="vehicule-matricule">
                    <span className="car-wrapper">
                        <span className="car-boost" />
                            <CarOutlined className="car-icon-animated" />
                        <span className="car-shadow" />
                    </span>
                    <Tag color="geekblue">{text}</Tag>
                </div>
            )
        }, 
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
            align: 'center',
                render: (text, record) => (
                    <Tag icon={<CarOutlined />} color="cyan">
                        {text}
                    </Tag>
                )
        },
        {
            title: 'Modèle',
            dataIndex: 'modele',
            align: 'center',
            render : (text) => (
                <Tag icon={<CarOutlined />} color="green">
                    {text ?? 'Aucun'}
                </Tag>
            )
        }
      ];

  const filteredData = data.filter(item =>
    item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <TruckOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Liste des vehicules</h2>
                </div>
                <div className="client-actions">
                    <div className="client-row-left">
                        <Search placeholder="Recherche..." 
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
                    onChange={(pagination)=> setPagination(pagination)}
                    rowKey="id_vehicule"
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    bordered
                    size="small" 
                    scroll={scroll}
                    loading={loading}
                />
            </div>
        </div>
    </>
  )
}

export default DemandeVehiculeDispo