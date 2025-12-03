import { useEffect, useMemo, useState } from "react";
import { Select, DatePicker, Skeleton, notification } from "antd";
import { getCarburantVehicule } from "../../../../services/carburantService";

const { RangePicker } = DatePicker;

const CarburantFilter = ({ onFilter }) => {
  const [vehicule, setVehicule] = useState([]);
  const [selectedVehicule, setSelectedVehicule] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicules = async () => {
      setLoading(true);
      try {
        const res = await getCarburantVehicule();
        setVehicule(res?.data || []);
      } catch (err) {
        notification.error({
          message: "Erreur lors du chargement",
          description: err?.response?.data?.message || "Impossible de charger les véhicules.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicules();
  }, []);

  const vehiculeOptions = useMemo(
    () =>
      vehicule.map((item) => ({
        value: item.id_vehicule_carburant,
        label: `${item.nom_marque} / ${item.immatriculation}`,
      })),
    [vehicule]
  );

  useEffect(() => {
    onFilter({
      vehicules: selectedVehicule,
      dateRange,
    });
  }, [selectedVehicule, dateRange]);

  return (
    <div className="filterTache" style={{marginBottom:'20px'}}>

      <div className="filter_row">
        <label>Véhicule :</label>

        {loading ? (
          <Skeleton.Input active style={{ width: "100%", height: 40 }} />
        ) : (
          <Select
            mode="multiple"
            showSearch
            style={{ width: "100%" }}
            options={vehiculeOptions}
            placeholder="Sélectionnez..."
            onChange={setSelectedVehicule}
          />
        )}
      </div>

      <div className="filter_row">
        <label>Date :</label>

        {loading ? (
          <Skeleton.Input active style={{ width: "100%", height: 40 }} />
        ) : (
          <RangePicker
            style={{ width: "100%" }}
            onChange={setDateRange}
          />
        )}
      </div>

    </div>
  );
};

export default CarburantFilter;
