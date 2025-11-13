import React, { useState } from 'react'
import { DatePicker, Button, Space, Select, Typography, Tag, Badge, Tooltip } from "antd";
import { CalendarOutlined, BellTwoTone, FileSearchOutlined, ReloadOutlined } from "@ant-design/icons";
import './rapportConsomCarburant.scss';

const { Title, Text } = Typography;

const RapportConsomCarburant = () => {
  const [spectre, setSpectre] = useState([ 
    {
      name :'Mes sites',
      value: 'MeSsites'
    },
    {
      name :'Siège Kin',
      value: 'siegeKin'
    }])

  const [parData, setparData] = useState([ 
    {
      name :'Sites',
      value: 'sites'
    },
    {
      name :'Véhicule',
      value: 'vehicule'
  }])

  const [periodeData, setperiodeData] = useState([ 
    {
      name :'7 jours',
      value: '7jours'
    },
    {
      name :'30 jours',
      value: '30jours'
    },
    {
      name :'90 jours',
      value: '90jours'
    },
    {
      name :'180 jours',
      value: '180jours'
    },
    {
      name :'360 jours',
      value: '360jours'
    }
  ])

  return (
    <>
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
                  <label>Spectre</label>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      options={spectre.map((i)=> (
                        {
                        value: i.value,
                        label: i.name
                        }
                      ))}
                      placeholder="Sélectionnez..."
                      optionFilterProp="label"
                      onChange={setSpectre}
                    />
                </div>

                <div className="rapportConsom__bottom_row">
                  <label>Par site ou véhicule</label>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      options={parData.map((i)=> (
                        {
                        value: i.value,
                        label: i.name
                        }
                      ))}
                      placeholder="Sélectionnez..."
                      optionFilterProp="label"
                      onChange={setparData}
                    />
                </div>

                <div className="rapportConsom__bottom_row">
                  <label>Période</label>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      options={periodeData.map((i)=> (
                        {
                        value: i.value,
                        label: i.name
                        }
                      ))}
                      placeholder="Sélectionnez..."
                      optionFilterProp="label"
                      onChange={setperiodeData}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RapportConsomCarburant