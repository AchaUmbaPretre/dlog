import React, { useState } from 'react';
import { Modal, Typography, Descriptions, Button, Space, Input, Divider } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;
const { TextArea } = Input;

const CongeDecisionModal = ({
  visible,
  onClose,
  record,
  onConfirm,
  loading
}) => {
  const [commentaire, setCommentaire] = useState('');

  if (!record) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
    >
      <Title level={4}>
        <ExclamationCircleOutlined  style={{ color: '#faad14', marginRight: 8 }} /> Décision du congé
      </Title>

      <Text type="secondary">
        Veuillez analyser la demande avant de prendre une décision.
      </Text>

      <Divider />

      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Agent">
          {record.agent_name} {record.agent_lastname}
        </Descriptions.Item>

        <Descriptions.Item label="Type de congé">
          {record.type_conge}
        </Descriptions.Item>

        <Descriptions.Item label="Période">
          Du <strong>{moment(record.date_debut).format('DD-MM-YYYY')}</strong> au <strong>{moment(record.date_fin).format('DD-MM-YYYY')}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Durée">
          {record.duree} jours
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Text strong>Commentaire du manager</Text>
      <TextArea
        rows={4}
        placeholder="Motif de validation ou de refus..."
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        style={{ marginTop: 8 }}
      />

      <Divider />

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>
          Annuler
        </Button>

        <Button
          danger
          icon={<CloseCircleOutlined />}
          loading={loading}
          disabled={!commentaire}
          onClick={() => onConfirm('REFUSE', commentaire)}
        >
          Refuser
        </Button>

        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          loading={loading}
          disabled={!commentaire}
          onClick={() => onConfirm('VALIDE', commentaire)}
        >
          Valider
        </Button>
      </Space>
    </Modal>
  );
};

export default CongeDecisionModal;
