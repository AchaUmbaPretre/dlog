import React, { useState } from 'react';
import { Card, Space, Table, Button, Dropdown, Checkbox, Input, Modal, Typography } from 'antd';
import { 
    FireOutlined, 
    ReloadOutlined, 
    MenuOutlined, 
    DownOutlined,
    ExpandOutlined
} from '@ant-design/icons';
import { useQRGenerationAll } from './hooks/useQRGenerationAll';
import { useQRGeneratedColumns } from './hooks/useQRGeneratedColumns';
import CodeQRForm from './codeQRForm/CodeQRForm';
import QRCodeModal from './qRCodeModal/QRCodeModal';

const { Search } = Input;
const { Title } = Typography;

const CodeQR = () => {
    const { loading, data, reload } = useQRGenerationAll();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchValue, setSearchValue] = useState('');
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'Code QR': true,
        'Site': true,
        'Zone': true,
        'Type Pointage': true,
        'Statut': true,
        'Créée par': false,
        'Date création': true,
        'Actions': true
    });
    const [modal, setModal] = useState({ type: null, id: null });
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [selectedQRCode, setSelectedQRCode] = useState(null);

    const closeAllModals = () => setModal({ type: null, id: null });
    const closeQRModal = () => {
        setQrModalVisible(false);
        setSelectedQRCode(null);
    };

    const handleQRCodeClick = (record) => {
        setSelectedQRCode(record);
        setQrModalVisible(true);
    };

    const columns = useQRGeneratedColumns({
        pagination,
        columnsVisibility,
        onDetail: (id) => setModal({ type: 'Detail', id: id }),
        onQRCodeClick: handleQRCodeClick // Passage de la fonction
    });

    const filteredData = data.filter(item => {
        if (!searchValue) return true;
        const searchLower = searchValue.toLowerCase();
        return (
            (item.code && item.code.toLowerCase().includes(searchLower)) ||
            (item.nom && `${item.nom} ${item.prenom}`.toLowerCase().includes(searchLower)) ||
            (item.nom_site && item.nom_site.toLowerCase().includes(searchLower)) ||
            (item.NomZone && item.NomZone.toLowerCase().includes(searchLower))
        );
    });

    const columnMenu = (
        <div style={{ padding: 10, background: "#fff", minWidth: 150 }}>
            {Object.keys(columnsVisibility).map((colName) => (
                <div key={colName} style={{ marginBottom: 8 }}>
                    <Checkbox
                        checked={columnsVisibility[colName]}
                        onChange={() =>
                            setColumnsVisibility((prev) => ({ ...prev, [colName]: !prev[colName] }))
                        }
                    >
                        {colName}
                    </Checkbox>
                </div>
            ))}
        </div>
    );

    return (
        <div className="carburant-page">
            <Card
                title={
                    <Space style={{display:'flex', alignItems:'center'}}>
                        <ExpandOutlined />
                        <Title level={4} style={{ margin: 0 }}>
                            Liste des codes QR
                        </Title>
                    </Space>
                }
                bordered={false}
                className="shadow-sm rounded-2xl"
                extra={
                    <Space wrap>
                        <Search
                            placeholder="Rechercher par code QR, créateur, site ou zone..."
                            allowClear
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ width: 300 }}
                        />
                        <Button icon={<ReloadOutlined />} onClick={reload} loading={loading}>
                            Actualiser
                        </Button>
                        <Dropdown overlay={columnMenu} trigger={["click"]}>
                            <Button icon={<MenuOutlined />}>
                                Colonnes <DownOutlined />
                            </Button>
                        </Dropdown>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: filteredData.length,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} éléments`,
                        onChange: (page, pageSize) => {
                            setPagination({ current: page, pageSize });
                        }
                    }}
                    scroll={{ x: 'max-content' }}
                    rowKey="id_qr"
                    bordered
                />
            </Card>
            
            <Modal 
                open={modal.type === "Detail"} 
                onCancel={closeAllModals} 
                footer={null} 
                width={modal.id ? 800 : 1400} 
                centered 
                destroyOnClose
            >
                <CodeQRForm 
                    closeModal={closeAllModals} 
                    fetchData={reload} 
                    idSite={modal.id} 
                />
            </Modal>

            <QRCodeModal
                visible={qrModalVisible}
                onClose={closeQRModal}
                qrData={selectedQRCode?.code}
                record={selectedQRCode}
            />
        </div>
    );
};

export default CodeQR;