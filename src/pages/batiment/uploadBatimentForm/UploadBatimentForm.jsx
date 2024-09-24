import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Select, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import { postPlans } from '../../../services/batimentService';
import { getBatimentOne } from '../../../services/typeService';

const { Option } = Select;

const UploadBatimentForm = ({idBatiment, closeModal, fetchData }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [nameBatiment, setNameBatiment] = useState('')

  useEffect(() => {
    const fetchData = async () => {
        try { 
            const res = await getBatimentOne(idBatiment)
              setNameBatiment(res.data[0]?.nom_batiment)

        } catch (error) {
            console.log(error)
        }
    };

    fetchData();
}, [idBatiment, form]);


  const handleFinish = async (values) => {
    const formData = new FormData();
    formData.append('nom_document', values.nom_document);
    formData.append('type_document', values.type_document);
    formData.append('id_batiment', idBatiment);  // Ajout de l'id_batiment dans le formData
    
    if (values.chemin_document && values.chemin_document.length > 0) {
      values.chemin_document.forEach(file => {
        formData.append('chemin_document', file.originFileObj);  // Append chaque fichier
      });
    }
  
    setIsLoading(true);
    try {
      await postPlans(formData);
      notification.success({
        message: 'Succès',
        description: 'Le document a été enregistré avec succès.',
      });

      closeModal();
      fetchData();
      navigate('/batiment');
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

  // Appeler handleFileChange lorsque l'upload change
  const handleFileChange = (info) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      let fileType = '';
      switch (extension) {
        case 'pdf':
          fileType = 'PDF';
          break;
        case 'doc':
        case 'docx':
          fileType = 'Word';
          break;
        case 'xls':
        case 'xlsx':
          fileType = 'Excel';
          break;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          fileType = 'Image';
          break;
        default:
          fileType = '';
      }
      form.setFieldsValue({ type_document: fileType });
    }
  };

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className='controle_h2'>Upload de croquis {nameBatiment} </h2>                
      </div>
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
          multiple
          listType="text"
          beforeUpload={() => false}
          onChange={handleFileChange}
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
    </div>
  );
};

export default UploadBatimentForm;
