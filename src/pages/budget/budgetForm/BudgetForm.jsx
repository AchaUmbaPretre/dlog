import React from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Button, Row, Col } from 'antd';

const { Option } = Select;

const BudgetForm = () => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log('Form values:', values);
  };

  const calculateMontant = () => {
    const quantiteValidee = form.getFieldValue('quantite_validee') || 0;
    const prixUnitaire = form.getFieldValue('prix_unitaire') || 0;
    return (quantiteValidee * prixUnitaire).toFixed(2);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        quantite_validee: 0.00,
        montant: calculateMontant(),
        date_creation: null,
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Article"
            name="article"
            rules={[{ required: true, message: 'Veuillez entrer l\'article' }]}
          >
            <Input placeholder="Nom de l'article" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Quantité demandée"
            name="quantite_demande"
            rules={[{ required: true, message: 'Veuillez entrer la quantité demandée' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0.00" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Quantité validée"
            name="quantite_validee"
            rules={[{ type: 'number', min: 0, message: 'Veuillez entrer une quantité validée positive' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0.00" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Prix unitaire"
            name="prix_unitaire"
            rules={[{ required: true, message: 'Veuillez entrer le prix unitaire' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0.00" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Montant"
            name="montant"
            dependencies={['quantite_validee', 'prix_unitaire']}
          >
            <InputNumber value={calculateMontant()} style={{ width: '100%' }} placeholder="0.00" readOnly />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Fournisseur"
            name="fournisseur"
          >
            <Select placeholder="Sélectionnez un fournisseur">
              <Option value="fournisseur1">Fournisseur 1</Option>
              <Option value="fournisseur2">Fournisseur 2</Option>
              {/* Add more options here */}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Date de création"
            name="date_creation"
            rules={[{ required: true, message: 'Veuillez sélectionner la date de création' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Montant validé"
            name="montant_valide"
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0.00" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Soumettre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BudgetForm;
