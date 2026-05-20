// TimeFilter.jsx
import { useState, useEffect } from 'react';
import { Select, Badge, Tooltip, Space } from 'antd';
import {
  ClockCircleOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
  CalendarOutlined,
  CaretDownOutlined
} from '@ant-design/icons';

const timeRanges = [
  { value: 'now', label: 'À l\'instant', seconds: 60, icon: <ThunderboltOutlined />, color: '#52c41a' },
  { value: '5min', label: '5 min', seconds: 300, icon: <ClockCircleOutlined />, color: '#1890ff' },
  { value: '15min', label: '15 min', seconds: 900, icon: <ClockCircleOutlined />, color: '#1890ff' },
  { value: '30min', label: '30 min', seconds: 1800, icon: <ClockCircleOutlined />, color: '#faad14' },
  { value: '1h', label: '1 heure', seconds: 3600, icon: <HistoryOutlined />, color: '#faad14' },
  { value: '3h', label: '3 heures', seconds: 10800, icon: <HistoryOutlined />, color: '#ff7a45' },
  { value: '6h', label: '6 heures', seconds: 21600, icon: <HistoryOutlined />, color: '#ff4d4f' },
  { value: '12h', label: '12 heures', seconds: 43200, icon: <CalendarOutlined />, color: '#ff4d4f' },
  { value: '24h', label: '24h+', seconds: 86400, icon: <CalendarOutlined />, color: '#8c8c8c' }
];

const TimeFilter = ({ vehicles, onTimeFilterChange }) => {
  const [selectedRange, setSelectedRange] = useState('now');
  const [counts, setCounts] = useState({});

  // Vérifie si le véhicule correspond au filtre
  const matchRange = (vehicle, range) => {
    const stopDuration = Number(vehicle.stop_duration_sec || 0);

    if (!stopDuration) return false;

    // 24h+ => supérieur à 24h
    if (range.value === '24h') {
      return stopDuration > 86400;
    }

    return stopDuration <= range.seconds;
  };

  useEffect(() => {
    const newCounts = {};

    timeRanges.forEach(range => {
      const filtered = vehicles.filter(vehicle => matchRange(vehicle, range));
      newCounts[range.value] = filtered.length;
    });

    setCounts(newCounts);
  }, [vehicles]);

  const handleChange = (value) => {
    setSelectedRange(value);

    const range = timeRanges.find(r => r.value === value);

    if (!range) return;

    const filtered = vehicles.filter(vehicle => matchRange(vehicle, range));

    onTimeFilterChange(filtered.map(v => v.id));
  };

  return (
    <Tooltip title={`Véhicules trouvés: ${counts[selectedRange] || 0}`}>
      <Select
        value={selectedRange}
        onChange={handleChange}
        size="small"
        style={{
          width: 130,
          height: 30,
          marginLeft: 8,
          borderRadius: 6
        }}
        suffixIcon={
          <CaretDownOutlined
            style={{
              fontSize: 10,
              color: '#8c8c8c'
            }}
          />
        }
        popupMatchSelectWidth={180}
      >
        {timeRanges.map(range => (
          <Select.Option key={range.value} value={range.value}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <Space size={6}>
                <span style={{ color: range.color }}>
                  {range.icon}
                </span>

                <span style={{ fontSize: 12 }}>
                  {range.label}
                </span>
              </Space>

              <Badge
                count={counts[range.value] || 0}
                style={{
                  backgroundColor: range.color,
                  fontSize: 10,
                  height: 18,
                  minWidth: 18,
                  lineHeight: '18px'
                }}
              />
            </div>
          </Select.Option>
        ))}
      </Select>
    </Tooltip>
  );
};

export default TimeFilter;