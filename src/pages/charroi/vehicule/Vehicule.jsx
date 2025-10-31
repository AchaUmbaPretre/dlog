import { Table, Button, Image, Input, message, Dropdown, Menu, Space, Tooltip, Popconfirm, Tag, Modal, notification } from 'antd';
import { MenuOutlined, MoreOutlined, StopOutlined, ThunderboltOutlined, WarningOutlined, AlertOutlined, DownOutlined, EnvironmentOutlined, RetweetOutlined, CarOutlined, DeleteOutlined, EyeOutlined, TruckOutlined, CalendarOutlined, PlusCircleOutlined} from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import config from '../../../config';
import { getVehicule, putVehicule } from '../../../services/charroiService';
import { getFalcon } from '../../../services/rapportService';
import vehiculeImg from './../../../assets/vehicule.png'
import moment from 'moment';
import SiteVehicule from '../siteVehicule/SiteVehicule';
import RelierFalcon from '../relierFalcon/RelierFalcon';
import VehiculeDetail from '../vehiculeDetail/VehiculeDetail';
import CharroiForm from '../charroiForm/CharroiForm';
import DetailTypeAlert from './detailTypeAlert/DetailTypeAlert';

const { Search } = Input;


const Vehicule = () => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [searchValue, setSearchValue] = useState('');
    const scroll = { x: 'max-content' };
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [falcon, setFalcon] = useState([]);
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [idVehicule, setIdVehicule] = useState('');
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'Image': true,
        'Immatriculation': true,
        'Marque': true,
        "Modèle": true,
        'Categorie': true,
        'Dernière connexion': true,
        "Année de fab.": false,
        'Année circu.': false,
        'Alerte traceur': true,
        'Dernière position': true
    });
    const handleDelete = async (id) => {
        try {
        await putVehicule(id);
        setData(data.filter((item) => item.id_vehicule !== id));
        message.success('Suppression du véhicule effectuée avec succès');
        } catch (error) {
        notification.error({
            message: 'Erreur de suppression',
            description: 'Une erreur est survenue lors de la suppression du client.',
        });
        }
    };
    const handleAddClient = (id) => openModal('Add', id)
    const handleDetail = (id) => openModal('Detail', id)
    const handleRelier = (id) => openModal('Relier', id)
    const handleSite = (id) => openModal('Affecter', id)
    const handleAlert = (id) => openModal('DetailTypeAlert', id)

    const closeAllModals = () => {
        setModalType(null);
    };

    const openModal = (type, idVehicule = '') => {
        closeAllModals();
        setModalType(type);
        setIdVehicule(idVehicule)
    };

    const fetchData = async () => {
      try {
        const [ vehiculeData ] = await Promise.all([
          getVehicule()
        ])
        setData(vehiculeData.data.data);
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

    const fetchFalcon = useCallback(async () => {
      try {
        const { data } = await getFalcon();
        setFalcon(data[0]?.items || []);
      } catch (error) {
        console.error('Erreur lors du chargement Falcon:', error);
      }
    }, []);

    useEffect(() => {
      fetchFalcon();
    }, []);

    const mergedCourses = useMemo(() => {
      return data.map((c) => {
        const capteur = falcon.find((f) => f.id === c.id_capteur);
        return { ...c, capteurInfo: capteur || null };
      });
    }, [data, falcon]);
  

    const toggleColumnVisibility = (columnName, e) => {
        e.stopPropagation();
        setColumnsVisibility(prev => ({
          ...prev,
          [columnName]: !prev[columnName]
        }));
      };

    const menu = (
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

    const columns = 
    [
      {
          title: "#",
          dataIndex: "id",
          key: "id",
          width: 60,
          align: "center",
          render: (_, __, index) => (
          <Tooltip title={`Ligne ${index + 1}`}>
              <Tag color="blue">{index + 1}</Tag>
          </Tooltip>
          ),
      },
      {
          title: "Image",
          dataIndex: "img",
          key: "img",
          align: "center",
          render: (_, record) => (
          <Image
              src={record.img ? `${DOMAIN}/${record.img}` : vehiculeImg}
              width={45}
              height={45}
              style={{
              borderRadius: "50%",
              border: "2px solid #f0f0f0",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
              alt="Profil véhicule"
          />
          ),
          ...(columnsVisibility["Image"] ? {} : { className: "hidden-column" }),
      },
      {
          title: "Matricule",
          dataIndex: "immatriculation",
          key: "immatriculation",
          render: (text) => (
          <Space>
              <CarOutlined style={{ color: "#1890ff" }} />
              <Tag color="geekblue" style={{ fontWeight: 600 }}>
              {text}
              </Tag>
          </Space>
          ),
          ...(columnsVisibility["Immatriculation"] ? {} : { className: "hidden-column" }),
      },
      {
          title: "Marque",
          dataIndex: "nom_marque",
          key: "nom_marque",
          render: (text) => (
          <Tag icon={<CarOutlined />} color="cyan">
              {text}
          </Tag>
          ),
          ...(columnsVisibility["Marque"] ? {} : { className: "hidden-column" }),
      },
      {
          title: "Modèle",
          dataIndex: "modele",
          key: "modele",
          render: (text) => (
          <Tag icon={<ThunderboltOutlined />} color="green">
              {text ?? "Aucun"}
          </Tag>
          ),
          ...(columnsVisibility["Modèle"] ? {} : { className: "hidden-column" }),
      },
      {
          title: "Catégorie",
          dataIndex: "nom_cat",
          key: "nom_cat",
          render: (text) => (
          <Tag color="purple">{text ?? "Non défini"}</Tag>
          ),
          ...(columnsVisibility["Categorie"] ? {} : { className: "hidden-column" }),
      },
      {
          title: "Année de fab.",
          dataIndex: "annee_fabrication",
          key: "annee_fabrication",
          align: "center",
          render: (text) => (
          <Tooltip title="Année de fabrication">
              <Tag icon={<CalendarOutlined />} color="magenta">
              {text}
              </Tag>
          </Tooltip>
          ),
          ...(columnsVisibility["Année de fab."] ? {} : { className: "hidden-column" }),
      },
      {
          title: "Année circu.",
          dataIndex: "annee_circulation",
          key: "annee_circulation",
          align: "center",
          render: (text) => (
          <Tooltip title="Année de mise en circulation">
              <Tag icon={<CalendarOutlined />} color="volcano">
              {text}
              </Tag>
          </Tooltip>
          ),
          ...(columnsVisibility["Année circu."] ? {} : { className: "hidden-column" }),
      },
      {
          title: "Dernière connexion",
          key: "last_connexion",
          render: (_, record) => (
          <Tag color="blue" icon={<ThunderboltOutlined />}>
              {record.capteurInfo?.time || "—"}
          </Tag>
          ),
          ...(columnsVisibility["Dernière connexion"] ? {} : { className: "hidden-column" }),
      },
      {
          title: "Dernière position",
          key: "position",
          render: (_, record) => {
          const lat = record.lat || record.capteurInfo?.lat;
          const lng = record.lng || record.capteurInfo?.lng;
          const address = record.address && record.address !== "-" ? record.address : null;

          if (!lat || !lng) return <Tag color="default">N/A</Tag>;

          const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
          return (
              <Tooltip
              title={
                  <>
                  <div>Latitude : {lat}</div>
                  <div>Longitude : {lng}</div>
                  {address && <div>Adresse : {address}</div>}
                  <div style={{ fontSize: 11, color: "#999" }}>Cliquez pour ouvrir la carte</div>
                  </>
              }
              >
              <Button
                  type="link"
                  icon={<EnvironmentOutlined style={{ color: "#52c41a" }} />}
                  onClick={() => window.open(mapUrl, "_blank")}
                  style={{ fontWeight: 500 }}
              >
                  Voir sur carte
              </Button>
              </Tooltip>
          );
          },
          ...(columnsVisibility["Dernière position"] ? {} : { className: "hidden-column" }),
      },
      {
      title: "Alerte traceur",
      key: "alert",
      render: (_, record) => {
          const lat = record.lat || record.capteurInfo?.lat;
          const lng = record.lng || record.capteurInfo?.lng;

          // Si pas de traceur (pas de position connue)
          if (!lat || !lng) {
              return (
                  <Tag color="default" style={{ fontWeight: 600 }}>
                      N/A
                  </Tag>
              );
          }

          const sensors = record.capteurInfo?.sensors || [];
          const val = sensors.find((s) => s.type === "textual" && s.name === "#MSG")?.val || "OK";
          const lastConnection = record.capteurInfo?.last_connection;
          const isOffline = lastConnection ? moment().diff(moment(lastConnection), "hours") > 12 : false;

          let label = "OK";
          let color = "green";
          let icon = null;

          if (isOffline) {
              label = "Hors ligne";
              color = "gray";
              icon = <StopOutlined />;
          } else {
              switch (val) {
                  case "lowBattery":
                      label = "Batterie faible";
                      color = "orange";
                      icon = <WarningOutlined />;
                      break;
                  case "fuelLeak":
                      label = "Fuite carburant";
                      color = "volcano";
                      icon = <AlertOutlined />;
                      break;
                  case "powerCut":
                      label = "Coupure d’alim.";
                      color = "red";
                      icon = <StopOutlined />;
                      break;
                  default:
                      break;
              }
          }

          return (
              <Tooltip title="Cliquez pour voir le détail d'état du traceur">
                  <Tag color={color} icon={icon} style={{ fontWeight: 600 }} onClick={() => handleAlert(record.id_vehicule)}>
                      {label}
                  </Tag>
              </Tooltip>
          );
      },
      ...(columnsVisibility["Alerte traceur"] ? {} : { className: "hidden-column" }),
      },
      {
          title: "Actions",
          key: "actions",
          align: "center",
          render: (_, record) => (
          <Space size="middle" style={{ justifyContent: "center" }}>
              <Tooltip title="Voir les détails">
              <Button
                  icon={<EyeOutlined />}
                  type="text"
                  style={{ color: "#1890ff" }}
                  onClick={() => handleDetail(record.id_vehicule)}
              />
              </Tooltip>

              <Dropdown
              menu={{
                  items: [
                  {
                      key: "site",
                      label: (
                      <>
                          <RetweetOutlined /> Affecter à un site
                      </>
                      ),
                      onClick: () => handleSite(record.id_vehicule),
                  },
                  {
                      type: "divider",
                  },
                  {
                      key: "reli",
                      label: (
                      <>
                          <RetweetOutlined /> Relier à un device
                      </>
                      ),
                      onClick: () => handleRelier(record.id_vehicule),
                  },
                  ],
              }}
              trigger={["click"]}
              >
              <Button
                  icon={<MoreOutlined />}
                  type="text"
                  style={{ color: "#333" }}
              />
              </Dropdown>

              <Tooltip title="Supprimer le véhicule">
              <Popconfirm
                  title="Confirmer la suppression du véhicule ?"
                  onConfirm={() => handleDelete(record.id_vehicule)}
                  okText="Oui"
                  cancelText="Non"
              >
                  <Button
                  icon={<DeleteOutlined />}
                  type="text"
                  style={{ color: "red" }}
                  />
              </Popconfirm>
              </Tooltip>
          </Space>
          ),
      },
    ];

    const filteredData = mergedCourses.filter(item =>
        item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <>
        <div className="client">
              <div className="client-wrapper">
                <div className="client-row">
                  <div className="client-row-icon">
                    <TruckOutlined className='client-icon'/>
                  </div>
                  <h2 className="client-h2">Liste des vehicules</h2>
                </div>
                <div className="client-actions">
                  <div className="client-row-left">
                    <Search placeholder="Recherche..." 
                      enterButton 
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                  <div className="client-rows-right">
                    <Button
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      onClick={handleAddClient}
                    >
                      Ajouter un véhicule
                    </Button>
                    <div className="client-rows-right">
                      <Dropdown overlay={menu} trigger={['click']}>
                        <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                          Colonnes <DownOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  onChange={(pagination)=> setPagination(pagination)}
                  rowKey="id_vehicule"
                  rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                  bordered
                  size="small" 
                  scroll={scroll}
                  loading={loading}
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
        <CharroiForm idVehicule={''} closeModal={() => setModalType(null)} fetchData={fetchData}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'Detail'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <VehiculeDetail idVehicule={idVehicule} closeModal={() => setModalType(null)} fetchData={fetchData}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'Relier'}
        onCancel={closeAllModals}
        footer={null}
        width={800}
        centered
      >
        <RelierFalcon idVehicule={idVehicule} closeModal={() => setModalType(null)} fetchData={fetchData}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'Affecter'}
        onCancel={closeAllModals}
        footer={null}
        width={600}
        centered
      >
        <SiteVehicule idVehicule={idVehicule} closeModal={() => setModalType(null)} fetchData={fetchData}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'DetailTypeAlert'}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        centered
      >
        <DetailTypeAlert idVehicule={idVehicule} />
      </Modal>
    </>
  )
}

export default Vehicule