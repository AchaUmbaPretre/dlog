// TimeFilter.jsx - Version Ultra Premium
import { useState, useEffect } from 'react';
import { Select, Badge, Tooltip, Space, Tag } from 'antd';
import { 
  ClockCircleOutlined, 
  ThunderboltOutlined,
  HistoryOutlined,
  CalendarOutlined,
  CaretDownOutlined
} from '@ant-design/icons';

const timeRanges = [
  { value: 'now', label: 'À l\'instant', icon: <ThunderboltOutlined />, minutes: 1, color: '#52c41a' },
  { value: '5min', label: '5 min', icon: <ClockCircleOutlined />, minutes: 5, color: '#1890ff' },
  { value: '15min', label: '15 min', icon: <ClockCircleOutlined />, minutes: 15, color: '#1890ff' },
  { value: '30min', label: '30 min', icon: <ClockCircleOutlined />, minutes: 30, color: '#faad14' },
  { value: '1h', label: '1 heure', icon: <HistoryOutlined />, minutes: 60, color: '#faad14' },
  { value: '3h', label: '3 heures', icon: <HistoryOutlined />, minutes: 180, color: '#ff7a45' },
  { value: '6h', label: '6 heures', icon: <HistoryOutlined />, minutes: 360, color: '#ff4d4f' },
  { value: '12h', label: '12 heures', icon: <CalendarOutlined />, minutes: 720, color: '#ff4d4f' },
  { value: '24h', label: '24h+', icon: <CalendarOutlined />, minutes: 1440, color: '#8c8c8c' }
];

const TimeFilter = ({ vehicles, onTimeFilterChange }) => {
  const [selectedRange, setSelectedRange] = useState('now');
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const newCounts = {};
    timeRanges.forEach(range => {
      const filtered = vehicles.filter(vehicle => {
        let lastUpdate;
        if (vehicle.time) {
          const [day, month, yearTime] = vehicle.time.split('-');
          const [year, time] = yearTime.split(' ');
          const dateStr = `${month}/${day}/${year} ${time}`;
          lastUpdate = new Date(dateStr);
        } else if (vehicle.timestamp) {
          lastUpdate = new Date(vehicle.timestamp * 1000);
        } else {
          return false;
        }
        
        if (isNaN(lastUpdate.getTime())) return false;
        const diffMinutes = (new Date() - lastUpdate) / (1000 * 60);
        
        if (range.value === 'now') return diffMinutes <= 1;
        if (range.value === '24h') return diffMinutes > 1440;
        return diffMinutes <= range.minutes;
      });
      newCounts[range.value] = filtered.length;
    });
    setCounts(newCounts);
  }, [vehicles]);

  const handleChange = (value) => {
    setSelectedRange(value);
    const range = timeRanges.find(r => r.value === value);
    if (!range) return;
    
    const filtered = vehicles.filter(vehicle => {
      let lastUpdate;
      if (vehicle.time) {
        const [day, month, yearTime] = vehicle.time.split('-');
        const [year, time] = yearTime.split(' ');
        const dateStr = `${month}/${day}/${year} ${time}`;
        lastUpdate = new Date(dateStr);
      } else if (vehicle.timestamp) {
        lastUpdate = new Date(vehicle.timestamp * 1000);
      } else {
        return false;
      }
      
      if (isNaN(lastUpdate.getTime())) return false;
      const diffMinutes = (new Date() - lastUpdate) / (1000 * 60);
      
      if (value === 'now') return diffMinutes <= 1;
      if (value === '24h') return diffMinutes > 1440;
      return diffMinutes <= range.minutes;
    });
    onTimeFilterChange(filtered.map(v => v.id));
  };

  const currentRange = timeRanges.find(r => r.value === selectedRange);

  return (
    <Tooltip title={`Véhicules actifs: ${counts[selectedRange] || 0}`}>
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
        suffixIcon={<CaretDownOutlined style={{ fontSize: 10, color: '#8c8c8c' }} />}
        popupMatchSelectWidth={180}
      >
        {timeRanges.map(range => (
          <Select.Option key={range.value} value={range.value}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Space size={6}>
                <span style={{ color: range.color }}>{range.icon}</span>
                <span style={{ fontSize: 12 }}>{range.label}</span>
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