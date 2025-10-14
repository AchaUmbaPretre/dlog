import React, { useEffect, useState } from 'react';
import {
  Typography,
  Input,
  Space,
  DatePicker,
  List,
  Spin,
  Modal,
  notification,
} from 'antd';
import moment from 'moment';
import PhraseItem from './phraseItem/PhraseItem';
import { getEventRow } from '../../../../../services/eventService';
import './rapportEvent.scss';
import RapportEventHistory from './rapportEventHistory/RapportEventHistory';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const RapportEvent = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([moment().startOf('day'), moment().endOf('day')]);
  const [modalVisible, setModalVisible] = useState(false);
  const [idDevice, setIdDevice] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      const { data } = await getEventRow(params);
      setReportData(data);
    } catch (err) {
      notification.error({
        message: 'Erreur de chargement',
        description: "Impossible de récupérer les données du rapport",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

const filteredData = reportData.filter(item =>
  item?.phrase?.toLowerCase().includes(searchText.toLowerCase())
);


  const openModal = (id) => {
    setIdDevice(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setIdDevice(null);
  };

  return (
    <div className="rapport-event-container">
      <Title level={3} style={{marginBottom: 24 }}>
        📊 Rapport des connexions
      </Title>

      <Space
        className="toolbar"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 }}
      >
        <RangePicker
          value={dateRange}
          onChange={dates => dates && setDateRange(dates)}
          showTime
          format="YYYY-MM-DD HH:mm"
          style={{ marginBottom: 8 }}
        />

        <Input.Search
          placeholder="Rechercher un véhicule"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
          style={{ width: 300, marginBottom: 8 }}
        />
      </Space>

      {loading ? (
        <Spin tip="Chargement..." size="large" style={{ display: 'block', marginTop: 60 }} />
      ) : (
        <List
          dataSource={filteredData}
          renderItem={(item, index) => (
            <PhraseItem
              phrase={item.phrase}
              index={index}
              onDetailClick={() => openModal(item.device_id)}
            />
          )}
          bordered
          style={{ backgroundColor: '#fff', borderRadius: 6 }}
          locale={{ emptyText: 'Aucun rapport trouvé.' }}
        />
      )}

      {/* Modal avec détails */}
      <Modal
        visible={modalVisible}
        title={`Détails du véhicule`}
        onCancel={closeModal}
        footer={null}
      >
        <RapportEventHistory idDevice={idDevice}/>
      </Modal>
    </div>
  );
};

export default RapportEvent;
