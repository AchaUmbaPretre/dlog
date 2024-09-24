import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Row, Col, notification } from 'antd';
import { getStatutEquipement,postEquipement } from '../../../../services/batimentService';
import moment from 'moment';
import { getArticle } from '../../../../services/typeService';

const { Option } = Select;

const EquipementForm = ({ idBatiment, closeModal, fetchData }) => {
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
                getArticle(),
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

  const handleSubmit = async(values) => {
    setIsLoading(true);
    try {
            await postEquipement({
                id_batiment: idBatiment,
                ...values
            });
        notification.success({
            message: 'Succès',
            description: 'Les informations ont été enregistrées avec succès.',
        });

         fetchData();
        closeModal();
        form.initialValue()
    } catch (error) {
        notification.error({
            message: 'Erreur',
            description: 'Une erreur s\'est produite lors de l\'enregistrement des informations.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className='controle_h2'>Ajouter un équipement au {''}</h2>                
      </div>
      <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        status: 2,
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Type d'équipement"
            name="id_type_equipement"
            rules={[{ required: true, message: "Veuillez sélectionner un type d'équipement" }]}
          >
            <Select
                showSearch
                options={typeEquipement.map((item) => ({
                    value: item.id_article,
                    label: item.nom_article,
                }))}
                placeholder="Sélectionnez un équipement..."
                optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Modèle"
            name="model"
          >
            <Input placeholder="Modèle (facultatif)" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Numéro de série"
            name="num_serie"
          >
            <Input placeholder="Numéro de série (facultatif)" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Date d'installation"
            name="installation_date"
            initialValue={moment()}
          >
            <DatePicker style={{ width: '100%' }} placeholder="Sélectionnez la date" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>

        <Col span={12}>
          <Form.Item
            label="Date de maintenance"
            name="maintenance_date"
          >
            <DatePicker style={{ width: '100%' }} placeholder="Sélectionnez la date" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Prochaine date d'entretien"
            name="date_prochaine_maintenance"
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
        <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
          Soumettre
        </Button>
      </Form.Item>
      </Form>
    </div>
  );
};

export default EquipementForm;
