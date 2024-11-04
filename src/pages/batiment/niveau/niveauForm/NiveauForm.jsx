import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { postNiveau } from '../../../../services/batimentService';

const NiveauForm = ({idBatiment}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async(values) => {
     setLoading(true);
    try {

        await postNiveau(idBatiment,values)
        notification.success({
          message: 'Succès',
          description: 'Le formulaire a été soumis avec succès.',
        });
        window.location.reload();
        form.resetFields();
    } catch (error) {
        notification.error({
            message: 'Erreur',
            description: "Erreur lors de l'enregistrement du projet.",
        });
    }
    finally {
        setLoading(false);
    }
  };

/*   useEffect(()=> {
    const fetchData = async () => {
        const {data} = await getCorpsMetierOne(idCorps)
        if(data && data[0] ){
            form.setFieldsValue(data[0])
        }
    }

    fetchData();
  }, [idCorps]) */

  const onFinishFailed = (errorInfo) => {
    console.log('Échec de la soumission:', errorInfo);
    notification.error({
      message: 'Erreur',
      description: 'Veuillez vérifier les champs du formulaire.',
    });
  };

  return (
    <div className="controle_form">
        <div className="controle_title_rows">
            <h2 className='controle_h2'>Insérer un nouveau niveau</h2>                
        </div>
        <div className="controle_wrapper">
            <Form
                form={form}
                name="format_form"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ maxWidth: 600, margin: '0 auto' }}
            >
        <Form.Item
            label="Nom niveau"
            name="nom_niveau"
            rules={[{ required: true, message: 'Veuillez entrer le nom du niveau' }]}
        >
            <Input placeholder="Entrez le nom du niveau..." />
        </Form.Item>

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

export default NiveauForm;
