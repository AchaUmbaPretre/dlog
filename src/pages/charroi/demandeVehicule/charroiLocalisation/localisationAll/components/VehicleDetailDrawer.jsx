import { Drawer, Descriptions, Card, Tag, Badge, Tabs, Statistic, Row, Col, Timeline } from 'antd';
import { 
  CarOutlined, 
  AlertOutlined, 
  DashboardOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { formatDate, formatDuration } from '../utils/helpers';
import { VehicleAddress } from '../../../../../../utils/vehicleAddress';

const VehicleDetailDrawer = ({ vehicle, visible, onClose }) => {
  if (!vehicle) return null;

  const ignition = vehicle.sensors?.find(s => s.type === 'acc');
  const odometer = vehicle.sensors?.find(s => s.type === 'odometer');
  const alarm = vehicle.sensors?.find(s => s.type === 'textual');

  const items = [
    {
      key: '1',
      label: 'Informations générales',
      children: (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Nom">{vehicle.name}</Descriptions.Item>
          <Descriptions.Item label="Statut">
            <Badge 
              status={vehicle.online === 'online' ? 'success' : 'warning'} 
              text={vehicle.online === 'online' ? 'En ligne' : 'ACK'}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Vitesse">
            <Tag color={vehicle.speed > 0 ? 'blue' : 'default'}>
              {vehicle.speed} km/h
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Distance totale">
            {vehicle.total_distance?.toFixed(2) || '-'} km
          </Descriptions.Item>
          <Descriptions.Item label="Temps d'arrêt">
            {formatDuration(vehicle.stop_duration_sec)}
          </Descriptions.Item>
          <Descriptions.Item label="Coordonnées">
            <VehicleAddress record={vehicle} />
            {vehicle.lat}, {vehicle.lng}
          </Descriptions.Item>
          <Descriptions.Item label="Altitude">{vehicle.altitude} m</Descriptions.Item>
          <Descriptions.Item label="Cap">{vehicle.course}°</Descriptions.Item>
          <Descriptions.Item label="Dernière mise à jour">
            {formatDate(vehicle.time)}
          </Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: '2',
      label: 'Capteurs',
      children: (
        <Card size="small">
          {vehicle.sensors?.map(sensor => (
            <div key={sensor.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div>
                <strong>{sensor.name}</strong>
                <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: 4 }}>
                  Type: {sensor.type}
                </div>
              </div>
              <Tag color={sensor.type === 'textual' && sensor.value !== '-' ? 'orange' : 
                         sensor.type === 'door' && sensor.val ? 'red' :
                         sensor.type === 'acc' && sensor.val ? 'green' : 'default'}>
                {sensor.value}
              </Tag>
            </div>
          ))}
        </Card>
      )
    },
    {
      key: '3',
      label: 'Statistiques',
      children: (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card size="small">
              <Statistic 
                title="Vitesse" 
                value={vehicle.speed} 
                suffix="km/h"
                prefix={<DashboardOutlined />}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small">
              <Statistic 
                title="Odomètre" 
                value={odometer?.val?.toFixed(0) || 0} 
                suffix="km"
                prefix={<LineChartOutlined />}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small">
              <Statistic 
                title="Temps d'arrêt" 
                value={formatDuration(vehicle.stop_duration_sec)}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small">
              <Statistic 
                title="Contact" 
                value={ignition?.val ? 'ON' : 'OFF'}
                valueStyle={{ color: ignition?.val ? '#52c41a' : '#ff4d4f' }}
                prefix={<ThunderboltOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )
    }
  ];

  if (alarm?.value && alarm.value !== '-') {
    items.push({
      key: '4',
      label: 'Alertes',
      children: (
        <Card size="small">
          <Timeline
            items={[
              {
                color: 'red',
                dot: <AlertOutlined />,
                children: (
                  <>
                    <strong>{alarm.value}</strong>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                      {formatDate(vehicle.time)}
                    </div>
                  </>
                )
              }
            ]}
          />
        </Card>
      )
    });
  }

  return (
    <Drawer
      title={
        <div>
          <CarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Détails - {vehicle.name}
        </div>
      }
      placement="right"
      width={520}
      onClose={onClose}
      open={visible}
      extra={
        <Badge 
          status={vehicle.online === 'online' ? 'success' : 'warning'} 
          text={vehicle.online === 'online' ? 'En ligne' : 'ACK'}
        />
      }
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Drawer>
  );
};

export default VehicleDetailDrawer;