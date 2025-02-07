import React, { useEffect, useState } from 'react';
import { Select, Skeleton, Input, Checkbox, Collapse, TreeSelect } from 'antd';
import 'antd/dist/reset.css';
import moment from 'moment';
import { getClient, getProvince } from '../../../../services/clientService';
import { getBatiment, getStatus_batiment } from '../../../../services/typeService';
import { getMois, getAnnee } from '../../../../services/templateService';

const { Option } = Select;
const { Panel } = Collapse;
const { TreeNode } = TreeSelect;

const RapportFiltrageTree = ({ onFilter, filtraVille, filtraClient, filtraStatus, filtreBatiment }) => {
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [selectedVille, setSelectedVille] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedBatiment, setSelectedBatiment] = useState([]);
    const [minMontant, setMinMontant] = useState(null);
    const [maxMontant, setMaxMontant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mois, setMois] = useState([]);
    const [annee, setAnnee] = useState([]);
    const [selectedMois, setSelectedMois] = useState([]);
    const [selectedAnnees, setSelectedAnnees] = useState([]);
    const [type, setType] = useState([]);
    const [batiment, setBatiment] = useState([])

useEffect(()=> {
    const handleFilter = () => {
        const period = {
            mois: [],
            annees: selectedAnnees,
        };
    
        selectedAnnees.forEach(year => {
            if (selectedMois[year]) {
                selectedMois[year].forEach(mois => {
                period.mois.push(mois.split('-')[0]); 
                });
            }
        });
    
        onFilter({
            ville: selectedVille,
            client: selectedClients,
            status_batiment: selectedType,
            montant: { min: minMontant, max: maxMontant },
            batiment: selectedBatiment,
            period,
        });
    
    };
    handleFilter();
}, [province, client, selectedVille, selectedType, selectedClients, minMontant, maxMontant, selectedBatiment, mois, annee, selectedMois, selectedAnnees, type ])

const handleAnneeChange = (values) => {
    if (!Array.isArray(values)) return; // Vérifie que c'est bien un tableau

    const valeursString = values.map(v => String(v)); // Convertir en string pour éviter l'erreur

    // Séparer les années des mois sélectionnés
    const anneesSelectionnees = valeursString.filter((v) => !v.includes('-'));
    const moisSelectionnes = valeursString.filter((v) => v.includes('-'));

    setSelectedAnnees(anneesSelectionnees);

    // Charger les mois pour chaque année sélectionnée si ce n'est pas déjà fait
    anneesSelectionnees.forEach((annee) => {
        if (!mois[annee]) {
            fetchMoisParAnnee(annee);
        }
    });

    // Mettre à jour la sélection des mois
    handleMoisChange(moisSelectionnes);
};


const handleMoisChange = (checkedValues) => {
    const moisParAnnee = {};

    checkedValues.forEach((value) => {
        const [mois, annee] = value.split('-');

        if (!moisParAnnee[annee]) {
            moisParAnnee[annee] = [];
        }
        moisParAnnee[annee].push(value);
    });

    setSelectedMois(moisParAnnee);
};


    const fetchMoisParAnnee = async (annee) => {
        try {
            const response = await getMois(annee); // Modifier `getMois` pour accepter l'année comme paramètre
            setMois((prev) => ({
                ...prev,
                [annee]: response.data,
            }));
        } catch (error) {
            console.error("Erreur lors du chargement des mois :", error);
        }
    };


    const fetchData = async () => {
            setIsLoading(true);
            try {
                const [clientData, provinceData, statutData, yearData, batimentData] = await Promise.all([ 
                    getClient(),
                    getProvince(),
                    getStatus_batiment(),
                    getAnnee(),
                    getBatiment()
                ]);

                setClient(clientData.data);
                setProvince(provinceData.data);
                setType(statutData.data);
                setAnnee(yearData.data);
                setBatiment(batimentData.data)

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
    }

    useEffect(() => {
        fetchData();
    }, []);

    
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

    const treeData = annee.map((item) => ({
        title: item.annee,
        value: item.annee,
        selectable: true,
        children: (mois[item.annee] || []).map((m) => ({
            title: moment().month(m.mois - 1).format('MMMM'),
            value: `${m.mois}-${item.annee}`,
        })),
    }));

    const options = [
        { value: null, label: 'All' },
        ...type.map((item) => ({
            value: item.id_status_batiment,
            label: item.nom_status_batiment,
        })),
    ];
    
    return (
        <div className="filterTache" style={{ margin: '10px 0' }}>
            {filtreBatiment && (
                <div className="filter_row">
                <label>Bâtiment :</label>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    showSearch
                    options={batiment.map((item) => ({
                            value: item.id_batiment,
                            label: item.nom_batiment,
                        }))}
                    placeholder="Sélectionnez un bâtiment..."
                    optionFilterProp="label"
                    onChange={setSelectedBatiment}
                />
            </div>
            )}
            {filtraVille && (
                <div className="filter_row">
                    <label>Ville :</label>
                    {isLoading ? (
                        <Skeleton.Input active={true} />
                    ) : (
                        <Select
                            mode="multiple"
                            showSearch
                            style={{ width: '100%' }}
                            options={province.map((item) => ({
                                value: item.id,
                                label: item.capital,
                            }))}
                            placeholder="Sélectionnez..."
                            optionFilterProp="label"
                            onChange={setSelectedVille}
                        />
                    )}
                </div>
            )}

            {filtraClient && (
                <div className="filter_row">
                    <label>Clients :</label>
                    {isLoading ? (
                        <Skeleton.Input active={true} />
                    ) : (
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            showSearch
                            options={client.map((item) => ({
                                value: item.id_client,
                                label: item.nom,
                            }))}
                            placeholder="Sélectionnez un client..."
                            optionFilterProp="label"
                            onChange={setSelectedClients}
                        />
                    )}
                </div>
            )}

            {filtraStatus && (
                <div className="filter_row">
                    <label>Type de batiment :</label>
                    {isLoading ? (
                        <Skeleton.Input active={true} />
                    ) : (
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            options={options}
                            placeholder="Sélectionnez..."
                            optionFilterProp="label"
                            onChange={setSelectedType}
                        />
                    )}
                </div>
            )}

            <div className="filter_row">
                <label>Montant :</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Input
                        placeholder="Min"
                        type="number"
                        value={minMontant}
                        onChange={(e) => setMinMontant(e.target.value)}
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        value={maxMontant}
                        onChange={(e) => setMaxMontant(e.target.value)}
                    />
                </div>
            </div>

            <div className="filter_row">
                <label>Période :</label>
                <TreeSelect
    multiple
    allowClear
    treeCheckable
    showSearch
    value={[...selectedAnnees, ...Object.values(selectedMois).flat()]} // Conserver les années et mois sélectionnés
    onChange={handleAnneeChange}
    placeholder="Sélectionnez une année..."
    style={{ width: '100%' }}
>
    {annee.map((item) => (
        <TreeNode key={item.annee} value={item.annee} title={item.annee}>
            {(mois[item.annee] || []).map((m) => (
                <TreeNode
                    key={`${m.mois}-${item.annee}`}
                    value={`${m.mois}-${item.annee}`}
                    title={moment().month(m.mois - 1).format('MMMM')}
                />
            ))}
        </TreeNode>
    ))}
</TreeSelect>

            </div>

        </div>
    );
};

export default RapportFiltrageTree;
