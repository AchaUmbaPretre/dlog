import { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Select } from 'antd';
import {  getBinsOne, getBinsOneV, postAdresse } from '../../../services/batimentService';
import { useNavigate } from 'react-router-dom';
import { getBatiment } from '../../../services/typeService';
import { MinusCircleOutlined } from '@ant-design/icons';

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
          <Form
            form={form}
            name="format_form"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{ adresses: [''] }} 
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

            <Form.List
              name="adresses"
              rules={[{ required: true, message: 'Veuillez ajouter au moins une adresse' }]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ marginBottom: '24px', border: '1px solid #eee', padding: '16px', borderRadius: '4px', display:'flex', gap:'20px' }}>
                      <Form.Item
                        {...restField}
                        label={name === 0 ? 'Adresse' : `Adresse ${name + 1}`}
                        name={[name, 'adresse']}
                        rules={[{ required: true, message: 'Veuillez entrer une adresse' }]}
                      >
                        <Input placeholder="Entrez l'adresse..." />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        label="Superficie (m²)"
                        name={[name, 'superficie_sol']}
                        rules={[
                          { required: true, message: 'Veuillez entrer la superficie' },
                          { pattern: /^\d+(\.\d+)?$/, message: 'Valeur numérique uniquement' }
                        ]}
                      >
                        <Input placeholder="Ex. 150.25" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        label="Volume (m³)"
                        name={[name, 'volume_m3']}
                        rules={[
                          { required: true, message: 'Veuillez entrer le volume' },
                          { pattern: /^\d+(\.\d+)?$/, message: 'Valeur numérique uniquement' }
                        ]}
                      >
                        <Input placeholder="Ex. 300.50" />
                      </Form.Item>

                      {fields.length > 1 && (
                        <Button danger icon={<MinusCircleOutlined />} type="text" onClick={() => remove(name)} style={{marginTop:'25px'}}>
                        </Button>
                      )}
                    </div>
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
      </div>
    </div>
  );
};

export default AdresseForm;
