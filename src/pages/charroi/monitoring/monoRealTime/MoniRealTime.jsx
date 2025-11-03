import { useEffect, useState, useMemo, useRef } from 'react';
import { DatePicker, Table, Typography, Tooltip, Modal, Tag, Space, message, Select, Button } from 'antd';
import { CarOutlined, HourglassOutlined, ArrowRightOutlined, ArrowLeftOutlined, EnvironmentOutlined, EyeOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import GetHistory from '../../demandeVehicule/charroiLocalisation/getHistory/GetHistory';
import { getEvent } from '../../../../services/rapportService';
import config from '../../../../config';
import getColumnSearchProps from '../../../../utils/columnSearchUtils';
import { calculateZoneDurations } from '../../../../utils/calculateZoneDurations';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const MoniRealTime = () => {
  const [dateRange, setDateRange] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [idDevice, setIdDevice] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 15 });
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const tableRef = useRef();
  const isFetching = useRef(false);
  const apiHash = config.api_hash;

  // Filtrage par véhicule
  const filterByVehicle = (eventsData, vehicle) => {
    if (!vehicle) return eventsData;
    return eventsData.filter(e => e.vehicule === vehicle);
  };

  // Fetch événements
  const fetchData = async (from, to, { isRefresh = false, silent = false } = {}) => {
    if (!silent) {
      if (isRefresh) setLoading(false);
      else setLoading(true);
    }

    try {
      const { data } = await getEvent({
        date_from: from,
        date_to: to,
        lang: "fr",
        limit: 2000,
        user_api_hash: apiHash,
      });

      const eventsData = data?.items?.data || [];
      const durations = calculateZoneDurations(eventsData);
            console.table(durations)

      const mapped = durations.map(e => ({ ...e, vehicule: e.vehicule }));
      setEvents(mapped);
      setFilteredEvents(filterByVehicle(mapped, selectedVehicle));
      setPagination(prev => ({ ...prev, current: 1 }));
    } catch (error) {
      console.error("Erreur lors du fetch:", error);
      if (!silent) message.error("Erreur lors du chargement des événements.");
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Chargement initial ou changement de date
  useEffect(() => {
    const from = dateRange[0] ? dateRange[0].format('YYYY-MM-DD HH:mm:ss') : dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const to = dateRange[1] ? dateRange[1].format('YYYY-MM-DD HH:mm:ss') : dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    fetchData(from, to);
  }, [dateRange]);

  // Auto-refresh toutes les 60s silencieusement
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isFetching.current) return;
      isFetching.current = true;

      const from = dateRange[0] ? dateRange[0].format('YYYY-MM-DD HH:mm:ss') : dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const to = dateRange[1] ? dateRange[1].format('YYYY-MM-DD HH:mm:ss') : dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');

      await fetchData(from, to, { silent: true, isRefresh: true });
      isFetching.current = false;
    }, 60000);

    return () => clearInterval(interval);
  }, [dateRange]);

  // Re-filtrage lorsque véhicule change
  useEffect(() => {
    setFilteredEvents(filterByVehicle(events, selectedVehicle));
    setPagination(prev => ({ ...prev, current: 1 }));
  }, [selectedVehicle, events]);

  const openModal = (type, id = '') => {
    setModalType(type);
    setIdDevice(id);
  };

  const closeAllModals = () => setModalType(null);

  // Colonnes Table
