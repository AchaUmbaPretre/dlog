import React, { useEffect, useState } from "react";
import moment from "moment";
import "./declarationStatutCloture.scss";
import { getAnnee, getMois, putDeclarationsStatus, putDeclarationsStatusCloture } from "../../../../services/templateService";
import { Modal, Select, Button, Skeleton, Checkbox, notification, Collapse, Typography } from "antd";

const { Panel } = Collapse;
const { Title } = Typography;

const DeclarationStatutCloture = () => {
  const [mois, setMois] = useState({});
  const [annee, setAnnee] = useState([]);
  const [selectedMois, setSelectedMois] = useState({});
  const [selectedAnnees, setSelectedAnnees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [yearData] = await Promise.all([getAnnee()]);
        setAnnee(yearData.data);
      } catch (error) {
        console.error("Erreur lors du chargement des années :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchMoisParAnnee = async (annee) => {
    try {
      const response = await getMois(annee);
      setMois((prev) => ({
        ...prev,
        [annee]: response.data,
      }));
    } catch (error) {
      console.error("Erreur lors du chargement des mois :", error);
    }
  };

  const handleMoisChange = (checkedValues, annee) => {
    setSelectedMois((prev) => ({
      ...prev,
      [annee]: checkedValues,
    }));
  };

  const handleAnneeChange = (checkedValues) => {
    setSelectedAnnees(checkedValues);
    checkedValues.forEach((annee) => {
      if (!mois[annee]) {
        fetchMoisParAnnee(annee);
      }
    });
  };

  const onFinish = async () => {
    if (!Object.keys(selectedMois).length) {
        notification.warning({
            message: 'Attention',
            description: 'Veuillez sélectionner au moins un mois à clôturer.',
        });
        return;
    }

    setLoading(true);

    try {
        const declarationsToUpdate = [];
        
        Object.entries(selectedMois).forEach(([annee, moisList]) => {
            moisList.forEach((mois) => {
                const [moisValue] = mois.split('-'); // Extraire uniquement le mois
                declarationsToUpdate.push({ annee, mois: moisValue });
            });
        });

        await putDeclarationsStatusCloture({ declarations: declarationsToUpdate });

        notification.success({
            message: 'Succès',
            description: 'Les déclarations ont été clôturées avec succès.',
        });

    } catch (error) {
        notification.error({
            message: 'Erreur',
            description: "Erreur lors de la clôture des déclarations.",
        });
    } finally {
        setLoading(false);
    }
};


  return (
      <>
            {loading ? (
        <Skeleton active />
      ) : (
        <div className="declaration_statut">
          <div className="declaration_statut_home">
            <div className="declaration_statut_row">
              <Title level={5}>Année :</Title>
              <Checkbox.Group
                options={annee.map((item) => ({
                  label: item.annee,
                  value: item.annee,
                }))}
                value={selectedAnnees}
                onChange={handleAnneeChange}
              />
            </div>
            {selectedAnnees.length > 0 && (
              <div className="declaration_statut_row">
                <Title level={5}>Mois :</Title>
                <Collapse defaultActiveKey={selectedAnnees} ghost>
                  {selectedAnnees.map((year) => (
                    <Panel header={`Année ${year}`} key={year}>
                      <Checkbox.Group
                        options={(mois[year] || []).map((item) => ({
                          label: moment()
                            .month(item.mois - 1)
                            .format("MMMM"),
                          value: `${item.mois}-${year}`,
                        }))}
                        value={selectedMois[year] || []}
                        onChange={(checkedValues) =>
                          handleMoisChange(checkedValues, year)
                        }
                      />
                    </Panel>
                  ))}
                </Collapse>
              </div>
            )}
            <div className="declaration_statut_row">
            <Button type="primary" onClick={onFinish}>
                Cloturé
            </Button>
            </div>
          </div>
        </div>
      )}
      </>
  );
};

export default DeclarationStatutCloture;
