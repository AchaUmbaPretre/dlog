import { Table, Dropdown, Menu, notification, Tag, Space, Tooltip, Popconfirm, Skeleton, Tabs, Popover, Typography } from 'antd';
import { useState } from 'react';
import { ChronoTag, EcartTag, MoyenneTag, renderTextWithTooltip } from '../../../../../utils/renderTooltip';
import { CarOutlined, EnvironmentOutlined, ApartmentOutlined, AppstoreOutlined, UserOutlined } from '@ant-design/icons';
const { Text } = Typography;

const RapportUtilitaireHorsCourseM = ({data}) => {
    const [loading, setLoading] = useState(false);
    
    const columns = [
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
        dataIndex: "chauffeur",
        key: "chauffeur",
        render: (text) => renderTextWithTooltip(text),
        },
        {
            title: (
                <Space>
                    <EnvironmentOutlined style={{ color: "red" }} />
                    <Text strong>Dernière destination</Text>
                </Space>
            ),
            dataIndex: "derniere_destination",
            key: "derniere_destination",
            render: (text) => renderTextWithTooltip(text),
        },
                {
            title: (
                <Space>
                <CarOutlined style={{ color: "green" }} />
                <Text strong>Immatricu.</Text>
                </Space>
            ),
            dataIndex: "immatriculation",
            key: "immatriculation",
            render: (text) => renderTextWithTooltip(text),
        },
        {
            title: (
                <Space>
                <CarOutlined style={{ color: "green" }} />
                <Text strong>Véhicule</Text>
                </Space>
            ),
            dataIndex: "type_vehicule",
            key: "type_vehicule",
            render: (text) => renderTextWithTooltip(text),
        },
        {
            title: "Durée Moyenne",
            key: "duree_moyenne_heures",
            align: 'duree_moyenne_heures',
            render: (_, record) => <MoyenneTag duree_moyenne_min={record.duree_moyenne_min} />,
        },
        {
            title: "Chrono",
            key: "chrono_cours",
            align: 'chrono_cours',
            render: (_, record) => (
                <div>
                    {record.chrono_cours}
                </div>
            )
        },
        {
            title: "Dispo estimee",
            key: "dispo_estimee",
            align: 'dispo_estimee',
            render: (_, record) => (
                <div>
                    {record.dispo_estimee}
                </div>
            )
        }
    ];

  return (
    <>
        <div className="rapportUtilitaire_dispo">
            <h2 className="rapport_h2">Moyennes pour les véhicules hors course</h2>
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

export default RapportUtilitaireHorsCourseM