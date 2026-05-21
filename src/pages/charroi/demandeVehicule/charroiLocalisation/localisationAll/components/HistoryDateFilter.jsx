// components/HistoryDateFilter.jsx
import React, { useState } from 'react';
import { Modal, DatePicker, TimePicker, Button, Space, Tag, Alert, Statistic, Row, Col, message } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  HistoryOutlined,
  CloseOutlined,
  CheckOutlined,
  ReloadOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

const { RangePicker } = DatePicker;

const HistoryDateFilter = ({ 
  visible, 
  onClose, 
  onApplyFilter,
  onClearFilter,
  vehicle,
  loading 
}) => {
  const [dateRange, setDateRange] = useState(null);
  const [timeRange, setTimeRange] = useState(null);
  const [preset, setPreset] = useState('today');

  const presets = [
    { 
      key: 'today', 
      label: 'Aujourd\'hui',
      getRange: () => {
        const start = dayjs().startOf('day');
        const end = dayjs().endOf('day');
        return { start, end };
      }
    },
    { 
      key: 'yesterday', 
      label: 'Hier',
      getRange: () => {
        const start = dayjs().subtract(1, 'day').startOf('day');
        const end = dayjs().subtract(1, 'day').endOf('day');
        return { start, end };
      }
    },
    { 
      key: 'week', 
      label: 'Cette semaine',
      getRange: () => {
        const start = dayjs().startOf('week');
        const end = dayjs().endOf('day');
        return { start, end };
      }
    },
    { 
      key: 'month', 
      label: 'Ce mois',
      getRange: () => {
        const start = dayjs().startOf('month');
        const end = dayjs().endOf('day');
        return { start, end };
      }
    },
    { 
      key: 'custom', 
      label: 'Personnalisé',
      getRange: () => ({ start: null, end: null })
    }
  ];

  const handlePresetChange = (key) => {
    setPreset(key);
    const presetData = presets.find(p => p.key === key);
    if (key !== 'custom') {
      const { start, end } = presetData.getRange();
      setDateRange([start, end]);
      setTimeRange(null);
    } else {
      setDateRange(null);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      setPreset('custom');
    }
  };

  const handleTimeRangeChange = (times) => {
    setTimeRange(times);
  };

  const handleApply = () => {
    let startDate = null;
    let endDate = null;

    if (preset === 'custom' && dateRange && dateRange[0] && dateRange[1]) {
      startDate = dateRange[0];
      endDate = dateRange[1];
      
      if (timeRange && timeRange[0] && timeRange[1]) {
        startDate = startDate.hour(timeRange[0].hour()).minute(timeRange[0].minute()).second(0);
        endDate = endDate.hour(timeRange[1].hour()).minute(timeRange[1].minute()).second(59);
      } else {
        startDate = startDate.startOf('day');
        endDate = endDate.endOf('day');
      }
    } else {
      const presetData = presets.find(p => p.key === preset);
      if (presetData && preset !== 'custom') {
        const range = presetData.getRange();
        startDate = range.start;
        endDate = range.end;
      }
    }

    if (startDate && endDate) {
      // Format pour l'API Falcon
      const fromDate = startDate.format('YYYY-MM-DD');
      const fromTime = startDate.format('HH:mm:ss');
      const toDate = endDate.format('YYYY-MM-DD');
      const toTime = endDate.format('HH:mm:ss');
      
      console.log('📅 Filtre appliqué:', { fromDate, fromTime, toDate, toTime });
      
      onApplyFilter({
        from_date: fromDate,
        from_time: fromTime,
        to_date: toDate,
        to_time: toTime,
        startDate,
        endDate
      });
    }
  };

  const handleClear = () => {
    setDateRange(null);
    setTimeRange(null);
    setPreset('today');
    onClearFilter();
  };

  const getDateLabel = () => {
    if (preset === 'custom' && dateRange) {
      if (timeRange) {
        return `${dateRange[0]?.format('DD/MM/YYYY')} ${timeRange[0]?.format('HH:mm')} - ${dateRange[1]?.format('DD/MM/YYYY')} ${timeRange[1]?.format('HH:mm')}`;
      }
      return `${dateRange[0]?.format('DD/MM/YYYY')} - ${dateRange[1]?.format('DD/MM/YYYY')}`;
    }
    const presetData = presets.find(p => p.key === preset);
    return presetData?.label || 'Aujourd\'hui';
  };

  return (
    <Modal
      title={
        <Space>
          <HistoryOutlined style={{ color: '#1890ff' }} />
          <span>Filtrer l'historique des trajets</span>
          {vehicle && <Tag color="blue">{vehicle.name}</Tag>}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={650}
      footer={[
        <Button key="clear" icon={<ReloadOutlined />} onClick={handleClear}>
          Réinitialiser
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Annuler
        </Button>,
        <Button 
          key="apply" 
          type="primary" 
          icon={<CheckOutlined />} 
          onClick={handleApply}
          loading={loading}
        >
          Appliquer
        </Button>
      ]}
    >
      <div style={{ padding: '8px 0' }}>
        {/* Presets */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12, fontWeight: 500, color: '#1a1a2e' }}>
            Périodes prédéfinies
          </div>
          <Space wrap size={8}>
            {presets.map(p => (
              <Button
                key={p.key}
                type={preset === p.key ? 'primary' : 'default'}
                onClick={() => handlePresetChange(p.key)}
                size="small"
              >
                {p.label}
              </Button>
            ))}
          </Space>
        </div>

        {/* Sélecteur de date */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12, fontWeight: 500, color: '#1a1a2e' }}>
            <CalendarOutlined /> Plage de dates
          </div>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            placeholder={['Date début', 'Date fin']}
            style={{ width: '100%' }}
            allowClear
          />
        </div>

        {/* Sélecteur d'heure */}
        {preset === 'custom' && dateRange && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 12, fontWeight: 500, color: '#1a1a2e' }}>
              <ClockCircleOutlined /> Plage horaire (optionnel)
            </div>
            <TimePicker.RangePicker
              value={timeRange}
              onChange={handleTimeRangeChange}
              format="HH:mm"
              placeholder={['Heure début', 'Heure fin']}
              style={{ width: '100%' }}
              minuteStep={15}
              allowClear
            />
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 8 }}>
              Laissez vide pour prendre toute la journée
            </div>
          </div>
        )}

        {/* Résumé */}
        <Alert
          message="Filtre actif"
          description={
            <div>
              <strong>{getDateLabel()}</strong>
              {preset === 'custom' && dateRange && timeRange && (
                <div style={{ marginTop: 8 }}>
                  <Tag color="blue">Plage personnalisée</Tag>
                  <Tag color="orange">Avec horaire</Tag>
                </div>
              )}
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </div>
    </Modal>
  );
};

export default HistoryDateFilter;