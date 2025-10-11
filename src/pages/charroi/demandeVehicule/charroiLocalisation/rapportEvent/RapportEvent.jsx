import React, { useEffect, useState } from 'react';
import {
  Typography,
  Input,
  Space,
  List,
  Button,
  notification,
  Spin,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { getEventRow } from '../../../../../services/eventService';
import PhraseItem from './phraseItem/PhraseItem';
import './rapportEvent.scss';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const RapportEvent = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([
    moment().startOf('day'),
    moment().endOf('day'),
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
        mode: 'phrases',
      };
      const { data } = await getEventRow(params);
      setReportData(data);
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de récupérer les rapports',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const filteredData = reportData.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="rapport-container">
      <Title level={2} className="rapport-title">
        📊 Rapport Véhicules - Liste détaillée
      </Title>

      <Space
        direction="horizontal"
        size="large"
        className="rapport-filters"
        wrap
      >
        <RangePicker
          allowClear={false}
          value={dateRange}
          onChange={(dates) => dates && setDateRange(dates)}
          format="DD MMM YYYY HH:mm"
          showTime={{ format: 'HH:mm' }}
          className="rapport-range-picker"
          disabled={loading}
        />

        <Input.Search
          allowClear
          placeholder="Rechercher un véhicule ou statut..."
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          enterButton
          loading={loading}
          className="rapport-search"
          size="middle"
        />
      </Space>

      {loading ? (
        <Spin
          tip="Chargement en cours..."
          size="large"
          className="rapport-spinner"
        />
      ) : (
        <List
          bordered
          dataSource={filteredData}
          locale={{ emptyText: 'Aucun résultat' }}
          renderItem={(phrase, index) => <PhraseItem phrase={phrase} index={index} />}
          style={{ maxHeight: '70vh', overflowY: 'auto', background: 'white', borderRadius: 4 }}
        />
      )}
    </div>
  );
};

export default RapportEvent;
