import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { getCat_inspectionOne, postCat_inspection, putCat_inspection } from '../../../services/batimentService';

const CatInspectionForm = ({closeModal, fetchData, idCatInspection}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchDataOne = async () => {
    try {
      const { data: catInspect } = await getCat_inspectionOne(idCatInspection);
      form.setFieldsValue({
        nom_cat_inspection: catInspect[0].nom_cat_inspection
      })
      
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    }
  };

  useEffect(()=> {
    fetchDataOne()
  }, [idCatInspection])

  const onFinish = async(values) => {
    setLoading(true)
    if(idCatInspection){
      await putCat_inspection(idCatInspection, values)
    } else{
        await postCat_inspection(values)

        notification.success({
          message: 'Succès',
          description: 'Le formulaire a été soumis avec succès.',
        });
    }
    fetchData();
    closeModal();
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    notification.error({
      message: 'Erreur',
      description: 'Veuillez vérifier les champs du formulaire.',
    });
  };

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className="controle_h2">{ idCatInspection ? "Modifier la categorie inspection" : "Inserer une nouvelle categorie inspection"}</h2>
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
          label="Nom categorie inspection"
          name="nom_cat_inspection"
          rules={[{ required: true, message: 'Veuillez entrer la categorie d inspection' }]}
        >
          <Input placeholder="Entrez la categorie" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            { idCatInspection ? 'Modifier' : 'Soumettre'}
          </Button>
        </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CatInspectionForm;
