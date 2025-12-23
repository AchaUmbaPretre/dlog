import { useEffect, useRef, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tag, Tooltip, Popover, Tabs, Popconfirm, Collapse, Select, Skeleton, Alert } from 'antd';
import { 
  ExportOutlined,MoreOutlined, UnlockOutlined, ApartmentOutlined, EnvironmentOutlined, EditOutlined, FilePdfOutlined, CalendarOutlined, TeamOutlined,FileExcelOutlined,DeleteOutlined,DownOutlined,MenuOutlined,PlusCircleOutlined, EyeOutlined, UserOutlined, FileTextOutlined, FileDoneOutlined 
} from '@ant-design/icons';
import TacheForm from './tacheform/TacheForm';
import { deletePutTache, getTache, putPriorite } from '../../services/tacheService';
import { Link } from 'react-router-dom';
import ListeDocTache from './listeDocTache/ListeDocTache';
import TacheDoc from './tacheDoc/TacheDoc';
import FormatCalendar from './formatCalendar/FormatCalendar';
import moment from 'moment';
import SuiviTache from './suiviTache/SuiviTache';
import ListeTracking from './listeTracking/ListeTracking';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import SousTacheForm from './sousTacheForm/SousTacheForm';
import './taches.scss'
import { getPriorityColor, getPriorityIcon, getPriorityLabel, statusIcons } from '../../utils/prioriteIcons';
import { filteredData, groupTasks } from '../../utils/tacheGroup';
import AllDetail from './allDetail/AllDetail';
import FilterTaches from './filterTaches/FilterTaches';
import  getColumnSearchProps  from '../../utils/columnSearchUtils';
import DetailTacheGlobalOne from './detailTacheGlobalOne/DetailTacheGlobalOne';
import UploadTacheExcel from './uploadTacheExcel/UploadTacheExcel';
import TacheTagsForm from './tacheTagsForm/TacheTagsForm';
import { useSelector } from 'react-redux';
import PermissionTache from '../permission/permissionTache/PermissionTache';
import ListCatTache from '../listCatTache/ListCatTache';
import CorpsMetier from '../corpsMetier/CorpsMetier';
import AuditLogTache from './auditLogsTache/AuditLogsTache';
const { Search } = Input;
const { Panel } = Collapse;

