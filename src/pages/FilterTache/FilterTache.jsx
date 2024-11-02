import { useEffect, useState } from "react";
import moment from 'moment';
import {  Button,notification, Space, Tag, Tooltip, Popover, Tabs, Popconfirm, Collapse, Select, Skeleton, Table } from 'antd';
import { 
    WarningOutlined,ApartmentOutlined, RocketOutlined, DollarOutlined, 
    CheckSquareOutlined, HourglassOutlined, ClockCircleOutlined, CheckCircleOutlined, 
    CalendarOutlined, TeamOutlined, UserOutlined, FileTextOutlined, FileDoneOutlined 
  } from '@ant-design/icons';
import { getTacheChartFilter, putPriorite } from "../../services/tacheService";
import { getPriorityColor, getPriorityIcon, getPriorityLabel } from "../../utils/prioriteIcons";
import './filterTache.scss'

const FilterTache = ({ selected, filters, dateRange }) => {
    const [data, setData] = useState([]);
    const scroll = { x: 400 };
    const [editingRow, setEditingRow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newPriority, setNewPriority] = useState(null); 
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
        "Categorie" : false
      });
      const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
      });

      const handleViewDetails = (idTache) => {
        
      };
    
    const fetchData = async () => {
        setLoading(true);
    
        try {
            const {data} = await getTacheChartFilter(selected, filters, dateRange);
            setData(data);
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
        fetchData();
    }, [selected, filters, dateRange]);

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

      const handleDoubleClick = (record) => {
        setEditingRow(record.id_tache);
        setNewPriority(record.priorite);
      };
    const handleChangePriority = (value, record) => {
        setNewPriority(value);
        setEditingRow(null);
        handleUpdatePriority(record.id_tache, value);
      };

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
          ...(columnsVisibility['DPT'] ? {} : { className: 'hidden-column' }),
    
        },
        {   
          title: 'Titre',
          dataIndex: 'nom_tache', 
          key: 'nom_tache', 
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
          render: text => (
            <Space>
              <Tag icon={<CalendarOutlined />} color='blue'>{text}</Tag>
            </Space>
          ),
          ...(columnsVisibility['Fréquence'] ? {} : { className: 'hidden-column' })
    
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
      ];

    return (
      <div className="filterTache">
        <div className="filterWrapper">
            <div className="filter_rows">
                <span className="filter_desc">Status : {selected} </span>
                <span className="filter_desc">Filtre appliqué : {filters}</span>
                { dateRange && <span className="filter_desc">Plage de dates : {dateRange[0]?.format('YYYY-MM-DD')} à {dateRange[1]?.format('YYYY-MM-DD')}</span>  }
            </div>
            <div>
            <Table
                id="id_tache"
                columns={columns}
                dataSource={data}
                rowKey="id_tache"
                size="small"
                bordered
                pagination={pagination}
                onChange={(pagination) => setPagination(pagination)}
                loading={loading}
                scroll={scroll}
            />;
            </div>
        </div>
      </div>
    );
  };
  
  export default FilterTache;