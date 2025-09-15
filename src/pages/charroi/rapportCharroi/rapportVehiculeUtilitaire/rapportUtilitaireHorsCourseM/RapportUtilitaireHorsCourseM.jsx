import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Tag, Space, Tooltip, Popconfirm, Skeleton, Tabs, Popover, Typography } from 'antd';
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
            <AppstoreOutlined style={{ color: "#1890ff" }} />
            <Text strong>Motif</Text>
            </Space>
        ),
        dataIndex: "nom_motif_demande",
        key: "nom_motif_demande",
        render: (text) => renderTextWithTooltip(text),
        },
        {
        title: (
            <Space>
            <ApartmentOutlined style={{ color: "#1d39c4" }} />
            <Text strong>Service</Text>
            </Space>
        ),
        dataIndex: "nom_service",
        key: "nom_service",
        render: (text) => renderTextWithTooltip(text),
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