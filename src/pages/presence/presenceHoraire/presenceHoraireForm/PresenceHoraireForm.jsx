import React, { useState } from "react";
import { Form, Input, Button, TimePicker, Table, notification } from "antd";
import moment from "moment";
import "./presenceHoraireForm.scss";
import { postHoraire } from "../../../../services/presenceService";
import { joursSemaine } from "../../../../utils/joursSemaine";

const PresenceHoraireForm = ({ onSuccess }) => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [joursData, setJoursData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleTimeChange = (jour, type, value) => {
    setJoursData((prev) => ({
      ...prev,
      [jour]: {
        ...prev[jour],
        [type]: value ? value.format("HH:mm:ss") : null,
      },
    }));
  };

  const handleSubmit = async () => {
    const jours = Object.entries(joursData)
      .filter(([_, val]) => val?.heure_debut && val?.heure_fin)
      .map(([jour_semaine, val]) => ({
        jour_semaine,
        heure_debut: val.heure_debut,
        heure_fin: val.heure_fin,
        tolerance_retard: val.tolerance_retard || 0,
      }));

    if (!jours.length) {
      notification.warning({
        message: "Aucune donnée",
        description: "Veuillez renseigner au moins un jour avec ses heures.",
      });
      return;
    }

    setSubmitting(true);
    try {
      await postHoraire({ nom, description, jours });
      notification.success({
        message: "Succès",
        description: "Horaire créé avec succès.",
      });

      setNom("");
      setDescription("");
      setJoursData({});
      onSuccess?.();
    } catch (error) {
      notification.error({
        message: "Erreur",
        description: "Échec de la création de l'horaire.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Jour",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Heure début",
      key: "heure_debut",
      render: (_, record) => (
        <TimePicker
          format="HH:mm"
          style={{ width: 100 }}
          value={
            joursData?.[record.value]?.heure_debut
              ? moment(joursData[record.value].heure_debut, "HH:mm:ss")
              : null
          }
          onChange={(val) => handleTimeChange(record.value, "heure_debut", val)}
        />
      ),
    },
    {
      title: "Heure fin",
      key: "heure_fin",
      render: (_, record) => (
        <TimePicker
          format="HH:mm"
          style={{ width: 100 }}
          value={
            joursData?.[record.value]?.heure_fin
              ? moment(joursData[record.value].heure_fin, "HH:mm:ss")
              : null
          }
          onChange={(val) => handleTimeChange(record.value, "heure_fin", val)}
        />
      ),
    },
  ];

  return (
    <div className="horaire-form-container">
      <h2>Créer un Horaire</h2>

      <Form layout="vertical">
        
        <Form.Item label="Nom de l'horaire">
          <Input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom de l'horaire"
          />
        </Form.Item>

        <Table
          dataSource={joursSemaine}
          columns={columns}
          rowKey="value"
          pagination={false}
        />

        <div style={{ marginTop: 20 }}>
          <Button type="primary" onClick={handleSubmit} loading={submitting}>
            Créer l'horaire
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PresenceHoraireForm;
