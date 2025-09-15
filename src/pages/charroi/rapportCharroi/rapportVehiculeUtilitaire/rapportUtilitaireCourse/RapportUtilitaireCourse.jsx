import { Table, Typography, Tabs, Input, message, Dropdown, Menu, Space } from 'antd';
import { useState } from 'react';
import { CarOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { ChronoTag, EcartTag, MoyenneTag, renderTextWithTooltip } from '../../../../../utils/renderTooltip';

const { Text } = Typography;


const RapportUtilitaireCourse = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = 
        [
            {
            title: "#",
            key: "index",
            render: (_, __, index) => index + 1,
            width: 60,
            align: "center",
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
            },
            {
                title: "Durée réelle",
                key: "duree_reelle_min",
                align: 'center',
                render: (_, record) => (
                    <ChronoTag sortie_time={record.sortie_time} date_prevue={record.date_prevue} />
                ),
            },
            {
                title: "Durée Moyenne",
                key: "duree_moyenne_min",
                align: 'center',
                render: (_, record) => <MoyenneTag duree_moyenne_min={record.duree_moyenne_min} />,
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
            },
        ];

  return (
    <>
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
                />
            </div>
        </div>
    </>
  )
}

export default RapportUtilitaireCourse