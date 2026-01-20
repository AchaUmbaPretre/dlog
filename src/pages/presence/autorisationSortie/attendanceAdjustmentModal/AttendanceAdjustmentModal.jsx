import React, { useEffect } from "react";
import { Modal, Form, Select, Input, TimePicker, Alert } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

const ADJUSTMENT_TYPES = [
  { value: "RETARD_JUSTIFIE", label: "Retard justifié" },
  { value: "CORRECTION_HEURE", label: "Correction d’heure" },
  { value: "AUTORISATION_SORTIE", label: "Autorisation de sortie" }
];

const AttendanceAdjustmentModal = ({
  open,
  onClose,
  onSubmit,
  presence
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) form.resetFields();
  }, [open]);

  return (
    <Modal
      title="Demande d’ajustement de présence"
      open={open}
      onCancel={onClose}
      okText="Soumettre la demande"
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message={`Date : ${dayjs(presence.date).format("DD/MM/YYYY")} — ${presence.nom}`}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onSubmit(values)}
      >
        <Form.Item
          name="type"
          label="Type d’ajustement"
          rules={[{ required: true, message: "Type requis" }]}
        >
          <Select options={ADJUSTMENT_TYPES} />
        </Form.Item>

        <Form.Item shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue("type") === "CORRECTION_HEURE" && (
              <Form.Item
                name="nouvelle_valeur"
                label="Nouvelle heure"
                rules={[{ required: true, message: "Heure requise" }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            )
          }
        </Form.Item>

        <Form.Item
          name="motif"
          label="Motif / justification"
          rules={[{ required: true, message: "Motif requis" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AttendanceAdjustmentModal;
