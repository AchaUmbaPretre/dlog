import React, { useState } from 'react';
import { Upload, Button, message, Modal, Card, Typography, Spin, Tooltip } from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;

const UploadTacheExcel = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleFileChange = (info) => {
        console.log(info)
        if (info.file.status !== 'uploading') {
            setFile(info.file.originFileObj);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            message.warning('Veuillez sélectionner un fichier à uploader.');
            return;
        }

        const formData = new FormData();
        formData.append('chemin_document', file);
        setLoading(true);

        try {
/*             const response = await axios.post('http://localhost:3001/tache_doc_excel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setModalMessage(response.data.message); */
            setIsModalVisible(true);
        } catch (error) {
            console.error('Erreur lors de l\'upload du fichier', error);
            setModalMessage('Erreur lors de l\'upload du fichier. Veuillez réessayer.');
            setIsModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <Card
            style={{
                maxWidth: '500px',
                margin: '0 auto',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            bordered={false}
        >
            <Title level={3} style={{ textAlign: 'center' }}>Importer des Tâches via Excel</Title>
            <Text type="secondary" style={{ marginBottom: '20px', display: 'block', textAlign: 'center' }}>
                Veuillez sélectionner un fichier Excel (.xlsx ou .xls) à importer.
            </Text>

            <Upload 
                beforeUpload={() => false} 
                accept=".xlsx, .xls" 
                onChange={handleFileChange}
                showUploadList={false}
                style={{ display: 'block', marginBottom: '20px' }}
            >
                <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
            </Upload>

            {file && (
                <Text style={{ display: 'block', textAlign: 'center', marginBottom: '20px' }}>
                    Fichier sélectionné : <Text strong>{file.name}</Text>
                </Text>
            )}

            <Tooltip title="Cliquez pour uploader le fichier">
                <Button 
                    type="primary" 
                    onClick={handleUpload} 
                    disabled={!file} 
                    loading={loading} 
                    style={{ width: '100%', margin: '20px 0' }}
                >
                    {loading ? <Spin /> : 'Uploader'}
                </Button>
            </Tooltip>

            <Modal 
                title="Résultat de l'Upload" 
                visible={isModalVisible} 
                onOk={handleModalClose} 
                onCancel={handleModalClose}
                footer={[
                    <Button key="ok" type="primary" onClick={handleModalClose}>
                        OK
                    </Button>,
                ]}
            >
                <p>{modalMessage}</p>
            </Modal>

            {!file && (
                <Text type="danger" style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>
                    <InfoCircleOutlined /> Aucun fichier sélectionné.
                </Text>
            )}
        </Card>
    );
};

export default UploadTacheExcel;
