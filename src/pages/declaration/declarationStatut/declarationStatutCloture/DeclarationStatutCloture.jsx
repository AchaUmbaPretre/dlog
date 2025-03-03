import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { getAnnee, getMois } from '../../../../services/templateService';
import { Select, Skeleton, Input, Checkbox, Collapse } from 'antd';

const { Panel } = Collapse;

const DeclarationStatutCloture = () => {
        const [mois, setMois] = useState([]);
        const [annee, setAnnee] = useState([]);
        const [selectedMois, setSelectedMois] = useState([]);
        const [selectedAnnees, setSelectedAnnees] = useState([]);

        const fetchData = async() => {
            const [yearData] = await Promise.all([
                getAnnee()
            ])
            setAnnee(yearData.data);
        }
            useEffect(() => {
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
        
        const renderMoisParAnnee = () => {
            return selectedAnnees.map((year) => (
                <Panel header={year} key={year}>
                    <Checkbox.Group
                        options={(mois[year] || []).map((item) => ({
                            label: moment().month(item.mois - 1).format('MMMM'),
                            value: `${item.mois}-${year}`,
                        }))}
                        value={selectedMois[year] || []}
                        onChange={(checkedValues) => handleMoisChange(checkedValues, year)}
                    />
                </Panel>
            ));
        };

  return (
    <>
        <div className="declaration_statut">
            <div className="declaration_statut_home">
                <div className="declaration_statut_row">
                    <label>Année :</label>
                    <Checkbox.Group
                        options={annee.map((item) => ({
                                label: item.annee,
                                value: item.annee,
                            }))}
                        value={selectedAnnees}
                        onChange={handleAnneeChange}
                    />
                </div>
                { selectedAnnees.length > 0 && (
                    <div className="declaration_statut_row">
                        <label>Mois :</label>
                        <Collapse defaultActiveKey={selectedAnnees}>
                            {renderMoisParAnnee()}
                        </Collapse>
                    </div>
                )

                }
            </div>
        </div>
    </>
  )
}

export default DeclarationStatutCloture