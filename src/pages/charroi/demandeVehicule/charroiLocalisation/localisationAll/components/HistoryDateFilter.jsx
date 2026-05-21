// components/HistoryDateFilter.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Modal, 
  DatePicker, 
  TimePicker, 
  Button, 
  Space, 
  Tag, 
  Alert, 
  Statistic, 
  Row, 
  Col, 
  message, 
  Divider, 
  Typography,
  Card,
  Badge,
  Tooltip,
  Steps
} from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  HistoryOutlined,
  SunOutlined,
  SettingOutlined,
  CheckOutlined,
  SaveOutlined,
  ClearOutlined,
  FilterOutlined,
  MoonOutlined,
  RiseOutlined,
  RocketOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import isBetween from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(isBetween);
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);
dayjs.extend(advancedFormat);
dayjs.locale('fr');

const { Text, Title } = Typography;
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
  const [quickSelect, setQuickSelect] = useState(null);
  const [savedFilters, setSavedFilters] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const presets = useMemo(() => [
    { key: 'today', label: "Aujourd'hui", icon: <SunOutlined />, description: 'Activité du jour', color: '#1890ff', bgColor: '#e6f7ff',
      getRange: () => ({ start: dayjs().startOf('day'), end: dayjs().endOf('day') }) },
    { key: 'yesterday', label: 'Hier', icon: <CalendarOutlined />, description: 'Jour précédent', color: '#52c41a', bgColor: '#f6ffed',
      getRange: () => ({ start: dayjs().subtract(1, 'day').startOf('day'), end: dayjs().subtract(1, 'day').endOf('day') }) },
    { key: 'week', label: 'Cette semaine', icon: <CalendarOutlined />, description: 'Lundi à aujourd\'hui', color: '#722ed1', bgColor: '#f9f0ff',
      getRange: () => ({ start: dayjs().startOf('isoWeek'), end: dayjs().endOf('day') }) },
    { key: 'month', label: 'Ce mois', icon: <CalendarOutlined />, description: '1er du mois à aujourd\'hui', color: '#fa8c16', bgColor: '#fff7e6',
      getRange: () => ({ start: dayjs().startOf('month'), end: dayjs().endOf('day') }) },
    { key: 'quarter', label: 'Trimestre', icon: <LineChartOutlined />, description: 'Analyse trimestrielle', color: '#eb2f96', bgColor: '#fff0f6',
      getRange: () => ({ start: dayjs().startOf('quarter'), end: dayjs().endOf('day') }) },
    { key: 'year', label: 'Année', icon: <CalendarOutlined />, description: 'Analyse annuelle', color: '#13c2c2', bgColor: '#e6fffa',
      getRange: () => ({ start: dayjs().startOf('year'), end: dayjs().endOf('day') }) },
    { key: 'custom', label: 'Personnalisé', icon: <SettingOutlined />, description: 'Plage sur mesure', color: '#8c8c8c', bgColor: '#fafafa',
      getRange: () => ({ start: null, end: null }) }
  ], []);

  // Quick selects avec icônes Ant Design - CORRIGÉS pour la nuit
  const quickSelects = [
    { value: 'dawn', label: 'Aube', startHour: 5, endHour: 7, icon: <RiseOutlined /> },
    { value: 'morning', label: 'Matinée', startHour: 7, endHour: 12, icon: <SunOutlined /> },
    { value: 'afternoon', label: 'Après-midi', startHour: 12, endHour: 17, icon: <SunOutlined /> },
    { value: 'evening', label: 'Soirée', startHour: 17, endHour: 21, icon: <MoonOutlined /> },
    { value: 'night', label: 'Nuit', startHour: 21, endHour: 5, crossesMidnight: true, icon: <MoonOutlined /> },
    { value: 'rushHour', label: 'Heures de pointe', startHour: 7, endHour: 9, icon: <RocketOutlined /> }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('flog_history_filters');
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handlePresetChange = (key) => {
    setPreset(key);
    setQuickSelect(null);
    const presetData = presets.find(p => p.key === key);
    if (key !== 'custom') {
      const { start, end } = presetData.getRange();
      setDateRange([start, end]);
      setTimeRange(null);
      setActiveStep(1);
    } else {
      setDateRange(null);
      setActiveStep(0);
    }
  };

  const handleQuickSelect = (value) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      message.warning('Veuillez d\'abord sélectionner une plage de dates');
      return;
    }

    setQuickSelect(value);
    const quick = quickSelects.find(q => q.value === value);
    if (!quick) return;

    if (quick.crossesMidnight) {
      // Nuit: de startHour à endHour le lendemain
      const startTime = dayjs().hour(quick.startHour).minute(0);
      const endTime = dayjs().hour(quick.endHour).minute(0).add(1, 'day');
      setTimeRange([startTime, endTime]);
    } else {
      const startTime = dayjs().hour(quick.startHour).minute(0);
      const endTime = dayjs().hour(quick.endHour).minute(0);
      setTimeRange([startTime, endTime]);
    }
    setActiveStep(2);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      setPreset('custom');
      setActiveStep(1);
    }
  };

  const handleTimeRangeChange = (times) => {
    setTimeRange(times);
    if (times && times[0] && times[1]) {
      setActiveStep(2);
    }
  };

  // Calcul des stats CORRIGÉ pour gérer les plages qui traversent minuit
  const getStatsPreview = useMemo(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return null;
    
    const days = dateRange[1].diff(dateRange[0], 'day') + 1;
    let hoursPerDay = 24;
    let totalHours = days * 24;

    if (timeRange && timeRange[0] && timeRange[1]) {
      let startHour = timeRange[0].hour();
      let endHour = timeRange[1].hour();
      let endMinute = timeRange[1].minute();
      
      // Vérifier si la plage traverse minuit (ex: 21h -> 5h)
      if (endHour < startHour || (endHour === startHour && endMinute < timeRange[0].minute())) {
        // Plage qui traverse minuit: de startHour à 24h + de 0h à endHour
        hoursPerDay = (24 - startHour) + endHour;
      } else {
        hoursPerDay = endHour - startHour;
      }
      
      totalHours = days * hoursPerDay;
    }

    const totalSlots = totalHours; // 1 slot par heure pour simplifier

    return { days, hoursPerDay, totalHours, totalSlots };
  }, [dateRange, timeRange]);

  const saveCurrentFilter = () => {
    const filterName = prompt('Nom du filtre', `${vehicle?.name || 'Trajets'} - ${dayjs().format('DD/MM/YYYY')}`);
    if (filterName) {
      let savedTimeRange = null;
      if (timeRange && timeRange[0] && timeRange[1]) {
        savedTimeRange = [
          timeRange[0].format('HH:mm'),
          timeRange[1].format('HH:mm')
        ];
      }
      const newFilter = {
        id: Date.now(),
        name: filterName,
        dateRange: dateRange ? [dateRange[0].toISOString(), dateRange[1].toISOString()] : null,
        timeRange: savedTimeRange,
        preset,
        createdAt: new Date().toISOString()
      };
      const updatedFilters = [newFilter, ...savedFilters].slice(0, 5);
      setSavedFilters(updatedFilters);
      localStorage.setItem('flog_history_filters', JSON.stringify(updatedFilters));
      message.success('Filtre sauvegardé');
    }
  };

  const loadSavedFilter = (filter) => {
    if (filter.dateRange) {
      setDateRange([dayjs(filter.dateRange[0]), dayjs(filter.dateRange[1])]);
    }
    if (filter.timeRange) {
      let startHour = parseInt(filter.timeRange[0].split(':')[0]);
      let startMinute = parseInt(filter.timeRange[0].split(':')[1]);
      let endHour = parseInt(filter.timeRange[1].split(':')[0]);
      let endMinute = parseInt(filter.timeRange[1].split(':')[1]);
      
      let startTime = dayjs().hour(startHour).minute(startMinute);
      let endTime = dayjs().hour(endHour).minute(endMinute);
      
      if (endHour < startHour) {
        endTime = endTime.add(1, 'day');
      }
      
      setTimeRange([startTime, endTime]);
    }
    setPreset(filter.preset);
    message.success(`Filtre "${filter.name}" chargé`);
  };

