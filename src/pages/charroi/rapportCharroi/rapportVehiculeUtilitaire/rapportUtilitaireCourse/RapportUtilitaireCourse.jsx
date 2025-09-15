import { Table, Typography, Space, Tag, Tooltip, Skeleton } from 'antd';
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
            render: (_, __, index) => (
                <Tooltip title={`Ligne ${index + 1}`}>
                    <Tag color="blue">{index + 1}</Tag>
                </Tooltip>
            ),
            width: 60,
            align: "center",
            fixed: 'left',
        },
                {
            title: (
                <Space>
                    <CarOutlined style={{ color: "red" }} />
                    <Text strong>Immatriculation</Text>
                </Space>
            ),
            dataIndex: "immatriculation",
            key: "immatriculation",
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
            title: "Durée réelle (h)",
            key: "duree_reelle_min",
            align: 'center',
            render: (_, record) => (
                <ChronoTag sortie_time={record.sortie_time} date_prevue={record.date_prevue} />
            ),
        },
        {
            title: "Durée Moyenne (h)",
            key: "duree_moyenne_min",
            align: 'center',
            render: (_, record) => <MoyenneTag duree_moyenne_min={record.duree_moyenne_min} />,
        },
        {
            title: "Écart (h)",
            key: "ecart_min",
            align: 'center',
            render: (_, record) => (
                <EcartTag
                    duree_reelle_min={record.duree_reelle_min}
                    duree_moyenne_min={record.duree_moyenne_min}
                />
            ),
        }
    ];

    return (
        <div style={{ padding: 20, background: "#fff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div>
                {loading ? <Skeleton active /> : (
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id_vehicule"
                        rowClassName={(record, index) => index % 2 === 0 ? 'odd-row' : 'even-row'}
                        bordered
                        size="middle"
                        scroll={{ x: 1000 }}
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                        rowStyle={{ cursor: 'pointer' }}
                    />
                )}
            </div>
        </div>
    );
};

export default RapportUtilitaireCourse;
