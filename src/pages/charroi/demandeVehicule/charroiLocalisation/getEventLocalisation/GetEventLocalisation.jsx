import './getEventLocalisation.scss';
import { useEffect, useState, useMemo, useRef } from 'react';
import { DatePicker, Table, Tooltip, Modal, Tag, Space, message, Select, Button } from 'antd';
import { CarOutlined, ClockCircleOutlined, EnvironmentOutlined, EyeOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import config from '../../../../../config';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { VehicleAddress } from '../../../../../utils/vehicleAddress';
import { getEvent } from '../../../../../services/rapportService';
import { processEvents } from '../../../../../utils/processEvent';
import RapportEventHistory from '../rapportEvent/rapportEventHistory/RapportEventHistory';

const { RangePicker } = DatePicker;
const { Option } = Select;

const GetEventLocalisation = () => {
  const [dateRange, setDateRange] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [idDevice, setIdDevice] = useState('');
  const [showPosition, setShowPosition] = useState(false);
  const tableRef = useRef();
  const apiHash = config.api_hash;
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (from, to, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { data } = await getEvent({
        date_from: from,
        date_to: to,
        lang: "fr",
        limit: 1000,
        user_api_hash: apiHash,
      });

      if (data?.items?.data?.length) {
        const eventsData = data.items.data;
        const processed = processEvents(eventsData);

        setEvents(eventsData);
        setFilteredEvents(
          selectedVehicle
            ? processed.filter(e => e.device_name === selectedVehicle)
            : processed
        );
      } else {
        setEvents([]);
        setFilteredEvents([]);
      }
    } catch (error) {
      console.error("Erreur lors du fetch:", error);
      if (!isRefresh) message.error("Erreur lors du chargement des événements.");
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  // Chargement initial (ou lors d’un changement de filtre)
  useEffect(() => {
    const from = dateRange[0]
      ? dateRange[0].format('YYYY-MM-DD HH:mm:ss')
      : dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const to = dateRange[1]
      ? dateRange[1].format('YYYY-MM-DD HH:mm:ss')
      : dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    fetchData(from, to);
  }, [dateRange, selectedVehicle]);

  // Rafraîchissement silencieux toutes les 30s
  useEffect(() => {
    const interval = setInterval(() => {
      const from = dateRange[0]
        ? dateRange[0].format('YYYY-MM-DD HH:mm:ss')
        : dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const to = dateRange[1]
        ? dateRange[1].format('YYYY-MM-DD HH:mm:ss')
        : dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      fetchData(from, to, true); // 👈 isRefresh = true
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [dateRange, selectedVehicle]);

  //Modal détail
  const openModal = (type, id = '') => {
    setModalType(type);
    setIdDevice(id);
  };
  const closeAllModals = () => setModalType(null);

  // 🔹 Colonnes
  const columns = [
    {
      title: 'Date & Heure',
      dataIndex: 'time',
      key: 'time',
      render: text => (
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
            <span style={{ fontWeight: 500, color }}>{text || 'N/A'}</span>
          </Space>
        );
      },
    },
    {
      title: 'Message',
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
    ...(showPosition ? [
      {
        title: 'Position',
        key: 'position',
        render: (_, record) => <VehicleAddress record={{ lat: record.latitude, lng: record.longitude }} />,
      },
    ] : []),
    {
      title: '🕒 Durée depuis le dernier changement',
      dataIndex: 'duration_since_last_change',
      key: 'duration_since_last_change',
      align: 'center',
      render: text => (
        <span style={{ fontWeight: 500, color: '#722ed1' }}>
          {text || '—'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Voir l'historique du véhicule">
            <Button icon={<EyeOutlined style={{ color: '#1890ff' }} />} onClick={() => openModal('device', record.device_id)} />
          </Tooltip>
          {record.latitude && record.longitude && (
            <Tooltip title="Voir la position sur Google Maps">
              <Button
                icon={<EnvironmentOutlined style={{ color: '#f5222d' }} />}
                onClick={() => window.open(`https://www.google.com/maps?q=${record.latitude},${record.longitude}`, '_blank')}
              />
            </Tooltip>
          )}
        </Space>
      ),
    }
  ];

  // 🔹 Liste véhicules unique
  const vehicles = useMemo(() => [...new Set(events.map(e => e.device_name))], [events]);

  // 🔹 Changement de plage de dates
  const handleDateChange = values => {
    setDateRange(values);
  };

  // 🔹 Filtrage par véhicule
  const handleVehicleChange = value => setSelectedVehicle(value);

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
    filteredEvents.forEach(e => worksheet.addRow({
      time: e.time,
      vehicle: e.device_name,
      event: e.message,
      lat: e.latitude,
      lng: e.longitude,
    }));
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "evenements.xlsx");
  };

  // 🔹 Export PDF
  const exportToPDF = () => {
    const element = tableRef.current;
    html2pdf().set({
      margin: 0.5,
      filename: "evenements.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    }).from(element).save();
  };

  return (
    <>
      <div className="event_container">
        <h2 className="title_event">📊 Détail des événements</h2>
        <div className="event_wrapper">
          <div className="event_top">
              <div className="event_top_row">
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
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Filtrer par véhicule"
                      value={selectedVehicle}
                      onChange={handleVehicleChange}
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children?.toLowerCase().includes(input.toLowerCase())
                      }
                  >
                      {vehicles.map(v => <Option key={v} value={v}>{v}</Option>)}
                  </Select>
              </div>
            <div className='row_lateral'>
              <Space>
                <Button type="primary" icon={<FileExcelOutlined />} onClick={exportToExcel}>Export Excel</Button>
                <Button type="primary" danger icon={<FilePdfOutlined />} onClick={exportToPDF}>Export PDF</Button>
                <Button onClick={() => setShowPosition(prev => !prev)}>
                  {showPosition ? "Masquer Position" : "Afficher Position"}
                </Button>
              </Space>
            </div>
          </div>
          <div className="event_bottom" ref={tableRef}>
            <Table
              columns={columns}
              dataSource={filteredEvents}
              rowKey={record => record.id || record.external_id}
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
          width={1200}
          centered
        >
          <RapportEventHistory idDevice={idDevice} dateRanges={dateRange} />
        </Modal>
      </div>
    </>
  );
};

export default GetEventLocalisation;
