import React, { useState } from 'react';
import { DatePicker, Button, Space, Select, Typography } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import './rapportConsomCarburant.scss';

const { Title, Text } = Typography;

const RapportConsomCarburant = () => {
  // Options
  const spectreOptions = [ 
    { name: 'Mes sites', value: 'mesSites' },
    { name: 'Siège Kin', value: 'siegeKin' }
  ];

  const parOptions = [ 
    { name: 'Sites', value: 'sites' },
    { name: 'Véhicule', value: 'vehicule' }
  ];

  const periodeOptions = [ 
    { name: '7 jours', value: '7jours' },
    { name: '30 jours', value: '30jours' },
    { name: '90 jours', value: '90jours' },
    { name: '180 jours', value: '180jours' },
    { name: '360 jours', value: '360jours' }
  ];

  // Valeurs sélectionnées
  const [spectreValue, setSpectreValue] = useState(null);
  const [parValue, setParValue] = useState(null);
  const [periodeValue, setPeriodeValue] = useState(null);

  return (
    <div className="rapportConsomCarburant">
      <div className="rapportConsom__container">
        <div className="rapportConsom__title_container">
          <div className="rapportConsom__title_row">
            <div className="rapportConsom__title_top">
              <div className="rapportConsom__title_top_row">
                <FileSearchOutlined className="rapport-header__icon" />
                <Title level={3} className="rapport-header__title">
                  Rapport des consommations
                </Title>
              </div>
              <Text type="secondary" className="rapport-header__subtitle">
                Suivi, analyse et performance des consommations
              </Text>
            </div>

            <div className="rapportConsom__bottom">
              <div className="rapportConsom__bottom__row">
                <label className='rapportConsom_label'>Spectre</label>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  options={spectreOptions.map(i => ({ value: i.value, label: i.name }))}
                  placeholder="Sélectionnez..."
                  optionFilterProp="label"
                  value={spectreValue}
                  onChange={setSpectreValue}
                />
              </div>

              <div className="rapportConsom__bottom__row">
                <label className='rapportConsom_label'>Par site ou véhicule</label>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  options={parOptions.map(i => ({ value: i.value, label: i.name }))}
                  placeholder="Sélectionnez..."
                  optionFilterProp="label"
                  value={parValue}
                  onChange={setParValue}
                />
              </div>

              <div className="rapportConsom__bottom__row">
                <label className='rapportConsom_label'>Période</label>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  options={periodeOptions.map(i => ({ value: i.value, label: i.name }))}
                  placeholder="Sélectionnez..."
                  optionFilterProp="label"
                  value={periodeValue}
                  onChange={setPeriodeValue}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapportConsomCarburant;
