import React, {  useState } from 'react';
import { Form, Input, Button, notification, Row, Col, Skeleton } from 'antd';
import { postContratRapport } from '../../../../services/rapportService';


const RapportContratForm = ({closeModal,fetchData }) => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        nom_contrat: '',
        tarif_camion: '',
        tarif_tonne: '',
        tarif_palette: ''
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
                <Input
                  type="text"
                  value={formData.nom_contrat}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Superfice"
                name="superfice"
              >
                <Input
                  value={formData.tarif_camion}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tarif camion"
                name="tarif_camion"
              >
                <Input
                  value={formData.tarif_camion}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tarif tonne"
                name="tarif_tonne"
                rules={[{ required: false, message: 'Veuillez entrer un tarif !' }]}
              >
                <Input
                  value={formData.tarif_tonne}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tarif palette"
                name="tarif_palette"
                rules={[{ required: false, message: 'Veuillez saisir un tarif!' }]}
              >
                <Input
                  value={formData.tarif_palette}
                  onChange={(e) => setFormData({ ...formData, tarif_palette: e.target.value })}
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
