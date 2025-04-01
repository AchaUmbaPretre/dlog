import React from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { postParametre } from '../../../services/rapportService';

const RapportParametre = ({ fetchData, closeModal, idContrat }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const parametres = values.parametres.map(param => ({
        id_contrat: idContrat,
        nom_parametre: param.nom_parametre
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
                      <Col span={22}>
                        <Form.Item
                          {...restField}
                          name={[name, "nom_parametre"]}
                          label="Nom du Paramètre"
                          rules={[{ required: true, message: 'Veuillez entrer le nom du paramètre' }]}
                        >
                          <Input placeholder="Ex: Tonnage" />
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
                      Ajouter un paramètre
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
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
