import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Table,
  Space,
  Input,
  Button,
  Typography,
  Progress,
  Tag,
  notification,
  DatePicker
} from 'antd';
import {
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getRapportPresenceDepartement } from '../../../services/presenceService';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const RapportPresenceDepartement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  // 📅 Période par défaut = mois en cours
  const [dateRange, setDateRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {
        date_debut: dateRange[0].format('YYYY-MM-DD'),
        date_fin: dateRange[1].format('YYYY-MM-DD')
      };

      const { data } = await getRapportPresenceDepartement(params);
      setData(data.data);

    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  // 🔎 Filtrage recherche
  const filteredData = useMemo(() => {
    return data.filter(dep =>
      dep.departement_name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase())
    );
  }, [data, searchValue]);

  const columns = [
    {
      title: "#",
      key: "index",
      width: 50,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Département",
      dataIndex: "departement_name",
      key: "departement_name",
      render: (text) => (
        <Space>
          <TeamOutlined />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: "Effectif",
      dataIndex: "total_users",
      align: "center",
      render: value => <Tag color="blue">{value}</Tag>
    },
    {
      title: "Présents",
      align: "center",
      render: (_, record) => (
        <Space direction="vertical" size={0} align="center">
          <Text>
            <CheckCircleOutlined style={{ color: "green" }} />{" "}
            {record.present.count}
          </Text>
          <Progress
            percent={Number(record.present.pct)}
            size="small"
            strokeColor="green"
            showInfo={false}
          />
        </Space>
      )
    },
    {
      title: "Retards",
      align: "center",
      render: (_, record) => (
        <Text type="warning">
          <WarningOutlined /> {record.retard.count}
        </Text>
      )
    },
    {
      title: "Absences",
      align: "center",
      render: (_, record) => (
        <Space direction="vertical" size={0} align="center">
          <Text type="danger">
            <CloseCircleOutlined />{" "}
            {record.absence.absent + record.absence.justifie}
          </Text>
          <Progress
            percent={Number(record.absence.pct)}
            size="small"
            strokeColor="red"
            showInfo={false}
          />
        </Space>
      )
    }
  ];

  const exportExcel = () => {
    console.log("Export Excel période:", dateRange);
  };

  return (
    <Card
      bordered={false}
      title="Rapport des présences par département"
      extra={
        <Space wrap>
          {/* 📅 FILTRE PERIODE */}
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            format="DD/MM/YYYY"
          />

          <Search
            placeholder="Recherche département..."
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 250 }}
          />

          <Button icon={<ExportOutlined />} onClick={exportExcel}>
            Exporter Excel
          </Button>
        </Space>
      }
    >
      <Table
        loading={loading}
        dataSource={filteredData}
        rowKey="departement_id"
        pagination={{ pageSize: 10 }}
        bordered
        columns={columns}
      />
    </Card>
  );
};

export default RapportPresenceDepartement;
