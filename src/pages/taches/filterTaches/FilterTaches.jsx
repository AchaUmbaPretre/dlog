import React, { useEffect, useState } from 'react';
import { Select, DatePicker, Input, Button, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // Assure-toi que le CSS d'Ant Design est bien importé
import './filterTaches.scss'
import { getDepartement } from '../../../services/departementService';
import { getUser } from '../../../services/userService';
import { getClient } from '../../../services/clientService';
const { Option } = Select;
const { RangePicker } = DatePicker;


const FilterTaches = ({ onFilter }) => {
  const [departement, setDepartement] = useState('');
  const [client, setClient] = useState([]);
  const [frequence, setFrequence] = useState([]);
  const [statut, setStatut] = useState('');
  const [priorite, setPriorite] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [owners, setOwners] = useState([]);


  const handleFilter = () => {
    onFilter({
      departement,
      client,
      statut,
      priorite,
      dateRange,
      owners
    });
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [departementData, usersData, clientData] = await Promise.all([
                getDepartement(),
                getUser(),
                getClient(),
            ]);

            setDepartement(departementData.data);
            setOwners(usersData.data);
            setClient(clientData.data);

        } catch (error) {
            console.log(error)
        }
    };

    fetchData();
}, []);

  return (
    <div className='filterTache'>
      <div className='filter_row'>
        <label>Département:</label>
        <Select
          style={{ width: '100%' }}
          value={departement}
          onChange={value => setDepartement(value)}
        >
          <Option value="">Tous</Option>
          <Option value="dept1">Département 1</Option>
          <Option value="dept2">Département 2</Option>
        </Select>
      </div>
      <div className='filter_row'>
        <label>Clients:</label>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          value={client}
          onChange={value => setClient(value)}
        >
          <Option value="client1">Client 1</Option>
          <Option value="client2">Client 2</Option>
        </Select>
      </div>
      <div className='filter_row'>
        <label>Statut:</label>
        <Select
          style={{ width: '100%' }}
          value={statut}
          onChange={value => setStatut(value)}
        >
          <Option value="">Tous</Option>
          <Option value="en_cours">En Cours</Option>
          <Option value="termine">Terminé</Option>
        </Select>
      </div>
      <div className='filter_row'>
        <label>Priorité:</label>
        <Select
          style={{ width: '100%' }}
          value={priorite}
          onChange={value => setPriorite(value)}
        >
          <Option value="">Toutes</Option>
          <Option value="haute">Haute</Option>
          <Option value="moyenne">Moyenne</Option>
          <Option value="basse">Basse</Option>
        </Select>
      </div>
      <div className='filter_row'>
        <label>Date de début:</label>
        <RangePicker
          style={{ width: '100%' }}
          value={dateRange}
          onChange={dates => setDateRange(dates)}
        />
      </div>
      <div className='filter_row'>
        <label>Owner:</label>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          value={owners}
          onChange={value => setOwners(value)}
        >
          <Option value="owner1">Propriétaire 1</Option>
          <Option value="owner2">Propriétaire 2</Option>
          {/* Ajoute d'autres propriétaires selon tes besoins */}
        </Select>
      </div>
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleFilter}
      >
        Filtrer
      </Button>
    </div>
  );
};

export default FilterTaches;
