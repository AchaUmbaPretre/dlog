import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Button, notification, Row, Col, Skeleton } from 'antd';
import moment from 'moment';
import { postContratRapport } from '../../../../services/rapportService';

const { Option } = Select;

const RapportContratForm = ({closeModal,fetchData }) => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        nom_contrat: '',
        tarif_camion: '',
        tarif_tonne: '',
        tarif_palette: ''
    });
    const [loadingData, setLoadingData] = useState(true);
    const [client, setClient] = useState([]);


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
        await postContratRapport(values);
    
        fetchData();
        closeModal();

        setFormData({
            nom_contrat: '',
            tarif_camion: '',
            tarif_tonne: '',
            tarif_palette: ''
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
                label="Description"
                name="nom_contrat"
                rules={[{ required: true, message: 'Veuillez entrer une description!' }]}
              >
                {loadingData ? <Skeleton.Input active={true} /> : 
                <Input
                  type="text"
                  onChange={handleChange}
                  style={{ width: '100%' }}
                /> }
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
                label="Conditions(Titre)"
                name="conditions"
                rules={[{ required: true, message: 'Veuillez saisir le titre!' }]}

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

export default RapportContratForm;