const Taches = () => {
  const [data, setData] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [idTache, setIdTache] = useState(null);
  const scroll = { x: 400 };
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'DPT': true,
    'Titre': true,
    'Client': true,
    "Statut": true,
    "Priorite": true,
    'Date debut & fin': true,
    'Fréquence': true,
    "Owner": true,
    "nom_corps_metier": false,
    "Tag" : false,
    "Categorie" : false,
    "Ville" : false
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [editingRow, setEditingRow] = useState(null);
  const [newPriority, setNewPriority] = useState(null); 
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedTacheIds, setSelectedTacheIds] = useState([]);
  const [filteredDatas, setFilteredDatas] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [statistique, setStatistique] = useState([]);
  const [total, setTotal] = useState([]);
  const [allIds, setAllIds] = useState([]);
  const searchInput = useRef(null);
  const role = useSelector((state) => state.user?.currentUser?.role);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const [permissions, setPermissions] = useState({});

  const handleDoubleClick = (record) => {
    setEditingRow(record.id_tache);
    setNewPriority(record.priorite);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedTacheIds(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleChangePriority = (value, record) => {
    setNewPriority(value);
    setEditingRow(null);
    handleUpdatePriority(record.id_tache, value);
  };

  const handleDelete = async (id) => {
    try {
       await deletePutTache(id, userId);
      setData(data.filter((item) => item.id_tache !== id));
      message.success('Tache a ete supprimée avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du budget.',
      });
    }
  };

  const fetchData = async (filters) => {
    setLoading(true);
    setFilteredDatas(filters);

    try {
        const response = await getTache(filters, userId, role);

        setAllIds([...new Set(response?.data?.taches?.map(d => d.id_tache) || [])]);

        const groupedData = response.data.taches.reduce((acc, curr) => {
            const found = acc.find(item => item.id_tache === curr.id_tache);

            if (found) {
                if (!found.nom_tag.includes(curr.nom_tag)) {
                    found.nom_tag.push(curr.nom_tag);
                }
            } else {
                acc.push({
                    ...curr,
                    nom_tag: [curr.nom_tag],
                });
            }

            return acc;
        }, []);

        const permissionsMap = response.data.taches.reduce((acc, permission) => {
          if (!acc[permission.id_tache]) {
            acc[permission.id_tache] = {
              can_comment: Boolean(permission.can_comment),
              can_edit: Boolean(permission.can_edit),
              can_view: Boolean(permission.can_view),
            };
          }
          return acc;
        }, {});

        setPermissions(permissionsMap);
        setData(groupedData);
        setStatistique(response.data.statistiques);
        setTotal(response.data.total_taches);
    } catch (error) {
        notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
        });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filteredDatas);
  }, [filteredDatas]);  

  const handleFilterChange = (newFilters) => {
    setFilteredDatas(newFilters); 
  };

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idTache = '') => {
    closeAllModals();
    setModalType(type);
    setIdTache(idTache);
  };

  const handFilter = () => {
    fetchData()
    setFilterVisible(!filterVisible)
  }

  const handleEdit = (idTache) => {
    setIdTache(idTache);
    setIsModalVisible(true);
  };

  const handleAllDetails = (idTache) => {
    openModal('Alldetail', idTache);
  };

  const handleViewDetails = (idTache) => {
    openModal('detail', idTache);
  };

  const handleSousTache = (idTache) => {
    openModal('SousTache', idTache);
  };

  const handleDetailDoc = (idTache) => {
    openModal('ListeDoc', idTache);
  };

  const handleAjouterDoc = (idTache) => {
    openModal('DocumentTacheForm', idTache);
  };

  const handleTracking = (idTache) => {
    openModal('suivi', idTache);
  };

  const handleListeTracking = (idTache) => {
    openModal('listeTracking', idTache);
  };

  const handlExcelImport = () => {
    openModal('excelImport');
  };

  const handleAddTask = () => {
    setIdTache('')
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAuto = (idTache) => {
    openModal('addAuto', idTache);
  }

  const handleExportExcel = () => {
    const filteredData = data.map(({ id_tache,id_controle, ...rest }) => rest);
      const ws = XLSX.utils.json_to_sheet(filteredData);
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
    XLSX.writeFile(wb, "tache.xlsx");
    message.success('Exportation vers Excel réussie.');
  };

  const handleExportPDF = () => {
    const element = document.getElementById('printableTable');
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'data.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const menus = (
    <Menu>
      {Object.keys(columnsVisibility).map(columnName => (
        <Menu.Item key={columnName}>
          <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
            <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
            <span style={{ marginLeft: 8 }}>{columnName}</span>
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );  
  
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleExportExcel}>
        Exporter vers Excel
      </Menu.Item>
      <Menu.Item key="2" onClick={handleExportPDF}>
        Exporter au format PDF
      </Menu.Item>
    </Menu>
  );

  const toggleColumnVisibility = (columnName, e) => {
    e.stopPropagation();
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };

  const columnStyles = {
    title: {
      maxWidth: '220px',
      whiteSpace: 'nowrap',
      overflowX: 'scroll', 
      overflowY: 'hidden',
      textOverflow: 'ellipsis',
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none', 
    },
    hideScroll: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  };

  const handleUpdatePriority = async (idTache, newPriority) => {
    try {
      await putPriorite(idTache, newPriority);
  
      notification.success({
        message: 'Mise à jour réussie',
        description: `La priorité de la tâche ${idTache} a été mise à jour avec succès.`,
        duration: 3, 
      });
  
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: `Une erreur est survenue lors de la mise à jour de la tâche ${idTache}.`,
        duration: 3,
      });
  
      console.error(`Erreur lors de la mise à jour de la tâche ${idTache}:`, error);
    }
    console.log(`Mise à jour de la tâche ${idTache} avec la nouvelle priorité: ${newPriority}`);
  };

  const getColor = (index) => {
    const colors = ['blue', 'green', 'red', 'yellow', 'orange', 'purple', 'cyan', 'magenta'];
    return colors[index % colors.length];
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "4%",

      ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' })
    },
    { 
      title: 'DPT', 
      dataIndex: 'departement', 
      key: 'nom_departement',
      ...getColumnSearchProps(
        'departement',
        searchText,
        setSearchText,
        setSearchedColumn,
        searchInput
      ),
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
      ...(columnsVisibility['DPT'] ? {} : { className: 'hidden-column' }),

    },
    {   
      title: 'Titre',
      dataIndex: 'nom_tache', 
      key: 'nom_tache', 
      ...getColumnSearchProps(
        'nom_tache',
        searchText,
        setSearchText,
        setSearchedColumn,
        searchInput
      ),
      render: (text,record) => (
        <Space style={columnStyles.title} className={columnStyles.hideScroll} onClick={() => handleViewDetails(record.id_tache)}>
          <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
      ...(columnsVisibility['Titre'] ? {} : { className: 'hidden-column' }),
    },
    {   
      title: 'Client', 
      dataIndex: 'nom_client', 
      key: 'nom_client',
      ...getColumnSearchProps(
        'nom_client',
        searchText,
        setSearchText,
        setSearchedColumn,
        searchInput
      ),
      render: text => (
        <Space>
          <Tag icon={<UserOutlined />} color='green'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
      ...(columnsVisibility['Client'] ? {} : { className: 'hidden-column' })
    },
    { 
      title: 'Statut', 
      dataIndex: 'statut', 
      key: 'statut',
      ...getColumnSearchProps(
        'statut',
        searchText,
        setSearchText,
        setSearchedColumn,
        searchInput
      ),
      render: text => {
        const { icon, color } = statusIcons[text] || {};
        return (
          <Space>
            <Tag icon={icon} color={color}>{text}</Tag>
          </Space>
        );
      },
      ...(columnsVisibility['Statut'] ? {} : { className: 'hidden-column' })

    },
    {
      title: 'Priorité',
      dataIndex: 'priorite',
      key: 'priorite',
      sorter: (a, b) => a.priorite - b.priorite,
      render: (priority, record) => {
        if (editingRow === record.id_tache) {
          return (
            <Select
              name='priorite'
              defaultValue={newPriority}
              onChange={(value) => handleChangePriority(value, record)}
              onBlur={() => setEditingRow(null)}
              options={[
                { value: 1, label: <span>{getPriorityIcon(1)} Très faible</span> },
                { value: 2, label: <span>{getPriorityIcon(2)} Faible</span> },
                { value: 3, label: <span>{getPriorityIcon(3)} Moyenne</span> },
                { value: 4, label: <span>{getPriorityIcon(4)} Haute</span> },
                { value: 5, label: <span>{getPriorityIcon(5)} Très haute</span> },
              ]}
              style={{ width: 120 }}
            />
          );
        }

        return (
          <Tag onDoubleClick={() => handleDoubleClick(record)} color={getPriorityColor(priority)}>
            {getPriorityIcon(priority)} {getPriorityLabel(priority)}
          </Tag>
        );
      },
    },
    {
      title: 'Date debut & fin',
      dataIndex: 'date_debut',
      key: 'date_debut',
      sorter: (a, b) => moment(a.date_debut) - moment(b.date_debut),
      sortDirections: ['descend', 'ascend'],
      render: (text,record) => 
        <Tag icon={<CalendarOutlined />} color="blue">
          {moment(text).format('DD-MM-yyyy')} & {moment(record.date_fin).format('DD-MM-yyyy')}
        </Tag>,
          ...(columnsVisibility['Date debut & fin'] ? {} : { className: 'hidden-column' })

    },
    { 
      title: 'Fréquence', 
      dataIndex: 'frequence', 
      key: 'frequence',
      ...getColumnSearchProps(
        'frequence',
        searchText,
        setSearchText,
        setSearchedColumn,
        searchInput
      ),
      render: text => (
        <Space>
          <Tag icon={<CalendarOutlined />} color='blue'>{text}</Tag>
        </Space>
      ),
      ...(columnsVisibility['Fréquence'] ? {} : { className: 'hidden-column' })

    },
    {
      title: 'Tag',
      dataIndex: 'nom_tag',
      key: 'nom_tag',
      render: (nom_tag) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {nom_tag.map((dd, index) => (
            <Tag key={index} color={getColor(index)}>{dd ?? 'Aucun'}</Tag>
          ))}
        </div>
      ),
      ...(columnsVisibility['Tag'] ? {} : { className: 'hidden-column' })
    },
    { 
      title: 'Corps metier', 
      dataIndex: 'nom_corps_metier', 
      key: 'nom_corps_metier',
      render: text => (
        <Space>
          <Tag color='blue'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
      ...(columnsVisibility['nom_corps_metier'] ? {} : { className: 'hidden-column' })
    },
    { 
      title: 'Categorie', 
      dataIndex: 'id_cat_tache', 
      key: 'id_cat_tache',
      render: text => (
        <Space>
          <Tag color='blue'>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
      ...(columnsVisibility['Categorie'] ? {} : { className: 'hidden-column' })
    },
    { 
      title: 'Ville', 
      dataIndex: 'ville', 
      key: 'ville',
      render: text => (
        <Space>
          <Tag color='red' icon={<EnvironmentOutlined />}>{text ?? 'Aucun'}</Tag>
        </Space>
      ),
      ...(columnsVisibility['Ville'] ? {} : { className: 'hidden-column' })
    },
    {
      title: 'Owner', 
      dataIndex: 'owner', 
      key: 'owner',
      ...getColumnSearchProps(
        'frequence',
        searchText,
        setSearchText,
        setSearchedColumn,
        searchInput
      ),
      render: text => (
        <Space>
          <Tag icon={<TeamOutlined />} color='purple'>{text}</Tag>
        </Space>
      ),
      ...(columnsVisibility['Owner'] ? {} : { className: 'hidden-column' })

    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
  
          <Space size="middle">
            <Tooltip title="Modifier">
              <Button
                icon={<EditOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleEdit(record.id_tache)}
                disabled={role !== 'Admin' && !permissions[record.id_tache]?.can_edit}
                aria-label="Edit tache"
              />
            </Tooltip>
            <Tooltip title="Voir les détails">
              <Button
                icon={<EyeOutlined />}
                onClick={() => handleViewDetails(record.id_tache)}
                disabled={
                 role !== 'Admin' && !permissions[record.id_tache]?.can_view
                }
                style={{ color: 'blue' }}
                aria-label="Voir les détails de la tâche"
                className="view-details-btn"
              />
            </Tooltip>

            { (role === 'Admin' || !permissions[record.id_tache]?.can_comment) ? (
              <Dropdown
                  overlay={
                    (
                      <Menu>
                        <Menu.Item onClick={() => handleTracking(record.id_tache)}>
                          <FileTextOutlined style={{ color: '#1890ff' }} /> Tracking
                        </Menu.Item>
                        <Menu.Item onClick={() => handleListeTracking(record.id_tache)}>
                          <FileTextOutlined style={{ color: '#52c41a' }} /> Liste de tracking
                        </Menu.Item>
                        <Menu.Item onClick={() => handleSousTache(record.id_tache)}>
                          <FileTextOutlined style={{ color: '#faad14' }} /> Créer sous-tâche
                        </Menu.Item>
                        <Menu.Divider />

                        <Menu.Item onClick={() => handleDetailDoc(record.id_tache)}>
                          <FileTextOutlined style={{ color: '#722ed1' }} /> Liste des docs
                        </Menu.Item>
                        <Menu.Item onClick={() => handleAjouterDoc(record.id_tache)}>
                          <FileTextOutlined style={{ color: '#eb2f96' }} /> Ajouter un doc
                        </Menu.Item>
                        <Menu.Divider />

                        { (role === 'Admin' || role === 'Manager') &&
                          <Menu.Item onClick={() => handleAuto(record.id_tache)}>
                            <UnlockOutlined style={{ color: '#ff4d4f' }} /> Permission
                          </Menu.Item>
                        }
                      </Menu>
                    )
                  }
                  title=""
                  trigger="click"
                >
                  <Tooltip title="Menu">
                    <Button
                      icon={<MoreOutlined />}
                      style={{ color: 'black' }}
                      aria-label="Menu options"
                    />
                  </Tooltip>
                </Dropdown>
              ) : 
              (
                <Tooltip title="Vous n'avez pas l'autorisation">
                  <Button
                    icon={<MoreOutlined />}
                    style={{ color: 'grey', cursor: 'not-allowed' }}
                    aria-label="Menu désactivé"
                    disabled
                  />
                </Tooltip>
              )
            }
            <Tooltip title="Pdf">
              <Button
                icon={<FilePdfOutlined />}
                onClick={() => handleAllDetails(record.id_tache)}
                aria-label="Voir en pdf"
                style={{ color: 'red' }}
                disabled={selectedRowKeys.length === 0}
              />
            </Tooltip>
            {role === 'Admin' ? (
            <Tooltip title="Supprimer">
              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer cette tâche ?"
                onConfirm={() => handleDelete(record.id_tache)}
                okText="Oui"
                cancelText="Non"
              >
                <Button
                  icon={<DeleteOutlined />}
                  style={{ color: 'red' }}
                  aria-label="Supprimer"
                />
              </Popconfirm>
            </Tooltip>
          ) : null}
          </Space>
      )
    }
  ];

  const onExpand = (expanded, record) => {
    const sousTaches = record.sousTaches || [];
    if (sousTaches.length > 0) {
      setExpandedRowKeys(expanded ? [record.id_tache] : []);
    }
  };
  
  const expandedRowRender = (record) => {
    const sousTaches = record.sousTaches || [];
    
    if (sousTaches.length === 0) {
      return null;
    }
  
    return (
      <Collapse
        defaultActiveKey={expandedRowKeys}
        onChange={() => onExpand(!expandedRowKeys.includes(record.id_tache), record)}
      >
        <Panel header="Tâche(s) liée(s)" key={record.id_tache}>
          <Table
            dataSource={sousTaches}
            columns={[
              {
                title: 'Titre',
                dataIndex: 'nom_tache',
                key: 'nom_tache',
                render: text => (
                  <Space style={columnStyles.title} className={columnStyles.hideScroll} onClick={() => handleViewDetails(record.id_tache)}>
                    <Tag icon={<FileTextOutlined />} color="cyan">
                      {text}
                    </Tag>
                  </Space>
                ),
              },
              {
                title: 'Statut',
                dataIndex: 'statut',
                key: 'statut',
                render: text => {
                  const { icon, color } = statusIcons[text] || {};
                  return (
                    <Space>
                      <Tag icon={icon} color={color}>
                        {text}
                      </Tag>
                    </Space>
                  );
                },
              },
              {
              title: 'Priorité',
              dataIndex: 'priorite',
              key: 'priorite',
              sorter: (a, b) => a.priorite - b.priorite,
              render: (priority, record) => {
                if (editingRow === record.id_tache) {
              return (
                <Select
                  name='priorite'
                  defaultValue={newPriority}
                  onChange={(value) => handleChangePriority(value, record)}
                  onBlur={() => setEditingRow(null)}
                  options={[
                    { value: 1, label: <span>{getPriorityIcon(1)} Très faible</span> },
                    { value: 2, label: <span>{getPriorityIcon(2)} Faible</span> },
                    { value: 3, label: <span>{getPriorityIcon(3)} Moyenne</span> },
                    { value: 4, label: <span>{getPriorityIcon(4)} Haute</span> },
                    { value: 5, label: <span>{getPriorityIcon(5)} Très haute</span> },
                  ]}
                  style={{ width: 120 }}
                />
              );
                }

                return (
                  <Tag onDoubleClick={() => handleDoubleClick(record)} color={getPriorityColor(priority)}>
                    {getPriorityIcon(priority)} {getPriorityLabel(priority)}
                  </Tag>
                );
              },
              },
              {
                title: 'Date début & fin',
                dataIndex: 'date_debut',
                key: 'date_debut',
                sorter: (a, b) => moment(a.date_debut) - moment(b.date_debut),
                sortDirections: ['descend', 'ascend'],
                render: (text, record) => (
                  <Tag icon={<CalendarOutlined />} color="blue">
                    {moment(text).format('DD-MM-yyyy')} & {moment(record.date_fin).format('DD-MM-yyyy')}
                  </Tag>
                ),
              },
              { 
                title: 'Fréquence', 
                dataIndex: 'frequence', 
                key: 'frequence',
                render: text => (
                  <Space>
                    <Tag icon={<CalendarOutlined />} color='blue'>{text}</Tag>
                  </Space>
                ),
                ...(columnsVisibility['Fréquence'] ? {} : { className: 'hidden-column' })

              },
              {
                title: 'Owner',
                dataIndex: 'owner',
                key: 'owner',
                ...getColumnSearchProps(
                  'owner',
                  searchText,
                  setSearchText,
                  '',
                  searchInput
                ),
                render: text => (
                  <Space>
                    <Tag icon={<TeamOutlined />} color="purple">
                      {text}
                    </Tag>
                  </Space>
                ),
              },
              {
                title: 'Action',
                key: 'action',
                width: '10%',
                render: (text, record) => (
                  <Space size="middle">
                    <Tooltip title="Modifier">
                      <Button
                        icon={<EditOutlined />}
                        style={{ color: 'green' }}
                        onClick={() => handleEdit(record.id_tache)}
                        disabled={role !== 'Admin' && !permissions[record.id_tache]?.can_edit}
                        aria-label="Edit tache"
                      />
                    </Tooltip>
                    <Tooltip title="Voir les détails">
                      <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record.id_tache)}
                        disabled={role !== 'Admin' && !permissions[record.id_tache]?.can_view}
                        aria-label="Voir les détails de la tâche"
                        style={{ color: 'blue' }}
                      />
                    </Tooltip>
                    { role === 'Admin' || permissions[record.id_tache]?.can_comment ? (
                      <Popover
                      content={
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <Link onClick={() => handleTracking(record.id_tache)}>
                            <FileTextOutlined /> Tracking
                          </Link>
                          <Link onClick={() => handleListeTracking(record.id_tache)}>
                            <FileTextOutlined /> Liste de tracking
                          </Link>
                          <Link onClick={() => handleDetailDoc(record.id_tache)}>
                            <FileTextOutlined /> Liste des docs
                          </Link>
                          <Link onClick={() => handleAjouterDoc(record.id_tache)}>
                            <FileTextOutlined /> Ajouter un doc
                          </Link>
                        </div>
                      }
                      title=""
                      trigger="click"
                    >
                      <Tooltip title="Menu">
                        <Button
                          icon={<MoreOutlined />}
                          style={{ color: 'black' }}
                          aria-label="Contrôler"
                        />
                      </Tooltip>
                    </Popover>
                    ) : 
                    (
                      <Tooltip title="Vous n'avez pas l'autorisation">
                        <Button
                          icon={<MoreOutlined />}
                          style={{ color: 'grey', cursor: 'not-allowed' }}
                          aria-label="Menu désactivé"
                          disabled
                        />
                      </Tooltip>
                    )
                    }
                    <Tooltip title="Supprimer">
                      <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cette tâche ?"
                        onConfirm={() => handleDelete(record.id_tache)}
                        okText="Oui"
                        cancelText="Non"
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          style={{ color: 'red' }}
                          aria-label="Delete"
                        />
                      </Popconfirm>
                    </Tooltip>
                  </Space>
                ),
              },
            ]}
            size="small"
            bordered
            pagination={false}
          />
        </Panel>
      </Collapse>
    );
  };

  const groupedTasks = groupTasks(data);
  const displayedData = filteredData(groupedTasks, searchValue);

  if (role === 'Manager' || role === 'Owner') {
    if (displayedData.length === 0) {
      return (
        <div className="access-message">
          <Alert
            message="Accès Restreint"
            description="Vous n'avez pas l'accès à cette fonctionnalité. Veuillez contacter votre administrateur."
            type="error"
            showIcon
            closable
            style={{ marginTop: 20 }}
          />
        </div>
      );
    }}

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-rows">
            <div className="client-row">
              <div className="client-row-icon">
                <FileDoneOutlined className='client-icon'/>
              </div>
              <h2 className="client-h2">Tâches</h2>
            </div>
            {
              role === 'Admin' &&
              <div className='client-row-lefts'>
              <span className='client-title'>
              Tâches trouvées : {loading ? <Skeleton.Input style={{ width: 100 }} active size='small' /> : total}
              </span>
              <div className="client-row-sous">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 1 }} />
                ) : (
                  statistique.map((s, index) => (
                    <div key={index}>
                      <span>{s.statut} : <strong>{s.nombre_taches}</strong></span>
                    </div>
                  ))
                )}
              </div>
            </div>
            }
          </div>
          {filterVisible && <FilterTaches onFilter={handleFilterChange}/>}
          <Tabs 
            defaultActiveKey="0"
            type="card"
            tabPosition="top"
          >
            <Tabs.TabPane tab='Liste de tache' key="0">
              <div className="client-actions">
                <div className="client-row-left">
                  <Search 
                    placeholder="Recherche..." 
                    enterButton 
                    onChange={(e) => setSearchValue(e.target.value)} 
                  />
                </div>
                <div className="client-rows-right">
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={handleAddTask}
                  >
                    Tâche
                  </Button>
                  <Button
                    className="button-excel"
                    icon={<FileExcelOutlined />}
                    onClick={handlExcelImport}
                  >
                    Exporter vers Excel
                  </Button>
                  <Button
                    type="default"
                    onClick={handFilter}
                  >
                    {filterVisible ? '🚫 Cacher les filtres' : '👁️ Afficher les filtres'}
                  </Button>
                  <Dropdown overlay={menu} trigger={['click']} className='client-export'>
                    <Button icon={<ExportOutlined />}>Exporter</Button>
                  </Dropdown>
                  <Dropdown overlay={menus} trigger={['click']}>
                    <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                      Colonnes <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <div className="tableau_client" id="printableTable">
                <Table
                  id="printableTable"
                  columns={columns}
                  rowSelection={rowSelection}
                  expandable={{
                    expandedRowRender: (record) => (record.sousTaches && record.sousTaches.length > 0 ? expandedRowRender(record) : null),
                    rowExpandable: (record) => record.sousTaches && record.sousTaches.length > 0,
                    onExpand
                  }}
                  dataSource={displayedData}
                  rowKey="id_tache"
                  size="small"
                  bordered
                  rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                  pagination={pagination}
                  onChange={(pagination) => setPagination(pagination)}
                  loading={loading}
                  scroll={scroll}
                />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Vue calendrier' key="1">
              <FormatCalendar/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Catégorie des taches' key="2">
              <ListCatTache/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Corps métier' key="3">
              <CorpsMetier/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Audit logs' key="4">
              <AuditLogTache/>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
      
      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        centered
      >
        <TacheForm idTache={idTache} closeModal={()=>setIsModalVisible(false)} fetchData={fetchData}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'DocumentTacheForm'}
        onCancel={closeAllModals}
        footer={null}
        centered
      >
        <TacheDoc idTache={idTache} fetchData={fetchData} closeModal={()=>setModalType(null)} />
      </Modal>

      <Modal
        title="Liste des documents"
        visible={modalType === 'ListeDoc'}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        centered
      >
        <ListeDocTache idTache={idTache} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'detail'}
        onCancel={closeAllModals}
        footer={null}
        width={1070}
        centered
      >
        <DetailTacheGlobalOne initialIdTache={idTache} allIds={allIds} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'suivi'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <SuiviTache idTache={idTache} closeModal={() => setModalType(null)} fetchData={fetchData} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'listeTracking'}
        onCancel={closeAllModals}
        footer={null}
        width={1025}
        centered
      >
        <ListeTracking idTache={idTache} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'SousTache'}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        centered
      >
        <SousTacheForm idTache={idTache} closeModal={()=>closeAllModals(null)} fetchData={fetchData} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'Alldetail'}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        centered
      >
        <AllDetail idTache={selectedTacheIds} closeModal={()=>closeAllModals(null)} fetchData={fetchData} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'excelImport'}
        onCancel={closeAllModals}
        footer={null}
        width={500}
        centered
      >
        <UploadTacheExcel closeModal={()=>closeAllModals(null)} fetchData={fetchData} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'AddTag'}
        onCancel={closeAllModals}
        footer={null}
        width={500}
        centered
      >
        <TacheTagsForm idTache={idTache} closeModal={()=>closeAllModals(null)} fetchData={fetchData} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'addAuto'}
        onCancel={closeAllModals}
        footer={null}
        width={1070}
        centered
      >
        <PermissionTache idTache={idTache}/>
      </Modal>
    </>
  );
};

export default Taches;
