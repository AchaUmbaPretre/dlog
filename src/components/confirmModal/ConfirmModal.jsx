import React from 'react';
import { Modal, Typography, Spin } from 'antd';
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
  loading = false,
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
      footer={[
        <button
          key="cancel"
          className="ant-btn cancel-btn"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </button>,
        <button
          key="confirm"
          className="ant-btn confirm-btn"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? <Spin size="small" /> : okText}
        </button>
      ]}
    >
      <Text className="confirm-modal-content">{content}</Text>
    </Modal>
  );
};

export default ConfirmModal;