const columns = [
  {
    title: '#',
    dataIndex: '#',
    width: 50,
    align: 'center',
    render: (_, __, index) => <strong>{index + 1}</strong>,
  },
  {
    title: 'Véhicule',
    dataIndex: 'vehicule',
    key: 'vehicule',
    ...getColumnSearchProps('vehicule', searchText, setSearchText, setSearchedColumn, searchInput),
    render: (text) => (
      <Space>
        <CarOutlined style={{ color: '#1890ff', fontSize: 18 }} />
        <span style={{ fontWeight: 600, color: '#0a3d62' }}>{text || 'N/A'}</span>
      </Space>
    ),
  },
  {
    title: 'Zone',
    dataIndex: 'zone',
    key: 'zone',
    ...getColumnSearchProps('zone', searchText, setSearchText, setSearchedColumn, searchInput),
    render: (text) => <Text type="secondary">{text || 'N/A'}</Text>,
  },
  {
    title: 'Entrée / Sortie',
    key: 'entry_exit',
    render: (_, record) => (
      <div>
        <div>
          <ArrowRightOutlined style={{ color: '#52c41a', marginRight: 4 }} />
          <span>{record.entree ? dayjs(record.entree, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm') : 'N/A'}</span>
        </div>
        <div>
          {record.sortie ? (
            <>
              <ArrowLeftOutlined style={{ color: '#f5222d', marginRight: 4 }} />
              <span>{dayjs(record.sortie, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')}</span>
            </>
          ) : (
            <Tag color="#fa8c16">⏳ En cours</Tag>
          )}
        </div>
      </div>
    ),
  },
  {
    title: 'Depuis zone préc.',
    dataIndex: 'duree_depuis_zone_precedente',
    key: 'duree_depuis_zone_precedente',
    render: (text) => {
      if (!text) return <span>—</span>;
      let color = '#52c41a';
      const match = text.match(/(\d+)h/) || text.match(/(\d+)min/) || text.match(/(\d+)sec/);
      if (match) {
        const value = parseInt(match[1], 10);
        if (text.includes('h') || value > 30) color = '#f5222d';
        else if (value > 15) color = '#fa8c16';
        else if (value > 5) color = '#a0d911';
      }
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: 'Durée dans zone',
    dataIndex: 'duree_text',
    key: 'duree_text',
    render: (_, record) => {
      if (record.duree_text === 'En cours') return <Tag color="#fa8c16">En cours</Tag>;
      const totalSeconds = (record.duree_minutes || 0) * 60 + (record.duree_secondes || 0);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      let color = '#52c41a';
      if (totalSeconds > 1800) color = '#f5222d';
      else if (totalSeconds > 900) color = '#fa8c16';
      else if (totalSeconds > 300) color = '#a0d911';
      return <Tag color={color}>{`${h > 0 ? h + 'h ' : ''}${m}min ${s}sec`}</Tag>;
    },
  },
  {
    title: 'Distance (km)',
    dataIndex: 'distance_km',
    key: 'distance_km',
    align: 'center',
    render: (value) => {
      if (!value) return <Tag color="gray">N/A</Tag>;
      let color = '#52c41a';
      if (value > 50) color = '#f5222d';
      else if (value > 20) color = '#fa8c16';
      else if (value > 5) color = '#a0d911';
      return <Tag color={color}>{value.toFixed(1)} km</Tag>;
    },
  },
  {
    title: 'Vitesse M. (km/h)',
    dataIndex: 'vitesse_moyenne',
    key: 'vitesse_moyenne',
    align: 'center',
    render: (value) => {
      if (!value) return <Tag color="gray">N/A</Tag>;
      let color = '#52c41a';
      if (value > 100) color = '#f5222d';
      else if (value > 60) color = '#fa8c16';
      else if (value > 30) color = '#a0d911';
      return <Tag color={color}>{value.toFixed(1)} km/h</Tag>;
    },
  },
  {
    title: 'Position',
    key: 'position',
    align: 'center',
    render: (_, record) =>
      record.latitude && record.longitude ? (
        <Tooltip title={`${record.latitude}, ${record.longitude}`}>
          <Button
            shape="circle"
            size="small"
            icon={<EnvironmentOutlined style={{ color: '#f5222d' }} />}
            onClick={() => window.open(`https://www.google.com/maps?q=${record.latitude},${record.longitude}`, '_blank')}
          />
        </Tooltip>
      ) : (
        <Tag color="gray">N/A</Tag>
      ),
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center',
    render: (_, record) => (
      <Space>
        <Tooltip title="Voir l'historique du véhicule">
          <Button
            shape="circle"
            size="small"
            icon={<EyeOutlined style={{ color: '#1890ff' }} />}
            onClick={() => openModal('device', record.device_id)}
          />
        </Tooltip>
      </Space>
    ),
  },
];



  // Liste unique véhicules
  const vehicles = useMemo(() => [...new Set(events.map(e => e.vehicule))], [events]);

  // Handlers
  const handleDateChange = values => setDateRange(values);
  const handleVehicleChange = value => setSelectedVehicle(value);

  // Export Excel
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Événements");
    worksheet.columns = [
      { header: "Date & Heure Entrée", key: "entree", width: 25 },
      { header: "Date & Heure Sortie", key: "sortie", width: 25 },
      { header: "Véhicule", key: "vehicle", width: 20 },
      { header: "Zone", key: "zone", width: 20 },
      { header: "Durée", key: "duree_text", width: 15 },
      { header: "Latitude", key: "lat", width: 15 },
      { header: "Longitude", key: "lng", width: 15 },
    ];
    filteredEvents.forEach(e => worksheet.addRow({
      entree: e.entree,
      sortie: e.sortie,
      vehicle: e.device_name,
      zone: e.zone,
      duree_text: e.duree_text,
      lat: e.latitude,
      lng: e.longitude,
    }));
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "evenements.xlsx");
  };

  // Export PDF
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
    <div className="event_container">
      <h2 className="title_event">📊 Monitoring</h2>
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
            </Space>
          </div>
        </div>
        <div className="event_bottom" ref={tableRef}>
          <Table
            columns={columns}
            dataSource={filteredEvents}
            rowKey={record => record.id || record.external_id}
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              pageSizeOptions: ['10','20','50', '80', '100'],
              showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} résultats`,
              onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
              onShowSizeChange: (current, size) => setPagination({ current: 1, pageSize: size }),
            }}
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

export default MoniRealTime;
