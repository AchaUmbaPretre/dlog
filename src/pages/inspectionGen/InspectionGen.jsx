import { useCallback, useEffect, useState } from 'react'
import { Input, Button, Tabs, Menu, Tooltip, Typography, message, Skeleton, Tag, Table, Space, Dropdown, Modal, notification } from 'antd';
import { FileSearchOutlined, StockOutlined, AppstoreOutlined, EditOutlined, FileImageOutlined, ExclamationCircleOutlined, DeleteOutlined, ExportOutlined, FileExcelOutlined, FilePdfOutlined,  UserOutlined, PlusOutlined, CloseCircleOutlined, ToolOutlined, MenuOutlined, DownOutlined, EyeOutlined, FileTextOutlined, MoreOutlined, CarOutlined, CalendarOutlined, PlusCircleOutlined } from '@ant-design/icons'
import InspectionGenForm from './inspectionGenForm/InspectionGenForm';
import { deleteInspectionGen, getInspectionGen} from '../../services/charroiService';
import moment from 'moment';
import InspectionGenDetail from './inspectionGenDetail/InspectionGenDetail';
import InspectionGenValider from './inspectionGenValider/InspectionGenValider';
import InspectionGenTracking from './inspectionGenTracking/InspectionGenTracking';
import InspectionGenFormTracking from './inspectionGenTracking/inspectionGenFormTracking/InspectionGenFormTracking';
import ReparationForm from '../controleTechnique/reparation/reparationForm/ReparationForm';
import './inspectionGen.css'
import { useSelector } from 'react-redux';
import { getInspectionIcon, statusIcons } from '../../utils/prioriteIcons';
import getColumnSearchProps from '../../utils/columnSearchUtils';
import { useRef } from 'react';
import FilterInspectionGen from './filterInspectionGen/FilterInspectionGen';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import InspectionGenDoc from './inspectionGenDoc/InspectionGenDoc';
import { handleRepair, handleValider } from '../../utils/modalUtils';
import InspectionImage from './inspectionImage/InspectionImage';
import ReparationDetail from '../controleTechnique/reparation/reparationDetail/ReparationDetail';
import CatInspection from '../catInspection/CatInspection';
import InspectionRapport from './inspectionRapport/InspectionRapport';

const { Text } = Typography;
const { Search } = Input;

