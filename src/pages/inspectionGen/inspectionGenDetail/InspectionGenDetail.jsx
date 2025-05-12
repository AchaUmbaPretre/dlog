import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, notification, Image, Typography, Tag, Divider } from 'antd';
import { getSubInspection } from '../../../services/charroiService';
import moment from 'moment';
import config from '../../../config';
import './inspectionGenDetail.scss'

const { Title, Text, Paragraph } = Typography;

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
                <Card loading={loading}>
                    <div className="inspectionGen_wrapper">
                        <div className="inspectionGen_top">
                            <span className="inspection_span">Marque : <strong>{headerInfo.marque}</strong></span>
                            <span className="inspection_span">Immatriculation : <strong>{headerInfo.marque}</strong></span>
                            <span className="inspection_span">Date inspection : <strong>{headerInfo.marque}</strong></span>
                        </div>

                        <div className="inspectionGen_bottom">
                            
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default InspectionGenDetail;
