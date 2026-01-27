import { Table, Card, DatePicker, Button, Select, Tag, Space, Spin } from "antd";
import { ReloadOutlined, ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { usePresenceRapportRPData } from "./hooks/usePresenceRapportRPData";
import { formatDuration } from "../../../utils/renderTooltip";

const { RangePicker } = DatePicker;

const PresenceRapportRP = () => {
  const {
    site,
    setSiteData,
    data,
    loading,
    reload,
    dateRange,
    setDateRange
  } = usePresenceRapportRPData();

  const columns = [
    {
      title: "Employé",
      dataIndex: "nom",
      key: "nom",
      fixed: "left"
    },
    {
      title: "Date",
      dataIndex: "date_presence",
      key: "date_presence",
      render: d => moment(d).format("DD-MM-YYYY")
    },
    {
      title: "Entrée",
      children: [
        {
          title: "Prévue",
          dataIndex: "heure_entree_prevue",
          key: "heure_entree_prevue"
        },
        {
          title: "Réelle",
          dataIndex: "heure_entree_reelle",
          key: "heure_entree_reelle"
        },
        {
          title: "Retard (min)",
          dataIndex: "retard_minutes",
          key: "retard_minutes",
          render: v =>
            v > 0 ? <Tag color="red">{formatDuration(v)}</Tag> : <Tag color="green">0</Tag>
        }
      ]
    },
    {
      title: "Sortie",
      children: [
        {
          title: "Prévue",
          dataIndex: "heure_sortie_prevue",
          key: "heure_sortie_prevue"
        },
        {
          title: "Réelle",
          dataIndex: "heure_sortie_reelle",
          key: "heure_sortie_reelle"
        },
        {
          title: "Avance (min)",
          dataIndex: "depart_anticipe_minutes",
          key: "depart_anticipe_minutes",
          render: v =>
            v > 0 ? <Tag color="orange">{v}</Tag> : <Tag color="green">0</Tag>
        }
      ]
    },
    {
      title: "Heures supp.",
      dataIndex: "heures_supplementaires",
      key: "heures_supplementaires",
      render: v =>
        v > 0 ? <Tag color="blue">{v} h</Tag> : "-"
    },
    {
      title: "Statut",
      dataIndex: "commentaire",
      key: "commentaire",
      render: c => {
        let color = "green";
        if (c.includes("Retard")) color = "red";
        if (c.includes("anticipé")) color = "orange";
        if (c.includes("Retard +")) color = "volcano";
        return <Tag icon={<ClockCircleOutlined />} color={color}>{c}</Tag>;
      }
    }
  ];

  return (
    <Card
      title="Rapport de retard & ponctualité"
      extra={
        <Space>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="DD/MM/YYYY"
          />
          <Select
            size='midlle'
            allowClear
            showSearch
            options={site?.map((item) => ({
              value: item.id_site,
              label: item.nom_site,
            }))}
            onChange={setSiteData}
            placeholder="Sélectionnez un site..."
            optionFilterProp="label"
            style={{width:'100%'}}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={reload}
            loading={loading}
          >
            Actualiser
          </Button>
        </Space>
      }
    >
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(r, i) => `${r.nom}_${i}`}
          scroll={{ x: 1200 }}
          bordered
        />
      )}
    </Card>
  );
};

export default PresenceRapportRP;
