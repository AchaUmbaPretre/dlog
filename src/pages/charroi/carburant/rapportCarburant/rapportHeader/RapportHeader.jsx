import { useState } from "react";
import { DatePicker, Button, Space, Typography, Tag, Badge, Tooltip } from "antd";
import { CalendarOutlined, BellTwoTone, FileSearchOutlined, ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import "./rapportHeader.scss";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const RapportHeader = ({ onPeriodChange, alertCount = 0 }) => {
  const today = moment();
  const [dates, setDates] = useState([today.clone().startOf("month"), today]);

  const handleChange = (dates) => setDates(dates);

  const handleGenerate = () => {
    if (dates?.length === 2 && onPeriodChange) {
      onPeriodChange([
        dates[0].format("YYYY-MM-DD"),
        dates[1].format("YYYY-MM-DD"),
      ]);
    }
  };

  return (
    <header className="rapport-header">
      <div className="rapport-header__content">
        <div className="rapport-header__title-section">
            <div>
                <div style={{display:"flex", alignItems:'center', gap:'10px'}}>
                    <FileSearchOutlined className="rapport-header__icon" />
                    <Title level={3} className="rapport-header__title">
                        RAPPORT GENERAL DU CARBURANT
                    </Title>
                </div>
            </div>

          {alertCount > 0 && (
            <Tooltip title={`${alertCount} alerte(s) détectée(s)`}>
              <Badge count={alertCount} offset={[6, 0]} color="#ff4d4f">
                <BellTwoTone className="rapport-header__alert-icon" />
              </Badge>
            </Tooltip>
          )}
        </div>

        <Space size="small" className="rapport-header__actions">
          <Space size="middle">
            <RangePicker
              format="YYYY-MM-DD"
              value={dates}
              onChange={handleChange}
              allowClear
              className="rapport-header__range"
              suffixIcon={<CalendarOutlined />}
            />
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleGenerate}
            >
              Générer
            </Button>
          </Space>

          {dates.length === 2 && (
            <Text className="rapport-header__period">
              Période :{" "}
              <Tag color="blue">
                {dates[0].format("YYYY-MM-DD")} → {dates[1].format("YYYY-MM-DD")}
              </Tag>
            </Text>
          )}
        </Space>
      </div>
    </header>
  );
};

export default RapportHeader;
