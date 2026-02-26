import React from 'react';
import { Row, Col, Card, Table, Tag, Space } from 'antd';
import { CrownOutlined, WarningOutlined } from '@ant-design/icons';

const EmployeeRanking = ({ topPerformeurs, agentsProbleme, columnsTop, columnsProbleme }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card 
          title={
            <Space>
              <CrownOutlined style={{ color: '#faad14' }} />
              <span>Top Performeurs</span>
              <Tag color="success">{topPerformeurs.length}</Tag>
            </Space>
          }
        >
          <Table 
            columns={columnsTop} 
            dataSource={topPerformeurs}
            pagination={false}
            showHeader={false}
            size="small"
            locale={{ emptyText: 'Aucun top performeur ce mois-ci' }}
          />
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card 
          title={
            <Space>
              <WarningOutlined style={{ color: '#f5222d' }} />
              <span>Agents à Problème</span>
              <Tag color="error">{agentsProbleme.length}</Tag>
            </Space>
          }
        >
          <Table 
            columns={columnsProbleme} 
            dataSource={agentsProbleme}
            pagination={false}
            size="small"
            locale={{ emptyText: 'Aucun agent à problème identifié' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default EmployeeRanking;