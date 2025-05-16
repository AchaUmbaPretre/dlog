import { useEffect, useState } from 'react';
import {
  Form, Button, notification, message, Input, Row, Col, Select, Card, Space
} from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {
  getLocalite, getPays, getTypeLocalisation, getVille, postLocalisation
} from '../../../../services/transporteurService';
import { getProvince } from '../../../../services/clientService';

const LocalisationFormMulti = ({ closeModal, fetchData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [province, setProvince] = useState([]);
  const [localite, setLocalite] = useState([]);
  const [ville, setVille] = useState([]);
  const [type, setType] = useState([]);
  const [pays, setPays] = useState([]);

  const handleError = (msg) => {
    notification.error({ message: 'Erreur', description: msg });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [provinceData, villeData, typeLocData, localiteData, paysData] = await Promise.all([
          getProvince(), getVille(), getTypeLocalisation(), getLocalite(), getPays()
        ]);
        setProvince(provinceData.data);
        setVille(villeData.data);
        setType(typeLocData.data);
        setLocalite(localiteData.data);
        setPays(paysData.data);
      } catch (error) {
        handleError("Erreur lors du chargement des données");
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async (values) => {
    const loadingKey = 'loadingLocalisation';
    message.loading({ content: 'Traitement en cours...', key: loadingKey, duration: 0 });
    setLoading(true);

    try {
      for (const localisation of values.localisations) {
        const typeLocName = type.find(t => t.id_type_localisation === localisation.type_loc)?.nom_type_loc;

        await postLocalisation({
          nom: localisation.nom,
          type_loc: typeLocName,
          id_parent: localisation.id_parent || null,
          commentaire: localisation.commentaire || ''
        });
      }

      message.success({ content: 'Toutes les localisations ont été enregistrées.', key: loadingKey });
      form.resetFields();
      fetchData();
      closeModal();
    } catch (error) {
      handleError("Erreur lors de l'enregistrement des localisations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>Créer plusieurs localisations</h2>
        <Form 
            form={form} 
            layout="vertical" 
            initialValues={{
                localisations: [{}]
            }} onFinish={handleSubmit}
        >
        <Form.List name="localisations">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const typeLocValue = form.getFieldValue(['localisations', name, 'type_loc']);
                const selectedType = type.find(item => item.id_type_localisation === typeLocValue)?.nom_type_loc;

                return (
                  <Card key={key} type="inner" style={{ marginBottom: 16 }} title={`Localisation ${name + 1}`} extra={
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  }>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'nom']}
                          label="Nom de la localisation"
                          rules={[{ required: true, message: 'Entrez le nom' }]}
                        >
                          <Input placeholder="Nom..." />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'type_loc']}
                          label="Type de localisation"
                          rules={[{ required: true, message: 'Sélectionnez un type' }]}
                        >
                          <Select
                            showSearch
                            allowClear
                            placeholder="Type..."
                            options={type.map(item => ({
                              value: item.id_type_localisation,
                              label: item.nom_type_loc
                            }))}
                          />
                        </Form.Item>
                      </Col>

                      {selectedType === 'province' && (
                        <Col span={8}>
                          <Form.Item {...restField} name={[name, 'id_parent']} label="Parent (pays)">
                            <Select
                              showSearch
                              allowClear
                              placeholder="Sélectionnez un pays..."
                              options={pays.map(p => ({ value: p.id_pays, label: p.nom_pays }))}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      {selectedType === 'ville' && (
                        <Col span={8}>
                          <Form.Item {...restField} name={[name, 'id_parent']} label="Parent (province)">
                            <Select
                              showSearch
                              allowClear
                              placeholder="Sélectionnez une province..."
                              options={province.map(p => ({ value: p.id, label: p.name }))}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      {selectedType === 'localité' && (
                        <Col span={8}>
                          <Form.Item {...restField} name={[name, 'id_parent']} label="Parent (ville)">
                            <Select
                              showSearch
                              allowClear
                              placeholder="Sélectionnez une ville..."
                              options={ville.map(v => ({ value: v.id_ville, label: v.nom_ville }))}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      {selectedType === 'site' && (
                        <Col span={8}>
                          <Form.Item {...restField} name={[name, 'id_parent']} label="Parent (localité)">
                            <Select
                              showSearch
                              allowClear
                              placeholder="Sélectionnez une localité..."
                              options={localite.map(l => ({ value: l.id_localite, label: l.nom_localite }))}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      <Col span={8}>
                        <Form.Item {...restField} name={[name, 'commentaire']} label="Commentaire">
                          <Input.TextArea placeholder="Commentaire..." autoSize={{ minRows: 1, maxRows: 3 }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusCircleOutlined />}
                >
                  Ajouter une localisation
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
            icon={<PlusCircleOutlined />}
          >
            Soumettre toutes les localisations
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LocalisationFormMulti;