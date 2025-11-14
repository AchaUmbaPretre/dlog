import React, { useState } from 'react'
import { DashboardOutlined, FireOutlined, CarOutlined, BankOutlined, EnvironmentOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import getColumnSearchProps from '../../../../../../utils/columnSearchUtils';
import { Checkbox, Card, Table, Tag, Tooltip } from 'antd';

const ConsomDetailVehicule = ({siegeData}) => {
    const [data,setData] = useState();
    const [loading, setLoading] = useState(true);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [modalType, setModalType] = useState(null);
    const scroll = { x: 400 };

    console.log(siegeData)

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
      title: 'Immatriculation',
      dataIndex: 'immatriculation',
      key: 'immatriculation',
      ...getColumnSearchProps('immatriculation'),
      render: (text) => (
        <div>
          <CarOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
          <Tag color="blue">{text}</Tag>
        </div>
      ),
    },
    {
      title: 'Marque',
      dataIndex: 'nom_marque',
      key: 'nom_marque',
      ...getColumnSearchProps('immatriculation'),
      render: (text) => (
        <div>
          <DashboardOutlined style={{ color: "#faad14", marginRight: "8px" }} />
          {text}
        </div>
      ),
    },
    {
      title: 'Modele',
      dataIndex: 'modele',
      key: 'modele',
      render: (text) => (
        <div>
          <CheckCircleOutlined
            style={{ color: text ? "#52c41a" : "#f5222d", marginRight: "8px" }}
          />
          {text || "Aucune"}
        </div>
      ),
    },
    {
      title: 'Carburant',
      dataIndex: 'nom_type_carburant',
      key: 'nom_type_carburant',
      render: (text) => (
        <div>
          <FireOutlined style={{ color: "#ff4d4f", marginRight: "8px" }} />
          {text}
        </div>
      ),
    },
    {
      title: 'Litre',
      dataIndex: 'total_litres',
      key: 'total_litres',
      render: (text) => (
        <div>
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
      title: 'Km',
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
            <Card type="inner" title="Détails pour chaque vehicule du site SIEGE KIN">
                <Table 
                    dataSource={siegeData} 
                    columns={columns} 
                    size="small"  
                    bordered
                    scroll={scroll}
                />
            </Card>
        </div>
    </>
  )
}

export default ConsomDetailVehicule;