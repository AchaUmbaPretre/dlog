import { useCallback, useEffect, useState } from 'react';
import { Card, notification, Button, Tooltip, Tag, Image, Divider } from 'antd';
import { getInspectionGen, getSubInspection } from '../../../services/charroiService';
import moment from 'moment';
import config from '../../../config';
import './inspectionGenDetail.scss';
import imgDetail from './../../../assets/Pas_image.jpg';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import { useMenu } from '../../../context/MenuProvider';

const InspectionGenDetail = ({ inspectionId }) => {
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idInspections, setIdInspections] = useState(inspectionId);
    const [idValides, setIdValides] = useState([]);
/*     const { data, fetchDataInsp } = useMenu();
 */    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [data, setData] = useState([]);

      const fetchDataInsp = useCallback(async (filters = '', searchValue = '') => {
        setLoading(true);
        try {
          const [inspectionData] = await Promise.all([
            getInspectionGen(searchValue, filters),
          ]);
          setData(inspectionData.data.inspections);
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
                        <span className="inspection_span">MARQUE : <strong>{headerInfo.marque?.toUpperCase()}</strong></span>
                        <span className="inspection_span">IMMATRICULATION : <strong>{headerInfo.immatriculation}</strong></span>
                        <span className="inspection_span">
                            DATE INSPECTION :{' '}
                            <strong>{headerInfo.date_inspection ? moment(headerInfo.date_inspection).format('DD/MM/YYYY') : 'N/A'}</strong>
                        </span>
                    </div>

                    <div className="inspectionGen_bottom_wrapper">
                        {datas.map((item) => (
                            <div className="inspectionGen_bottom" key={item.id || `${item.nom_cat_inspection}-${item.type_rep}`}>
                                <div className="inspection_rows_img">
                                    <Image src={item.img ? `${DOMAIN}/${item.img}` : imgDetail} alt="Image" className="img" />
                                </div>
                                <Divider style={{margin:'0', margin:'10px'}} />
                                <div className="inspectionGen_bottom_rows">
                                    <span className="inspectiongen_txt">Type de réparation : <strong>{item.type_rep}</strong></span>
                                    <span className="inspectiongen_txt">Catégorie : <strong>{item.nom_cat_inspection}</strong></span>
                                    <span className="inspectiongen_txt">Caractéristique : {item.nom_carateristique_rep}</span>
                                    <span className="inspectiongen_txt">Montant : <strong>{item.montant} $</strong></span>
                                    <span className="inspectiongen_txt">Statut : <Tag color="orange">{item.nom_type_statut}</Tag></span>
                                    <span className="inspectiongen_txt txt">Commentaire : <strong>{item.commentaire}</strong></span>
                                    <span className="inspectiongen_txt txt">Avis : <strong>{item.avis}</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default InspectionGenDetail;
