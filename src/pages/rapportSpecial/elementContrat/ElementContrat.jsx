import React , { useEffect, useState }  from 'react'
import { Form, Input, Button, notification, Row, Col, Select } from 'antd';
import { getCatRapport, postElementContrat } from '../../../services/rapportService';


const ElementContrat = ({idContrat}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [idCat, setIdCat] = useState('')
  const [cat, setCat] = useState('');

    const handleError = (message) => {
      notification.error({
          message: 'Erreur de chargement',
          description: message,
      });
    };

    useEffect(() => {
      const fetchData = async () => {
          try {
              const [contratData] = await Promise.all([
                  getCatRapport()
              ]);
  
              setCat(contratData.data);
          } catch (error) {
              handleError('Une erreur est survenue lors du chargement des données.');
          }
      };
  
      fetchData();
  }, []);

    const handleSubmit = async (values) => {
      setLoading(true); 
      try {
        await postElementContrat({
            id_contrat : idContrat,
            ...values
        });
        notification.success({
          message: 'Succès',
          description: 'Le fournisseur a été enregistré avec succès.',
        });
        form.resetFields();
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
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>Ajouter nouveau element contrat</h2>              
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
                        name="id_cat"
                        label="Categorie"
                        rules={[{ required: true, message: 'Veuillez selectionner une categorie' }]}
                        >
                        <Input placeholder="ex: Log" />
                        </Form.Item>
                    </Col>
            
                    <Col span={12}>
                        <Form.Item
                            name="nom_element"
                            label="Element contrat"
                            rules={[{ required: true, message: 'Veuillez entrer le nom d un element' }]}
                        >
                        <Input placeholder=" ex: Transport NRJ" />
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
    </>
  )
}

export default ElementContrat