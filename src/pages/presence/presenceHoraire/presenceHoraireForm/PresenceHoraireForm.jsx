import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Select, notification, Spin } from 'antd';
import './presenceHoraireForm.scss'
import { getUser } from '../../../../services/userService';
import { getHoraire, postHoraire } from '../../../../services/presenceService';

const { Option } = Select;

const PresenceHoraireForm = ({closeModa, fetchData}) => {
  const [users, setUsers] = useState([]);
  const [horaires, setHoraires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedHoraires, setSelectedHoraires] = useState({});
         
  const fetchDatas = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, horairesRes] = await Promise.all([
        getUser(),
        getHoraire(),
      ]);   

      setUsers(usersRes?.data || []);
      setHoraires(horairesRes?.data || []);
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de charger les données.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatas();
  }, [fetchDatas]);

  const handleHoraireChange = (userId, horaireId) => {
    setSelectedHoraires((prev) => ({
      ...prev,
      [userId]: horaireId,
    }));
  };

  const handleSubmit = async () => {
    const entries = Object.entries(selectedHoraires);

    if (!entries.length) {
      notification.warning({
        message: 'Aucune sélection',
        description: 'Veuillez sélectionner au moins un horaire.',
      });
      return;
    }

    setSubmitting(true);
    try {
      for (const [user_id, horaire_id] of entries) {
        await postHoraire({
          user_id,
          horaire_id,
          date_debut: new Date().toISOString().split('T')[0],
        });
      }

      notification.success({
        message: 'Succès',
        description: 'Horaires affectés avec succès.',
      });

      setSelectedHoraires({});
      fetchData();
      closeModa();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Échec de l’affectation des horaires.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Employé',
      dataIndex: 'nom',
      key: 'nom',
      render: (_, record) =>
        `${record.nom} ${record.postnom ?? ''}`.trim(),
    },
    {
      title: 'Horaire',
      key: 'horaire',
      render: (_, record) => (
        <Select
          placeholder="Sélectionner un horaire"
          style={{ width: '100%' }}
          value={selectedHoraires[record.id_utilisateur]}
          onChange={(value) =>
            handleHoraireChange(record.id_utilisateur, value)
          }
        >
          {horaires.map((h) => (
            <Option key={h.id_horaire} value={h.id_horaire}>
              {h.nom}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

return (
  <Spin spinning={loading}>
    <div className="presence-horaire-container">
        <h2 className="presence-horaire-title">Affectation des horaires</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id_user"
        pagination={{ pageSize: 10 }}
      />

      <div className="horaire-submit">
        <Button
          type="primary"
          loading={submitting}
          onClick={handleSubmit}
        >
          Valider
        </Button>
      </div>
    </div>
  </Spin>
);

};

export default PresenceHoraireForm;
