import React, { useEffect, useState } from 'react';
import { Select, Typography, Divider } from "antd";
import { FileSearchOutlined, AppstoreOutlined, CarOutlined, CalendarOutlined } from "@ant-design/icons";
import './rapportConsomCarburant.scss';
import { parOptions, periodeOptions, spectreOptions } from '../../../../utils/periodeData';
import ConsomInfoGen from './consomInfoGen/ConsomInfoGen';
import ConsomCarburantDetail from './consomCarburantDetail/ConsomCarburantDetail';
import ConsomCarburantChart from './consomCarburantChart/ConsomCarburantChart';
import { getRapportConsomGen } from '../../../../services/carburantService';

const { Title, Text } = Typography;

const RapportConsomCarburant = () => {
  const [spectreValue, setSpectreValue] = useState(null);
  const [parValue, setParValue] = useState(null);
  const [periodeValue, setPeriodeValue] = useState(null);
  const [siteData, setSiteData] = useState([]);
  const [siegeData, setSiegeData] = useState([]);
  const [siegeTypeData, setSiegeTypeData] = useState([]);
  const [siteAllData, setSiteAllData] = useState([]);
  const [consomMonth, setConsomMonth] = useState([]);
  const [consomYear, setConsomYear] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getRapportConsomGen(periodeValue);
      setSiteData(response.data?.sqlMesSites);
      setSiegeData(response?.data?.sqlDetailSiegeKin);
      setSiteAllData(response?.data?.sqlSitesAll);
      setSiegeTypeData(response?.data?.sqlSiegeKinTypeCarburant);
      setConsomMonth(response?.data?.sqlConsomTypeCarburant);
      setConsomYear(response?.data?.sqlConsomYearTypeCarburant)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [periodeValue]);


  return (
    <div className="rapportConsomCarburant">
      <div className="rapportConsom__container">
        <div className="rapportConsom__title_container">
          <div className="rapportConsom__title_row">
            <div className="rapportConsom__title_top">
              <div className="rapportConsom__title_top_row">
                <FileSearchOutlined className="rapport-header__icon" />
                <Title level={3} className="rapport-header__title">
                  RAPPORT DES CONSOMMATIONS
                </Title>
              </div>
              <Text type="secondary" className="rapport-header__subtitle">
                Suivi, analyse et performance des consommations
              </Text>
            </div>

            <Divider />

            <div className="rapportConsom__bottom">

              <div className="rapportConsom__bottom__row">
                <div className='rapportConsom_label'>
                  <AppstoreOutlined style={{ marginRight: 6, color: '#1677ff' }} />
                  Spectre
                </div>
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
                <div className='rapportConsom_label'>
                  <CarOutlined style={{ marginRight: 6, color: '#1677ff' }} />
                  Par site ou véhicule
                </div>
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
                <div className='rapportConsom_label'>
                  <CalendarOutlined style={{ marginRight: 6, color: '#1677ff' }} />
                  Période
                </div>
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

          <div className="rapportConsom__info">
            <ConsomInfoGen siteData={siteData} siegeData={siegeTypeData} parValue={parValue} loading={loading} />
          </div>

          <div className="rapportConsom__info">
            <ConsomCarburantDetail spectreValue={spectreValue} siteAllData={siteAllData} siegeData={siegeData} loading={loading} />
          </div>

          <div className="rapportConsom__info">
            <ConsomCarburantChart consomMonth={consomMonth} consomYear={consomYear} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapportConsomCarburant;
