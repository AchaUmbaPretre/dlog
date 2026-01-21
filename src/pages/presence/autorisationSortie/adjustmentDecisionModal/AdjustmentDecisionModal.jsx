import React, { useState } from 'react';
import { Modal, Typography, Descriptions, Space, Button, Alert, notification } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { validateAttendanceAdjustment } from '../../../../services/presenceService';
import { useSelector } from 'react-redux';
import moment from 'moment';

const { Text, Paragraph } = Typography;

const AdjustmentDecisionModal = ({
  open,
  onClose,
  adjustment,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  if (!adjustment) return null;

  const handleDecision = async (decision) => {
    try {
      setLoading(true);

      const payload = {
        id_adjustment :adjustment.id_adjustment,
        decision,
        validated_by : userId
      }
      await validateAttendanceAdjustment(payload);

      notification.success({
        message: 'Succès',
        description:
          decision === 'VALIDE'
            ? 'Demande validée avec succès'
            : 'Demande rejetée',
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description:
          error?.response?.data?.message ||
          'Impossible de traiter la demande',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      title={
        <>
          <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
          Validation d’ajustement de présence
        </>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Agent">
          {adjustment.utilisateur_nom}
        </Descriptions.Item>

        <Descriptions.Item label="Type">
          {adjustment.type}
        </Descriptions.Item>

        <Descriptions.Item label="Date">
          <strong>{moment(adjustment.date_presence).format('DD-MM-YYYY')}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Ancienne valeur">
            {adjustment.ancienne_valeur || '--'}
        </Descriptions.Item>

        <Descriptions.Item label="Nouvelle valeur">
          {adjustment.nouvelle_valeur || '--'}
        </Descriptions.Item>

        <Descriptions.Item label="Motif">
          {adjustment.motif || '--'}
        </Descriptions.Item>
      </Descriptions>

        <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button onClick={onClose}>
            Annuler
          </Button>

          <Button
            danger
            icon={<CloseCircleOutlined />}
            loading={loading}
            onClick={() => handleDecision('REJETE')}
          >
            Rejeter
          </Button>

          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={loading}
            onClick={() => handleDecision('VALIDE')}
          >
            Valider
          </Button>
        </Space>
      </Space>
    </Modal>
  );
};

export default AdjustmentDecisionModal;
