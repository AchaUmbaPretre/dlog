import { useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col, Select } from 'antd';
import { useState } from 'react';
import { getDepartement } from '../../../services/departementService';
import { postPersonnel } from '../../../services/userService';

const PersonnelForm = ({fetchData, modalOff}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [departement, setDepartement] = useState([]);

  const handleError = (message) => {
    notification.error({
      message: 'Erreur de chargement',
      description: message,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [departementData] = await Promise.all([
                getDepartement(),
            ]);
            setDepartement(departementData.data);
        } catch (error) {
            handleError('Une erreur est survenue lors du chargement des données.');
        }
    };

    fetchData();
}, []);

  const handleSubmit = async (values) => {
    setLoading(true); 
    try {
       await postPersonnel(values);
       notification.success({
        message: 'Succès',
        description: 'Le personnel a été enregistré avec succès.',
      });
      form.resetFields();
      fetchData();
      modalOff(false)
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
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className='controle_h2'>Enregistrement d’un nouveau personnel
</h2>                
      </div>
      <div className="controle_wrapper">
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
        <Row gutter={12}>
          <Col xs={24} span={12}>
            <Form.Item
              name="nom"
              label="Nom"
              rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
            >
              <Input placeholder=" Entrez le nom..." />
            </Form.Item>
          </Col>

          <Col xs={24} span={12}>
            <Form.Item
              name="prenom"
              label="Prenom"
              rules={[{ required: true, message: 'Veuillez entrer le prenom' }]}
            >
              <Input placeholder=" Entrez le nom..." />
            </Form.Item>
          </Col>

          <Col xs={24} span={12}>
            <Form.Item
              name="matricule"
              label="Matricule"
              rules={[{ required: true, message: 'Veuillez entrer le numero matricule' }]}
            >
              <Input placeholder=" Entrez le num matricule..." />
            </Form.Item>
          </Col>

          <Col xs={24} span={12}>
            <Form.Item
              name="id_departement"
              label="Département"
            >
              <Select
                showSearch
                options={departement.map((item) => ({
                    value: item.id_departement,
                    label: item.nom_departement}))}
                placeholder="Sélectionnez un département..."
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            Soumettre
          </Button>
        </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PersonnelForm;
