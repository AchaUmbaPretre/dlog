import React from 'react';
import { Card, Table, Tag, Space } from 'antd';
import { BuildOutlined } from '@ant-design/icons';

const SiteComparison = ({ 
  sites, 
  columns, 
  stats, 
  onRowClass 
}) => {
      const scroll = { x: 'max-content' };
  return (
    <Card 
      title={
        <Space>
          <BuildOutlined />
          <span>Comparaison des Sites</span>
          <Tag color="blue">{sites.length} sites</Tag>
        </Space>
      }
      style={{ marginBottom: '24px' }}
      extra={
        <Space>
          {stats.meilleurSite && (
            <Tag color="gold">
              🏆 Meilleur: {stats.meilleurSite.site_nom} ({stats.meilleurSite.performance}%)
            </Tag>
          )}
          {stats.pireSite && stats.pireSite.performance < 50 && (
            <Tag color="error">
              ⚠ Pire: {stats.pireSite.site_nom} ({stats.pireSite.performance}%)
            </Tag>
          )}
        </Space>
      }
    >
      <Table 
        columns={columns} 
        dataSource={sites}
        pagination={false}
        bordered
        scroll={scroll}
        rowClassName={onRowClass}
        locale={{ emptyText: 'Aucune donnée de site disponible' }}
      />
      {sites.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <Space size={[0, 8]} wrap>
            <Tag color="gold">🏆 Top 3 performeurs</Tag>
            <Tag color="blue">Moyenne présence: {Math.round(stats.moyennePresenceParSite)}%</Tag>
            <Tag color="orange">{stats.sitesAvecProblemes} sites en difficulté</Tag>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default SiteComparison;