import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Button, notification, Row, Col, Skeleton } from 'antd';
import moment from 'moment';
import { getClient } from '../../../services/clientService';
import { getTypeContrat, postContrat } from '../../../services/templateService';

const { Option } = Select;

const ContratForm = ({closeModal,fetchData }) => {
    const [form] = Form.useForm();
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
    const [loadingData, setLoadingData] = useState(true);
    const [client, setClient] = useState([]);
    const [typeContrat, setTypeContrat] = useState([]);



    const fetchDataAll = async () => {
        setLoadingData(true);
      
        try {
          const [clientData, typeData] = await Promise.all([
            getClient(),
            getTypeContrat()
          ]);
      
          setClient(clientData.data);
          setTypeContrat(typeData.data);
      
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error);
          notification.error({
            message: 'Erreur de récupération',
            description: 'Une erreur est survenue lors de la récupération des données.',
          });
      
        } finally {
          setLoadingData(false);
        }
      };
      

  useEffect(() => {
    fetchDataAll();
}, [form]);

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
        await postContrat(values);
    
        fetchData();
        closeModal();

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
                label="Client"
                name="id_client"
                rules={[{ required: true, message: 'Veuillez entrer l\'ID client!' }]}
              >
                {loadingData ? <Skeleton.Input active={true} /> : <Select
                                    showSearch
                                    options={client.map((item) => ({
                                        value: item.id_client,
                                        label: item.nom,
                                    }))}
                                    placeholder="Sélectionnez un client..."
                                    optionFilterProp="label"
                                />}
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
                rules={[{ required: false, message: 'Veuillez entrer le montant!' }]}
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
                {loadingData ? <Skeleton.Input active={true} /> : <Select
                                    showSearch
                                    options={typeContrat.map((item) => ({
                                        value: item.id_type_contrat,
                                        label: item.nom_type_contrat,
                                    }))}
                                    placeholder="Sélectionnez un contrat..."
                                    optionFilterProp="label"
                                />}
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

export default ContratForm;
