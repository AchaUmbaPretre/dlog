import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, TimePicker, notification, Spin } from "antd";
import moment from "moment";
import "./presenceHoraireForm.scss";
import { getUser } from "../../../../services/userService";
import { postHoraire } from "../../../../services/presenceService";
import { joursSemaine } from "./../../../../utils/joursSemaine";

const PresenceHoraireForm = ({ closeModa, fetchData }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [planningData, setPlanningData] = useState({});

  const fetchDatas = useCallback(async () => {
    setLoading(true);
    try {
      const usersRes = await getUser();
      setUsers(usersRes?.data || []);
    } catch (error) {
      notification.error({
        message: "Erreur",
        description: "Impossible de charger les employés.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatas();
  }, [fetchDatas]);

  const handleTimeChange = (userId, jour, type, value) => {
    setPlanningData((prev) => {
      const userPlanning = prev[userId] || {};

      return {
        ...prev,
        [userId]: {
          ...userPlanning,
          [jour]: {
            ...userPlanning[jour],
            [type]: value ? value.format("HH:mm:ss") : null,
          },
        },
      };
    });
  };

  const handleSubmit = async () => {
    const entries = Object.entries(planningData);

    if (!entries.length) {
      notification.warning({
        message: "Aucune donnée",
        description: "Veuillez configurer au moins un planning.",
      });
      return;
    }

    setSubmitting(true);

    try {
      for (const [user_id, jours] of entries) {
        const details = Object.entries(jours)
          .filter(([_, value]) => value?.heure_debut && value?.heure_fin)
          .map(([jour_semaine, value]) => ({
            jour_semaine,
            heure_debut: value.heure_debut,
            heure_fin: value.heure_fin,
          }));

        if (!details.length) continue;

        await postHoraire({
          user_id,
          date_debut: moment().format("YYYY-MM-DD"),
          details,
        });
      }

      notification.success({
        message: "Succès",
        description: "Planning enregistré avec succès.",
      });

      setPlanningData({});
      fetchData();
      closeModa();

    } catch (error) {
      notification.error({
        message: "Erreur",
        description: "Échec de l'enregistrement du planning.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: "Employé",
      dataIndex: "nom",
      key: "nom",
      render: (_, record) =>
        `${record.prenom} ${record.nom ?? ""}`.trim(),
    },
    ...joursSemaine.map((jour) => ({
      title: jour,
      key: jour,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 5 }}>
          <TimePicker
            format="HH:mm"
            placeholder="Début"
            onChange={(value) =>
              handleTimeChange(record.id_utilisateur, jour, "heure_debut", value)
            }
          />
          <TimePicker
            format="HH:mm"
            placeholder="Fin"
            onChange={(value) =>
              handleTimeChange(record.id_utilisateur, jour, "heure_fin", value)
            }
          />
        </div>
      ),
    })),
  ];

  return (
    <Spin spinning={loading}>
      <div className="presence-horaire-container">
        <h2 className="presence-horaire-title">
          Configuration Planning Employés
        </h2>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id_utilisateur"
          pagination={{ pageSize: 6 }}
          scroll={{ x: true }}
        />

        <div className="horaire-submit">
          <Button
            type="primary"
            loading={submitting}
            onClick={handleSubmit}
          >
            Enregistrer Planning
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default PresenceHoraireForm;
