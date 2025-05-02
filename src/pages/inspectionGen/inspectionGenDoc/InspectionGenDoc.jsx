import React, { useEffect, useState } from 'react'
import { Card, Button, Table, Form, notification, Input, Select, Upload, Tag } from 'antd';
import { FileTextOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { getTagProps } from '../../../utils/prioriteIcons';
import config from '../../../config';
import { getDocumentInspection, postDocumentReparation } from '../../../services/charroiService';

const { Option } = Select;

const InspectionGenDoc = ({subInspectionId}) => {
    const [form] = Form.useForm();
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [loading, setLoading] = useState(true);
    const [iSloading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };

    const fetchData = async () => {
        setLoading(true)

        try {
             const {data} = await getDocumentInspection(subInspectionId);
           setData(data)
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [subInspectionId]);

    const columns = [
            {
              title: '#',
              dataIndex: 'id',
              key: 'id',
              render: (text, record, index) => index + 1,
              width: "3%",
            },
            {
              title: 'Titre',
              dataIndex: 'nom_document',
              key: 'nom_document',
              render: (text) => (
                <Tag icon={<FileTextOutlined />} color="green">{text}</Tag>
              ),
            },
            {
              title: 'Type',
              dataIndex: 'type_document',
              key: 'type_document',
              render: (text) => {
                const { icon, color } = getTagProps(text);
                return <Tag icon={icon} color={color}>{text}</Tag>;
              },
            },
            {
              title: 'Doc',
              dataIndex: 'chemin_document',
              key: 'chemin_document',
              render: (text) => (
                <a href={`${DOMAIN}/${text}`} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<DownloadOutlined />} color="blue">Télécharger</Tag>
                </a>
              ),
            },
/*             {
              title: 'Action',
              key: 'action',
              width: '10%',
              render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Modifier">
                    <Button
                      icon={<EditOutlined />}
                      style={{ color: 'green' }}
                      onClick={() => handleViewDetails(record.id_tache_document )}
                      aria-label=""
                    />
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <Popconfirm
                      title="Êtes-vous sûr de vouloir supprimer ce client?"
                      onConfirm={() => handleDelete(record.id)}
                      okText="Oui"
                      cancelText="Non"
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        style={{ color: 'red' }}
                        aria-label="Delete client"
                      />
                    </Popconfirm>
                  </Tooltip>
                </Space>
              ),
            }, */
    ];

    const handleFinish = async (values) => {
        const formData = new FormData();
        formData.append('nom_document', values.nom_document);
        formData.append('type_document', values.type_document);
        formData.append('id_sub_inspection', subInspectionId);
      
        if (values.chemin_document && values.chemin_document.length > 0) {
          values.chemin_document.forEach((file) => {
            formData.append('chemin_document', file.originFileObj);
          });
        }
      
        setIsLoading(true);
        try {
            await postDocumentReparation(formData);
            notification.success({
            message: 'Succès',
            description: 'Les documents ont été enregistrés avec succès.',
          });
          fetchData();
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
    <>
        <div className="document_reparation">
            <div className="document_detail_title">
                <h1 className="document_detail_h1">ENREGISTRER UN DOCUMENT D'INSPECTION</h1>
            </div>
            <div className="document_reparation_wrapper">
                
                <div className="document_reparation_left">
                    <Card>
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
                                <Button type="primary" htmlType="submit" block loading={iSloading} disabled={iSloading}>
                                Soumettre
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>

                <div className="document_reparation_right">
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={data}
                            loading={loading}
                            pagination={{ pageSize: 15 }}
                            rowKey="id"
                            bordered
                            size="small"
                            scroll={scroll}
                            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                        />
                    </Card>
                </div>
                
            </div>
        </div>

    </>
  )
}

export default InspectionGenDoc;