import React, { useState } from 'react';
import { Form, Input, Button, Upload, Select, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { postOffreDoc } from '../../../services/offreService';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const { Option } = Select;

const DocumentOffreForm = ({idOffre}) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);


  const handleFinish = async (values) => {
    const formData = new FormData();
    formData.append('nom_document', values.nom_document);
    formData.append('type_document', values.type_document);
  
    // Ajouter les fichiers
    if (values.chemin_document && values.chemin_document.length > 0) {
      values.chemin_document.forEach(file => {
        formData.append('chemin_document', file.originFileObj);
      });
    }

     formData.append('id_offre', idOffre); 
  
    setIsLoading(true);
    try {
      await postOffreDoc(formData);
      notification.success({
        message: 'Succès',
        description: 'Le document a été enregistré avec succès.',
      });
      navigate('/offre');
      window.location.reload();
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
        label="Télécharger le Document"
        rules={[{ required: true, message: 'Veuillez télécharger le document!' }]}
        valuePropName="fileList"
        getValueFromEvent={handleUpload}
        extra="Formats supportés : PDF, Word, Excel, Image"
      >
        <Upload name="chemin_document" action={`${DOMAIN}/api/offre/doc`} listType="text">
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

export default DocumentOffreForm;
