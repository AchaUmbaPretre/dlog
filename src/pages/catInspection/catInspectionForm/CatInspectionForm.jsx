import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { getCat_inspectionOne, postCat_inspection, putCat_inspection } from '../../../services/batimentService';

const CatInspectionForm = ({ closeModal, fetchData, idCatInspection }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchDataOne = async () => {
    if (!idCatInspection) return;

    try {
      const { data: catInspect } = await getCat_inspectionOne(idCatInspection);
      form.setFieldsValue({
        nom_cat_inspection: catInspect[0]?.nom_cat_inspection || '',
      });
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    }
  };

  useEffect(() => {
    fetchDataOne();
  }, [idCatInspection]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (idCatInspection) {
        await putCat_inspection(idCatInspection, values);
        notification.success({
          message: 'Succès',
          description: 'La catégorie inspection a été mise à jour avec succès.',
        });
      } else {
        await postCat_inspection(values);
        notification.success({
          message: 'Succès',
          description: 'La nouvelle catégorie inspection a été ajoutée avec succès.',
        });
      }

      fetchData();
      closeModal();
      form.resetFields();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: "Une erreur est survenue lors de l'enregistrement des données.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Gestion des erreurs de validation
  const onFinishFailed = () => {
    notification.error({
      message: 'Erreur',
      description: 'Veuillez vérifier les champs du formulaire.',
    });
  };

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className="controle_h2">
          {idCatInspection
            ? 'Modifier la catégorie inspection'
            : 'Insérer une nouvelle catégorie inspection'}
        </h2>
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
            label="Nom catégorie inspection"
            name="nom_cat_inspection"
            rules={[
              { required: true, message: 'Veuillez entrer la catégorie inspection.' },
            ]}
          >
            <Input placeholder="Entrez la catégorie" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              {idCatInspection ? 'Modifier' : 'Soumettre'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CatInspectionForm;
