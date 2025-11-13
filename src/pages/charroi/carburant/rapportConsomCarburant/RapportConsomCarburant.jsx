import React from 'react'
import { DatePicker, Button, Space, Typography, Tag, Badge, Tooltip } from "antd";
import { CalendarOutlined, BellTwoTone, FileSearchOutlined, ReloadOutlined } from "@ant-design/icons";
import './rapportConsomCarburant.scss';

const { Title, Text } = Typography;

const RapportConsomCarburant = () => {
  return (
    <>
      <div className="rapportConsomCarburant">
        <div className="rapportConsom__container">
          <div className="rapportConsom__title_container">
            <div className="rapportConsom__title_row">
              <div className="rapportConsom__title_top">
                <FileSearchOutlined className="rapport-header__icon" />
                <Title level={3} className="rapport-header__title">
                  Rapport des consommations
                </Title>
              </div>
              <Text type="secondary" className="rapport-header__subtitle">
                Suivi, analyse et performance des consommations
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RapportConsomCarburant