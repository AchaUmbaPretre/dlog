import React, { useEffect } from 'react';
import { Form, Input, Button, Select, notification, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { getElementContrat, getEtiquette, postParametre } from '../../../services/rapportService';

const RapportParametre = ({ fetchData, closeModal, idContrat }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [etiq, setEtiq] = useState([]);
  const [element, setElement] = useState([])

      useEffect(() => {
        const fetchData = async () => {
            try {
                const [etiqData, elementData] = await Promise.all([
                    getEtiquette(),
                    getElementContrat()
                ]);
    
                setEtiq(etiqData.data)
                setElement(elementData.data)
            } catch (error) {
                console.log(error)
            }
        };
    
        fetchData();
    }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const parametres = values.parametres.map(param => ({
        id_contrat: idContrat,
        nom_parametre: param.nom_parametre,
        id_element_contrat: param.id_element_contrat,
        id_etiquette: param.id_etiquette
      }));

      await postParametre(parametres);

      notification.success({
        message: 'Succès',
        description: 'Les paramètres ont été enregistrés avec succès.',
      });

      form.resetFields();
      fetchData();
      closeModal();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: "Erreur lors de l'enregistrement des paramètres.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="controle_form">
        <div className="controle_title_rows">
          <h2 className='controle_h2'>FORMULAIRE PARAMÈTRES</h2>
        </div>
        <div className="controle_wrapper">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ parametres: [{}] }}
          >
            <Form.List name="parametres">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} style={{display:'flex', alignItems:'center'}}>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "nom_parametre"]}
                          label="Nom du Paramètre"
                          rules={[{ required: true, message: 'Veuillez entrer le nom du paramètre' }]}
                        >
                          <Input size="large" placeholder="Ex: Tonnage" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "id_etiquette"]}
                          label="Etiquette"
                        >
                            <Select
                                size="large"
                                allowClear
                                showSearch
                                options={etiq?.map((item) => ({
                                value: item.id_etiquette                                ,
                                label: item.nom_etiquette}))}
                                placeholder="Sélectionnez une etiquette..."
                                optionFilterProp="label"
                            />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, "id_element_contrat"]}
                          label="Element contrat"
                        >
                            <Select
                                size="large"
                                allowClear
                                showSearch
                                options={element.map(item => ({ value: item.id_element_contrat ,label: item.nom_element }))}
                                placeholder="Sélectionnez une etiquette..."
                                optionFilterProp="label"
                            />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        {fields.length > 1 && (
                          <Button type="link" danger onClick={() => remove(name)}>
                            <MinusCircleOutlined />
                          </Button>
                        )}
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Enregistrer
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item>
              <Button type="primary" size="large" htmlType="submit" loading={loading} disabled={loading}>
                Soumettre
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default RapportParametre;
