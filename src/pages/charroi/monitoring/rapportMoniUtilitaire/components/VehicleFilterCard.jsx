// components/VehicleFilterCard.jsx
import React from "react";
import { Card, Button, Space, Select, DatePicker, Typography, Col, Tooltip } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  ScheduleOutlined,
  BorderlessTableOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;

const VehicleFilterCard = ({
  vehicles,
  selectedDevices,
  setSelectedDevices,
  quickFilter,
  dateRange,
  handleDateChange,
  loading,
}) => (
  <Card
    bordered={false}
    style={{
      marginBottom: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      borderRadius: 12,
      padding: 10,
    }}
  >
    <Title level={4} style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
      <CalendarOutlined style={{ color: "#1677ff", marginRight: 10, fontSize: 20 }} />
      Filtres rapides
    </Title>

    <Space wrap size={[12, 12]}>
      <Col>
        <Select
          mode="multiple"
          showSearch
          style={{ width: 250 }}
          value={selectedDevices}
          onChange={setSelectedDevices}
          placeholder="Sélectionnez un ou plusieurs véhicules"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          allowClear
          disabled={loading}
        >
          {vehicles.map((v) => (
            <Option key={v.id} value={v.id}>
              {v.name}
            </Option>
          ))}
        </Select>
      </Col>

      {/* Boutons colorés avec icônes */}
      <Tooltip title="Voir la dernière heure">
        <Button
          onClick={() => quickFilter("lastHour")}
          icon={<ClockCircleOutlined style={{ color: "#faad14" }} />}
          disabled={loading}
        >
          Dernière heure
        </Button>
      </Tooltip>

      <Tooltip title="Voir les événements d’aujourd’hui">
        <Button
          onClick={() => quickFilter("today")}
          icon={<FieldTimeOutlined style={{ color: "#52c41a" }} />}
          disabled={loading}
        >
          Aujourd’hui
        </Button>
      </Tooltip>

      <Tooltip title="Voir les événements d’hier">
        <Button
          onClick={() => quickFilter("yesterday")}
          icon={<ScheduleOutlined style={{ color: "#1890ff" }} />}
          disabled={loading}
        >
          Hier
        </Button>
      </Tooltip>

      <Tooltip title="Voir les événements de cette semaine">
        <Button
          onClick={() => quickFilter("thisWeek")}
          icon={<BorderlessTableOutlined style={{ color: "#722ed1" }} />}
          disabled={loading}
        >
          Cette semaine
        </Button>
      </Tooltip>

      <Tooltip title="Voir les événements de ce mois">
        <Button
          onClick={() => quickFilter("thisMonth")}
          icon={<CalendarOutlined style={{ color: "#eb2f96" }} />}
          disabled={loading}
        >
          Ce mois
        </Button>
      </Tooltip>

      {/* Sélecteur de date */}
      <RangePicker
        showTime
        value={dateRange}
        onChange={handleDateChange}
        format="YYYY-MM-DD HH:mm:ss"
        disabled={loading}
        style={{ borderRadius: 8 }}
      />
    </Space>
  </Card>
);

export default VehicleFilterCard;
