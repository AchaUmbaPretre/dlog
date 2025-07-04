import { useEffect, useState } from 'react'
import { CarOutlined, TruckOutlined } from '@ant-design/icons';
import { Table, Tooltip, Typography, Input, Space, notification } from 'antd';
import { getVehiculeDispo } from '../../../../services/charroiService';

const { Search } = Input;
const { Text } = Typography;

const DemandeVehiculeDispo = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [searchValue, setSearchValue] = useState('');
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
          render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
        },
        width: "4%"
    },
    {
    title: (
      <Space>
        <CarOutlined style={{ color: 'red' }} />
        <Text strong>Immatriculation</Text>
      </Space>
    ),
    dataIndex: 'immatriculation',
    key: 'immatriculation',
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
        <CarOutlined style={{ color: 'blue' }} />
        <Text strong>Modèle</Text>
      </Space>
    ),
    dataIndex: 'modele',
    key: 'modele',
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
        <CarOutlined style={{ color: '#2db7f5' }} />
        <Text strong>Marque</Text>
      </Space>
    ),
    dataIndex: 'nom_marque',
    key: 'nom_marque',
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
    },
   ]

  const filteredData = data.filter(item =>
    item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <TruckOutlined className='client-icon' style={{color:'red'}}/>
                    </div>
                    <h2 className="client-h2"> Les vehicules disponibles</h2>
                </div>
                <div className="client-actions">
                    <div className="client-row-left">
                        <Search placeholder="Recherche..." 
                            enterButton 
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={pagination}
                    onChange={(pagination) => setPagination(pagination)}
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