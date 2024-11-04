import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';

const DenominationForm= ({idBatiment}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async(values) => {
/*     setLoading(true);
    try {
        if(idCorps) {
            await putCorpsMetier(idCorps, values)
        }
        else {
            await postCorpsMetier(values)
        }
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
    } */
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
            <h2 className='controle_h2'>Insérer une dénomination</h2>                
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
                    label="Dénomination"
                    name="nom_denomination_bat"
                    rules={[{ required: true, message: 'Veuillez entrer la dénomination' }]}
                >
                    <Input placeholder="Entrez la dénomination..." />
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

export default DenominationForm;
