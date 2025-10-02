import './getEventLocalisation.scss';
import { useEffect, useState, useMemo, useRef } from 'react';
import { DatePicker, Table, Tooltip, Modal, Tag, Space, message, Select, Button } from 'antd';
import { CarOutlined, ClockCircleOutlined, EnvironmentOutlined, EyeOutlined, PoweroffOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import config from '../../../../../config';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { VehicleAddress } from '../../../../../utils/vehicleAddress';
import GetHistory from '../getHistory/GetHistory';
import { getEvent } from '../../../../../services/rapportService';

const { RangePicker } = DatePicker;
const { Option } = Select;

const REFRESH_INTERVAL_MS = 30 * 1000; // 30 secondes

const GetEventLocalisation = () => {
  const [dateRange, setDateRange] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const tableRef = useRef();
  const [modalType, setModalType] = useState(null);
  const [idDevice, setIdDevice] = useState('');
  const [showPosition, setShowPosition] = useState(false);

  const apiHash = config.api_hash;

  // 🔹 Récupération des événements depuis le backend
  const fetchData = async (from, to) => {
    try {
      setLoading(true);
      const { data } = await getEvent({
        date_from: from,
        date_to: to,
        lang: "fr",
        limit: 1000,
        user_api_hash: apiHash,
      });

      if (data?.length) {
        setEvents(data);
        setFilteredEvents(data);
      } else {
        setEvents([]);
        setFilteredEvents([]);
      }
    } catch (error) {
      console.error("Erreur lors du fetch:", error);
      message.error("Erreur lors du chargement des événements.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Au chargement initial, afficher les événements du jour
  useEffect(() => {
    const startOfDay = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfDay = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    setDateRange([dayjs().startOf('day'), dayjs().endOf('day')]);
    fetchData(startOfDay, endOfDay);

    // 🔄 Intervalle pour le temps réel
    const interval = setInterval(() => {
      fetchData(startOfDay, endOfDay);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // 🔹 Ouverture et fermeture des modals
  const openModal = (type, id = '') => {
    setModalType(type);
    setIdDevice(id);
  };
  const closeAllModals = () => setModalType(null);

  const handleDetail = (id) => openModal('device', id);

  // 🔹 Colonnes du tableau
  const columns = [
    {
      title: 'Date & Heure',
      dataIndex: 'time',
      key: 'time',
      render: (text) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#1890ff' }} />
          {dayjs(text, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')}
        </Space>
      ),
    },
    {
    title: 'Véhicule',
    dataIndex: 'device_name',
    key: 'device_name',
    render: (text, record) => {
        const color = record.type === 'ignition_on' ? 'green' : 'red';
        return (
        <Space>
            <CarOutlined style={{ color }} />
            <span style={{ fontWeight: 500, color }}>{text}</span>
        </Space>
        );
    },
    },
    {
      title: 'Événement',
      dataIndex: 'message',
      key: 'message',
      render: (text, record) => {
        const color = record.type === 'ignition_on' ? 'green' : 'red';
        return (
          <Tag color={color} style={{ fontSize: 14, padding: '4px 10px' }}>
            {text}
          </Tag>
        );
      },
    },
    ...(showPosition
      ? [
          {
            title: 'Position',
            key: 'position',
            render: (_, record) => {
              const location = { lat: record.latitude, lng: record.longitude };
              return <VehicleAddress record={location} />;
            },
          },
        ]
      : []),
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title="Voir l'historique du véhicule">
            <Button
              icon={<EyeOutlined />}
              type="link"
              onClick={() => handleDetail(record.device_id)}
            />
          </Tooltip>

          {record.latitude && record.longitude && (
            <Tooltip title="Voir la position sur Google Maps">
              <Button
                type="link"
                icon={<EnvironmentOutlined style={{ color: '#f5222d' }} />}
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${record.latitude},${record.longitude}`,
                    '_blank'
                  )
                }
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // 🔹 Liste unique des véhicules pour filtrage
  const vehicles = useMemo(() => {
    return [...new Set(events.map((e) => e.device_name))];
  }, [events]);

  // 🔹 Filtrage par date
  const handleDateChange = (values) => {
    setDateRange(values);
    if (values && values.length === 2) {
      const from = values[0].format('YYYY-MM-DD HH:mm:ss');
      const to = values[1].format('YYYY-MM-DD HH:mm:ss');
      fetchData(from, to);
      setSelectedVehicle(null);
    }
  };

  // 🔹 Filtrage par véhicule
  const handleVehicleChange = (value) => {
    setSelectedVehicle(value);
    if (value) {
      setFilteredEvents(events.filter((e) => e.device_name === value));
    } else {
      setFilteredEvents(events);
    }
  };

  // 🔹 Export Excel
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Événements");

    worksheet.columns = [
      { header: "Date & Heure", key: "time", width: 25 },
      { header: "Véhicule", key: "vehicle", width: 20 },
      { header: "Événement", key: "event", width: 20 },
      { header: "Latitude", key: "lat", width: 15 },
      { header: "Longitude", key: "lng", width: 15 },
    ];

    filteredEvents.forEach((e) => {
      worksheet.addRow({
        time: e.time,
        vehicle: e.device_name,
        event: e.message,
        lat: e.latitude,
        lng: e.longitude,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "evenements.xlsx");
  };

  // 🔹 Export PDF
  const exportToPDF = () => {
    const element = tableRef.current;
    const opt = {
      margin: 0.5,
      filename: "evenements.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="event_container">
      <h2 className="title_event">📊 Détail des événements (Temps réel)</h2>
      <div className="event_wrapper">
        <div className="event_top">
          <RangePicker
            style={{ width: '100%' }}
            value={dateRange}
            onChange={handleDateChange}
            allowClear
            showTime={{ format: 'HH:mm' }}
            format="DD/MM/YYYY HH:mm"
            placeholder={['Date et heure début', 'Date et heure fin']}
          />
          <Select
            style={{ width: '100%', marginTop: 10 }}
            placeholder="Filtrer par véhicule"
            value={selectedVehicle}
            onChange={handleVehicleChange}
            allowClear
          >
            {vehicles.map((v) => (
              <Option key={v} value={v}>
                {v}
              </Option>
            ))}
          </Select>
          <div className='row_lateral'>
            <Space>
              <Button type="primary" icon={<FileExcelOutlined />} onClick={exportToExcel}>
                Export Excel
              </Button>
              <Button type="primary" danger icon={<FilePdfOutlined />} onClick={exportToPDF}>
                Export PDF
              </Button>
            </Space>
            <Space>
              <Button onClick={() => setShowPosition((prev) => !prev)}>
                {showPosition ? "Masquer Position" : "Afficher Position"}
              </Button>
            </Space>
          </div>
        </div>

        <div className="event_bottom" ref={tableRef}>
          <Table
            columns={columns}
            dataSource={filteredEvents}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            bordered
            size="middle"
          />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'device'}
        onCancel={closeAllModals}
        footer={null}
        width={1090}
        centered
      >
        <GetHistory id={idDevice} dateRanges={dateRange} />
      </Modal>
    </div>
  );
};

export default GetEventLocalisation;
