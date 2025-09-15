import { Table, Typography, Space } from 'antd';
import { useState } from 'react';
import { CarOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { ChronoTag, EcartTag, MoyenneTag, renderTextWithTooltip } from '../../../../../utils/renderTooltip';

const { Text } = Typography;

const RapportUtilitaireCourse = ({ data }) => {
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 60,
      align: "center",
      fixed: 'left',
    },
    {
      title: (
        <Space>
          <UserOutlined style={{ color: "orange" }} />
          <Text strong>Chauffeur</Text>
        </Space>
      ),
      dataIndex: "nom",
      key: "nom",
      render: (text) => renderTextWithTooltip(text),
      ellipsis: true,
    },
    {
      title: (
        <Space>
          <EnvironmentOutlined style={{ color: "red" }} />
          <Text strong>Destination</Text>
        </Space>
      ),
      dataIndex: "nom_destination",
      key: "nom_destination",
      render: (text) => renderTextWithTooltip(text),
      ellipsis: true,
    },
    {
      title: (
        <Space>
          <CarOutlined style={{ color: "green" }} />
          <Text strong>Véhicule</Text>
        </Space>
      ),
      dataIndex: "nom_cat",
      key: "nom_cat",
      render: (text) => renderTextWithTooltip(text),
      ellipsis: true,
    },
    {
      title: "Durée réelle",
      key: "duree_reelle_min",
      align: 'center',
      render: (_, record) => (
        <ChronoTag sortie_time={record.sortie_time} date_prevue={record.date_prevue} />
      ),
      width: 120,
    },
    {
      title: "Durée M.",
      key: "duree_moyenne_min",
      align: 'center',
      render: (_, record) => <MoyenneTag duree_moyenne_min={record.duree_moyenne_min} />,
      width: 120,
    },
    {
      title: "Écart",
      key: "ecart_min",
      align: 'center',
      render: (_, record) => (
        <EcartTag
          duree_reelle_min={record.duree_reelle_min}
          duree_moyenne_min={record.duree_moyenne_min}
        />
      ),
      width: 100,
    },
  ];

  return (
    <div className="rapportUtilitaire_dispo">
      <h2 className="rapport_h2">Véhicules en course</h2>
      <div className="rapport_utilitaire_dispo_wrapper">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id_vehicule"
          rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          bordered
          size="small"
          loading={loading}
          scroll={{ x: 1000 }} // permet le scroll horizontal si le tableau est trop large
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </div>
    </div>
  );
};

export default RapportUtilitaireCourse;
