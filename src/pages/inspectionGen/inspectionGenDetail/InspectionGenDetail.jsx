import React, { useEffect, useState } from 'react';
import { Card, notification, Button, Tooltip, Tag, Image, Divider} from 'antd';
import { getSubInspection } from '../../../services/charroiService';
import moment from 'moment';
import config from '../../../config';
import './inspectionGenDetail.scss'
import imgDetail from './../../../assets/Pas_image.png'
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';

const InspectionGenDetail = ({ inspectionId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [idInspections, setIdInspections] = useState(inspectionId);
    const [idValides, setIdValides] = useState([]);

    const fetchDatas = async () => {
        setLoading(true);
        try {
            const response = await getSubInspection(inspectionId);
            setData(response.data);
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
        } finally {
            setLoading(false);
        }
    };

    const goToPrevious = () => {
        setIdInspections((prevId) =>
             {
            const currentIndex = idValides.indexOf(prevId);
            if (currentIndex !== -1 && currentIndex < idValides.length - 1) {
                return idValides[currentIndex + 1]
            }
            return prevId;
        })
    }

    const goToNext = () => {

    }

    useEffect(() => {
        if (inspectionId) {
            fetchDatas();
        }
    }, [inspectionId]);

    const headerInfo = data.length > 0 ? {
        marque: data[0].nom_marque,
        immatriculation: data[0].immatriculation
    } : {};

    return (
        <>
            <div className="inspectionGenDetail">
                <Card loading={loading} className='rows'>
                    <div className="inspectionGen_wrapper">
                        <div className="inspectionGen-arrow">
                            <Tooltip title="Précédent">
                                <Button className="row-arrow" onClick={goToPrevious}>
                                    <LeftCircleFilled className='icon-arrow'/>
                                </Button>
                            </Tooltip>
                            <h2 className="inspection_h2">DETAILS DE L'INSPECTION</h2>
                            <Tooltip title="Suivant">
                                <Button className="row-arrow" onClick={goToNext}>
                                    <RightCircleFilled className='icon-arrow' />
                                </Button>
                            </Tooltip>
                        </div>

                        <div className="inspectionGen_top">
                            <span className="inspection_span">MARQUE : <strong>{headerInfo.marque?.toUpperCase()}</strong></span>
                            <span className="inspection_span">IMMATRICULATION : <strong>{headerInfo.immatriculation}</strong></span>
                            <span className="inspection_span">DATE INSPECTION : <strong>{moment(headerInfo.date_inspection).format('DD/MM/YYYY')}</strong></span>
                        </div>

                        <div className="inspectionGen_bottom_wrapper">
                            { data.map((item)=> (
                            <div className="inspectionGen_bottom">
                                <div className="inspection_rows_img">
                                    <Image src={item.img ? `${DOMAIN}/${item.img}` : imgDetail} alt="Image" className="img" />
                                </div>
                                <Divider />
                                <div className="inspectionGen_bottom_rows">
                                    <span className="inspectiongen_txt">Type de réparation : <strong>{item.type_rep}</strong></span>
                                    <span className="inspectiongen_txt">Catégorie : <strong>{item.nom_cat_inspection}</strong></span>
                                    <span className="inspectiongen_txt">Caractéristique : {item.nom_carateristique_rep}</span>
                                    <span className="inspectiongen_txt">Montant : <strong>{item.montant} $</strong></span>
                                    <span className="inspectiongen_txt">Statut : <Tag color="orange">{item.nom_type_statut}</Tag></span>
                                    <span className="inspectiongen_txt">Commentaire : <strong>{item.commentaire}</strong></span>
                                    <span className="inspectiongen_txt">Avis : <strong>{item.avis}</strong></span>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default InspectionGenDetail;
