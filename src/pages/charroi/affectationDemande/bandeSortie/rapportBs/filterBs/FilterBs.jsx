import { useEffect, useState } from 'react'
import { Select, DatePicker } from 'antd';
import { getDestination, getServiceDemandeur, getVehicule } from '../../../../../../services/charroiService';
import './filterBs.scss'

const { RangePicker } = DatePicker;

const FilterBs = ({ onFilter }) => {
    const [selectedVehicule, setSelectedVehicule] = useState([]);
    const [selectedService, setSelectedService] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState([]);
    const [vehicule, setVehicule] = useState([]);
    const [service, setService] = useState([]);
    const [destination, setDestination] = useState([]);
    const [dateRange, setDateRange] = useState([]);


        const fetchData = async() => {
            try {
                const [serviceData, vehiculeData, destinationData ] = await Promise.all([
                    getServiceDemandeur(),
                    getVehicule(),
                    getDestination()
                ]);
                    setService(serviceData.data);
                    setVehicule(vehiculeData.data.data);
                    setDestination(destinationData.data)
                } catch (error) {
                    console.error(error);
                }
            }
        useEffect(() => {
            fetchData()
        }, []);

        useEffect(() => {
            const handleFilter = async () => {
                onFilter({
                    service : selectedDestination,
                    destination : selectedDestination,
                    vehicule : selectedVehicule
                });
            };
            handleFilter();
        },[selectedService, selectedDestination, selectedVehicule])

  return (
    <>
        <div className="filterBs">
            <div className="filter_card">
                <label>Service :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={service.map((item) => ({
                        value: item.id_service_demandeur,
                        label: item.nom_service,
                    }))}
                    placeholder="Sélectionnez ..."
                    optionFilterProp="label"
                    onChange={setSelectedService}
                />
            </div>

             <div className="filter_card">
                <label>Service :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={service.map((item) => ({
                        value: item.id_service_demandeur,
                        label: item.nom_service,
                    }))}
                    placeholder="Sélectionnez ..."
                    optionFilterProp="label"
                    onChange={setSelectedService}
                />
            </div>

             <div className="filter_card">
                <label>Véhicule :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={vehicule.map((item) => ({
                        value: item.id_vehicule,
                        label: item.immatriculation,
                    }))}
                    placeholder="Sélectionnez ..."
                    optionFilterProp="label"
                    onChange={setSelectedVehicule}
                />
             </div>

             <div className="filter_card">
                <label>Destination :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={destination.map((item) => ({
                        value: item.id_destination ,
                        label: item.nom_destination,
                    }))}
                    placeholder="Sélectionnez ..."
                    optionFilterProp="label"
                    onChange={setSelectedVehicule}
                />
             </div>

             <div className="filter_card">
                <label>Date : </label>
                <RangePicker
                    style={{ width: '100%' }}
                    value={dateRange}
                    onChange={setDateRange}
                />
             </div>
        </div>
    </>
  )
}

export default FilterBs