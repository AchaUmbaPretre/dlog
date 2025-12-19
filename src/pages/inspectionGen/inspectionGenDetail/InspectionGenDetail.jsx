import { useCallback, useEffect, useState } from 'react';
import { Card, Menu, Dropdown, Modal, notification, Button, Tooltip, Tag, Image, Divider } from 'antd';
import { getInspectionGen, getSubInspection } from '../../../services/charroiService';
import moment from 'moment';
import config from '../../../config';
import './inspectionGenDetail.scss';
import imgDetail from './../../../assets/Pas_image.jpg';
import { LeftCircleFilled, EyeOutlined, CalendarOutlined, DollarCircleOutlined, RightCircleFilled, CarOutlined, PlusOutlined, MoreOutlined, FileSearchOutlined, ToolOutlined, FileTextOutlined, FileImageOutlined } from '@ant-design/icons';
import { handleRepair, handleValider } from '../../../utils/modalUtils';
import InspectionGenValider from '../inspectionGenValider/InspectionGenValider';
import InspectionGenDoc from '../inspectionGenDoc/InspectionGenDoc';
import InspectionImage from '../inspectionImage/InspectionImage';
import ReparationDetail from '../../controleTechnique/reparation/reparationDetail/ReparationDetail';
import ReparationForm from '../../controleTechnique/reparation/reparationForm/ReparationForm';
import InspectionGenFormTracking from '../inspectionGenTracking/inspectionGenFormTracking/InspectionGenFormTracking';
import InspectionGenTracking from '../inspectionGenTracking/InspectionGenTracking';

