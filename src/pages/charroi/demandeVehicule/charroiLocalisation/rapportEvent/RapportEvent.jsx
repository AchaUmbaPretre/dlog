import React, { useEffect, useState, useRef } from 'react';
import { getEventRow } from '../../../../../services/eventService';
import { Table, Space, Typography, Spin, Button, Timeline, Divider, notification, DatePicker } from 'antd';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import html2pdf from 'html2pdf.js';
import HtmlDocx from 'html-docx-js/dist/html-docx';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import 'leaflet/dist/leaflet.css';
import './rapportEvent.scss';
import moment from 'moment';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const iconOnline = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
  iconSize: [25, 25],
});

const RapportEvent = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);
  const reportRef = useRef();

  const fetchData = async (range) => {
    setLoading(true);
    try {
      const params = {
        startDate: range[0].format('YYYY-MM-DD HH:mm:ss'),
        endDate: range[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      const { data } = await getEventRow(params);
      setReportData(data);
    } catch (error) {
      console.error(error);
      notification.error({ message: 'Erreur', description: 'Impossible de récupérer les rapports' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange]);

  const handleRangeChange = (dates) => {
    if (!dates) return;
    setDateRange(dates);
  };

  const exportPDF = () => {
    if (!reportRef.current) return;
    html2pdf().from(reportRef.current).set({ margin: 10, filename: 'rapport.pdf' }).save();
  };

  const exportWord = () => {
    if (!reportRef.current) return;
    const content = HtmlDocx.asBlob(reportRef.current.innerHTML);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'rapport.docx';
    link.click();
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      reportData.map(r => ({
        Véhicule: r.vehicle,
        Allumages: r.ignitionCount,
        'Dépassements vitesse': r.overspeedCount,
        Déconnexions: r.disconnects.map(d => `${d.durationMinutes} min`).join(', '),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapport');
    XLSX.writeFile(workbook, 'rapport.xlsx');
  };

  return (
    <div className="rapport-event-dashboard">
      {/* Filtre par date */}
      <Space style={{ marginBottom: 20 }}>
        <RangePicker
          value={dateRange}
          onChange={handleRangeChange}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
        />
        <Button type="primary" onClick={() => fetchData(dateRange)}>Rafraîchir</Button>
      </Space>

      {/* Exports */}
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={exportPDF}>Exporter PDF</Button>
        <Button type="default" onClick={exportWord}>Exporter Word</Button>
        <Button type="dashed" onClick={exportExcel}>Exporter Excel</Button>
        <CSVLink
          data={reportData.map(r => ({
            Véhicule: r.vehicle,
            Allumages: r.ignitionCount,
            'Dépassements vitesse': r.overspeedCount,
            Déconnexions: r.disconnects.map(d => `${d.durationMinutes} min`).join(', '),
          }))}
          filename="rapport.csv"
        >
          <Button>Exporter CSV</Button>
        </CSVLink>
      </Space>

      <div ref={reportRef}>
        {loading ? (
          <Spin tip="Chargement des rapports..." size="large" style={{ marginTop: 100 }} />
        ) : (
          reportData.map(vehicle => (
            <div key={vehicle.vehicle} className="vehicle-report">
              <Text strong style={{ fontSize: 18 }}>{vehicle.vehicle}</Text>
              <Text style={{ display: 'block', marginBottom: 10 }}>{vehicle.summary}</Text>

              {/* Timeline */}
              <Timeline mode="left">
                {vehicle.details.map((e, idx) => (
                  <Timeline.Item
                    key={idx}
                    color={
                      e.type === 'ignition_on' ? 'green' :
                      e.type === 'overspeed' ? 'orange' : 'red'
                    }
                  >
                    {moment(e.time).format('DD-MM-YYYY HH:mm:ss')} | {e.type} | lat:{e.latitude}, lon:{e.longitude}
                  </Timeline.Item>
                ))}
              </Timeline>

              {/* Mini Carte */}
              {vehicle.details.length > 0 && (
                <MapContainer
                  center={[vehicle.details[0].latitude, vehicle.details[0].longitude]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: '250px', width: '100%', marginTop: 20 }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {vehicle.details.map((e, idx) => (
                    <Marker
                      key={idx}
                      position={[e.latitude, e.longitude]}
                      icon={iconOnline}
                    >
                      <Popup>
                        {moment(e.time).format('HH:mm:ss')} | {e.type}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}

              <Divider />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RapportEvent;
