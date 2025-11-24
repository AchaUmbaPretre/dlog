import React from 'react'
import { CarOutlined,FireOutlined,DashboardOutlined,ArrowRightOutlined   } from '@ant-design/icons';
import { Card, Table, Tag, Tooltip, Typography } from 'antd';
import { formatNumber } from '../../../../../../utils/formatNumber';

const { Text } = Typography;

const ConsomInfoSiegeKin = ({siegeData, loading}) => {
    const scroll = { x: 400 };

    const columns = [
    {
      title: '#', 
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => (
        <Tooltip title={`Ligne ${index + 1}`}>
          <Tag color="blue">{index + 1}</Tag>
        </Tooltip>
      ),
      width: "3%"
    },
    {
      title: (
        <>
          <FireOutlined style={{ color: '#ffec3d' }} /> Carburant
        </>
      ),
      dataIndex: 'nom_type_carburant',
      render: (text) => (
        <Tooltip title="Nom du site">
          <Tag color="green">{text ?? 'N/A'}</Tag>
        </Tooltip>
      )
    },
    {
      title: 'Plein',
      dataIndex: 'total_pleins',
      render: (text) => (
        <Tooltip title="Nombre total de pleins">
          <Text type="secondary">{formatNumber(text)}</Text>
        </Tooltip>
      )
    },
    {
      title: (
        <>
          <CarOutlined style={{ color: "#1890ff" }} /> Véhicule
        </>
      ),
      dataIndex: 'nbre_vehicule',
      render: (text) => (
        <Tooltip title="Nombre total de pleins">
            <Text type="secondary">{formatNumber(text)}</Text>
        </Tooltip>
      )
    },
    {
      title: (
        <>
          <ArrowRightOutlined style={{ color: "#722ed1" }} /> Litres
        </>
      ),
      dataIndex: 'total_litres',
      render: (text) => (
        <Tooltip title="Quantité totale en litres">
            <Text type="secondary">{formatNumber(text)}</Text>
        </Tooltip>
      )
    },
    {
      title: (
        <>
          <DashboardOutlined style={{ color: "#eb2f96" }} /> Km
        </>
      ),
      dataIndex: 'total_kilometrage',
      render: (text) => (
        <Tooltip title="Kilométrage total">
            <Text type="secondary">{formatNumber(text)}</Text>
        </Tooltip>
      )
    }
  ];

  return (
    <>
        <div>
          <Card type="inner" title="COBRA">
            <Table 
              columns={columns} 
              dataSource={siegeData} 
              size="small"
              rowClassName={(_, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
              scroll={scroll}
              loading={loading}
            />
          </Card>
        </div>
    </>
  )
}

export default ConsomInfoSiegeKin