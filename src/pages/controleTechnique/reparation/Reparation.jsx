import { useEffect, useRef, useState } from 'react'
import { ToolOutlined, ExclamationCircleOutlined, FileImageOutlined, EditOutlined, DeleteOutlined, CarOutlined, ExportOutlined, FileExcelOutlined, FileTextOutlined, FilePdfOutlined, ShopOutlined, MenuOutlined, DownOutlined, EyeOutlined, MoreOutlined, PlusCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { Input, Button, Typography, Tooltip, message, Dropdown, Menu, Space, notification, Table, Tag, Modal } from 'antd';
import moment from 'moment';
import ReparationForm from './reparationForm/ReparationForm';
import { deleteReparation, getReparation } from '../../../services/charroiService';
import SuiviReparationForm from './suiviReparation/suiviReparationForm/SuiviReparationForm';
import ReparationDetail from './reparationDetail/ReparationDetail';
import DocumentReparation from './documentReparation/DocumentReparation';
import getColumnSearchProps from '../../../utils/columnSearchUtils';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';
import ReparationImage from './reparationImage/ReparationImage';
import { statusIcons, statutIcons } from '../../../utils/prioriteIcons';

const { Search } = Input;
const { Text } = Typography;

const Reparation = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    }); 
    const [data, setData] = useState([]);
    const role = useSelector((state) => state.user?.currentUser?.role);
    const [modalType, setModalType] = useState(null);
    const scroll = { x: 'max-content' };
    const [idReparation, setIdReparation] = useState(null)
    const [columnsVisibility, setColumnsVisibility] = useState({
      '#': true,
      'Matricule': true,
      'Marque': true,
      'Type réparation': true,
      'Date entree': true,
      "Date réparation": false,
      "Jour": false,
      'Fournisseur':true,
      'Statut': true,
      'Etat': true,
      'Budget' : true,
      "Main d'oeuvre" : false,
      'Date sortie' : false,
      "commentaire": false,
      "Statut vehicule" : true
    });
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [vehicule, setVehicule] = useState(null)
    
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

    const fetchData = async() => {
      try {
        const { data } = await getReparation();
        setData(data.data);
        setLoading(false);
      } catch (error) {
          notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
          });
          setLoading(false);
          }
      }

    useEffect(()=> {
        fetchData();
        const intervalId = setInterval(() => {
          fetchData();
        }, 5000);
    
        return () => clearInterval(intervalId);
    }, [])

    const getActionMenu = (record, openModal) => {
        const handleClick = ({ key }) => {
          switch (key) {
            case 'voirDetail':
                openModal('Detail', record.id_reparation)
              break;
            case 'Document':
              openModal('Document', record.id_sud_reparation);
              break;
            case 'DetailSuivi':
                openModal('DetailSuivi', record.id_reparation)
                break;
            case 'ajouterSuivi':
                openModal('AddSuivi', record.id_reparation)
                break;
            case 'image':
                openModal('Image', record.id_reparation, record.immatriculation)
                break;
            default:
              break;
          }
        };
      
        return (
          <Menu onClick={handleClick}>
            <Menu.Item key="voirDetail">
              <EyeOutlined style={{ color: 'green' }} /> Voir Détail
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="Document">
              <FileTextOutlined style={{ color: 'blue' }} /> Document
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="image">
              <FileImageOutlined style={{ color: 'magenta' }} /> Image
            </Menu.Item>
          </Menu>
        );
    };

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
          title: 'Matricule',
          dataIndex: 'immatriculation',
          ...getColumnSearchProps(
              'immatriculation',
                searchText,
                setSearchText,
                setSearchedColumn,
                searchInput
            ),
            render: (text) => (
              <div className="vehicule-matricule">
                <span className="car-wrapper">
                  <span className="car-boost" />
                    <CarOutlined className="car-icon-animated" />
                  <span className="car-shadow" />
                </span>
                <Tag color="blue">{text}</Tag>
              </div>
            ),
            ...(columnsVisibility['Matricule'] ? {} : { className: 'hidden-column' }),
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
            title: 'Type réparation',
            dataIndex: 'type_rep',
            ...getColumnSearchProps(
              'type_rep',
              searchText,
              setSearchText,
              setSearchedColumn,
              searchInput
            ),
            render: (text) => (
              <Tag icon={<ToolOutlined spin />} color='volcano' bordered={false}>
                {text}
              </Tag>
            ),
          ...(columnsVisibility['Type réparation'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Date Entrée',
          dataIndex: 'date_entree',
          render: (text) => (
            <Tag icon={<CalendarOutlined />} color="blue">
                {moment(text).format('DD-MM-YYYY')}
            </Tag>
          ),
          ...(columnsVisibility['Date entree'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Date Sortie',
          dataIndex: 'date_sortie',
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
          ...(columnsVisibility['Date sortie'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Date rep',
          dataIndex: 'date_reparation',
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
            title: '#Jour',
            dataIndex: 'nb_jours_au_garage',
            render: (text) => (
              <Tag color='orange'>
                {text ?? 'Aucun'}
              </Tag>
            ),
            ...(columnsVisibility['Jour'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: "Budget",
          dataIndex: 'montant',
          key: 'montant',
          sorter: (a, b) => a.montant - b.montant,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
              <Space>
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
          align: 'right', 
          ...(columnsVisibility['Budget'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: "Main d'oeuvre",
          dataIndex: 'cout',
          key: 'cout',
          sorter: (a, b) => a.cout - b.cout,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
              <Space>
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
          align: 'right', 
          ...(columnsVisibility["Main d'oeuvre"] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Fournisseur',
          dataIndex: 'nom_fournisseur',
          ...getColumnSearchProps(
              'nom_fournisseur',
              searchText,
              setSearchText,
              setSearchedColumn,
              searchInput
          ),
          render: (text) => (
              <Tag>
                <ShopOutlined style={{ marginRight: 5, color: '#52c41a' }} />
                {text}
              </Tag>
            ),
          ...(columnsVisibility['Fournisseur'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: "Commentaire",
          dataIndex: 'commentaire',
          render: (text) => (
            <div style={columnStyles.title} className={columnStyles.hideScroll}>
              {text}
            </div>
          ),
          ...(columnsVisibility['Commentaire'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'État',
          dataIndex: 'nom_type_statut',
          render: (text) => {
            const {icon, color } = statutIcons(text)
            return (
              <Tag icon={icon} color={color} style={{ fontWeight: 500 }}>
                {text}
              </Tag>
            );
          },
          ...(columnsVisibility['Etat'] ? {} : { className: 'hidden-column' }),
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
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
              <Space>
                <Tooltip title="Modifier">
                  <Button
                    icon={<EditOutlined />}
                    style={{ color: 'green' }}
                    onClick={() => handleEdit(record.id_sud_reparation)}
                    disabled={role !== 'Admin'}
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
                      onClick={() => showDeleteConfirm(record.id_sud_reparation, userId, setData)}
                    />
                </Tooltip>
              </Space>
            )
        }
    ];

    const handleAddReparation = () => openModal('Add');
    const handleEdit = (id) => openModal('Edit', id)

    const closeAllModals = () => {
      setModalType(null);
    };
      
    const openModal = (type, id='', vehicule) => {
      closeAllModals();
      setModalType(type);
      setIdReparation(id);
      setVehicule(vehicule);
    };

    const handleExportExcel = () => {
      try {
        const formattedData = data.map((record, index) => ({
          "#": index + 1,
          "Matricule": record.immatriculation || 'N/A',
          "Marque": record.nom_marque || 'Inconnu',
          "Type de Rép.": record.type_rep || 'N/A',
          "Date Entrée": record.date_entree
            ? moment(record.date_entree).format('DD/MM/YYYY')
            : '—',
          "Date Sortie": record.date_sortie
            ? moment(record.date_sortie).format('DD/MM/YYYY')
            : '—',
          "Date reparation": record.date_reparation
            ? moment(record.date_reparation).format('DD/MM/YYYY')
            : '—',
          "Budget": record.montant ? `${record.montant} $` : '0 $',
          "Main d'oeuvre": record.cout ? `${record.cout} $` : '0 $',
          "Fournisseur": record.nom_fournisseur || 'Aucun',
          "Commentaire": record.commentaire || 'Aucun'
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
        doc.text("Liste des réparations", 14, 22);
    
        const tableColumn = [
          "#", 
          "Matricule", 
          "Marque", 
          "Type de rep.", 
          "Date Entrée", 
          "Budget", 
          "Coût", 
          "Fournisseur"
        ];
    
        const tableRows = [];
    
        data.forEach((record, index) => {
          const tableRow = [
            index + 1,
            record.immatriculation || 'N/A',
            record.nom_marque || 'Inconnu',
            record.type_rep || 'N/A',
            record.date_entree ? moment(record.date_entree).format('DD/MM/YYYY') : '—',
            record.montant ? `${record.montant} $` : '0 $',
            record.cout ? `${record.cout} $` : '—',
            record.nom_fournisseur || 'Non spécifié',
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
            fontSize: 9,
            halign: 'center',
          },
          margin: { top: 10, left: 14, right: 14 },
          styles: {
            cellPadding: 3,
          },
          didDrawPage: function (data) {
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Exporté le : ${moment().format('DD/MM/YYYY HH:mm')}`, 14, 10);
          },
        });
    
        doc.save("Reparations.pdf");
    
        message.success("Exportation PDF réussie !");
      } catch (error) {
        console.error("Erreur lors de l'export PDF :", error);
        message.error("Une erreur est survenue lors de l'export PDF.");
      }
    };
    
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
                  Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette réparation ?
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
                 await deleteReparation({
                  id_sud_reparation : id,
                  user_id: userId,
                });
                setData((prevData) => prevData.filter((item) => item.id_sud_reparation !== id));
                message.success("La réparation a été supprimée avec succès.", 3);
                fetchData()
              } catch (error) {
                notification.error({
                  message: "Erreur de suppression",
                  description: "Une erreur est survenue lors de la suppression de la réparation.",
                  duration: 5,
                });
              }
            },
          });
    };

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
    item.nom_type_statut?.toLowerCase().includes(searchValue.toLowerCase())
  );
      
  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                  <div className="client-row-icon">
                    <ToolOutlined className='client-icon'/>
                  </div>
                  <h2 className="client-h2">Liste des réparations</h2>
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
                        onClick={handleAddReparation}
                      >
                        Ajouter
                      </Button>

                      <Dropdown overlay={menu} trigger={['click']}>
                        <Button icon={<ExportOutlined />}>Export</Button>
                      </Dropdown>

                      <Dropdown overlay={menus} trigger={['click']}>
                        <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                          Colonnes <DownOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    scroll={scroll}
                    size="small"
                    onChange={(pagination)=> setPagination(pagination)}
                    bordered
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />
            </div>
        </div>
        <Modal
            title=""
            visible={modalType === 'Add'}
            onCancel={closeAllModals}
            footer={null}
            width={1000}
            centered
        >
            <ReparationForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'Document'}
          onCancel={closeAllModals}
          footer={null}
          width={950}
          centered
        >
          <DocumentReparation closeModal={() => setModalType(null)} fetchData={fetchData} id_sud_reparation={idReparation} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'AddSuivi'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <SuiviReparationForm closeModal={() => setModalType(null)} fetchData={fetchData} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'Detail'}
          onCancel={closeAllModals}
          footer={null}
          width={900}
          centered
        >
          <ReparationDetail closeModal={() => setModalType(null)} fetchData={fetchData} idReparation={idReparation} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Edit'}
            onCancel={closeAllModals}
            footer={null}
            width={1023}
            centered
        >
          <ReparationForm closeModal={() => setModalType(null)} fetchData={fetchData} subInspectionId={null} idReparations={idReparation} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Image'}
            onCancel={closeAllModals}
            footer={null}
            width={750}
            centered
        >
          <ReparationImage closeModal={() => setModalType(null)} fetchData={fetchData} idReparation={idReparation} vehicule={vehicule} />
      </Modal>
    </>
  )
}

export default Reparation