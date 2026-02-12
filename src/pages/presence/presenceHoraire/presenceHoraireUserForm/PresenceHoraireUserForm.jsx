import React, { useEffect, useState } from "react";
import { Select, Button, notification, Spin, Card } from "antd";
import { getUser } from "../../../../services/userService";
import { getHoraire, postHoraireUser } from "../../../../services/presenceService";

const { Option } = Select;

const PresenceHoraireUserForm = ({ fetchData }) => {
  const [users, setUsers] = useState([]);
  const [horaire, setHoraire] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedHoraire, setSelectedHoraire] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Charger les utilisateurs et horaires
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, horaireRes] = await Promise.all([getUser(), getHoraire()]);
      setUsers(usersRes?.data || []);
      setHoraire(horaireRes?.data || []);
    } catch (error) {
      notification.error({
        message: "Erreur",
        description: "Impossible de charger les utilisateurs ou horaires.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 🔹 Soumettre la sélection
  const handleSubmit = async () => {
    if (!selectedUsers.length || !selectedHoraire) {
      notification.warning({
        message: "Champs manquants",
        description: "Veuillez sélectionner au moins un utilisateur et un horaire.",
      });
      return;
    }

    setSubmitting(true);
    try {
      for (const user_id of selectedUsers) {
        await postHoraireUser({ user_id, horaire_id: selectedHoraire });
      }

      notification.success({
        message: "Succès",
        description: "Horaire attribué aux utilisateurs avec succès.",
      });

      setSelectedUsers([]);
      setSelectedHoraire(null);
      if (fetchData) fetchData();
    } catch (error) {
      notification.error({
        message: "Erreur",
        description: "Impossible d'attribuer l'horaire.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Card
        title="Attribuer un Horaire à un ou plusieurs Utilisateurs"
        style={{
          maxWidth: 600,
          margin: "20px auto",
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          
          {/* 🔹 Sélection Utilisateurs */}
          <Select
            showSearch
            mode="multiple"
            placeholder="Sélectionner un ou plusieurs utilisateurs"
            value={selectedUsers}
            onChange={setSelectedUsers}
            optionLabelProp="label"
            style={{ width: "100%" }}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          >
            {users.map(u => (
              <Option
                key={u.id_utilisateur}
                value={u.id_utilisateur}
                label={`${u.prenom} ${u.nom}`}
              >
                {`${u.prenom} ${u.nom}`}
              </Option>
            ))}
          </Select>

          {/* 🔹 Sélection Horaire */}
          <Select
            placeholder="Sélectionner un horaire"
            value={selectedHoraire}
            onChange={setSelectedHoraire}
            style={{ width: "100%" }}
          >
            {horaire.map(h => (
              <Option key={h.id_horaire} value={h.id_horaire}>
                {h.nom}
              </Option>
            ))}
          </Select>

          {/* 🔹 Bouton Submit */}
          <Button
            type="primary"
            loading={submitting}
            onClick={handleSubmit}
            style={{
              alignSelf: "flex-end",
              borderRadius: 6,
              padding: "0 20px",
              fontWeight: 500,
            }}
          >
            Attribuer Horaire
          </Button>
        </div>
      </Card>
    </Spin>
  );
};

export default PresenceHoraireUserForm;