const InspectionGen = () => {
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [modalType, setModalType] = useState(null);
    const scroll = { x: 'max-content' };
    const [inspectionId, setInspectionId] = useState('');
    const role = useSelector((state) => state.user?.currentUser?.role);
    const [columnsVisibility, setColumnsVisibility] = useState({
      '#': true,
      'Matricule': true,
      'Code' : true,
      'Marque': true,
      'Date inspection': true,
      'Date réparation' : false,
      'type_rep': true,
      "Cat inspection" : true,
      "Avis d expert": false,
      "Montant": true,
      'Statut vehicule': true,
      'Date validation':true,
      'Statut': true,
      'Type rep': true,
      'Budget_valide' : true,
      'Nom chauffeur' : false,
      'Kilometrage' : false,
      'Chauffeur': false
    });
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [filteredDatas, setFilteredDatas] = useState(null);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [vehicule, setVehicule] = useState(null)
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statistique, setStatistique] = useState(null);
    const [activeKey, setActiveKey] = useState(['1', '2']);

    const handleTabChange = (key) => {
      setActiveKey(key);
    };

    const handleExportExcel = () => {
      try {
        const formattedData = data.map((record, index) => ({
          "#": index + 1,
          "Matricule": record.immatriculation || 'N/A',
          "Marque": record.nom_marque || 'Inconnu',
          "Chauffeur": record.nom_chauffeur || '—',
          "Date Inspection": record.date_inspection
            ? moment(record.date_inspection).format('DD/MM/YYYY')
            : '—',
          "Date Réparation": record.date_reparation
            ? moment(record.date_reparation).format('DD/MM/YYYY')
            : '—',
          "Date Validation": record.date_validation
            ? moment(record.date_validation).format('DD/MM/YYYY')
            : '—',
          "Type de Rép.": record.type_rep || 'N/A',
          "Avis d'expert": record.avis || '—',
          "Budget": record.montant ? `${record.montant} $` : '0 $',
          "Validé": record.budget_valide ? `${record.montant} $` : '0 $',
          "Kilométrage": record.kilometrage || '—',
          "Statut": record.nom_statut_vehicule || 'Non spécifié',
        }));
    
        // 📄 Création de la feuille
        const ws = XLSX.utils.json_to_sheet(formattedData);
    
        // 📏 Définition des largeurs de colonnes
        const columnWidths = new Array(Object.keys(formattedData[0]).length).fill({ wpx: 120 });
        ws['!cols'] = columnWidths;
    
        // 🎨 Style de l'en-tête
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell = ws[XLSX.utils.encode_cell({ r: 0, c: col })];
          if (cell) {
            cell.s = {
              font: { bold: true, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: "2E8B57" } },
              alignment: { horizontal: "center", vertical: "center" },
            };
          }
        }
    
        // 📘 Création du classeur Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inspection");
    
        // 💾 Exportation
        XLSX.writeFile(wb, "Inspection.xlsx");
    
        // ✅ Confirmation utilisateur
        message.success("Exportation Excel réussie !");
      } catch (error) {
        console.error("Erreur lors de l'exportation Excel :", error);
        message.error("Une erreur est survenue lors de l'exportation.");
      }
    };
    
    const handleExportPDF = () => {
      try {
        const doc = new jsPDF();
    
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Liste des inspections", 14, 22);
    
        const tableColumn = [
          "#",
          "Matricule",
          "Marque",
          "Date Inspection",
          "Type de réparation",
          "Budget",
          "Validé",
          "Statut véhicule"
        ];
    
        const tableRows = [];
    
        data.forEach((record, index) => {
          const formattedDate = record.date_inspection
            ? moment(record.date_inspection).format('DD/MM/YYYY')
            : '—';
    
          const tableRow = [
            index + 1,
            record.immatriculation || 'N/A',
            record.nom_marque || 'Inconnu',
            formattedDate,
            record.type_rep || 'N/A',
            record.montant ? `${record.montant} $` : '0 $',
            record.budget_valide ? 'Oui' : 'Non',
            record.nom_statut_vehicule || 'Non spécifié',
          ];
          tableRows.push(tableRow);
        });
    
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 30,
          theme: 'grid',
          headStyles: {
            fillColor: [34, 139, 34],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center',
          },
          bodyStyles: {
            fontSize: 10,
            halign: 'center',
          },
          columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
          },
          margin: { top: 10, left: 14, right: 14 },
          styles: {
            cellPadding: 3,
          },
          didDrawPage: function (data) {
            // 🕒 Date d'export
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Exporté le : ${moment().format('DD/MM/YYYY à HH:mm')}`, 14, 10);
          },
        });
    
        doc.save('Liste_Inspections.pdf');
    
        message.success("Exportation PDF réussie !");
      } catch (error) {
        console.error("Erreur lors de l'export PDF :", error);
        message.error("Une erreur est survenue pendant l'export.");
      }
    };

    const fetchDataInsp = useCallback(async (filters, searchValue) => {
        setLoading(true);
        try {
          const [inspectionData] = await Promise.all([
            getInspectionGen(searchValue, filters),
          ]);
          setData(inspectionData.data.inspections);
          setStatistique(inspectionData.data.stats);
        } catch (error) {
          notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
          });
        } finally {
          setLoading(false);
        }
    }, []);

    const handFilter = () => {
      fetchDataInsp()
      setFilterVisible(!filterVisible)
    }

    const showDeleteConfirm = (id, userId, setData) => {
      Modal.confirm({
        title: (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ExclamationCircleOutlined style={{ fontSize: 28, color: "#FF4D4F" }} />
            <Text strong style={{ fontSize: 18, color: "#333", fontWeight: '600' }}>
              Suppression Définitive
            </Text>
          </div>
        ),
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>
              Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette inspection ?
            </Text>
            <Text type="danger" style={{ fontSize: 14, marginTop: 12 }}>
              Cette suppression ne peut pas être annulée.
            </Text>
          </div>
        ),
        okText: "Oui, supprimer",
        cancelText: "Annuler",
        okType: "danger",
        centered: true,
        maskClosable: true,
        icon: null,
        okButtonProps: {
          style: {
            backgroundColor: "#FF4D4F",
            borderColor: "#FF4D4F",
            fontWeight: 600,
            color: "#fff",
            borderRadius: 4,
            transition: 'all 0.3s ease-in-out',
          },
          onMouseEnter: (e) => {
            e.target.style.backgroundColor = '#FF2A2A'; // Hover effect
          },
          onMouseLeave: (e) => {
            e.target.style.backgroundColor = '#FF4D4F'; // Reset on hover out
          },
        },
        cancelButtonProps: {
          style: {
            fontWeight: 600,
            color: "#333",
            borderRadius: 4,
            borderColor: "#ddd",
            transition: 'all 0.3s ease-in-out',
          },
        },
        onOk: async () => {
          try {
            await deleteInspectionGen({
              id_sub_inspection_gen : id,
              user_id: userId,
            });
            setData((prevData) => prevData.filter((item) => item.id_sub_inspection_gen  !== id));
            message.success("L'inspection a été supprimée avec succès.", 3);
          } catch (error) {
            notification.error({
              message: "Erreur de suppression",
              description: "Une erreur est survenue lors de la suppression d'inspection.",
              duration: 5,
            });
          }
        },
      });
    };

    useEffect(() => {
      fetchDataInsp(filteredDatas,searchValue);
  }, [searchValue, filteredDatas, filterVisible]);

  const handleAddInspection = () => openModal('Add');
  const handleEdit = (id) => openModal('Edit', id)
  const handleDetail = (id) => openModal('DetailInspection', id)

  const closeAllModals = () => {
    setModalType(null);
  };

  const handleRapportInsp = () => openModal('rapport')

  const openModal = (type, inspectionId = '', vehicule) => {
    closeAllModals();
    setModalType(type);
    setInspectionId(inspectionId)
    setVehicule(vehicule)
  };

  const getActionMenu = (record, openModal) => {
    const handleClick = ({ key }) => {

      switch (key) {
        case 'voirDetail':
          openModal('DetailInspection', record.id_inspection_gen)
          break;
        case 'validerInspection':
          handleValider(openModal, record)
          break;
        case 'DetailSuivi':
          openModal('DetailSuivi', record.id_sub_inspection_gen)
          break;
        case 'ajouterSuivi':
          openModal('AddSuivi', record.id_sub_inspection_gen)
          break;
        case 'reparer':
          handleRepair(openModal, record);
          break;
        case 'modifier':
          openModal('Edit', record.id_sub_inspection_gen)
          break;
        case 'document':
          openModal('Document', record.id_sub_inspection_gen)
          break;
        case 'image':
          openModal('Image', record.id_sub_inspection_gen, record.immatriculation)
          break;
        default:
          break;
        }
        };
      
        return (
          <Menu onClick={handleClick}>
            <Menu.SubMenu
              key="inspection"
              title={
                <>
                  <FileTextOutlined style={{ color: '#1890ff' }} /> Inspection
                </>
              }
            >
              <Menu.Item key="voirDetail">
                <EyeOutlined style={{ color: 'green' }} /> Voir Détail
              </Menu.Item>
              <Menu.Item key="validerInspection">
                <PlusOutlined style={{ color: 'orange' }} /> Valider
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Divider />

            <Menu.SubMenu
              key="tracking"
              title={
                <>
                  <FileSearchOutlined style={{ color: 'green' }} /> Tracking
                </>
              }
            >
              <Menu.Item key="DetailSuivi">
                <EyeOutlined style={{ color: 'green' }} /> Voir Détail
              </Menu.Item>
              <Menu.Item key="ajouterSuivi">
                <PlusOutlined style={{ color: 'orange' }} /> Ajouter
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Divider />

            <Menu.Item key="reparer">
                <ToolOutlined style={{ color: 'orange' }} /> Réparer
            </Menu.Item>

            <Menu.Item key="document">
              <FileTextOutlined style={{ color: 'blue' }} /> Document
            </Menu.Item>

            <Menu.Item key="image">
              <FileImageOutlined style={{ color: 'magenta' }} /> Image
            </Menu.Item>
          </Menu>
        );
  };

  const columnStyles = {
        title: {
          maxWidth: '220px',
          whiteSpace: 'nowrap',
          overflowX: 'scroll', 
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none', 
        },
        hideScroll: {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
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
    
  const handleFilterChange = (newFilters) => {
    setFilteredDatas(newFilters); 
  };

  const toggleColumnVisibility = (columnName, e) => {
    e.stopPropagation();
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
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
    },
    {
      title: 'Code',
      dataIndex: 'id_sub_inspection_gen',
      key: 'id_sub_inspection_gen',
      ...getColumnSearchProps(
        'id_sub_inspection_gen',
          searchText,
          setSearchText,
          setSearchedColumn,
          searchInput,
          searchedColumn
        ),
      render: (text, record) => (
        <Tag color="blue">{`${new Date().getFullYear().toString().substring(2)}${record.id_sub_inspection_gen.toString().padStart(4, '0')}`}</Tag>
      ),
      ...(columnsVisibility['Code'] ? {} : { className: 'hidden-column' }),
    },
    {
        title: 'Matricule',
        dataIndex: 'immatriculation',
        ...getColumnSearchProps(
        'immatriculation',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput,
            searchedColumn
        ),
        render: (text, record) => (
          <div className="vehicule-matricule">
            <span className="car-wrapper">
              <span className="car-boost" />
                <CarOutlined className="car-icon-animated" onClick={() => handleDetail(record.id_inspection_gen)} />
              <span className="car-shadow" />
            </span>
              <Tag color="blue">{text}</Tag>
          </div>
          ),
          ...(columnsVisibility['Matricule'] ? {} : { className: 'hidden-column' }),
    },
    {
          title: 'Chauffeur',
          dataIndex: 'nom_chauffeur',
          ...getColumnSearchProps(
            'nom',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
          ),
          render: (text, record) => (
              <Tag icon={<UserOutlined />} color="orange">
                  {text}
              </Tag>
          ),
          ...(columnsVisibility['Chauffeur'] ? {} : { className: 'hidden-column' }),
    },                       
    {
            title: 'Marque',
            dataIndex: 'nom_marque',
            ...getColumnSearchProps(
              'nom_marque',
              searchText,
              setSearchText,
              setSearchedColumn,
              searchInput
            ),
            render: (text, record) => (
                <Tag icon={<CarOutlined />} color="orange">
                    {text}
                </Tag>
            ),
            ...(columnsVisibility['Marque'] ? {} : { className: 'hidden-column' }),

    },
    {
      title: 'Date',
      dataIndex: 'date_inspection',
      key: 'date_inspection',
        sorter: (a,b) => moment(a.date_inspection) - (b.date_inspection),
          sortDirections: ['descend', 'ascend'],
            render: (text) => (
              <Tag icon={<CalendarOutlined />} color="blue">
                  {moment(text).format('DD-MM-YYYY')}
              </Tag>
            ),
            ...(columnsVisibility['Date inspection'] ? {} : { className: 'hidden-column' }),

    },
    {
      title: 'Date rep.',
      dataIndex: 'date_reparation',
        sorter: (a, b) => moment(a.date_reparation) - moment(b.date_reparation),
          sortDirections: ['descend', 'ascend'],
            render: (text) => {
              if (!text) {
                return (
                  <Tag icon={<CalendarOutlined />} color="red">
                    Aucune date
                  </Tag>
                );
              }
          
              const date = moment(text);
              const isValid = date.isValid();
          
              return (
                <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
                  {isValid ? date.format('DD-MM-YYYY') : 'Date invalide'}
                </Tag>
              );
            },
            ...(columnsVisibility['Date réparation'] ? {} : { className: 'hidden-column' }),
    },          
    {
      title: 'Type de rep.',
      dataIndex: 'type_rep',
      ...getColumnSearchProps(
        'type_rep',
        searchText,
        setSearchText,
        setSearchedColumn,
        searchInput
      ),
      render: (text) => (
        <Tag icon={<ToolOutlined spin />} style={columnStyles.title} className={columnStyles.hideScroll} color='volcano' bordered={false}>
          {text}
        </Tag>
      ),
      ...(columnsVisibility['Type rep'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: 'Cat inspect.',
      dataIndex: 'nom_cat_inspection',
      ...getColumnSearchProps(
      'nom_cat_inspection',
        searchText,
        setSearchText,
        setSearchedColumn,
        searchInput
      ),
          render: (text) => {
            const { icon, color } = getInspectionIcon(text);
            return (
              <Tag
                icon={icon}
                color={color}
                style={columnStyles.title}
                className={columnStyles.hideScroll}
              >
                {text}
              </Tag>
            );
          },
          ...(columnsVisibility['Cat inspection'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: "Avis d'expert",
          dataIndex: 'avis',
          ...getColumnSearchProps(
            'avis',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
        ),
          render: (text) => (
            <div style={columnStyles.title} className={columnStyles.hideScroll}>
              {text}
            </div>
          ),
          ...(columnsVisibility['Avis d expert'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: "Budget",
          dataIndex: 'montant',
          key: 'montant',
          sorter: (a, b) => a.montant - b.montant,
            sortDirections: ['descend', 'ascend'],
            render: (text) => (
                <Space style={columnStyles.title} className={columnStyles.hideScroll} >
                    <Tag color="green">
                        {text
                            ? `${parseFloat(text)
                                .toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                })
                                .replace(/,/g, " ")} $`
                            : "0.00"}
                    </Tag>
                </Space>
            ),
          ...(columnsVisibility['Montant'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: "#Validé",
          dataIndex: 'budget_valide',
          key: 'budget_valide',
          sorter: (a, b) => a.budget_valide - b.budget_valide,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Space style={columnStyles.title} className={columnStyles.hideScroll}>
              {text && parseFloat(text) !== 0 ? (
                <Tag color="blue">
                  {`${parseFloat(text)
                    .toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    .replace(/,/g, " ")} $`}
                </Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="red">Non validé</Tag>
              )}
            </Space>
          ),
          ...(columnsVisibility['Budget_valide'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'KM',
          dataIndex: 'kilometrage',
          render: (text) => (
            <Tag color={ text > 0 ? 'green' : 'red' }>
              {text ?? 0}
            </Tag>
          ),
          ...(columnsVisibility['Kilometrage'] ? {} : { className: 'hidden-column' }),
        },      
        {
          title: 'Date validation',
          dataIndex: 'date_validation',
          render: (text) => {
            if (!text) {
              return (
                <Tag icon={<CalendarOutlined />} color="red">
                      Aucune date
                </Tag>
              );
            }
            const date = moment(text);
            const isValid = date.isValid();
            
            return (
                <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
                  {isValid ? date.format('DD-MM-YYYY') : 'Date invalide'}
                </Tag>
              );
            },
          ...(columnsVisibility['Date validation'] ? {} : { className: 'hidden-column' }),
        },
        { 
          title: '#Véhicule', 
          dataIndex: 'nom_statut_vehicule', 
          key: 'nom_statut_vehicule',
          ...getColumnSearchProps(
            'nom_statut_vehicule',
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
          ...(columnsVisibility['Statut vehicule'] ? {} : { className: 'hidden-column' }),
        },
        { 
          title: 'Statut', 
          dataIndex: 'nom_type_statut', 
          key: 'nom_type_statut',
          ...getColumnSearchProps(
            'nom_type_statut',
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
            ...(columnsVisibility['Statut'] ? {} : { className: 'hidden-column' }),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
              <Space>
                <Tooltip title="Modifier">
                  <Button
                    icon={<EditOutlined />}
                    style={{ color: 'green' }}
                    onClick={() => handleEdit(record.id_sub_inspection_gen)}
                    aria-label="Edit tache"
                  />
                </Tooltip>
                <Dropdown overlay={getActionMenu(record, openModal)} trigger={['click']}>
                  <Button icon={<MoreOutlined />} style={{ color: 'blue' }} />
                </Dropdown>
                <Tooltip title="Supprimer">
                    <Button
                      icon={<DeleteOutlined />}
                      style={{ color: 'red' }}
                      aria-label="Supprimer"
                      onClick={() => showDeleteConfirm(record.id_sub_inspection_gen, userId, setData)}
                    />
                </Tooltip>
              </Space>
            )
          }
    ]

  const menu = (
      <Menu>
        <Menu.Item key="1" onClick={handleExportExcel}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileExcelOutlined style={{ color: '#1D6F42' }} />
            Export to Excel
          </span>
        </Menu.Item>
        <Menu.Item key="2" onClick={handleExportPDF}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FilePdfOutlined style={{ color: '#E53935' }} /> 
            Export to PDF
          </span>
        </Menu.Item>
      </Menu>
    );
    
  const filteredData = data.filter(item =>
    item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_marque?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.commentaire?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom?.toLowerCase().includes(searchValue.toLowerCase()) || 
    item.nom_type_statut?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
        <Tabs
          activeKey={activeKey[0]}
          onChange={handleTabChange}
          type="card"
          tabPosition="top"
          renderTabBar={(props, DefaultTabBar) => <DefaultTabBar {...props} />}
        >
          <Tabs.TabPane
              tab={
                <span>
                  <FileSearchOutlined
                    style={{
                      color: '#1890ff',
                      fontSize: '18px',
                      marginRight: '8px',
                    }}
                  />
                  Inspection
                </span>
              }
            key="1"
          >
            <div className="client">
              <div className="client-wrapper">
                  <div className="client-rows">
                    <div className="client-row">
                        <div className="client-row-icon">
                            <FileSearchOutlined className='client-icon'/>
                        </div>
                        <h2 className="client-h2">Inspection</h2>
                    </div>
                    {
                        role === 'Admin' &&
                    <div className='client-row-lefts'>
                        <span className='client-title'>
                        Resumé :
                        </span>
                        <div className="client-row-sou">
                          {loading ? (
                            <Skeleton active paragraph={{ rows: 1 }} />
                          ) : (
                              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'10px'}}>
                                <span style={{fontSize:'.8rem',  fontWeight:'200'}}>#Inspection : <strong>{statistique?.nbre_inspection?.toLocaleString()}</strong></span>
                                <span style={{fontSize:'.8rem',  fontWeight:'200'}}>#Véhicule : <strong>{Math.round(parseFloat(statistique?.nbre_vehicule)).toLocaleString() || 0}</strong></span>
                                <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                                  Budget non validé : <strong>
                                    {Number.isFinite(parseFloat(statistique?.budget_total))
                                      ? Math.round(parseFloat(statistique?.budget_total)).toLocaleString()
                                      : 0} $</strong>
                                </span>

                                <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                                  Budget validé  : <strong>
                                    {Number.isFinite(parseFloat(statistique?.budget_valide))
                                      ? Math.round(parseFloat(statistique?.budget_valide)).toLocaleString()
                                      : 0} $</strong>
                                </span>

                                <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                                  #Immobile : <strong>
                                    {Number.isFinite(parseFloat(statistique?.nbre_vehicule_immobile))
                                      ? Math.round(parseFloat(statistique?.nbre_vehicule_immobile)).toLocaleString()
                                      : 0}</strong>
                                </span>

                                <span style={{ fontSize: '.8rem', fontWeight: '200' }}>
                                  #En réparation : <strong>
                                    {Number.isFinite(parseFloat(statistique?.nbre_reparation))
                                      ? Math.round(parseFloat(statistique?.nbre_reparation)).toLocaleString()
                                      : 0}</strong>
                                </span>
                              </div>
                          )}
                        </div>
                      </div>
                      }
                  </div>
                    <div className="client-actions">
                      <div className="client-row-left">
                        <Search 
                          placeholder="Recherche..." 
                          onChange={(e) => setSearchValue(e.target.value)}
                          enterButton
                        />
                      </div>
                      <div className="client-rows-right">
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                onClick={handleAddInspection}
                            >
                                Ajouter
                            </Button>
                            
                            <Tooltip title="Cliquez pour voir le rapport complet">
                              <Button
                                type="primary"
                                icon={<StockOutlined />}
                                onClick={handleRapportInsp}
                                style={{
                                  backgroundColor: '#6a8bff',
                                  borderColor: '#6a8bff',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  padding: '8px 20px',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                }}
                                aria-label="Générer le rapport des stocks"
                              >
                                Générer Rapport
                              </Button>
                            </Tooltip>

                            <Dropdown overlay={menu} trigger={['click']}>
                              <Button icon={<ExportOutlined />}>Export</Button>
                            </Dropdown>
                            <Button
                              type="default"
                              onClick={handFilter}
                            >
                              {filterVisible ? '🚫 Cacher les filtres' : '👁️ Afficher les filtres'}
                            </Button>

                            <Dropdown overlay={menus} trigger={['click']}>
                              <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                                Colonnes <DownOutlined />
                              </Button>
                            </Dropdown>
                      </div>
                    </div>
                    {filterVisible && <FilterInspectionGen onFilter={handleFilterChange}/>}
                    <Table
                      columns={columns}
                      dataSource={filteredData}
                      rowKey="id_inspection_gen"
                      loading={loading}
                      scroll={scroll}
                      size="small"
                      onChange={(pagination)=> setPagination(pagination)}
                      bordered
                      rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    />
              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane
              tab={
                    <span>
                        <AppstoreOutlined
                            style={{
                              color: '#fa8c16',
                              fontSize: '18px',
                              marginRight: '8px',
                            }}
                        />
                          Categorie
                    </span>
                }
            key="2"
          >
                <CatInspection/>
          </Tabs.TabPane>

        </Tabs>

        <Modal
            title=""
            visible={modalType === 'Add'}
            onCancel={closeAllModals}
            footer={null}
            width={1023}
            centered
        >
            <InspectionGenForm closeModal={() => setModalType(null)} fetchData={fetchDataInsp} idSubInspectionGen={''} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Edit'}
            onCancel={closeAllModals}
            footer={null}
            width={1023}
            centered
        >
          <InspectionGenForm closeModal={() => setModalType(null)} fetchData={fetchDataInsp} idSubInspectionGen={inspectionId} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'DetailInspection'}
            onCancel={closeAllModals}
            footer={null}
            width={1023}
            centered
        >
            <InspectionGenDetail inspectionId={inspectionId} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'AddValider'}
            onCancel={closeAllModals}
            footer={null}
            width={1000}
            centered
        >
          <InspectionGenValider closeModal={() => setModalType(null)} fetchData={fetchDataInsp} inspectionId={inspectionId} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'updatedValider'}
          onCancel={closeAllModals}
          footer={null}
          width={1000}
          centered
        >
          <InspectionGenValider closeModal={() => setModalType(null)} fetchData={fetchDataInsp} inspectionId={inspectionId} modelTypes={modalType} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'DetailSuivi'}
            onCancel={closeAllModals}
            footer={null}
            width={1023}
            centered
        >
            <InspectionGenTracking idSubInspectionGen={inspectionId} closeModal={() => setModalType(null)} fetchData={fetchDataInsp} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'AddSuivi'}
          onCancel={closeAllModals}
          footer={null}
          width={800}
          centered
        >
          <InspectionGenFormTracking idSubInspectionGen={inspectionId} closeModal={() => setModalType(null)} fetchData={fetchDataInsp} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Reparer'}
            onCancel={closeAllModals}
            footer={null}
            width={1000}
            centered
        >
            <ReparationForm closeModal={() => setModalType(null)} fetchData={fetchDataInsp} subInspectionId={inspectionId} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Document'}
            onCancel={closeAllModals}
            footer={null}
            width={1000}
            centered
        >
          <InspectionGenDoc closeModal={() => setModalType(null)} fetchData={fetchDataInsp} subInspectionId={inspectionId} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'Image'}
          onCancel={closeAllModals}
          footer={null}
          width={750}
          centered
        >
          <InspectionImage closeModal={() => setModalType(null)} fetchData={fetchDataInsp} subInspectionId={inspectionId} vehicule={vehicule} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'Detail'}
          onCancel={closeAllModals}
          footer={null}
          width={900}
          centered
        >
          <ReparationDetail closeModal={() => setModalType(null)} fetchData={fetchDataInsp} idReparation={null} inspectionId={inspectionId} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'rapport'}
          onCancel={closeAllModals}
          footer={null}
          width={1150}
          centered
        >
          <InspectionRapport />
        </Modal>
    </>
  )
}

export default InspectionGen