/*   const deleteSavedFilter = (filterId) => {
    const updatedFilters = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updatedFilters);
    localStorage.setItem('flog_history_filters', JSON.stringify(updatedFilters));
    message.success('Filtre supprimé');
  }; */

  const handleApply = () => {
    let startDate = null;
    let endDate = null;

    if (preset === 'custom' && dateRange && dateRange[0] && dateRange[1]) {
      startDate = dateRange[0];
      endDate = dateRange[1];
      
      if (timeRange && timeRange[0] && timeRange[1]) {
        let startHour = timeRange[0].hour();
        let startMinute = timeRange[0].minute();
        let endHour = timeRange[1].hour();
        let endMinute = timeRange[1].minute();
        
        startDate = startDate.hour(startHour).minute(startMinute);
        
        if (endHour < startHour) {
          endDate = endDate.add(1, 'day').hour(endHour).minute(endMinute);
        } else {
          endDate = endDate.hour(endHour).minute(endMinute);
        }
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
      onApplyFilter({
        from_date: startDate.format('YYYY-MM-DD'),
        from_time: startDate.format('HH:mm:ss'),
        to_date: endDate.format('YYYY-MM-DD'),
        to_time: endDate.format('HH:mm:ss')
      });
    }
  };

  const handleClear = () => {
    setDateRange(null);
    setTimeRange(null);
    setPreset('today');
    setQuickSelect(null);
    setActiveStep(0);
    onClearFilter();
    message.info('Filtres réinitialisés');
  };

  const currentPreset = presets.find(p => p.key === preset);
  const hasActiveFilter = preset !== 'today' || dateRange || timeRange;
  const stats = getStatsPreview;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Space size={12}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FilterOutlined style={{ fontSize: 20, color: 'white' }} />
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>Filtre historique des trajets</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>Affinez la période d'analyse</Text>
            </div>
          </Space>
          {vehicle && (
            <Badge count={vehicle.name} style={{ backgroundColor: '#1890ff' }} />
          )}
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      centered
      footer={null}
      styles={{ body: { padding: '24px' } }}
    >
      <Steps
        current={activeStep}
        size="small"
        items={[
          { title: 'Période', icon: <CalendarOutlined /> },
          { title: 'Dates', icon: <ClockCircleOutlined /> },
          { title: 'Horaire', icon: <HistoryOutlined /> }
        ]}
        style={{ marginBottom: 24 }}
      />

      {/* Presets section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text strong style={{ fontSize: 14 }}>Périodes prédéfinies</Text>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {presets.map(p => (
            <div
              key={p.key}
              onClick={() => handlePresetChange(p.key)}
              style={{
                padding: '12px',
                borderRadius: 12,
                cursor: 'pointer',
                background: preset === p.key ? p.bgColor : '#fafafa',
                border: preset === p.key ? `2px solid ${p.color}` : '1px solid #f0f0f0',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>{p.icon}</span>
                <Text strong style={{ color: preset === p.key ? p.color : '#666' }}>{p.label}</Text>
              </div>
              <Text type="secondary" style={{ fontSize: 11 }}>{p.description}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* Quick selects */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ fontSize: 14 }}>Sélection rapide</Text>
        </div>
        <Space wrap size={8}>
          {quickSelects.map(q => (
            <Button
              key={q.value}
              type={quickSelect === q.value ? 'primary' : 'default'}
              onClick={() => handleQuickSelect(q.value)}
              size="small"
              icon={q.icon}
            >
              {q.label}
            </Button>
          ))}
        </Space>
      </div>

      {/* Date Range Picker */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ fontSize: 14 }}>Plage de dates</Text>
        </div>
        <RangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          format="DD/MM/YYYY"
          placeholder={['Date de début', 'Date de fin']}
          style={{ width: '100%', height: 40 }}
          allowClear
          size="large"
        />
      </div>

      {/* Time Range Picker */}
      {preset === 'custom' && dateRange && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text strong style={{ fontSize: 14 }}>Plage horaire</Text>
            <Tag color="orange" icon={<ClockCircleOutlined />}>Optionnel</Tag>
          </div>
          <TimePicker.RangePicker
            value={timeRange}
            onChange={handleTimeRangeChange}
            format="HH:mm"
            placeholder={['Heure début', 'Heure fin']}
            style={{ width: '100%', height: 40 }}
            minuteStep={15}
            allowClear
            size="large"
          />
          <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
            Laissez vide pour analyser toute la journée
          </Text>
        </div>
      )}

      {/* Stats preview - VERSION CORRIGÉE */}
      {stats && (
        <Card size="small" style={{ marginBottom: 24, background: '#f8f9fa', borderRadius: 12 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic 
                title="Jours analysés" 
                value={stats.days} 
                suffix="jour(s)"
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={8}>
              <Statistic 
                title="Heures par jour" 
                value={stats.hoursPerDay} 
                suffix="h"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={8}>
              <Statistic 
                title="Total heures" 
                value={stats.totalHours} 
                suffix="h"
                prefix={<LineChartOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Saved filters */}
      {savedFilters.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Divider orientation="left">
            <Space>
              <SaveOutlined />
              <Text strong>Filtres sauvegardés</Text>
            </Space>
          </Divider>
          <Space wrap size={8}>
            {savedFilters.map(filter => (
              <Tooltip key={filter.id} title={`Créé le ${dayjs(filter.createdAt).format('DD/MM/YYYY')}`}>
                <Button
                  size="small"
                  onClick={() => loadSavedFilter(filter)}
                  icon={<SaveOutlined />}
                >
                  {filter.name}
                </Button>
              </Tooltip>
            ))}
          </Space>
        </div>
      )}

      <Divider />

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button 
            icon={<SaveOutlined />} 
            onClick={saveCurrentFilter}
            disabled={!hasActiveFilter}
          >
            Sauvegarder
          </Button>
          <Button 
            icon={<ClearOutlined />} 
            onClick={handleClear}
          >
            Réinitialiser
          </Button>
        </Space>
        <Space>
          <Button onClick={onClose}>
            Annuler
          </Button>
          <Button 
            type="primary" 
            icon={<CheckOutlined />} 
            onClick={handleApply}
            loading={loading}
            size="large"
          >
            Appliquer
          </Button>
        </Space>
      </div>

      {/* Résumé actuel */}
      {hasActiveFilter && (
        <Alert
          message="Filtre actif"
          description={
            <div>
              <div><strong>Période:</strong> {currentPreset?.label || 'Personnalisée'}</div>
              {dateRange && (
                <div><strong>Dates:</strong> {dateRange[0]?.format('DD/MM/YYYY')} - {dateRange[1]?.format('DD/MM/YYYY')}</div>
              )}
              {timeRange && (
                <div><strong>Horaires:</strong> {timeRange[0]?.format('HH:mm')} - {timeRange[1]?.format('HH:mm')}</div>
              )}
              {quickSelect && (
                <div><strong>Raccourci:</strong> {quickSelects.find(q => q.value === quickSelect)?.label}</div>
              )}
              {stats && (
                <div><strong>Total:</strong> {stats.totalHours} heures sur {stats.days} jour(s)</div>
              )}
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </Modal>
  );
};

export default HistoryDateFilter;