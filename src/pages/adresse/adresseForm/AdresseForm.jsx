import { useEffect, useState } from 'react';
import { Form, Input, Card, Button, notification, Select } from 'antd';
import {  getBinsOne, getBinsOneV, postAdresse } from '../../../services/batimentService';
import { useNavigate } from 'react-router-dom';
import { getBatiment } from '../../../services/typeService';

const AdresseForm = ({closeModal, fetchData, idBin}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [batiment, setBatiment] = useState([]);
  const [idBatiment, setIdBatiment] = useState([]);
  const [bin, setBin] = useState([]);
  const navigate = useNavigate()

  const fetchDataAll = async () => {
        
    try {
        const [binData, batimentData] = await Promise.all([
            getBinsOne(idBatiment),
            getBatiment()
        ])
        setBin(binData.data)
        setBatiment(batimentData.data)

        if (idBin) {
          const {data} = await getBinsOneV(idBin)
          form.setFieldsValue({
            id_bin : data[0].id
        })
        }

    } catch (error) {
        notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
        });
    }
};

useEffect(() => {
  fetchDataAll()
}, [idBin, idBatiment]);

  const onFinish = async(values) => {
    setLoading(true)
    await postAdresse(values)
    notification.success({
      message: 'Succès',
      description: 'Le formulaire a été soumis avec succès.',
    });
    
    fetchData();
    closeModal();
    navigate('/adresse')
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Échec de la soumission:', errorInfo);
    notification.error({
      message: 'Erreur',
      description: 'Veuillez vérifier les champs du formulaire.',
    });
  };

  return (
    <div className="controle_form" >
      <div className="controle_title_rows">
        <h2 className="controle_h2">Insérer une adresse</h2>
      </div>
      <div className="controle_wrapper">
        <Card>
          <Form
            form={form}
            name="format_form"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{ adresses: [''] }} 
            style={{ maxWidth: 600, margin: '0 auto' }}
          >
            <Form.Item
              label="Warehouse"
              name="id_batiment"
              rules={[{ required: true, message: 'Veuillez selectionner un bin' }]}
            >
              <Select
                showSearch
                options={batiment.map(item => ({ value: item.id_batiment, label: item.nom_batiment }))}
                placeholder="Sélectionnez..."
                optionFilterProp="label"
                onChange={setIdBatiment}
              />
            </Form.Item>

            <Form.Item
              label="Bin"
              name="id_bin"
              rules={[{ required: true, message: 'Veuillez entrer un bin' }]}
            >
              <Select
                showSearch
                options={bin.map(item => ({ value: item.id, label: item.nom }))}
                placeholder="Sélectionnez..."
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.List name="adresses" rules={[{ required: true, message: 'Veuillez ajouter au moins une adresse' }]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Form.Item
                      key={key}
                      label={name === 0 ? 'Adresse' : `Adresse ${name + 1}`}
                      required
                      {...restField}
                      name={[name]}
                      rules={[{ required: true, message: 'Veuillez entrer une adresse' }]}
                    >
                      <Input
                        placeholder="Entrez l'adresse..."
                        addonAfter={
                          fields.length > 1 ? (
                            <Button
                              danger
                              type="text"
                              onClick={() => remove(name)}
                              style={{ padding: 0 }}
                            >
                              Supprimer
                            </Button>
                          ) : null
                        }
                      />
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      + Ajouter une adresse
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
        </Card>
      </div>
    </div>
  );
};

export default AdresseForm;
