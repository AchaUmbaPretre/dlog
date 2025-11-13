import React, { useState } from 'react';
import { DatePicker, Button, Divider, Select, Typography } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import './rapportConsomCarburant.scss';
import { parOptions, periodeOptions, spectreOptions } from '../../../../utils/periodeData';

const { Title, Text } = Typography;

const RapportConsomCarburant = () => {
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
            <Divider />
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
