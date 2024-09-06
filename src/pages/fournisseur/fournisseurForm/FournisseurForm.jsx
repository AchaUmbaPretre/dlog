import React, { useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col, Select } from 'antd';
import { useState } from 'react';
import { postFournisseur } from '../../../services/fournisseurService';
import { getActivite } from '../../../services/typeService';
import { getProvince } from '../../../services/clientService';

const { TextArea } = Input;

const FournisseurForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activite, setActivite] = useState([]);
  const [province, setProvince] = useState([]);


  const handleError = (message) => {
    notification.error({
        message: 'Erreur de chargement',
        description: message,
    });
};

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [activiteData, provinceData] = await Promise.all([
                getActivite(),
                getProvince()

            ]);

            setActivite(activiteData.data);
            setProvince(provinceData.data);
        } catch (error) {
            handleError('Une erreur est survenue lors du chargement des données.');
        }
    };

    fetchData();
}, []);

  const handleSubmit = async (values) => {
    setLoading(true); 
    try {
      await postFournisseur(values);
      notification.success({
        message: 'Succès',
        description: 'Le fournisseur a été enregistré avec succès.',
      });
      form.resetFields();
      window.location.reload();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Erreur lors de l\'enregistrement du fournisseur.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        date_ajout: new Date(),
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="nom_fournisseur"
            label="Nom du Fournisseur"
            rules={[{ required: true, message: 'Veuillez entrer le nom du fournisseur' }]}
          >
            <Input placeholder="Nom du fournisseur" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="telephone"
            label="Téléphone"
          >
            <Input placeholder="Téléphone" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Veuillez entrer un email valide' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="pays"
            label="Pays"
          >
            <Input placeholder="Pays" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="ville"
            label="Ville"
          >
            <Select
                showSearch
                options={province.map((item) => ({
                value: item.id,
                label: item.name}))}
                placeholder="Sélectionnez une province..."
                optionFilterProp="label"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="nom_activite"
            label="Activité"
          >
           <Select
                mode="multiple"
                showSearch
                options={activite.map((item) => ({
                value: item.id_activite,
                label: item.nom_activite}))}
                placeholder="Sélectionnez une activité..."
                optionFilterProp="label"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="adresse"
            label="Adresse"
          >
            <TextArea rows={3} placeholder="Adresse" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
          Soumettre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FournisseurForm;