const InspectionGenDetail = ({ inspectionId }) => {
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idInspections, setIdInspections] = useState(inspectionId);
    const [idValides, setIdValides] = useState([]);
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [data, setData] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [inspectionIds, setInspectionIds] = useState(null)
    const [total, setTotal] = useState(null);

    const fetchDataInsp = useCallback(async (filters = '', searchValue = '') => {
        setLoading(true);
        try {
          const [inspectionData] = await Promise.all([
            getInspectionGen(searchValue, filters),
          ]);

        setData(inspectionData?.data?.inspections || []);

        } catch (error) {
          notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
          });
        } finally {
          setLoading(false);
        }
      }, []);

    useEffect(() => {
      fetchDataInsp()
    }, [])

    const closeAllModals = () => {
      setModalType(null);
    };

    const openModal = (type, inspectionId = '') => {
        closeAllModals();
        setModalType(type);
        setInspectionIds(inspectionId)
    };

    const handleTracking = (id) => openModal('DetailSuivi', id);

    useEffect(() => {
        setIdInspections(inspectionId)
    }, [inspectionId]);;

    const fetchDatas = async () => {
        setLoading(true);
        try {
            const response = await getSubInspection(idInspections);
            const idList = data.map(item => item.id_inspection_gen).sort((a, b) => a - b);
            setDatas(response.data || []);
            setIdValides(idList);

            const totalMontant = response.data.reduce((acc, curr) => {
            return acc + (curr.montant ?? 0);
        }, 0);

        setTotal(totalMontant);

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
        if (data?.length && idInspections) {
            fetchDatas();
        }
    }, [data, idInspections, inspectionId]);

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
    
    const goToNext = () => {
        setIdInspections((prevId) => {
            const currentIndex = idValides.indexOf(prevId);
            return currentIndex !== -1 && currentIndex < idValides.length - 1
                ? idValides[currentIndex + 1]
                : prevId;
        });
    };

    const goToPrevious = () => {
        setIdInspections((prevId) => {
            const currentIndex = idValides.indexOf(prevId);
            return currentIndex > 0 ? idValides[currentIndex - 1] : prevId;
        });
    };

    const headerInfo = datas.length > 0
        ? {
              marque: datas[0].nom_marque,
              immatriculation: datas[0].immatriculation,
              date_inspection: datas[0].date_inspection,
          }
        : {};

    return (
        <div className="inspectionGenDetail">
          <Card loading={loading} className="rows">
            <div className="inspectionGen_wrapper">
              <div className="inspectionGen-arrow">
                <Tooltip title="Précédent">
                  <Button className="row-arrow" onClick={goToPrevious}>
                    <LeftCircleFilled className="icon-arrow" />
                  </Button>
                </Tooltip>
                <h2 className="inspection_h2">
                  DÉTAILS DE L'INSPECTION N° {`${new Date().getFullYear().toString().slice(2)}${inspectionId?.toString().padStart(4, '0')}`}
                </h2>
                <Tooltip title="Suivant">
                  <Button className="row-arrow" onClick={goToNext}>
                    <RightCircleFilled className="icon-arrow" />
                  </Button>
                </Tooltip>
              </div>

              <div className="inspectionGen_top">
                      <span className="inspection_span">
                        <DollarCircleOutlined style={{ color: '#13c2c2' }} /> TOTAL : <strong>{total} $</strong>
                      </span>

                      <span className="inspection_span">
                        <CarOutlined style={{ color: '#722ed1' }} /> MARQUE : <strong>{headerInfo.marque?.toUpperCase()}</strong>
                      </span>

                      <span className="inspection_span">
                        <CarOutlined style={{ color: '#fa8c16' }} /> IMMATRICULATION : <strong>{headerInfo.immatriculation}</strong>
                      </span>

                      <span className="inspection_span">
                        <CalendarOutlined style={{ color: '#1890ff' }} /> DATE INSPECTION :{' '}
                        <strong>{headerInfo.date_inspection ? moment(headerInfo.date_inspection).format('DD-MM-YYYY') : 'N/A'}</strong>
                      </span>
              </div>

              <div className="inspectionGen_bottom_wrapper">
                {datas.map((item) => (
                <div className="inspectionGen_bottom" key={item.id || `${item.nom_cat_inspection}-${item.type_rep}`}>
                  <div className='inspectionGen_row_icones'>
                    <Dropdown overlay={getActionMenu(item, openModal)} trigger={['click']}>
                      <Button type='text' icon={<MoreOutlined />} style={{ color: 'blue' }} />
                    </Dropdown>
                  </div>

                  <div className="inspection_rows_img">
                    <Image src={item.img ? `${DOMAIN}/${item.img}` : imgDetail} alt="Image" className="img" />
                  </div>

                  <Divider style={{margin:'0', margin:'10px'}} />
                  <div className="inspectionGen_bottom_rows">
                    <span className="inspectiongen_txt">Type de réparation : <strong>{item.type_rep}</strong></span>
                    <span className="inspectiongen_txt">Catégorie : <strong>{item.nom_cat_inspection}</strong></span>
                    <span className="inspectiongen_txt">Caractéristique : {item.nom_carateristique_rep}</span>
                    <span className="inspectiongen_txt">Montant : <strong>{item.montant} $</strong></span>
                    <span className="inspectiongen_txt">Statut : <Tag color="orange" onClick={()=>handleTracking(item.id_sub_inspection_gen)}>{item.nom_type_statut}</Tag></span>
                    <span className="inspectiongen_txt">Date d'enregistrement : <Tag color="green" icon={<CalendarOutlined />}>
                      {moment(item.created_at).format('LL [à] HH:mm')}
                      </Tag>
                    </span>
                    <span className="inspectiongen_txt">Date de dernière mise à jour : <Tag color="blue" icon={<CalendarOutlined />}>{moment(item.update_at).format('LL')}</Tag></span>
                    <span className="inspectiongen_txt txt">Commentaire : <strong>{item.commentaire}</strong></span>
                    <span className="inspectiongen_txt txt">Avis : <strong>{item.avis}</strong></span>
                  </div>
                </div>
                ))}
              </div>
            </div>
            </Card>
            <Modal
                title=""
                visible={modalType === 'AddValider'}
                onCancel={closeAllModals}
                footer={null}
                width={1000}
                centered
            >
                <InspectionGenValider closeModal={() => setModalType(null)} fetchData={fetchDataInsp} inspectionId={idInspections} />
            </Modal>
            
        <Modal
            title=""
            visible={modalType === 'DetailSuivi'}
            onCancel={closeAllModals}
            footer={null}
            width={1023}
            centered
        >
            <InspectionGenTracking idSubInspectionGen={inspectionIds} closeModal={() => setModalType(null)} fetchData={fetchDataInsp} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'AddSuivi'}
          onCancel={closeAllModals}
          footer={null}
          width={800}
          centered
        >
          <InspectionGenFormTracking idSubInspectionGen={inspectionIds} closeModal={() => setModalType(null)} fetchData={fetchDataInsp} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'Reparer'}
          onCancel={closeAllModals}
          footer={null}
          width={1000}
          centered
        >
          <ReparationForm closeModal={() => setModalType(null)} fetchData={fetchDataInsp} subInspectionId={inspectionIds} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'Document'}
          onCancel={closeAllModals}
          footer={null}
          width={1000}
          centered
        >
          <InspectionGenDoc closeModal={() => setModalType(null)} fetchData={fetchDataInsp} subInspectionId={inspectionIds} />
        </Modal>

        <Modal
          title=""
          visible={modalType === 'Image'}
          onCancel={closeAllModals}
          footer={null}
          width={750}
          centered
        >
          <InspectionImage closeModal={() => setModalType(null)} fetchData={fetchDataInsp} subInspectionId={inspectionIds} vehicule={''} />
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
        </div>
    );
};

export default InspectionGenDetail;
