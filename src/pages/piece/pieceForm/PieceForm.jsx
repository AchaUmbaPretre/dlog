import React, { useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col, Select } from 'antd';
import { useState } from 'react';
import { getCatPiece, postPiece } from '../../../services/charroiService';

const PieceForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [catPiece, setCatPiece] = useState([]);


  const handleError = (message) => {
    notification.error({
        message: 'Erreur de chargement',
        description: message,
    });
};

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [catPieceData] = await Promise.all([
                getCatPiece(),
            ]);
            setCatPiece(catPieceData.data);
        } catch (error) {
            handleError('Une erreur est survenue lors du chargement des données.');
        }
    };

    fetchData();
}, []);

  const handleSubmit = async (values) => {
    setLoading(true); 
    try {
       await postPiece(values);
        notification.success({
        message: 'Succès',
        description: 'La pièce a été enregistrée avec succès.',
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
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className='controle_h2'>Ajouter nouvelle pièce</h2>                
      </div>
      <div className="controle_wrapper">
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="nom"
              label="Nom"
              rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
            >
              <Input placeholder=" Entrez le nom de la pièce.." />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="idcategorie"
              label="Catégorie"
            >
              <Select
                showSearch
                options={catPiece.map((item) => ({
                    value: item.id,
                    label: item.titre}))}
                placeholder="Sélectionnez une categorie..."
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

export default PieceForm;
