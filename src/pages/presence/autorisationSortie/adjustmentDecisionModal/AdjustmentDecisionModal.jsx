import React, { useState } from 'react';
import { Modal, Typography, Space, Button, Alert, notification } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { validateAttendanceAdjustment } from '../../../../services/presenceService';
import { useSelector } from 'react-redux';

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

      await validateAttendanceAdjustment(adjustment.id_adjustment, {
        decision,
        validated_by : userId
      });

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
        <Alert
          type="info"
          showIcon
          message="Résumé de la demande"
          description={
            <>
              <Paragraph>
                <Text strong>Agent :</Text> {adjustment.utilisateur_nom}
              </Paragraph>
              <Paragraph>
                <Text strong>Date :</Text> {adjustment.date_presence}
              </Paragraph>
              <Paragraph>
                <Text strong>Type :</Text> {adjustment.type}
              </Paragraph>
              <Paragraph>
                <Text strong>Ancienne valeur :</Text>{' '}
                {adjustment.ancienne_valeur || '--'}
              </Paragraph>
              <Paragraph>
                <Text strong>Nouvelle valeur :</Text>{' '}
                {adjustment.nouvelle_valeur || '--'}
              </Paragraph>
              <Paragraph>
                <Text strong>Motif :</Text> {adjustment.motif || '--'}
              </Paragraph>
            </>
          }
        />

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
