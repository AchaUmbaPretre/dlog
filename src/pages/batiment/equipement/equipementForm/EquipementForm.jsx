import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Row, Col, notification } from 'antd';
import { getStatutEquipement, getTypeEquipement } from '../../../../services/batimentService';

const { Option } = Select;

const EquipementForm = ({ idBatiment }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [statutEquipement, setStatutEquipement] = useState([]);
  const [typeEquipement, setTypeEquipement] = useState([]);

  const handleError = (message) => {
    notification.error({
        message: 'Erreur de chargement',
        description: message,
    });
};

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [typeData, statutData] = await Promise.all([
                getTypeEquipement(),
                getStatutEquipement()
            ]);

            setTypeEquipement(typeData.data);
            setStatutEquipement(statutData.data)

        } catch (error) {
            handleError('Une erreur est survenue lors du chargement des données.');
        }
    };

    fetchData();
}, [idBatiment, form]);

  const handleSubmit = (values) => {
    console.log('Form values:', values);
    // Traitement des données
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        status: 2,
      }}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Type d'équipement"
            name="id_type_equipement"
            rules={[{ required: true, message: "Veuillez sélectionner un type d'équipement" }]}
          >
            <Select
                showSearch
                options={typeEquipement.map((item) => ({
                    value: item.id_type_equipement,
                    label: item.nom_type,
                }))}
                placeholder="Sélectionnez un client..."
                optionFilterProp="label"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Modèle"
            name="model"
          >
            <Input placeholder="Modèle (facultatif)" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Numéro de série"
            name="num_serie"
          >
            <Input placeholder="Numéro de série (facultatif)" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* installation_date */}
        <Col span={12}>
          <Form.Item
            label="Date d'installation"
            name="installation_date"
          >
            <DatePicker style={{ width: '100%' }} placeholder="Sélectionnez la date" />
          </Form.Item>
        </Col>

        {/* maintenance_date */}
        <Col span={12}>
          <Form.Item
            label="Date de maintenance"
            name="maintenance_date"
          >
            <DatePicker style={{ width: '100%' }} placeholder="Sélectionnez la date" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* location */}
        <Col span={12}>
          <Form.Item
            label="Emplacement"
            name="location"
          >
            <Input placeholder="Emplacement de l'équipement (facultatif)" />
          </Form.Item>
        </Col>

        {/* status */}
        <Col span={12}>
          <Form.Item
            label="Statut"
            name="status"
            rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
          >
            <Select
                showSearch
                options={statutEquipement.map((item) => ({
                    value: item.id_statut_equipement,
                    label: item.nom_statut,
                }))}
                placeholder="Sélectionnez un client..."
                optionFilterProp="label"
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Submit button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Soumettre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EquipementForm;
