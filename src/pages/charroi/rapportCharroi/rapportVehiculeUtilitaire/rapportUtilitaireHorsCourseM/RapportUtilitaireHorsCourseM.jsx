import { Table, Space, Typography, Tag, Tooltip, Skeleton } from 'antd';
import { useState } from 'react';
import { CarOutlined, EnvironmentOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { MoyenneTag, ChronoTag, renderTextWithTooltip } from '../../../../../utils/renderTooltip';
import moment from 'moment';

const { Text } = Typography;

const RapportUtilitaireHorsCourseM = ({ data }) => {
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
            width: 50,
            align: "center",
        },
        {
            title: (
                <Space>
                    <UserOutlined style={{ color: "#fa8c16" }} />
                    <Text strong>Chauffeur</Text>
                </Space>
            ),
            dataIndex: "chauffeur",
            key: "chauffeur",
            render: (text) => renderTextWithTooltip(text),
            ellipsis: true,
        },
        {
            title: (
                <Space>
                    <EnvironmentOutlined style={{ color: "#f5222d" }} />
                    <Text strong>Dernière destination</Text>
                </Space>
            ),
            dataIndex: "derniere_destination",
            key: "derniere_destination",
            render: (text) => renderTextWithTooltip(text),
            ellipsis: true,
        },
        {
            title: (
                <Space>
                    <CarOutlined style={{ color: "#52c41a" }} />
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
                    <CarOutlined style={{ color: "#1890ff" }} />
                    <Text strong>Type véhicule</Text>
                </Space>
            ),
            dataIndex: "type_vehicule",
            key: "type_vehicule",
            render: (text) => renderTextWithTooltip(text),
            ellipsis: true,
        },
        {
            title: "Durée Moyenne (h)",
            key: "duree_moyenne_heures",
            align: 'center',
            render: (_, record) => <MoyenneTag duree_moyenne_min={record.duree_moyenne_heures} />,
        },
/*         {
            title: "Chrono (h)",
            key: "chrono_cours",
            align: 'center',
            render: (_, record) =>
                record.chrono_cours ? <ChronoTag chrono={record.chrono_cours} /> : <Text type="secondary">—</Text>,
        }, */
        {
            title: "Disponibilité Estimée",
            key: "dispo_estimee",
            align: 'center',
            sorter: (a, b) => moment(a.dispo_estimee) - moment(b.dispo_estimee),
            render: (text) => {
                if (!text) {
                    return (
                        <Tag icon={<CalendarOutlined />} color="red">
                            Aucune date
                        </Tag>
                    );
                }
                const date = moment(text);
                return (
                    <Tag icon={<CalendarOutlined />} color={date.isValid() ? "blue" : "red"}>
                        {date.isValid() ? date.format('DD-MM-YYYY') : 'Date invalide'}
                    </Tag>
                );
            },
        },
        {
            title: "Statut",
            key: "statut",
            align: 'center',
            render: (_, record) => {
                let color = record.statut === 'Disponible' ? 'green' 
                          : record.statut === 'Réservé' ? 'orange' 
                          : 'red';
                return <Tag color={color}>{record.statut}</Tag>;
            },
        },
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
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 'max-content' }}
                    />
                )}
            </div>
        </div>
    );
};

export default RapportUtilitaireHorsCourseM;
