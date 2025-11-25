import { useEffect, useState } from 'react';
import { Select, Skeleton, Checkbox, Collapse } from 'antd';
import 'antd/dist/reset.css';
import moment from 'moment';
import { getAnneeCarburant, getCarburantVehicule, getMoisCarburant } from '../../../../../../services/carburantService';
import { getCatVehicule, getSite } from '../../../../../../services/charroiService';

const { Panel } = Collapse;

const RapportPeriodeFiltrage = ({ onFilter, filtraVille, filtraClient, filtraStatus, filtreBatiment, filtreTemplate, filtreMontant }) => {
    const [selectedSite, setSelectedSite] = useState([]);
    const [selectedCat, setSelectedCat] = useState([]);
    const [selectedVehicule, setSelectedVehicule] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mois, setMois] = useState([]);
    const [annee, setAnnee] = useState([]);
    const [vehicule, setVehicule] = useState([]);
    const [selectedMois, setSelectedMois] = useState([]);
    const [selectedAnnees, setSelectedAnnees] = useState([]);
    const [cat, setCat] = useState([]);
    const [site, setSite] = useState([]);
    const [selectAllSite, setSelectAllSite] = useState(false);
    const [selectAllVehicule, setSelectAllVehicule] = useState(false);
    const [selectAllCat, setSelectAllCat] = useState(false);


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
                vehicule: selectedVehicule,
                site: selectedSite,
                cat: selectedCat,
                period,
            });
        
        };
        handleFilter();
    }, [ selectedAnnees, selectedCat, selectedMois, selectedVehicule, selectedSite ])

    const fetchMoisParAnnee = async (annee) => {
        try {
            const response = await getMoisCarburant(annee);
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
                const [yearData, vehiculeData, siteData, catData] = await Promise.all([ 
                    getAnneeCarburant(),
                    getCarburantVehicule(),
                    getSite(),
                    getCatVehicule()
                ]);
                setAnnee(yearData.data);
                setVehicule(vehiculeData.data);
                setSite(siteData.data?.data)
                setCat(catData?.data)

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
    }

    useEffect(() => {
        fetchData();
    }, []);

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

    const toggleSelectAll = (selectAll, setSelectAll, data, setSelected) => {
        const newState = !selectAll;
        setSelectAll(newState);
    
        if (newState) {
            const allValues = data.map(item => item.value || item.id || item.id_client || item.id_batiment || item.id_template);
            setSelected(allValues);
        } else {
            setSelected([]);
        }
    };
    
    return (
        <div className="filterTache" style={{ margin: '10px 0' }}>
            <div className="filter_row">
                <label>Véhicule :</label>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    showSearch
                    value={selectedVehicule}
                    options={[
                        {
                            value: 'selectAll',
                            label: selectAllVehicule ? 'Tout désélectionner' : 'Tout sélectionner',
                        },
                        ...vehicule?.map((item) => ({
                        value: item.id_enregistrement,
                        label: `${item.nom_marque} / ${item.immatriculation}`,
                        }))
                    ]}
                    placeholder="Sélectionnez un ou plusieur..."
                    optionFilterProp="label"
                    onChange={(newValue) => {
                        if (newValue.includes('selectAll')) {
                            toggleSelectAll(selectAllVehicule, setSelectAllVehicule, vehicule, setSelectedVehicule);
                        } else {
                            setSelectedVehicule(newValue);
                        }
                    }}
                />
            </div>

            <div className="filter_row">
                <label>Site :</label>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    showSearch
                    value={selectedSite}
                    options={[
                        {
                            value: 'selectAll',
                            label: selectAllSite ? 'Tout désélectionner' : 'Tout sélectionner',
                        },
                        ...site.map((item) => ({
                                value: item.id_site,
                                label: item.nom_site,
                            }))
                    ]}
                    placeholder="Sélectionnez un ou plusieur..."
                    optionFilterProp="label"
                    onChange={(newValue) => {
                        if (newValue.includes('selectAll')) {
                            toggleSelectAll(selectAllSite, setSelectAllSite, site, setSelectedSite);
                        } else {
                            setSelectedSite(newValue);
                        }
                    }}
                />
            </div>
            <div className="filter_row">
                <label>Type véhicule :</label>
                {isLoading ? (
                    <Skeleton.Input active={true} />
                ) : (
                    <Select
                        mode="multiple"
                        showSearch
                        value={selectedCat}
                        style={{ width: '100%' }}
                        options={[
                            {
                                value: 'selectAll',
                                label: selectAllCat ? 'Tout désélectionner' : 'Tout sélectionner',
                                },
                                ...cat.map((item) => ({
                                value: item.id_cat_vehicule,
                                label: item.abreviation,
                            }))
                        ]}
                        placeholder="Sélectionnez..."
                        optionFilterProp="label"
                        onChange={(newValue) => {
                            if (newValue.includes('selectAll')) {
                                toggleSelectAll(selectAllCat, setSelectAllCat, cat, setSelectedCat);
                            } else {
                                setSelectedCat(newValue);
                            }
                        }}
                    />
                )}
            </div>

            <div className="filter_row">
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

            {selectedAnnees.length > 0 && (
                <div className="filter_row">
                    <label>Mois :</label>
                    <Collapse defaultActiveKey={selectedAnnees}>
                        {renderMoisParAnnee()}
                    </Collapse>
                </div>
            )}

        </div>
    );
};

export default RapportPeriodeFiltrage;
