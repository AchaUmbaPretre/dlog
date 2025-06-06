import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { getCatTacheOne, getCorpsMetierOne, postCatTache, postCorpsMetier, putCatTache, putCorpsMetier } from '../../../services/typeService';

const ListeCatTacheForm = ({idCat,close, fetchData}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async(values) => {
    setLoading(true);
    try {
        if(idCat) {
            await putCatTache(idCat, values)
            fetchData();
            close()
        }
        else {
            await postCatTache(values)
            fetchData();
            close()
        }
        notification.success({
          message: 'Succès',
          description: 'Le formulaire a été soumis avec succès.',
        });
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

  useEffect(()=> {
    const fetchData = async () => {
        const {data} = await getCatTacheOne(idCat)
        if(data && data[0] ){
            form.setFieldsValue(data[0])
        }
    }

    fetchData();
  }, [idCat])

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
            <h2 className="controle_h2">{ idCat ? 'Modifier la categorie de tache': 'Insérer une nouvelle categorie tache'}</h2>
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
                label="Categorie tache"
                name="nom_cat_tache"
                rules={[{ required: true, message: 'Veuillez entrer le nom de cat...' }]}
            >
                <Input placeholder="Entrez..." />
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

export default ListeCatTacheForm;
