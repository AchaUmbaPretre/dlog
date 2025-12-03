import { useEffect, useState } from 'react';
import { Select, DatePicker, Skeleton } from 'antd';
import 'antd/dist/reset.css';
import { getCarburantVehicule } from '../../../../services/carburantService';
const { RangePicker } = DatePicker;

const CarburantFilter = ({ onFilter }) => {
  const [vehicule, setVehicule] = useState([]);
  const [selectedVehicule, setSelectedVehicule] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vehiculeData] = await Promise.all([getCarburantVehicule()]);
        setVehicule(vehiculeData?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    onFilter({
      vehicules: selectedVehicule,
      dateRange,
    });
  }, [selectedVehicule, vehicule]);

  return (
    <div className="filterTache">

      {/* --- Champ Véhicule --- */}
      <div className="filter_row">
        <label>Véhicule :</label>

        {loading ? (
          <Skeleton.Input
            active
            style={{ width: "100%", height: 40, borderRadius: 6 }}
          />
        ) : (
          <Select
            mode="multiple"
            showSearch
            style={{ width: '100%' }}
            options={vehicule?.map((item) => ({
              value: item.id_vehicule_carburant,
              label: `${item.nom_marque} / ${item.immatriculation}`,
            }))}
            placeholder="Sélectionnez ..."
            optionFilterProp="label"
            onChange={setSelectedVehicule}
          />
        )}
      </div>

      {/* --- Champ Date --- */}
      <div className="filter_row">
        <label>Date :</label>

        {loading ? (
          <Skeleton.Input
            active
            style={{ width: "100%", height: 40, borderRadius: 6 }}
          />
        ) : (
          <RangePicker
            style={{ width: '100%' }}
            value={dateRange}
            onChange={setDateRange}
          />
        )}
      </div>

    </div>
  );
};

export default CarburantFilter;