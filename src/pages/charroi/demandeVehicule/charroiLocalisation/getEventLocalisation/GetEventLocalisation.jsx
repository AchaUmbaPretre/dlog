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
import { postEvent } from '../../../../../services/eventService';

const { RangePicker } = DatePicker;
const { Option } = Select;

const GetEventLocalisation = () => {
  const [dateRange, setDateRange] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const apiHash = config.api_hash;
  const tableRef = useRef();
  const [modalType, setModalType] = useState(null);
  const [idDevice, setIdDevice] = useState('')
  const [showPosition, setShowPosition] = useState(false); // 👈 par défaut caché

/*   useEffect(() => {
  // Fonction qui appelle postEvent pour toutes les données actuelles
  const fetchAndPostEvents = async () => {
    try {
      // Ici, tu peux utiliser filteredEvents ou events selon ce que tu veux poster
      for (const e of events) {
        await postEvent({
          external_id: e.id,
          device_id: e.device_id,
          device_name: e.device_name,
          type: e.type,
          message: e.message,
          speed: e.speed,
          latitude: e.latitude,
          longitude: e.longitude,
          event_time: e.time
        });
      }
      console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] Événements postés automatiquement.`);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement automatique :", err.message);
    }
  };

  // Exécution immédiate au montage (optionnel)
  fetchAndPostEvents();

  // Intervalle toutes les 6h
  const interval = setInterval(() => {
    fetchAndPostEvents();
  }, 6 * 60 * 60 * 1000); // 6h en ms

  // Nettoyage à la destruction du composant
  return () => clearInterval(interval);
}, [events]); */


useEffect(() => {
  // Fonction qui envoie les événements vers ta base
  const fetchAndPostEvents = async () => {
    try {
      for (const e of events) {
        await postEvent({
          external_id: e.id,
          device_id: e.device_id,
          device_name: e.device_name,
          type: e.type,
          message: e.message,
          speed: e.speed,
          latitude: e.latitude,
          longitude: e.longitude,
          event_time: e.time
        });
      }
      console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ✅ Événements envoyés automatiquement`);
    } catch (err) {
      console.error("❌ Erreur lors de l'envoi auto :", err.message);
    }
  };

  // Lancer une fois immédiatement pour tester
  fetchAndPostEvents();

  // Toutes les 3 minutes
  const interval = setInterval(() => {
    fetchAndPostEvents();
  }, 6 * 60 * 60 * 1000);

  return () => clearInterval(interval); // Nettoyage
}, [events]);

//3 * 60 * 1000

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

    if (data?.items?.data) {
      setEvents(data.items.data);
      setFilteredEvents(data.items.data);
    } else {
      setEvents([]);
      setFilteredEvents([]);
      message.info("Aucun événement trouvé pour cette période.");
    }
  } catch (error) {
    console.error("Erreur lors du fetch:", error);
    message.error("Erreur lors du chargement des événements.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const startOfDay = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfDay = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    setDateRange([dayjs().startOf('day'), dayjs().endOf('day')]);
    fetchData(startOfDay, endOfDay);
  }, []);

    const openModal = (type, id = '') => {
        setModalType(type);
        setIdDevice(id)
    };
    const closeAllModals = () => setModalType(null);
    const handleDetail = (id) => openModal('device', id)

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
      render: (text) => (
        <Space>
          <CarOutlined style={{ color: '#722ed1' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Événement',
      dataIndex: 'message',
      key: 'message',
      render: (text, record) => {
        const color = record.type === 'ignition_on' ? 'green' : 'red';
        const icon = record.type === 'ignition_on' ? (
          <PoweroffOutlined style={{ color: 'green' }} />
        ) : (
          <PoweroffOutlined style={{ color: 'red' }} />
        );
        return (
          <Tag color={color} style={{ fontSize: 14, padding: '4px 10px' }}>
            {icon} {text}
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
        render: (text, record) => (
            <Space style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Bouton détail */}
            <Tooltip title="Voir l'historique du véhicule">
                <Button
                icon={<EyeOutlined />}
                type="link"
                onClick={() => handleDetail(record.device_id)}
                />
            </Tooltip>

            {/* Bouton ouvrir Google Maps */}
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
    }
  ];

  // 🔹 Liste unique des véhicules
  const vehicles = useMemo(() => {
    const unique = [...new Set(events.map((e) => e.device_name))];
    return unique;
  }, [events]);

  // 🔹 Quand on change la plage de dates
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

  const handSubmit = async() => {
    try {
        await postEvent()
    } catch (error) {
        console.log(error)
    }
  }

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
      <h2 className="title_event">📊 Détail des événements</h2>
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
                <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={exportToExcel}
                >
                Export Excel
                </Button>
                <Button
                type="primary"
                danger
                icon={<FilePdfOutlined />}
                onClick={exportToPDF}
                >
                Export PDF
                </Button>
            </Space>
            <Space>
                <Button
                    onClick={() => setShowPosition((prev) => !prev)}
                >
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
