import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tag, Tooltip, Popover, Tabs, Popconfirm, Collapse, Select } from 'antd';
import { 
  ExportOutlined, WarningOutlined, ApartmentOutlined, RocketOutlined, DollarOutlined, 
  CheckSquareOutlined, HourglassOutlined,EditOutlined, ClockCircleOutlined, CheckCircleOutlined, 
  CalendarOutlined, TeamOutlined,DeleteOutlined,DownOutlined,MenuOutlined,PlusCircleOutlined, EyeOutlined, UserOutlined, FileTextOutlined, FileDoneOutlined 
} from '@ant-design/icons';
import TacheForm from './tacheform/TacheForm';
import { deletePutTache, getTache, putPriorite } from '../../services/tacheService';
import { Link } from 'react-router-dom';
import ListeDocTache from './listeDocTache/ListeDocTache';
import TacheDoc from './tacheDoc/TacheDoc';
import FormatCalendar from './formatCalendar/FormatCalendar';
import moment from 'moment';
import DetailTache from './detailTache/DetailTache';
import SuiviTache from './suiviTache/SuiviTache';
import ListeTracking from './listeTracking/ListeTracking';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import SousTacheForm from './sousTacheForm/SousTacheForm';
import './taches.scss'
import { getPriorityColor, getPriorityIcon, getPriorityLabel, getPriorityTag } from '../../utils/prioriteIcons';
import { groupTasks } from '../../utils/tacheGroup';

const { Search } = Input;
const { Panel } = Collapse;

