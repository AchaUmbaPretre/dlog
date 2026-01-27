import { Table, Button, Checkbox, Spin } from 'antd';
import { useUserTerminal } from './hooks/useUserTerminal';

const UserTerminalContainer = ({ terminal, closeModal }) => {
  const {
    users,
    permissions,
    loading,
    submitting,
    togglePermission,
    submit,
  } = useUserTerminal(terminal?.id_terminal, closeModal);

  if (!terminal?.id_terminal) return null;

  const columns = [
    { title: 'Nom', dataIndex: 'nom', key: 'nom' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Rôle', dataIndex: 'role', key: 'role' },
    {
      title: 'Lecture',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={permissions[record.id_utilisateur]?.can_read}
          onChange={() =>
            togglePermission(record.id_utilisateur, 'can_read')
          }
        />
      ),
    },
    {
      title: 'Édition',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={permissions[record.id_utilisateur]?.can_edit}
          onChange={() =>
            togglePermission(record.id_utilisateur, 'can_edit')
          }
        />
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <h3 style={{ marginBottom: 16 }}>
        Utilisateurs du terminal :
        <strong style={{ marginLeft: 8 }}>{terminal.name}</strong>
      </h3>

      <Table
        rowKey="id_utilisateur"
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 12 }}
        size="small"
        bordered
      />

      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button onClick={closeModal} style={{ marginRight: 8 }}>
          Annuler
        </Button>
        <Button
          type="primary"
          loading={submitting}
          onClick={submit}
        >
          Valider
        </Button>
      </div>
    </Spin>
  );
};

export default UserTerminalContainer;
