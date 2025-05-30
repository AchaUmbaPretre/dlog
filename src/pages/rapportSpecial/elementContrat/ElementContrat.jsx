import React , { useEffect, useState }  from 'react'
import { Form, Input, Button, notification, Row, Col, Select } from 'antd';
import { getCatRapport, getEtiquette, postElementContrat } from '../../../services/rapportService';


const ElementContrat = ({fetchData, closeModal, idContrat}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState([]);
  const [etiq, setEtiq] = useState([]);

    const handleError = (message) => {
      notification.error({
          message: 'Erreur de chargement',
          description: message,
      });
    };

    useEffect(() => {
      const fetchData = async () => {
          try {
              const [contratData, etiqData] = await Promise.all([
                  getCatRapport(),
                  getEtiquette()
              ]);
  
              setCat(contratData?.data);
              setEtiq(etiqData.data)
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
          description: 'L element contrat a été enregistré avec succès.',
        });
        form.resetFields();
        fetchData();
        closeModal();
        window.location.reload()
      } catch (error) {
        notification.error({
          message: 'Erreur',
          description: 'Erreur lors de l\'enregistrement d un element contrat.',
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
                    <Col span={24}>
                        <Form.Item
                        name="id_cat"
                        label="Categorie"
                        rules={[{ required: true, message: 'Veuillez selectionner une categorie' }]}
                        >
                            <Select
                                size="large"
                                allowClear
                                showSearch
                                options={cat?.map((item) => ({
                                value: item.id_cat_rapport                                ,
                                label: item.nom_cat}))}
                                placeholder="Sélectionnez une categorie..."
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </Col>
            
                    <Col span={24}>
                        <Form.Item
                            name="nom_element"
                            label="Element contrat"
                            rules={[{ required: true, message: 'Veuillez entrer le nom d un element' }]}
                        >
                        <Input 
                            placeholder=" ex: Transport NRJ" 
                            size="large"
                        />
                        </Form.Item>
                    </Col>
                    </Row>
        
                    <Form.Item>
                    <Button 
                        size="large"
                        type="primary" 
                        htmlType="submit" 
                        loading={loading} 
                        disabled={loading}
                    >
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