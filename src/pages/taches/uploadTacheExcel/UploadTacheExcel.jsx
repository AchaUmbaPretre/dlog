import React, { useState } from 'react';
import { Upload, Button, message, Typography, Card, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { postTacheDocExcel } from '../../../services/tacheService';
import './uploadTacheExcel.css'; // Importing a CSS file for custom styles

const { Title } = Typography;

const UploadTacheExcel = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (info) => {
        if (info.fileList.length > 0) {
            setFile(info.fileList[0].originFileObj);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            message.warning('Veuillez sélectionner un fichier avant de continuer.');
            return;
        }

        const formData = new FormData();
        formData.append('chemin_document', file);

        setLoading(true);
        try {
            const response = await postTacheDocExcel(formData);
            message.success(response.data.message);
            setFile(null); // Reset file input
        } catch (error) {
            console.error('Erreur lors de l\'upload du fichier', error);
            message.error('Erreur lors de l\'upload du fichier.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card 
            className="upload-card"
        >
            <Title level={2} className="upload-title">Importer des Tâches via Excel</Title>
            <Upload
                accept=".xlsx, .xls"
                beforeUpload={() => false} 
                onChange={handleFileChange}
                showUploadList={false}
                className="upload-area"
            >
                <Button 
                    icon={<UploadOutlined />} 
                    className="upload-button"
                >
                    Sélectionner un fichier
                </Button>
            </Upload>
            <Button 
                type="primary" 
                onClick={handleUpload} 
                className="upload-submit"
                loading={loading}
            >
                {loading ? <Spin size="small" /> : 'Uploader'}
            </Button>
        </Card>
    );
};

export default UploadTacheExcel;