const Taches = () => {
  const [data, setData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [idTache, setIdTache] = useState('');
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
    "Owner": true
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });
  const [editingRow, setEditingRow] = useState(null);
  const [newPriority, setNewPriority] = useState(null); 

  const handleDoubleClick = (record) => {
    setEditingRow(record.id_tache);
    setNewPriority(record.priorite);
  };

  const handleChangePriority = (value, record) => {
    setNewPriority(value);
    setEditingRow(null);
    handleUpdatePriority(record.id_tache, value);
  };

  const handleDelete = async (id) => {
    try {
       await deletePutTache(id);
      setData(data.filter((item) => item.id_tache !== id));
      message.success('Tache supprimée avec succès');
    } catch (error) {
      notification.error({
        message: 'Erreur de suppression',
        description: 'Une erreur est survenue lors de la suppression du budget.',
      });
    }
  };

    const fetchData = async () => {
      try {
        const response = await getTache();
        setData(response.data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };

    useEffect(() => {
    fetchData();
  }, []);


  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idTache = '') => {
    closeAllModals();
    setIdTache(idTache);
    setModalType(type);
  };

  const handleEdit = (idTache) => {
    setIdTache(idTache);
    setIsModalVisible(true);

  };

  const handleViewDetails = (idTache) => {
    message.info(`Affichage des détails de la tâche : ${idTache}`);
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

  const handleAddTask = () => {
    setIdTache('')
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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

  const statusIcons = {
    'En attente': { icon: <ClockCircleOutlined />, color: 'orange' },
    'En cours': { icon: <HourglassOutlined />, color: 'blue' },
    'Point bloquant': { icon: <WarningOutlined />, color: 'red' },
    'En attente de validation': { icon: <CheckSquareOutlined />, color: 'purple' },
    'Validé': { icon: <CheckCircleOutlined />, color: 'green' },
    'Budget': { icon: <DollarOutlined />, color: 'gold' },
    'Executé': { icon: <RocketOutlined />, color: 'cyan' },
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
      render: text => (
        <Space>
          <Tag icon={<ApartmentOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
      ...(columnsVisibility['DPT'] ? {} : { className: 'hidden-column' })

    },
    {   
      title: 'Titre',
      dataIndex: 'nom_tache', 
      key: 'nom_tache', 
      render: text => (
        <Space style={columnStyles.title} className={columnStyles.hideScroll}>
          <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
      ...(columnsVisibility['Titre'] ? {} : { className: 'hidden-column' }),
    },
    {   
      title: 'Client', 
      dataIndex: 'nom_client', 
      key: 'nom_client',
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
      render : (text, record) => (
        <Space size="middle">
            <Tooltip title="Modifier">
              <Button
                icon={<EditOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleEdit(record.id_tache)}
                aria-label="Edit tache"
              />
          </Tooltip>
          <Tooltip title="Voir les détails">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record.id_tache)}
              aria-label="Voir les détails de la tâche"
              style={{color: 'green'}}
            />
          </Tooltip>
          <Popover
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link onClick={() => handleTracking(record.id_tache)} >
                  <FileTextOutlined /> Tracking
                </Link>
                <Link onClick={()=>handleListeTracking(record.id_tache)}>
                  <FileTextOutlined /> Liste de tracking
                </Link>
                <Link onClick={() => handleSousTache(record.id_tache)} >
                  <FileTextOutlined /> Créer sous-tâche
                </Link>
                <Link onClick={() => handleDetailDoc(record.id_tache)} >
                  <FileTextOutlined /> Liste des docs
                </Link>
                <Link onClick={() => handleAjouterDoc(record.id_tache)} >
                  <FileTextOutlined /> Ajouter un doc
                </Link>
              </div>
            }
            title=""
            trigger="click"
          >
            <Tooltip title="Menu">
              <Button
                icon={<PlusCircleOutlined />}
                style={{ color: 'blue' }}
                aria-label="Contrôler"
              />
            </Tooltip>
          </Popover>
          <Tooltip title="Supprimer">
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer cette tache ?"
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
                  <Space style={columnStyles.title} className={columnStyles.hideScroll}>
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
                render: priority => getPriorityTag(priority),
                ...(columnsVisibility['Priorite'] ? {} : { className: 'hidden-column' })
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
                        aria-label="Edit tache"
                      />
                    </Tooltip>
                    <Tooltip title="Voir les détails">
                      <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record.id_tache)}
                        aria-label="Voir les détails de la tâche"
                        style={{ color: 'green' }}
                      />
                    </Tooltip>
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
                          icon={<PlusCircleOutlined />}
                          style={{ color: 'blue' }}
                          aria-label="Contrôler"
                        />
                      </Tooltip>
                    </Popover>
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
            pagination={false}
          />
        </Panel>
      </Collapse>
    );
  };

  const filterSubTasks = (subTasks, searchValue) => {
    return subTasks.filter(task =>
      task.nom_tache?.toLowerCase().includes(searchValue.toLowerCase()) ||
      task.statut?.toLowerCase().includes(searchValue.toLowerCase()) ||
      task.owner?.toLowerCase().includes(searchValue.toLowerCase())
    );
  };
  
  const filteredData = (tasks, searchValue) => {
    return tasks.filter(task => {
      const filteredSubTasks = filterSubTasks(task.sousTaches || [], searchValue);
      return filteredSubTasks.length > 0 || 
             task.nom_tache?.toLowerCase().includes(searchValue.toLowerCase()) ||
             task.departement?.toLowerCase().includes(searchValue.toLowerCase()) ||
             task.nom_client?.toLowerCase().includes(searchValue.toLowerCase()) ||
             task.statut?.toLowerCase().includes(searchValue.toLowerCase()) ||
             task.frequence?.toLowerCase().includes(searchValue.toLowerCase()) ||
             task.owner?.toLowerCase().includes(searchValue.toLowerCase());
    }).map(task => ({
      ...task,
      sousTaches: filterSubTasks(task.sousTaches || [], searchValue),
    }));
  };

  const groupedTasks = groupTasks(data);
  const displayedData = filteredData(groupedTasks, searchValue);

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileDoneOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Tâches</h2>
          </div>
          <Tabs defaultActiveKey="0">
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
                  expandable={{
                    expandedRowRender: (record) => (record.sousTaches && record.sousTaches.length > 0 ? expandedRowRender(record) : null),
                    rowExpandable: (record) => record.sousTaches && record.sousTaches.length > 0, // Condition pour montrer l'icône d'expansion
                    onExpand
                  }}
                  dataSource={displayedData}
                  rowKey="id_tache"
                  size="small"
                  bordered
                  pagination={pagination}
                  onChange={(pagination) => setPagination(pagination)}
                  loading={loading}
                  scroll={scroll}
                />;
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Vue calendrier' key="1">
              <FormatCalendar/>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>

      <Modal
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={850}
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
        <TacheDoc idTache={idTache} />
      </Modal>

      <Modal
        title="Liste des documents"
        visible={modalType === 'ListeDoc'}
        onCancel={closeAllModals}
        footer={null}
        width={850}
        centered
      >
        <ListeDocTache idTache={idTache} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'detail'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <DetailTache idTache={idTache} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'suivi'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <SuiviTache idTache={idTache} closeModal={() => setModalType(null)} fetchData={fetchData} />
      </Modal>

      <Modal
        title="Liste de tracking"
        visible={modalType === 'listeTracking'}
        onCancel={closeAllModals}
        footer={null}
        width={850}
        centered
      >
        <ListeTracking idTache={idTache} />
      </Modal>

      <Modal
        title="Sous tache"
        visible={modalType === 'SousTache'}
        onCancel={closeAllModals}
        footer={null}
        width={850}
        centered
      >
        <SousTacheForm idTache={idTache} closeModal={()=>closeAllModals(null)} fetchData={fetchData} />
      </Modal>
    </>
  );
};

export default Taches;
