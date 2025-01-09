import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button, notification, Row, Col } from 'antd';
import moment from 'moment';

const { Option } = Select;

const ContratForm = () => {
  // Gestion de l'état pour les champs du formulaire
  const [formData, setFormData] = useState({
    id_client: '',
    date_debut: '',
    date_fin: '',
    montant: '',
    type_contrat: '',
    statut: 'actif',
    date_signature: '',
    conditions: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Fonction pour envoyer le formulaire
  const handleSubmit = async (values) => {
    try {
      console.log(values);
      setFormData({
        id_client: '',
        date_debut: '',
        date_fin: '',
        montant: '',
        type_contrat: '',
        statut: 'actif',
        date_signature: '',
        conditions: ''
      });
      notification.success({
        message: 'Contrat créé',
        description: 'Le contrat a été créé avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      notification.error({
        message: 'Erreur',
        description: 'Une erreur s\'est produite lors de l\'envoi du formulaire',
      });
    }
  };

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className="controle_h2">Ajouter un contrat</h2>
      </div>
      <div className="controle_wrapper">
        <Form
          name="contratForm"
          onFinish={handleSubmit}
          initialValues={formData}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="ID Client"
                name="id_client"
                rules={[{ required: true, message: 'Veuillez entrer l\'ID client!' }]}
              >
                <Input
                  type="number"
                  value={formData.id_client}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Date de début"
                name="date_debut"
                rules={[{ required: true, message: 'Veuillez sélectionner une date de début!' }]}
              >
                <DatePicker
                  value={formData.date_debut ? moment(formData.date_debut) : null}
                  onChange={(date, dateString) => setFormData({ ...formData, date_debut: dateString })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Date de fin"
                name="date_fin"
                rules={[{ required: true, message: 'Veuillez sélectionner une date de fin!' }]}
              >
                <DatePicker
                  value={formData.date_fin ? moment(formData.date_fin) : null}
                  onChange={(date, dateString) => setFormData({ ...formData, date_fin: dateString })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Montant"
                name="montant"
                rules={[{ required: true, message: 'Veuillez entrer le montant!' }]}
              >
                <Input
                  type="number"
                  value={formData.montant}
                  onChange={handleChange}
                  prefix="$"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Type de contrat"
                name="type_contrat"
                rules={[{ required: true, message: 'Veuillez sélectionner le type de contrat!' }]}
              >
                <Select
                  value={formData.type_contrat}
                  onChange={(value) => setFormData({ ...formData, type_contrat: value })}
                  style={{ width: '100%' }}
                >
                  <Option value="CDI">CDI</Option>
                  <Option value="CDD">CDD</Option>
                  <Option value="Contrat de prestation de services">Contrat de prestation de services</Option>
                  <Option value="Contrat de vente">Contrat de vente</Option>
                  <Option value="Contrat d'apprentissage">Contrat d'apprentissage</Option>
                  <Option value="Contrat d'intérim">Contrat d'intérim</Option>
                  <Option value="Contrat de sous-traitance">Contrat de sous-traitance</Option>
                  <Option value="Contrat d'assurance vie">Contrat d'assurance vie</Option>
                  <Option value="Contrat de location">Contrat de location</Option>
                  <Option value="Contrat de franchise">Contrat de franchise</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Statut"
                name="statut"
              >
                <Select
                  value={formData.statut}
                  onChange={(value) => setFormData({ ...formData, statut: value })}
                  style={{ width: '100%' }}
                >
                  <Option value="actif">Actif</Option>
                  <Option value="inactif">Inactif</Option>
                  <Option value="terminé">Terminé</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Date de signature"
                name="date_signature"
                rules={[{ required: true, message: 'Veuillez sélectionner la date de signature!' }]}
              >
                <DatePicker
                  value={formData.date_signature ? moment(formData.date_signature) : null}
                  onChange={(date, dateString) => setFormData({ ...formData, date_signature: dateString })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Conditions"
                name="conditions"
              >
                <Input
                  value={formData.conditions}
                  onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Créer le contrat
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ContratForm;
