import { Card, Typography, Space, Table, DatePicker, Statistic, Progress, Button } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { getRapportBonPerformance } from '../../../../../../services/rapportService';
import { CSVLink } from 'react-csv';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const Performance_op = () => {
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);
  const [vehicule, setVehicule] = useState([]);
  const [chauffeur, setChauffeur] = useState([]);
  const [course, setCourse] = useState([]);
  const [courseDuree, setCourseDuree] = useState([]);
  const [tauxRespect, setTauxRespect] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (start, end) => {
    setLoading(true);
    try {
      const [performanceData] = await Promise.all([
        getRapportBonPerformance(start, end)
      ]);

      setVehicule(performanceData.data.vehiculeData || []);
      setChauffeur(performanceData.data.chauffeurData || []);
      setCourse(performanceData.data.dureeData || []);
      setCourseDuree(performanceData.data.dureeData || []);
      setTauxRespect(performanceData.data.tauxData?.taux_retour_delais || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD'));
  }, []);

  const columnsVehicule = [
    { title: '#', key: 'id', render: (text, record, index) => index + 1, width: '3%' },
    { title: 'Immatriculation', dataIndex: 'immatriculation', key: 'immatriculation' },
    { title: 'Marque', dataIndex: 'nom_marque', key: 'nom_marque' },
    { title: 'Catégorie', dataIndex: 'nom_cat', key: 'nom_cat' },
    { title: 'Nbre sorties', dataIndex: 'total_sorties', key: 'total_sorties' }
  ];

  const columnsChauffeur = [
    { title: '#', key: 'id', render: (text, record, index) => index + 1, width: '3%' },
    { title: 'Nom', dataIndex: 'nom', key: 'nom' },
    { title: 'Nbre sorties', dataIndex: 'total_sorties', key: 'total_sorties' }
  ];

  const columnsCourse = [
    { title: '#', key: 'id', render: (text, record, index) => index + 1, width: '3%' },
    { title: 'Destination', dataIndex: 'nom_destination', key: 'nom_destination' },
    { title: 'Durée moyenne (heures)', dataIndex: 'duree_moyenne_heures', key: 'duree_moyenne_heures' },
    { title: 'Durée totale (jours)', dataIndex: 'duree_totale_jours', key: 'duree_totale_jours' }
  ];

  return (
    <div className='rapport_bs'>
      <Card type='inner' title='Performance opérationnelle'>
        <Space style={{ marginBottom: 16 }}>
          <RangePicker
            value={dateRange}
            format='YYYY-MM-DD'
            onChange={(dates) => {
              if (dates) {
                setDateRange(dates);
                fetchData(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
              }
            }}
          />
          <CSVLink data={vehicule} filename={`vehicule_${moment().format('YYYYMMDD')}.csv`}>
            <Button type='primary'>Exporter Véhicules CSV</Button>
          </CSVLink>
        </Space>

        <Card title={`Taux de respect des délais`} style={{ marginBottom: 16 }}>
          <Statistic
            title='Respect des délais (%)'
            value={tauxRespect}
            precision={2}
          />
          <Progress percent={tauxRespect} status={tauxRespect >= 100 ? 'success' : 'active'} />
        </Card>

        <Card title='Nombre moyen de sorties par véhicule' style={{ marginBottom: 16 }}>
          <Table dataSource={vehicule} columns={columnsVehicule} loading={loading} rowKey='id_vehicule' pagination={{ pageSize: 5 }} />
        </Card>

        <Card title='Nombre moyen de sorties par chauffeur' style={{ marginBottom: 16 }}>
          <Table dataSource={chauffeur} columns={columnsChauffeur} loading={loading} rowKey='id_chauffeur' pagination={{ pageSize: 5 }} />
        </Card>

        <Card title='Durée moyenne et totale des courses' style={{ marginBottom: 16 }}>
          <Table dataSource={course} columns={columnsCourse} loading={loading} rowKey='nom_destination' pagination={{ pageSize: 5 }} />
        </Card>
      </Card>
    </div>
  );
};

export default Performance_op;
