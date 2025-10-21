import React, { useEffect, useState, useCallback } from "react";
import { Row, Spin, message, Empty, Card, Typography } from "antd";
import { CarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import VehicleFilterCard from "./components/VehicleFilterCard";
import SummaryCard from "./components/SummaryCard";
import EventDetailsPanel from "./components/EventDetailsPanel";
import { getEventHistory, getFalcon } from "../../../../services/rapportService";
import config from "../../../../config";
import "./rapportMoniUtilitaire.scss";

const { Text } = Typography;

const RapportMoniUtilitaire = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [vehicleDataMap, setVehicleDataMap] = useState({});
  const [summaryMap, setSummaryMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([dayjs().startOf("day"), dayjs().endOf("day")]);
  const apiHash = config.api_hash;

  // Charger la liste des véhicules
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await getFalcon();
        setVehicles(data?.[0]?.items || []);
      } catch {
        message.error("Erreur lors du chargement des véhicules.");
      }
    };
    fetchVehicles();
  }, []);

  // Fonction de résumé
  const summarizeEvents = (events) => {
    const distance = events.reduce((sum, e) => sum + (e.distance || 0), 0);
    const top_speed = events.length ? Math.max(...events.map((e) => e.top_speed || 0)) : 0;
    const avg_speed = events.length
      ? Math.round(events.reduce((sum, e) => sum + (e.average_speed || 0), 0) / events.length)
      : 0;
    const engine_duration = events.reduce((sum, e) => sum + (e.engine_work || 0), 0);
    const stops = events.length;
    return { distance, top_speed, avg_speed, engine_duration, stops };
  };

  const fetchForDevice = async (deviceId, from, to) => {
    const { data } = await getEventHistory({
      device_id: deviceId,
      from_date: from.split(" ")[0],
      from_time: from.split(" ")[1],
      to_date: to.split(" ")[0],
      to_time: to.split(" ")[1],
      lang: "fr",
      limit: 1000,
      user_api_hash: apiHash,
    });
    return data?.items || [];
  };

  const fetchDataForSelected = useCallback(
    async (deviceIds, from, to) => {
      if (!deviceIds || deviceIds.length === 0) {
        setVehicleDataMap({});
        setSummaryMap({});
        return;
      }

      setLoading(true);
      try {
        const promises = deviceIds.map((id) =>
          fetchForDevice(id, from, to).then((items) => ({ id, items }))
        );
        const results = await Promise.all(promises);

        const dataMap = {};
        const sumsMap = {};
        results.forEach(({ id, items }) => {
          dataMap[id] = items;
          const moving = items.filter((e) => e.engine_work > 0);
          const stopped = items.filter((e) => e.engine_work === 0);
          sumsMap[id] = {
            moving: summarizeEvents(moving),
            stopped: summarizeEvents(stopped),
          };
        });

        setVehicleDataMap(dataMap);
        setSummaryMap(sumsMap);
      } catch {
        message.error("Erreur lors du chargement des historiques.");
      } finally {
        setLoading(false);
      }
    },
    [apiHash]
  );

  useEffect(() => {
    const from = dateRange[0].format("YYYY-MM-DD HH:mm:ss");
    const to = dateRange[1].format("YYYY-MM-DD HH:mm:ss");
    fetchDataForSelected(selectedDevices, from, to);
  }, [selectedDevices, dateRange, fetchDataForSelected]);

  const handleDateChange = (values) => {
    if (!values || values.length !== 2) {
      setDateRange([dayjs().startOf("day"), dayjs().endOf("day")]);
      return;
    }
    setDateRange(values);
  };

  const quickFilter = (type) => {
    const now = dayjs();
    let from, to;
    switch (type) {
      case "lastHour":
        from = now.subtract(1, "hour");
        to = now;
        break;
      case "today":
        from = now.startOf("day");
        to = now.endOf("day");
        break;
      case "yesterday":
        from = now.subtract(1, "day").startOf("day");
        to = now.subtract(1, "day").endOf("day");
        break;
      case "thisWeek":
        from = now.startOf("week");
        to = now;
        break;
      case "thisMonth":
        from = now.startOf("month");
        to = now.endOf("month");
        break;
      default:
        return;
    }
    setDateRange([from, to]);
  };

  return (
    <div className="rapport-event-history" style={{ padding: 20 }}>
      <VehicleFilterCard
        vehicles={vehicles}
        selectedDevices={selectedDevices}
        setSelectedDevices={setSelectedDevices}
        quickFilter={quickFilter}
        dateRange={dateRange}
        handleDateChange={handleDateChange}
        loading={loading}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : selectedDevices.length === 0 ? (
        <Card
          style={{
            textAlign: "center",
            padding: 40,
            marginTop: 30,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <CarOutlined style={{ fontSize: 25, color: "#1677ff", marginBottom: 16 }} />
          <Text type="secondary" style={{ fontSize: 16 }}>
            Aucun véhicule sélectionné
          </Text>
          <br />
          <Text type="secondary">
            Veuillez choisir un ou plusieurs véhicules pour afficher leurs détails.
          </Text>
        </Card>
      ) : (
        <>
          <Row gutter={24}>
            {selectedDevices.map((deviceId) => {
              const summaryForDevice =
                summaryMap[deviceId] || {
                  moving: { distance: 0, top_speed: 0, avg_speed: 0, engine_duration: 0, stops: 0 },
                  stopped: { distance: 0, top_speed: 0, avg_speed: 0, engine_duration: 0, stops: 0 },
                };

              return (
                <React.Fragment key={deviceId}>
                  <Row style={{ width: "100%", marginBottom: 8 }}>
                    <h3 style={{ margin: "8px 0", color: "#1677ff" }}>
                      {vehicles.find((v) => v.id === deviceId)?.name || `Véhicule ${deviceId}`}
                    </h3>
                  </Row>
                  <SummaryCard type="moving" data={summaryForDevice.moving} />
                  <SummaryCard type="stopped" data={summaryForDevice.stopped} />
                </React.Fragment>
              );
            })}
          </Row>

          {selectedDevices.map((deviceId) => (
            <div key={`details-${deviceId}`} style={{ marginTop: 12 }}>
              <h4 style={{ marginBottom: 8, color: "#595959" }}>
                {vehicles.find((v) => v.id === deviceId)?.name || `Véhicule ${deviceId}`} — Détails
              </h4>
              <EventDetailsPanel vehicleData={vehicleDataMap[deviceId] || []} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default RapportMoniUtilitaire;
