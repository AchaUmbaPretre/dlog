import { useCallback, useEffect, useState } from 'react';
import { Card, notification, Button, Tooltip, Tag, Image, Divider } from 'antd';
import { LeftCircleFilled, TagsOutlined, TagOutlined, CalendarOutlined, DollarCircleOutlined, RightCircleFilled, CarOutlined, PlusOutlined, MoreOutlined, FileSearchOutlined, ToolOutlined, FileTextOutlined, FileImageOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getInspectGenerateur, getInspectGenerateurById } from '../../../../../services/generateurService';


const InspectionGeneDetail = ({ inspectionId }) => {
    const [datas, setDatas] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idInspections, setIdInspections] = useState(inspectionId);
    const [idValides, setIdValides] = useState([]);
    const [total, setTotal] = useState(null);

    const fetchDataInsp = useCallback(async () => {
        setLoading(true);
        try {
              const [inspectionData] = await Promise.all([
                getInspectGenerateur(),
              ]);
    
            setData(inspectionData?.data || []);
    
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
    }, [inspectionId])

        const fetchDatas = async () => {
                setLoading(true);
                try {
                    const response = await  getInspectGenerateurById(idInspections);
                    const idList = data.map(item => item.id_inspection_generateur).sort((a, b) => a - b);
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

    console.log(datas)
    const headerInfo = datas.length > 0
        ? {
              marque: datas[0].nom_marque,
              modele: datas[0].nom_modele,
              date_inspection: datas[0].date_inspection,
          }
        : {};

  return (
    <>
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
                            DÉTAILS DE L'INSPECTION GENERATEUR N° {`${new Date().getFullYear().toString().slice(2)}${inspectionId?.toString().padStart(4, '0')}`}
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
                            <TagOutlined style={{ color: '#722ed1' }} /> MARQUE : <strong>{headerInfo.marque?.toUpperCase()}</strong>
                        </span>

                        <span className="inspection_span">
                            <TagsOutlined style={{ color: '#fa8c16' }} /> MODELE : <strong>{headerInfo.modele}</strong>
                        </span>

                        <span className="inspection_span">
                            <CalendarOutlined style={{ color: '#1890ff' }} /> DATE INSPECTION :{' '}
                            <strong>{headerInfo.date_inspection ? moment(headerInfo.date_inspection).format('DD-MM-YYYY') : 'N/A'}</strong>
                        </span>
                    </div>
                    <div className="inspectionGen_bottom_wrapper">
                        {datas.map((item) => (
                            <div className="inspectionGen_bottom">
                                <div className="inspectionGen_row_icones">

                                </div>

                                <div className="inspectionGen_bottom_rows">
                                <span className="inspectiongen_txt">Type de réparation : <strong>{item.type_rep}</strong></span>
                                <span className="inspectiongen_txt">Catégorie : <strong>{item.nom_cat_inspection}</strong></span>
                                <span className="inspectiongen_txt">Caractéristique : {item.nom_carateristique_rep}</span>
                                <span className="inspectiongen_txt">Montant : <strong>{item.montant} $</strong></span>
                                <span className="inspectiongen_txt">Statut : <Tag color="orange">{item.nom_type_statut}</Tag></span>
                                <span className="inspectiongen_txt">Date d'enregistrement : <Tag color="green" icon={<CalendarOutlined />}>
                                {moment(item.created_at).format('LL [à] HH:mm')}
                                </Tag>
                                </span>
                                <span className="inspectiongen_txt">Date de dernière mise à jour : <Tag color="blue" icon={<CalendarOutlined />}>{moment(item.update_at).format('LL')}</Tag></span>
                                <span className="inspectiongen_txt txt">Commentaire : <strong>{item.commentaire}</strong></span>
                                <span className="inspectiongen_txt txt">Avis : <strong>{item.avis}</strong></span>
                                </div>                            
                            </div>
                        ))

                        }
                    </div>
               </div> 
            </Card>
        </div>
    </>
  )
}

export default InspectionGeneDetail