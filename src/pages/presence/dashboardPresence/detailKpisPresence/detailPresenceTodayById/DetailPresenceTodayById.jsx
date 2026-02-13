import React, { useState } from 'react';
import { Table, Card, Tooltip, Space, Typography, Input } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Text } = Typography;

const DetailPresenceTodayById = ({ modalLoading, modalData, nameSite }) => {
  const [searchValue, setSearchValue] = useState("");

  const modalColumns = [
    {
      title: "#",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Nom & Prénom",
      dataIndex: "nom_complet",
      key: "nom_complet",
      render: (text, record) => (
        <Tooltip title={`Statut: ${record.statut}`}>
          <Text strong>{text}</Text>
        </Tooltip>
      ),
      fixed: "left",
      width: 200
    },
    {
        title: "Statut",
        dataIndex: "statut",
        key: "statut",
        align: "center",
        render: statut => {
            let icon;
            let color;

            switch(statut) {
            case "PRESENT":
                icon = <CheckCircleOutlined />;
                color = 'green';
                break;
            case "ABSENT":
                icon = <CloseCircleOutlined />;
                color = 'red';
                break;
            case "ABSENCE_JUSTIFIEE":
                icon = <WarningOutlined />;
                color = 'orange';
                break;
            default:
                icon = <ClockCircleOutlined />;
                color = 'gray';
            }

            return (
            <Tooltip title={`Statut: ${statut}`}>
                {React.cloneElement(icon, { style: { color, fontSize: 18 } })}
            </Tooltip>
            );
        }
    },
    {
      title: "Retard (min)",
      dataIndex: "retard_minutes",
      key: "retard_minutes",
      align: "center",
      render: minutes => minutes > 0 
        ? <Text type="warning">{minutes} min</Text> 
        : <CheckCircleOutlined style={{ color: 'green' }} />
    },
    {
      title: "Heure d'arrivée (GMT)",
      dataIndex: "heure_entree_gmt",
      key: "heure_entree_gmt",
      align: "center",
      width:'20%',
      render: time => time ? <ClockCircleOutlined style={{ marginRight: 4 }} /> && <Text>{time}</Text> : <Text type="secondary">--</Text>
    },
    {
      title: "Heure de sortie (GMT)",
      dataIndex: "heure_sortie_gmt",
      key: "heure_sortie_gmt",
      align: "center",
      width:'20%',
      render: time => time ? <ClockCircleOutlined style={{ marginRight: 4 }} /> && <Text>{time}</Text> : <Text type="secondary">--</Text>
    }
  ];

  return (
    <Card
      title={`Détail des présences par employé du site : ${nameSite}`}
      bordered={false}
      bodyStyle={{ padding: 10 }}
      extra={
        <Space wrap size="middle">
          <Search
            placeholder="Recherche employé"
            allowClear
            onChange={e => setSearchValue(e.target.value)}
            style={{ width: 280 }}
          />
        </Space>
      }
    >
      <Table
        columns={modalColumns}
        dataSource={modalData.filter(d =>
          d.nom_complet.toLowerCase().includes(searchValue.toLowerCase())
        )}
        rowKey="id_utilisateur"
        pagination={{ pageSize: 10 }}
        size="middle"
        bordered
        scroll={{ x: "max-content", y: 500 }}
        loading={modalLoading}
        sticky
      />
    </Card>
  );
};

export default DetailPresenceTodayById;
