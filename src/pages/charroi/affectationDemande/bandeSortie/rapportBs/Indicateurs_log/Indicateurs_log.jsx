import React, { useEffect, useState, useMemo } from 'react';
import {
  Card, Row, Col, Statistic, Space, Typography, Tooltip,
  Skeleton, Empty, Button, DatePicker, Divider, Badge, message
} from 'antd';
import {
  ReloadOutlined, InfoCircleOutlined, DashboardOutlined,
  ClockCircleOutlined, AppstoreOutlined, ArrowUpOutlined, ArrowDownOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getRapportIndicateurLog } from '../../../../../../services/rapportService';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const IndicateursLog = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [range, setRange] = useState(null);

  const numberOrZero = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (range?.[0] && range?.[1]) {
        params.startDate = range[0].format('YYYY-MM-DD');
        params.endDate = range[1].format('YYYY-MM-DD');
      }
      const { data: resp } = await getRapportIndicateurLog(params);
      setData(resp);
    } catch (err) {
      console.error(err);
      setError(err);
      message.error('Erreur lors du chargement des indicateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const totalCourses = useMemo(() => numberOrZero(data?.nb_ot), [data]);

  const getBadgeStatus = (value) => {
    if (value > 80) return 'success';
    if (value > 50) return 'warning';
    return 'error';
  };

  const renderCard = (title, value, tooltip, icon = <DashboardOutlined />, extra = null) => (
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        height: '100%',
      }}
      hoverable
      bodyStyle={{ padding: 20 }}
    >
      <Space direction="vertical" size={6} style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            {icon}
            <Tooltip title={tooltip}>
              <Text strong style={{ fontSize: 16 }}>{title}</Text>
              <InfoCircleOutlined style={{ color: '#8c8c8c', marginLeft: 4 }} />
            </Tooltip>
          </Space>
          {extra}
        </Space>
        <Statistic
          value={numberOrZero(value)}
          valueStyle={{ fontWeight: 700, fontSize: 28 }}
        />
      </Space>
    </Card>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* --- Header / Filtres --- */}
      <Card
        bordered={false}
        bodyStyle={{
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        }}
      >
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={12}>
            <Space direction="vertical" size={0}>
              <Title level={4} style={{ margin: 0 }}>Indicateurs – Bons de sortie</Title>
              <Text type="secondary">Vue des opérations</Text>
            </Space>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space wrap>
              <RangePicker
                allowClear
                value={range}
                onChange={(vals) => setRange(vals ? [vals[0], vals[1]] : null)}
                format="YYYY-MM-DD"
              />
              <Button
                type="default"
                onClick={() => setRange([dayjs().startOf('day'), dayjs().endOf('day')])}
              >
                Aujourd'hui
              </Button>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchData}
                loading={loading}
              >
                Actualiser
              </Button>
            </Space>
          </Col>
        </Row>
        <Divider style={{ margin: '16px 0' }} />
        <Text>Total courses: <b>{totalCourses}</b></Text>
      </Card>

      {/* --- KPI Cards --- */}
      {loading ? (
        <Row gutter={[24, 24]} justify="center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Col xs={24} sm={12} md={12} lg={8} xl={6} key={i}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Col>
          ))}
        </Row>
      ) : error ? (
        <Card bordered={false}>
          <Empty description="Impossible de charger les données">
            <Button onClick={fetchData} icon={<ReloadOutlined />}>Réessayer</Button>
          </Empty>
        </Card>
      ) : data ? (
        <>
          {/* Totaux principaux */}
          <Row gutter={[24, 24]} justify="center">
            {renderCard(
              'Nombre total de bons de sortie',
              data.nb_ot,
              'Total des bons de sortie émis',
              <AppstoreOutlined />,
              <Badge count={data.nb_ot || 0} style={{ backgroundColor: '#52c41a' }} />
            )}
            {renderCard(
              'Taux d\'utilisation du parc',
              data.taux_utilisation_parc,
              'Pourcentage d\'utilisation du parc',
              <DashboardOutlined />,
              <Badge status={getBadgeStatus(data.taux_utilisation_parc)} text={`${data.taux_utilisation_parc}%`} />
            )}
          </Row>

          {/* Top destinations */}
          <Divider orientation="left">Top destinations & Temps moyen</Divider>
          <Row gutter={[24, 24]} justify="center">
            {data.top_destinations?.map((d, i) => {
              const delta = d.nb_courses - (d.nb_courses_prev || 0);
              return (
                <Col xs={24} sm={12} md={12} lg={8} xl={6} key={i}>
                  {renderCard(
                    `Destination: ${d.nom_destination}`,
                    d.nb_courses,
                    `Nombre de courses: ${d.nb_courses}`,
                    <ClockCircleOutlined />,
                    delta !== 0 ? (
                      <Tooltip title={`Changement par rapport à la période précédente: ${delta > 0 ? '+' : ''}${delta}`}>
                        {delta > 0 ? <ArrowUpOutlined style={{ color: '#cf1322' }} /> : <ArrowDownOutlined style={{ color: '#3f8600' }} />}
                      </Tooltip>
                    ) : null
                  )}
                </Col>
              );
            })}
          </Row>

          {/* Volume par service */}
          <Divider orientation="left">Volume courses par service</Divider>
          <Row gutter={[24, 24]} justify="center">
            {data.volume_courses_par_service?.map((s, i) => (
              <Col xs={24} sm={12} md={12} lg={8} xl={6} key={i}>
                {renderCard(
                  `Service: ${s.nom_service}`,
                  s.nb_courses,
                  `Nombre de courses du service ${s.nom_service}`,
                  <AppstoreOutlined />
                )}
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <Card bordered={false}>
          <Empty description="Aucune donnée" />
        </Card>
      )}
    </div>
  );
};

export default IndicateursLog;
