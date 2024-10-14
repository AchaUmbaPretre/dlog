import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Select, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import config from '../../../config';
import { getTacheDocOne, postTacheDoc, putTacheDoc } from '../../../services/tacheService';
import { getProjetMoko, postProjetDoc, putProjetDoc } from '../../../services/projetService';

const { Option } = Select;

const ProjetDocForm = ({ idProjet, fetchData, closeModal, idProjetDoc }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (idProjetDoc) {
      getProjetMoko(idProjetDoc).then(({ data }) => {
        if (data && data.length > 0) {
          form.setFieldsValue({
            nom_document: data[0].nom_document,
            type_document: data[0].type_document,
          });
        }
      });
    }
  }, [idProjetDoc, form]);

  const handleFinish = async (values) => {
    const formData = new FormData();
    formData.append('nom_document', values.nom_document);
    formData.append('type_document', values.type_document);
    formData.append('id_projet', idProjet);
  
    if (values.chemin_document && values.chemin_document.length > 0) {
      values.chemin_document.forEach((file) => {
        formData.append('chemin_document', file.originFileObj);
      });
    }
  
    setIsLoading(true);
    try {
      if (idProjetDoc) {
        await putProjetDoc(idProjetDoc, formData);
      } else {
        await postProjetDoc(formData);
      }
      notification.success({
        message: 'Succès',
        description: 'Les documents ont été enregistrés avec succès.',
      });
      fetchData();
      closeModal();
      form.resetFields();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Une erreur s\'est produite lors de l\'enregistrement des informations.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpload = (e) => Array.isArray(e) ? e : e?.fileList;

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: '600px', margin: 'auto', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
      scrollToFirstError
    >
      <Form.Item
        name="nom_document"
        label="Nom du Document"
        rules={[{ required: true, message: 'Veuillez entrer le nom du document!' }]}
      >
        <Input placeholder="Entrez le nom du document" />
      </Form.Item>

      <Form.Item
        name="type_document"
        label="Type de Document"
        rules={[{ required: true, message: 'Veuillez sélectionner le type de document!' }]}
      >
        <Select placeholder="Sélectionnez le type de document">
          <Option value="PDF">PDF</Option>
          <Option value="Word">Word</Option>
          <Option value="Excel">Excel</Option>
          <Option value="Image">Image</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="chemin_document"
        label="Télécharger les Documents"
        valuePropName="fileList"
        getValueFromEvent={handleUpload}
        extra="Formats supportés : PDF, Word, Excel, Image"
        >
        <Upload 
            name="chemin_document" 
            multiple  // Ajout de la possibilité de sélectionner plusieurs fichiers
            action={`${DOMAIN}/api/offre/doc`} 
            listType="text"
        >
            <Button icon={<UploadOutlined />}>Cliquez pour télécharger</Button>
        </Upload>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading} disabled={isLoading}>
            Soumettre
            </Button>
      </Form.Item>
    </Form>
  );
};

export default ProjetDocForm;
