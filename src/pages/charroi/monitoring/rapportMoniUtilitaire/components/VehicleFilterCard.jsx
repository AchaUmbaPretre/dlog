// components/VehicleFilterCard.jsx
import React from "react";
import { Card, Button, Space, Select, DatePicker, Typography, Col } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;

const VehicleFilterCard = ({ vehicles, selectedDevices, setSelectedDevices, quickFilter, dateRange, handleDateChange, loading }) => (
  <Card bordered={false} style={{ marginBottom: 20 }}>
    <Title level={4}>
      <CalendarOutlined style={{ color: "#1677ff", marginRight: 8 }} />
      Filtres rapides
    </Title>

    <Space wrap>
      <Col>
        <Select
          mode="multiple"
          showSearch
          style={{ width: 350 }}
          value={selectedDevices}
          onChange={setSelectedDevices}
          placeholder="Sélectionnez un ou plusieurs véhicules"
          optionFilterProp="children"
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          allowClear
          disabled={loading}
        >
          {vehicles.map((v) => (
            <Option key={v.id} value={v.id}>{v.name}</Option>
          ))}
        </Select>
      </Col>

      <Button onClick={() => quickFilter("lastHour")} icon={<ClockCircleOutlined />} disabled={loading}>
        Dernière heure
      </Button>
      <Button onClick={() => quickFilter("today")} icon={<CalendarOutlined />} disabled={loading}>
        Aujourd’hui
      </Button>
      <Button onClick={() => quickFilter("yesterday")} icon={<CalendarOutlined />} disabled={loading}>
        Hier
      </Button>
      <Button onClick={() => quickFilter("thisWeek")} icon={<CalendarOutlined />} disabled={loading}>
        Cette semaine
      </Button>
      <Button onClick={() => quickFilter("thisMonth")} icon={<CalendarOutlined />} disabled={loading}>
        Ce mois
      </Button>

      <RangePicker
        showTime
        value={dateRange}
        onChange={handleDateChange}
        format="YYYY-MM-DD HH:mm:ss"
        disabled={loading}
      />
    </Space>
  </Card>
);

export default VehicleFilterCard;
