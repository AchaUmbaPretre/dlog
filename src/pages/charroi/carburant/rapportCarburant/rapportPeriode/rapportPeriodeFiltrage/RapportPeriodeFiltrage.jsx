import { useEffect, useState } from 'react';
import { Select, Skeleton, Checkbox, Collapse } from 'antd';
import 'antd/dist/reset.css';
import moment from 'moment';
import { getAnneeCarburant, getCarburantVehicule, getMoisCarburant } from '../../../../../../services/carburantService';
import { getCatVehicule, getSite, getTypeCarburant } from '../../../../../../services/charroiService';

const { Panel } = Collapse;

// Sous-composant pour le rendu des mois
const MoisParAnnee = ({ selectedAnnees, moisData, selectedMois, onChange }) =>
    selectedAnnees.map(annee => (
        <Panel header={annee} key={annee}>
            <Checkbox.Group
                options={(moisData[annee] || []).map(item => ({
                    label: moment().month(item.mois - 1).format('MMMM'),
                    value: `${item.mois}-${annee}`,
                }))}
                value={selectedMois[annee] || []}
                onChange={vals => onChange(annee, vals)}
            />
        </Panel>
    ));

const RapportPeriodeFiltrage = ({ onFilter }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        vehicule: [],
        site: [],
        categories: [],
        typeCarb: [],
        annees: [],
        mois: {},
    });
    const [selectAll, setSelectAll] = useState({
        vehicule: false,
        site: false,
        categories: false,
        typeCarb: false,
    });
    const [vehicule, setVehicule] = useState([]);
    const [site, setSite] = useState([]);
    const [categories, setCategories] = useState([]);
    const [typeCarb, setTypeCarb] = useState([]);
    const [annee, setAnnee] = useState([]);
    const [moisData, setMoisData] = useState({});

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [yearData, vehiculeData, siteData, catData, carburantData] = await Promise.all([
                    getAnneeCarburant(),
                    getCarburantVehicule(),
                    getSite(),
                    getCatVehicule(),
                    getTypeCarburant()
                ]);
                setAnnee(yearData.data);
                setVehicule(vehiculeData.data);
                setSite(siteData.data?.data || []);
                setCategories(catData?.data || []);
                setTypeCarb(carburantData?.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch mois par année si non déjà chargé
    const fetchMoisParAnnee = async (annee) => {
        if (moisData[annee]) return;
        try {
            const res = await getMoisCarburant(annee);
            setMoisData(prev => ({ ...prev, [annee]: res.data }));
        } catch (err) {
            console.error("Erreur chargement mois :", err);
        }
    };

    // Handle filter changes
    useEffect(() => {
        const period = { annees: filters.annees, mois: [] };
        filters.annees.forEach(annee => (filters.mois[annee] || []).forEach(m => period.mois.push(m.split('-')[0])));
        onFilter({
            vehicule: filters.vehicule,
            site: filters.site,
            cat: filters.categories,
            type_carb: filters.typeCarb,
            period
        });
    }, [filters, onFilter]);

    // Générique pour tous les Select multiples avec selectAll
    const handleSelectChange = (key, values, dataList) => {
        if (values.includes('selectAll')) {
            const newSelect = !selectAll[key];
            setSelectAll(prev => ({ ...prev, [key]: newSelect }));
            setFilters(prev => ({
                ...prev,
                [key]: newSelect ? dataList.map(item => item.id_enregistrement || item.id_site || item.id_cat_vehicule || item.id_type_carburant) : [],
            }));
        } else {
            setFilters(prev => ({ ...prev, [key]: values }));
        }
    };

    const handleAnneeChange = (years) => {
        setFilters(prev => ({ ...prev, annees: years }));
        years.forEach(fetchMoisParAnnee);
    };

    const handleMoisChange = (annee, vals) => {
        setFilters(prev => ({ ...prev, mois: { ...prev.mois, [annee]: vals } }));
    };

    return (
        <div className="filterTache" style={{ margin: '10px 0' }}>
            <div className="filter_row">
                <label>Véhicule :</label>
                <Select
                    mode="multiple"
                    showSearch
                    value={filters.vehicule}
                    style={{ width: '100%' }}
                    options={[
                        { value: 'selectAll', label: selectAll.vehicule ? 'Tout désélectionner' : 'Tout sélectionner' },
                        ...vehicule.map(v => ({ value: v.id_enregistrement, label: `${v.nom_marque} / ${v.immatriculation}` }))
                    ]}
                    onChange={v => handleSelectChange('vehicule', v, vehicule)}
                />
            </div>

            <div className="filter_row">
                <label>Site :</label>
                <Select
                    mode="multiple"
                    showSearch
                    value={filters.site}
                    style={{ width: '100%' }}
                    options={[
                        { value: 'selectAll', label: selectAll.site ? 'Tout désélectionner' : 'Tout sélectionner' },
                        ...site.map(s => ({ value: s.id_site, label: s.nom_site }))
                    ]}
                    onChange={v => handleSelectChange('site', v, site)}
                />
            </div>

            <div className="filter_row">
                <label>Type carburant :</label>
                {isLoading ? <Skeleton.Input active /> :
                    <Select
                        mode="multiple"
                        showSearch
                        value={filters.typeCarb}
                        style={{ width: '100%' }}
                        options={[
                            { value: 'selectAll', label: selectAll.typeCarb ? 'Tout désélectionner' : 'Tout sélectionner' },
                            ...typeCarb.map(t => ({ value: t.nom_type_carburant, label: t.id_type_carburant }))
                        ]}
                        onChange={v => handleSelectChange('typeCarb', v, typeCarb)}
                    />
                }
            </div>

            <div className="filter_row">
                <label>Type véhicule :</label>
                {isLoading ? <Skeleton.Input active /> :
                    <Select
                        mode="multiple"
                        showSearch
                        value={filters.categories}
                        style={{ width: '100%' }}
                        options={[
                            { value: 'selectAll', label: selectAll.categories ? 'Tout désélectionner' : 'Tout sélectionner' },
                            ...categories.map(c => ({ value: c.id_cat_vehicule, label: c.abreviation }))
                        ]}
                        onChange={v => handleSelectChange('categories', v, categories)}
                    />
                }
            </div>

            <div className="filter_row">
                <label>Année :</label>
                <Checkbox.Group
                    options={annee.map(a => ({ label: a.annee, value: a.annee }))}
                    value={filters.annees}
                    onChange={handleAnneeChange}
                />
            </div>

            {filters.annees.length > 0 && (
                <div className="filter_row">
                    <label>Mois :</label>
                    <Collapse defaultActiveKey={filters.annees}>
                        <MoisParAnnee
                            selectedAnnees={filters.annees}
                            moisData={moisData}
                            selectedMois={filters.mois}
                            onChange={handleMoisChange}
                        />
                    </Collapse>
                </div>
            )}
        </div>
    );
};

export default RapportPeriodeFiltrage;
