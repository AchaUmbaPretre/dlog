import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, notification } from 'antd';
import moment from 'moment';
import { getStatutMaintenance, postMaintenance } from '../../../../../services/batimentService';

const { Option } = Select;

const MaintenanceForm = ({ idEquipement, closeModal, fetchData }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [statutMaintenance, setStatutMaintenance] = useState([])

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [typeData] = await Promise.all([
              getStatutMaintenance()
            ]);
            setStatutMaintenance(typeData)
        } catch (error) {
          console.log(error)
        }
    };

    fetchData();
}, []);

  const onFinish = async(values) => {
    const formattedValues = {
      ...values,
      id_equipement  : idEquipement,
      date_entretien: values.maintenance_date.format('YYYY-MM-DD'),
    };
    try {
      await postMaintenance(formattedValues);
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
    <Form form={form} layout="vertical" onFinish={onFinish}>

      <Form.Item
        name="maintenance_date"
        label="Date d'entretien"
        rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
      >
        <DatePicker placeholder="Sélectionnez une date" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Veuillez décrire les actions réalisées' }]}
      >
        <Input.TextArea placeholder="Décrivez les actions effectuées" />
      </Form.Item>

      <Form.Item
        name="technicien"
        label="Technicien"
        rules={[{ required: true, message: 'Veuillez entrer le nom du technicien' }]}
      >
        <Input placeholder="Nom du technicien" />
      </Form.Item>

      <Form.Item
        name="statut"
        label="Statut"
        rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
      >
        <Select
          showSearch
          options={statutMaintenance.map((item) => ({
            value: item.id_statut_maintenance,
            label: item.nom_statut_maintenance,
          }))}
          placeholder="Sélectionnez..."
          optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Enregistrer la maintenance
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MaintenanceForm;
