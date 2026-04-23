import { Table, Checkbox, Switch, Input, Button, Badge, Typography, Space } from 'antd';
import { SearchOutlined, CarOutlined } from '@ant-design/icons';
import { useGeofenceVehicule } from './hooks/useGeofenceVehicule';

const { Title, Text } = Typography;

const GeofencesVehicule = ({ closeModal, fetchDatas, idGeofence }) => {

  const {
    filteredData,
    loading,
    saving,
    search,
    setSearch,
    handleCheck,
    handleSwitch,
    handleSave
  } = useGeofenceVehicule(idGeofence);

  const total = filteredData.length;
  const selected = filteredData.filter(v => v.checked).length;

  const columns = [
    {
      title: '#',
      align: 'center',
      render: (_,record, index) => index + 1,
      width: '50px'
    },
    {
      title: 'Véhicule',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>
            {record.nom_marque} {record.modele}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.immatriculation}
          </Text>
        </Space>
      )
    },
    {
      title: 'Statut',
      align: 'center',
      render: (_, record) => (
        <Badge
          status={record.checked ? 'success' : 'default'}
          text={record.checked ? 'Affecté' : 'Non affecté'}
        />
      )
    },
    {
      title: 'Sans BS',
      align: 'center',
      render: (_, record) => (
        <Switch
          checked={record.autorise_sans_bs === 1}
          onChange={() => handleSwitch(record.id_vehicule)}
          disabled={!record.checked}
          checkedChildren="OK"
          unCheckedChildren="BS"
        />
      )
    },
    {
      title: '',
      width: 60,
      render: (_, record) => (
        <Checkbox
          checked={record.checked}
          onChange={() => handleCheck(record.id_vehicule)}
        />
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      <div style={{
        marginBottom: 12,
        padding: 12,
        borderRadius: 10,
        background: '#fafafa',
        border: '1px solid #f0f0f0'
      }}>

        <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CarOutlined />
          Affectation des véhicules
        </Title>

        <Text type="secondary">
          {selected} / {total} véhicules sélectionnés
        </Text>

        <Input
          prefix={<SearchOutlined />}
          placeholder="Rechercher un véhicule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginTop: 10, borderRadius: 8 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id_vehicule"
        loading={loading}
        pagination={{ pageSize: 8 }}
        scroll={{ y: 420 }}
        size="middle"
        bordered={false}
        rowClassName={(record) =>
          record.checked ? 'row-selected' : 'row-default'
        }
      />

      <div style={{
        marginTop: 15,
        padding: 12,
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10,
        background: '#fff',
        position: 'sticky',
        bottom: 0
      }}>

        <Button onClick={closeModal}>
          Annuler
        </Button>

        <Button
          type="primary"
          loading={saving}
          onClick={() => handleSave(closeModal, fetchDatas)}
        >
          Enregistrer les modifications
        </Button>
      </div>

      <style>{`
        .row-selected {
          background: #f6ffed !important;
          transition: all 0.2s ease;
        }

        .row-default:hover {
          background: #fafafa !important;
        }
      `}</style>

    </div>
  );
};

export default GeofencesVehicule;