import { useEffect, useState } from 'react'
import { getVehiculeOne, putRelierVehiculeFalcon } from '../../../services/charroiService';
import { notification ,Table , Tag, Button, Typography, message } from 'antd';
import './relierFalcon.scss'
import { getFalcon } from '../../../services/rapportService';
import { CarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getOdometer } from '../../../services/geocodeService';

const { Text } = Typography;

const RelierFalcon = ({idVehicule, closeModal}) => {
    const [vehicule, setVehicule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ falcon, setFalcon ] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
    const [searchValue, setSearchValue] = useState('');

      const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      }, width: "4%",
    },
    { title: 'Matricule', dataIndex: 'name', render: (text) => (
        <div className="vehicule-matricule">
          <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
          <Text strong>{text}</Text>
        </div>
      ),
    },
    { title: 'Date & Heure', dataIndex: 'time', render: (text) =>
        <Text>{moment(text, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")}</Text>,
      sorter: (a, b) =>
        moment(a.time, "DD-MM-YYYY HH:mm:ss").unix() - moment(b.time, "DD-MM-YYYY HH:mm:ss").unix(),
    },
    { title: 'Km Total', dataIndex: 'sensors', render: (sensors) => {
        const km = getOdometer(sensors);
        if (!km || isNaN(km)) return <Tag color="default">N/A</Tag>;
        return <Text>{Number(km).toLocaleString('fr-FR')} km</Text>;
      },
    },
  ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getFalcon()
                setFalcon(data[0].items);

            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, []);

    const fetchData = async () => {
        setLoading(true);
            try {
                const { data } = await getVehiculeOne(idVehicule);
                setVehicule(data.data[0]);
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des données.',
                });
            } finally {
                setLoading(false);
            }
    };

    useEffect(() => {
        if (idVehicule) fetchData();
    }, [idVehicule]);

    const handSubmit = async(values) => {
        try {
            await putRelierVehiculeFalcon({
                ...values,
                id_vehicule : idVehicule
            })
            message.success({ content: 'Véhicule a été relié avec succes!', key: 'submit' });
            closeModal();

        } catch (error) {
            message.error({ content: 'Une erreur est survenue.', key: 'submit' });
            console.error('Erreur lors de l\'ajout du chauffeur:', error);
        }
    }

  return (
    <>
        <div className="relierFalcon">
            <div className="relierFalcon_wrapper">
                <div className="relier_top">
                    <span>Immatriculation : {vehicule?.immatriculation}</span>                    
                    <span>Type de véhicule : {vehicule?.nom_cat}</span>
                    <span>Marque : {vehicule?.nom_marque}</span>
                    <span>Modele : {vehicule?.modele}</span>
                </div>

                <div className="relier_bottom">
                    <Table
                        columns={columns}
                        dataSource={falcon.filter(item => item.name?.toLowerCase().includes(searchValue.toLowerCase()))}
                        loading={loading}
                        pagination={pagination}
                        onChange={(pagination) => setPagination(pagination)}
                        rowKey="id"
                        bordered
                        size="middle"
                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    />
                    <div className="row_btn">
                        <Button handleClick={handSubmit} >Relier</Button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default RelierFalcon