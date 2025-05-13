import React, { useEffect, useState } from 'react';
import { Card, notification, Tag } from 'antd';
import { getSubInspection } from '../../../services/charroiService';
import moment from 'moment';
import config from '../../../config';
import './inspectionGenDetail.scss'

const InspectionGenDetail = ({ inspectionId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

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
                        <h2 className="inspection_h2">DETAILS DE L'INSPECTION</h2>
                        <div className="inspectionGen_top">
                            <span className="inspection_span">Marque : <strong>{headerInfo.marque}</strong></span>
                            <span className="inspection_span">Immatriculation : <strong>{headerInfo.immatriculation}</strong></span>
                            <span className="inspection_span">Date inspection : <strong>{moment(headerInfo.date_inspection).format('DD/MM/YYYY')}</strong></span>
                        </div>

                        <div className="inspectionGen_bottom_wrapper">
                            { data.map((item)=> (
                            <div className="inspectionGen_bottom">
                                <div className="inspection_rows_img">
                                    <img src={`${DOMAIN}/${item.img}`} alt="" className="img" />
                                </div>
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
