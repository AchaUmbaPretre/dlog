import React, { useState } from 'react';
import { Table, Tag, Badge, Button, Space, Tooltip, Modal, Form, Select, Input, message, Typography, Divider } from 'antd';
import { EyeOutlined, CheckCircleOutlined, ThunderboltOutlined, AlertOutlined, SafetyOutlined, CloseCircleOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { regulariserSortie } from '../../../../../services/controleGpsService';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ControleTable = ({ data, loading, onRefresh }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSortie, setSelectedSortie] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const getStatutConfig = (statut) => {
    const map = {
      'CONFORME': { color: '#52c41a', icon: <CheckCircleOutlined />, text: 'Conforme' },
      'SORTIE_SANS_BON': { color: '#ff4d4f', icon: <CloseCircleOutlined />, text: 'Sortie sans bon' },
      'SORTIE_AUTORISEE_SANS_BS': { color: '#1890ff', icon: <CheckCircleOutlined />, text: 'Auto. sans BS' },
      'SORTIE_NON_POINTEE': { color: '#faad14', icon: <WarningOutlined />, text: 'Non pointée' },
      'ANOMALIE_A_VERIFIER': { color: '#8c8c8c', icon: <ClockCircleOutlined />, text: 'À vérifier' },
      'BON_NON_EXECUTE': { color: '#faad14', icon: <WarningOutlined />, text: 'Bon non exécuté' },
      'SORTIE_NON_AUTORISEE': { color: '#ff4d4f', icon: <CloseCircleOutlined />, text: 'Non autorisée' }
    };
    return map[statut] || { color: '#8c8c8c', icon: null, text: 'Inconnu' };
  };

  const columns = [
    {
      title: 'Heure GPS',
      dataIndex: 'gps_heure',
      key: 'gps_heure',
      width: 100,
      render: (time) => time ? moment(time).format('HH:mm:ss') : '-',
      sorter: (a, b) => moment(a.gps_heure).unix() - moment(b.gps_heure).unix(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Heure tab.',
      dataIndex: 'tablette_heure',
      key: 'tablette_heure',
      width: 100,
      render: (time) => time ? moment(time).format('HH:mm:ss') : '-'
    },
    {
      title: 'Écart',
      dataIndex: 'ecart_minutes',
      key: 'ecart',
      width: 70,
      align: 'center',
      render: (ecart) => {
        if (ecart === null || ecart === undefined) return '-';
        const isOk = Math.abs(ecart) <= 30;
        return (
          <Tag color={isOk ? 'success' : 'error'} style={{ margin: 0 }}>
            {Math.abs(ecart)} min
          </Tag>
        );
      }
    },
    {
      title: 'Véhicule',
      dataIndex: 'immatriculation',
      key: 'vehicule',
      width: 100,
      render: (immat) => <Text strong>{immat}</Text>
    },
    {
      title: 'Zone',
      dataIndex: 'zone_nom',
      key: 'zone',
      width: 100,
      render: (zone) => zone || '-'
    },
    {
    title: 'Bon',
    dataIndex: 'bon_id',
    key: 'bon',
    width: 80,
    render: (bonId) => bonId ? `BS-${bonId}` : <Text type="danger">Aucun</Text>
    },
    {
      title: 'BS',
      dataIndex: 'a_bon',
      key: 'a_bon',
      width: 50,
      align: 'center',
      render: (val) => val ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    },
    {
      title: 'Tab',
      dataIndex: 'a_tablette',
      key: 'a_tablette',
      width: 50,
      align: 'center',
      render: (val) => val ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    },
    {
      title: 'GPS',
      dataIndex: 'a_gps',
      key: 'a_gps',
      width: 50,
      align: 'center',
      render: (val) => val ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 70,
      align: 'center',
      render: (score) => {
        if (!score) return '-';
        const color = score >= 70 ? '#52c41a' : score >= 50 ? '#faad14' : '#ff4d4f';
        return <Text strong style={{ color }}>{score}%</Text>;
      }
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      width: 130,
      render: (statut) => {
        const config = getStatutConfig(statut);
        return (
          <Badge color={config.color} text={config.text} />
        );
      }
    },
    {
    title: 'Niveau',
    dataIndex: 'niveau_risque',
    key: 'niveau',
    width: 90,
    align: 'center',
    render: (niveau) => {
        if (!niveau) {
        return (
            <Tag>
            <AlertOutlined style={{ marginRight: 6 }} />
            Non défini
            </Tag>
        );
        }

        const map = {
        FAIBLE: { color: 'success', text: 'Faible', icon: <SafetyOutlined /> },
        MOYEN: { color: 'warning', text: 'Moyen', icon: <WarningOutlined /> },
        ELEVE: { color: 'error', text: 'Élevé', icon: <ThunderboltOutlined /> }
        };

        const config = map[niveau] || {
        color: 'default',
        text: niveau || 'Inconnu',
        icon: <AlertOutlined />
        };

        return (
        <Tag color={config.color}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {config.icon}
            {config.text}
            </span>
        </Tag>
        );
    }
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="Régulariser">
          <Button 
            type="text" 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => {
              setSelectedSortie(record);
              setModalVisible(true);
            }}
          />
        </Tooltip>
      )
    }
  ];

  const handleRegulariser = async (values) => {
    setSubmitting(true);
    try {
      await regulariserSortie(
        selectedSortie.id,
        values.id_bon_sortie,
        values.commentaire,
        localStorage.getItem('userId')
      );
      message.success('Sortie régularisée');
      setModalVisible(false);
      form.resetFields();
      onRefresh();
    } catch (error) {
      message.error('Erreur lors de la régularisation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showTotal: (total) => `Total ${total} sorties`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
        scroll={{ x: 1100 }}
      />

      <Modal
        title="Régulariser une sortie"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedSortie(null);
          form.resetFields();
        }}
        footer={null}
        width={480}
      >
        {selectedSortie && (
          <>
            <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
              <Space direction="vertical" size={4}>
                <Text><strong>Véhicule:</strong> {selectedSortie.immatriculation}</Text>
                <Text><strong>Heure GPS:</strong> {moment(selectedSortie.gps_heure).format('DD/MM/YYYY HH:mm:ss')}</Text>
                <Text><strong>Zone:</strong> {selectedSortie.zone_nom || 'Non définie'}</Text>
              </Space>
            </div>

            <Form form={form} layout="vertical" onFinish={handleRegulariser}>
              <Form.Item
                name="id_bon_sortie"
                label="Bon de sortie"
                rules={[{ required: true, message: 'Sélectionnez un bon' }]}
              >
                <Select placeholder="Choisir un bon de sortie">
                  <Option value="1">BS-001 - 24/04/2024 08:00</Option>
                  <Option value="2">BS-002 - 24/04/2024 10:30</Option>
                </Select>
              </Form.Item>

              <Form.Item name="commentaire" label="Commentaire">
                <TextArea rows={2} placeholder="Optionnel..." />
              </Form.Item>

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button onClick={() => setModalVisible(false)}>
                  Annuler
                </Button>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  Valider
                </Button>
              </div>
            </Form>
          </>
        )}
      </Modal>
    </>
  );
};

export default ControleTable;