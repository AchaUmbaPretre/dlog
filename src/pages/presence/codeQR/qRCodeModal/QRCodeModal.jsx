// QRCodeModal.jsx
import React from 'react';
import { Modal, QRCode, Space, Typography, Descriptions, Tag } from 'antd';

const { Text, Title } = Typography;

const QRCodeModal = ({ visible, onClose, qrData, record }) => {
    if (!record) return null;

    return (
        <Modal
            title=""
            open={visible}
            onCancel={onClose}
            footer={null}
            width={900}
            centered
            destroyOnClose
        >
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <Title level={4}>Scannez ce code QR</Title>
                <div style={{ display:'flex', gap:'20px' }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        margin: '20px 0',
                        padding: '20px',
                        background: '#f5f5f5',
                        borderRadius: '8px'
                    }}>
                        <QRCode
                            value={qrData || record?.code || ''}
                            size={300}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="L"
                            includeMargin={true}
                            bordered={true}
                        />
                    </div>
                    
                    <Descriptions bordered column={1} style={{ marginTop: 20, textAlign: 'left' }}>
                        <Descriptions.Item label="Code QR">
                            <Text copyable>{record?.code}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Site">
                            {record?.nom_site || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Zone">
                            {record?.NomZone || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Type Pointage">
                            <Tag color={record?.type_pointage === 'ENTREE_SORTIE' ? 'blue' : 'green'}>
                                {record?.type_pointage || '-'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Créé par">
                            {record?.nom} {record?.prenom}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date création">
                            {record?.created_at ? new Date(record.created_at).toLocaleString() : '-'}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>
        </Modal>
    );
};

export default QRCodeModal;