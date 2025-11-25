import React from 'react';
import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './confirmModal.scss';

const { Text } = Typography;

const ConfirmModal = ({
  visible,
  title = "Confirmation",
  content,
  onConfirm,
  onCancel,
  okText = "Confirmer",
  cancelText = "Annuler",
}) => {
  return (
    <Modal
      visible={visible}
      title={
        <div className="confirm-modal-header">
          <ExclamationCircleOutlined className="confirm-modal-icon" />
          <span className="confirm-modal-title">{title}</span>
        </div>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      centered
      maskClosable={false}
      closable={false}
      className="confirm-modal"
    >
      <Text className="confirm-modal-content">{content}</Text>
    </Modal>
  );
};

export default ConfirmModal;
