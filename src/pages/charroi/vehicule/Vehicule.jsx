import { Table, Button, Image, Input, message, Dropdown, Menu, Space, Tooltip, Popconfirm, Tag, Modal, notification, Badge } from 'antd';
import { MenuOutlined, MoreOutlined, DownOutlined, EnvironmentOutlined, RetweetOutlined, CarOutlined, DeleteOutlined, EyeOutlined, TruckOutlined, CalendarOutlined, PlusCircleOutlined} from '@ant-design/icons';
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
        'Matricule': true,
        'Marque': true,
        "Modèle": true,
        'Categorie': true,
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

    const columns = [
    { 
      title: '#', 
      dataIndex: 'id', 
      key: 'id', 
      render: (text, record, index) => (
        <Tooltip title={`Ligne ${index + 1}`}>
          <Tag color="blue">{index + 1}</Tag>
        </Tooltip>
      ),
      width: "4%" 
    },
    {
      title: 'Image',
      dataIndex: 'img',
      key: 'img',
      render: (text, record) => (
        <div className="userList">
          <Image
            className="userImg"
            src={ record.img ? `${DOMAIN}/${record.img}` : vehiculeImg}
            width={40}
            height={40}
            style={{ borderRadius: '50%' }}
            alt="Profil vehicule"
          />
        </div>
      ),
      ...(columnsVisibility['Image'] ? {} : { className: 'hidden-column' }),
    },
    {
        title: 'Matricule',
        dataIndex: 'immatriculation',
        render: (text) => (
            <div className="vehicule-matricule">
                <span className="car-wrapper">
                    <span className="car-boost" />
                        <CarOutlined className="car-icon-animated" />
                    <span className="car-shadow" />
                </span>
                <Tag color="geekblue">{text}</Tag>
            </div>
        ),
      ...(columnsVisibility['Immatriculation'] ? {} : { className: 'hidden-column' }),
    }, 
    {
      title: 'Marque',
      dataIndex: 'nom_marque',
      render: (text, record) => (
        <Tag icon={<CarOutlined />} color="cyan">
          {text}
        </Tag>
      ),
      ...(columnsVisibility['Marque'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: 'Modèle',
      dataIndex: 'modele',
      render : (text) => (
        <Tag icon={<CarOutlined />} color="green">
            {text ?? 'Aucun'}
        </Tag>
      ),
      ...(columnsVisibility['Modèle'] ? {} : { className: 'hidden-column' }),
    },
    {
        title: 'Categorie',
        dataIndex: 'nom_cat',
        render : (text) => (
          <Tag icon={<CarOutlined />} color="geekblue">
              {text ?? 'Aucun'}
          </Tag>
        ),
      ...(columnsVisibility['Categorie'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: 'Année de fab.',
      dataIndex: 'annee_fabrication',
      render: text => (
        <Tooltip title="Annee fabrication">
            <Tag icon={<CalendarOutlined />} color="magenta">
                {text}
            </Tag>
        </Tooltip>
      ),
      ...(columnsVisibility['Année de fab.'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: 'Année circu.',
      dataIndex: 'annee_circulation',
      render: text => (
        <Tooltip title="annee circulation'">
          <Tag icon={<CalendarOutlined />} color="magenta">
                {text}
            </Tag>
        </Tooltip>
      ),
      ...(columnsVisibility['Année circu.'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: "Dernière position",
      dataIndex: "position",
      render: (text, record) => {
        const lat = record.lat || record.capteurInfo?.lat;
        const lng = record.lng || record.capteurInfo?.lng;
        const address = record.address && record.address !== "-" ? record.address : null;

        if (!lat || !lng) {
          return <span style={{ color: "#aaa" }}>N/A</span>;
        }

        // 🔹 Génère le lien Google Maps
        const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        return (
          <Tooltip
            title={
              <>
                <div>Latitude : {lat}</div>
                <div>Longitude : {lng}</div>
                {address && <div>Adresse : {address}</div>}
                <div>Cliquez pour ouvrir la carte</div>
              </>
            }
          >
            <Button
              type="link"
              icon={<EnvironmentOutlined style={{ color: "#1890ff" }} />}
              onClick={() => window.open(mapUrl, "_blank")}
              style={{ padding: 0, fontWeight: "bold" }}
            >
              Voir sur la carte
            </Button>
          </Tooltip>
        );
      },
      ...(columnsVisibility['Dernière position'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: 'Alerte traceur',
      dataIndex: 'alert',
      render: (text, record) => {
        const sensors = record.capteurInfo?.sensors || [];
        const val = sensors.find(s => s.type === 'textual' && s.name === '#MSG')?.val || 'OK';

        // Vérifier si hors ligne (>12h)
        const lastConnection = record.capteurInfo?.last_connection;
        const isOffline = lastConnection
          ? moment().diff(moment(lastConnection), 'hours') > 12
          : false;

        let status = 'success';
        let label = '✅ OK';

        if (isOffline) {
          status = 'default';
          label = '🚫 Hors ligne (>12h)';
        } else {
          switch (val) {
            case 'overspeed':
              status = 'error';
              label = '⚡ Excès de vitesse';
              break;
            case 'lowBattery':
              status = 'warning';
              label = '🟧 Batterie faible';
              break;
            case 'fuelLeak':
              status = 'error';
              label = '⛽ Fuite carburant';
              break;
            case 'powerCut':
              status = 'error';
              label = '🟥 Coupure';
              break;
            default:
              status = 'success';
              label = '✅ OK';
          }
        }

        return (
          <Tooltip title="Cliquez ici pour voir le détail">
            <Badge status={status} text={label} />
          </Tooltip>
        );
      },
      ...(columnsVisibility['Dernière position'] ? {} : { className: 'hidden-column' }),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle" style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <Tooltip title="Voir les détails">
                <Button
                icon={<EyeOutlined />}
                aria-label="Voir les détails de la tâche"
                style={{ color: 'blue' }}
                onClick={()=> handleDetail(record.id_vehicule)}
                />
            </Tooltip>

            <Dropdown
              overlay={(
                <Menu>
                  <Menu.Item onClick={()=> handleSite(record.id_vehicule)}>
                    <RetweetOutlined /> Affecter à un site
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item onClick={()=> handleRelier(record.id_vehicule)}>
                    <RetweetOutlined /> Rélier à un device
                  </Menu.Item>
                </Menu>
              )}
              trigger={['click']}
            >
              <Button
                icon={<MoreOutlined />}
                style={{ color: 'black', padding: '0' }}
                aria-label="Menu actions"
              />
            </Dropdown>
            
            <Tooltip title="Supprimer">
                <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer ce véhicule ?"
                    onConfirm={() => handleDelete(record.id_vehicule)}
                    okText="Oui"
                    cancelText="Non"
                >
                    <Button
                        icon={<DeleteOutlined />}
                        style={{ color: 'red' }}
                        aria-label="Delete client"
                    />
                </Popconfirm>
            </Tooltip>
        </Space>
      ),
    }
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
    </>
  )
}

export default Vehicule