import { Card, Typography, Space, Table } from 'antd'
import { useState } from 'react';

const { Text } = Typography;

const Performance_op = () => {
  const [data, setData] = useState([]);

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Immatriculation', key: 'immatriculation', 
      render: (text, record) => (
        <Space>
          <Text type='secondary'>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Marque', key: 'nom_marque', 
      render: (text, record) => (
        <Space>
          <Text type='secondary'>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Nbre moyen', key: 'nbre_moyen', 
      render: (text, record) => (
        <Space>
          <Text type='secondary'>{text}</Text>
        </Space>
      )
    }
  ]

  const ChauffeurColumns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Nom', dataIndex: 'nom_chauffeur', key: 'nom_chauffeur', 
      render: (text, record) => (
        <Space>
          <Text type='secondary'>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Nbre moyen', key: 'nbre_moyen', 
      render: (text, record) => (
        <Space>
          <Text type='secondary'>{text}</Text>
        </Space>
      )
    }
  ]

  const MoyenneDureeColumns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Destination', dataIndex: 'nom_destination', key: 'nom_destination', 
      render: (text, record) => (
        <Space>
          <Text type='secondary'>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Date', dataIndex: 'Date', key: 'date',
      render: (text, record) => (
        <Space>
          <Text type='secondary'>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Nbre moyen', key: 'nbre_moyen', 
      render: (text, record) => (
        <Space>
          <Text type='secondary'>{text}</Text>
        </Space>
      )
    }
  ]

  const TotaleDureeColumns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => index + 1, width: "3%" },
    {
      title: 'Destination', dataIndex: 'nom_destination', key: 'nom_destination', 
      render: (text, record) => (
        <Space>
          <Text type='secondary'>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Date', dataIndex: 'Date', key: 'date',
      render: (text, record) => (
        <Space>
          <Text type='secondary'>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Nbre moyen', key: 'nbre_moyen', 
      render: (text, record) => (
        <Space>
          <Text type='secondary'>{text}</Text>
        </Space>
      )
    }
  ]

  return (
    <>
      <div className="rapport_bs">
        <div className="rapport_bs_wrapper">
          <Card  type="inner" title="Performance opérationnelle" className="rapport_bs_globals">
            <div className="rapport_bs_global">
              <Card type="inner" title="Nombre moyen de sorties par véhicule">
                <Table dataSource={data} columns={columns} />
              </Card>

              <Card type="inner" title="Nombre moyen de sorties par chauffeur">
                <Table dataSource={data} columns={ChauffeurColumns} />
              </Card>

              <Card type="inner" title="Durée moyenne d’une course">
                <Table dataSource={data} columns={MoyenneDureeColumns} />
              </Card>

              <Card type="inner" title="Durée totale cumulée des courses">
                <Table dataSource={data} columns={TotaleDureeColumns} />
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Performance_op