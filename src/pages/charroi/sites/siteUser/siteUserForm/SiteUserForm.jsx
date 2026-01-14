import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, notification, Spin } from 'antd';
import { getUser } from '../../../../../services/userService';
import { postSiteUser } from '../../../../../services/charroiService';

const SiteUserForm = ({ site, closeModal, fetchData }) => {
  const [users, setUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUser();
      setUsers(res?.data || []);
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de charger les utilisateurs.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (site?.id_site) {
      fetchUsers();
    }
  }, [site, fetchUsers]);

  const handleSubmit = async () => {
    if (!selectedRowKeys.length) {
      notification.warning({
        message: 'Aucune sélection',
        description: 'Veuillez sélectionner au moins un utilisateur.'
      });
      return;
    }

    setSubmitting(true);
    try {
      await postSiteUser({
        id_site: site.id_site,
        user_ids: selectedRowKeys
      });

      notification.success({
        message: 'Succès',
        description: `Utilisateurs affectés au site "${site.nom_site}" avec succès.`
      });

      closeModal();
      fetchData?.();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Échec de l’affectation des utilisateurs.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Rôle',
      dataIndex: 'role'
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
  };

  if (!site) return null;

  return (
    <Spin spinning={loading}>
      <h3 style={{ marginBottom: 16 }}>
        Affectation des utilisateurs au site :
        <strong style={{ marginLeft: 8 }}>{site.nom_site}</strong>
      </h3>

      <Table
        rowKey="id_utilisateur"
        columns={columns}
        dataSource={users}
        rowSelection={rowSelection}
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
          onClick={handleSubmit}
          loading={submitting}
        >
          Valider
        </Button>
      </div>
    </Spin>
  );
};

export default SiteUserForm;
