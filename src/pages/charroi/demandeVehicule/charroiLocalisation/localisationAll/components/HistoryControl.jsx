// components/HistoryControl.jsx
import React, { useState } from 'react';
import { Button, Tooltip, Badge, Dropdown } from 'antd';
import { HistoryOutlined, FilterOutlined } from '@ant-design/icons';
import HistoryDateFilter from './HistoryDateFilter';

const HistoryControl = ({ 
  vehicle, 
  onLoadHistory, 
  onClearHistory,
  showHistory,
  onToggleHistory 
}) => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApplyFilter = async (filterParams) => {
    setLoading(true);
    setActiveFilter(filterParams);
    await onLoadHistory(vehicle, filterParams);
    setLoading(false);
    setFilterVisible(false);
  };

  const handleClearFilter = () => {
    setActiveFilter(null);
    onClearHistory(vehicle?.id);
  };

  const hasActiveFilter = activeFilter !== null;

  return (
    <>
      <div style={{ display: 'flex', gap: 8 }}>
        <Tooltip title={showHistory ? "Masquer l'historique" : "Afficher l'historique"}>
          <Button 
            type={showHistory ? 'primary' : 'default'}
            icon={<HistoryOutlined />}
            onClick={onToggleHistory}
            style={{ flex: 1 }}
            disabled={!vehicle}
          >
            Historique
          </Button>
        </Tooltip>
        
        {showHistory && (
          <Badge dot={hasActiveFilter} color="#1890ff" offset={[-5, 5]}>
            <Tooltip title="Filtrer par date">
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFilterVisible(true)}
                disabled={!vehicle}
                style={{ width: 40 }}
              />
            </Tooltip>
          </Badge>
        )}
      </div>

      <HistoryDateFilter
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilter={handleApplyFilter}
        onClearFilter={handleClearFilter}
        vehicle={vehicle}
        loading={loading}
      />
    </>
  );
};

export default HistoryControl;