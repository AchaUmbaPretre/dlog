import { Table, Checkbox, Switch, Input, Button, Badge, Typography, Space, Spin, Alert } from 'antd';
import { SearchOutlined, CarOutlined, UndoOutlined, SaveOutlined } from '@ant-design/icons';
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
    handleSave,
    handleReset,
    hasChanges,
    changesCount
  } = useGeofenceVehicule(idGeofence);

  const total = filteredData.length;
  const selected = filteredData.filter(v => v.checked).length;

  // Afficher un loader pendant le chargement initial
  if (loading && filteredData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" tip="Chargement des véhicules..." />
      </div>
    );
  }

  const columns = [
    {
      title: '#',
      align: 'center',
      render: (_, __, index) => index + 1,
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <Text type="secondary">
            {selected} / {total} véhicules sélectionnés
          </Text>
          {hasChanges && (
            <Badge 
              count={`${changesCount.ajouts + changesCount.suppressions + changesCount.modifications} modif.`} 
              style={{ backgroundColor: '#faad14' }}
            />
          )}
        </div>

        <Input
          prefix={<SearchOutlined />}
          placeholder="Rechercher un véhicule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginTop: 10, borderRadius: 8 }}
          allowClear
        />
      </div>

      {hasChanges && (
        <Alert
          message="Modifications non enregistrées"
          description={`Vous avez ${changesCount.ajouts} ajout(s), ${changesCount.suppressions} suppression(s) et ${changesCount.modifications} modification(s) en attente.`}
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 12 }}
        />
      )}

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id_vehicule"
        loading={loading}
        pagination={{ 
          pageSize: 8,
          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} véhicules`,
          showSizeChanger: true,
          pageSizeOptions: ['8', '16', '24', '32']
        }}
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
        justifyContent: 'space-between',
        gap: 10,
        background: '#fff',
        position: 'sticky',
        bottom: 0
      }}>

        <Button onClick={closeModal}>
          Fermer
        </Button>

        <Space>
          {hasChanges && (
            <Button 
              onClick={handleReset}
              icon={<UndoOutlined />}
            >
              Annuler les modifications
            </Button>
          )}
          
          <Button
            type="primary"
            loading={saving}
            onClick={() => handleSave(closeModal, fetchDatas)}
            icon={<SaveOutlined />}
          >
            Enregistrer les modifications
          </Button>
        </Space>
      </div>

      <style>{`
        .row-selected {
          background: #f6ffed !important;
          transition: all 0.2s ease;
        }

        .row-default:hover {
          background: #fafafa !important;
        }
        
        .ant-table-tbody > tr.ant-table-row-selected:hover > td {
          background: #d9f7be !important;
        }
      `}</style>

    </div>
  );
};

export default GeofencesVehicule;