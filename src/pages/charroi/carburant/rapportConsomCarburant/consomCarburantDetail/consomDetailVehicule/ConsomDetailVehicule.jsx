import React, { useState } from 'react'
import { DashboardOutlined, BankOutlined, EnvironmentOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import getColumnSearchProps from '../../../../../../utils/columnSearchUtils';
import { Checkbox, Card, Table, Tag, Tooltip } from 'antd';

const ConsomDetailVehicule = () => {
    const [data,setData] = useState();
    const [loading, setLoading] = useState(true);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [modalType, setModalType] = useState(null);
    const scroll = { x: 400 };

    const columns = [
        {
        title: '#',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => (
            <Tooltip title={`Ligne ${index + 1}`}>
            <Tag color="blue">{index + 1}</Tag>
            </Tooltip>
        ),
        width: "4%",
        },
        {
            title: 'Nom Site',
            dataIndex: 'nom_site',
            key: 'nom_site',
            ...getColumnSearchProps('nom_site'),
            render: (text) => (
                <div>
                <BankOutlined style={{ color: "#1890ff", marginRight: "4px" }} />
                {text || "Aucune"}
                </div>
            )
        },
        {
            title: 'Province',
            dataIndex: 'province',
            key: 'province',
            ...getColumnSearchProps('province'),
            render: (text) => (
                <div>
                <EnvironmentOutlined style={{ color: "red", marginRight: "8px" }} />
                {text}
                </div>
            )
        },
        {
        title: 'Zone',
        dataIndex: 'zone',
        key: 'zone',
        render: (text) => (
            <div>
            <EnvironmentOutlined style={{ color: "#faad14", marginRight: "8px" }} />
            {text || "Aucune"}
            </div>
        ),
        },
        {
        title: 'Litre',
        dataIndex: 'total_litres',
        key: 'total_litres',
        render: (text) => (
            <div>
            <LoadingOutlined style={{ color: "#722ed1", marginRight: "8px" }} />
            {text}
            </div>
        ),
        },
        {
        title: 'Plein',
        dataIndex: 'total_pleins',
        key: 'total_pleins',
        render: (text) => (
            <div>
            <CheckCircleOutlined
                style={{ color: "#52c41a", marginRight: "8px" }}
            />
            {text}
            </div>
        ),
        },
        {
        title: (
            <>
            <DashboardOutlined style={{ color: "#eb2f96" }} /> Km
            </>
        ),
        dataIndex: 'total_kilometrage',
        key: 'total_kilometrage',
        render: (text) => (
            <div>
            <DashboardOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
            {text}
            </div>
        ),
        },
        {
        title: 'Sélection',
        dataIndex: 'id',
        key: 'checkbox',
        render: (id, record) => (
            <Checkbox
            onChange={(e) => handleCheckboxChange(record.id_vehicule, e.target.checked)}
            checked={selectedVehicles.includes(record.id_vehicule)}
            />
        ),
        width: "5%",
        },
    ];

    const handleCheckboxChange = (id, checked) => {
    setSelectedVehicles((prev) =>
      checked ? [...prev, id] : prev.filter((vehiculeId) => vehiculeId !== id)
    );
  };

  return (
    <>
        <div className="consomDetailSite">
            <Card type="inner" title="Détails pour chaque site">
                <Table 
                    dataSource={data} 
                    columns={columns} 
                    size="small"  
                    bordered
                    scroll={scroll}
                    loading={loading}
                />
            </Card>
        </div>
    </>
  )
}

export default ConsomDetailVehicule;