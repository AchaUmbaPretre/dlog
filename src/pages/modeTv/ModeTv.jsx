import { useEffect, useState } from 'react';
import DepartHorsTiming from './departHorsTiming/DepartHorsTiming';
import ModelEvenementLive from './modelEvenementLive/ModelEvenementLive';
import './modeTv.scss'
import ModeTvCardPonct from './modeTvCardPonct/ModeTvCardPonct';
import ModeTvService from './modeTvService/ModeTvService';
import TableauHorsTiming from './tableauHorsTiming/TableauHorsTiming';
import TopBarModelTv from './topBarModelTv/TopBarModelTv'
import { InfoCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import { getRapportKiosque } from '../../services/rapportService';

const ModeTv = () => {
    const [data, setData] = useState([]);
    const [anomalies, setAnomalies] = useState([]);
    const [courseService, setCourseService] = useState([]);
    const [courseVehicule, setCourseVehicule] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            const { data } = await getRapportKiosque();
            setAnomalies(data?.anomalies);
            setData(data?.ponctualite);
            setCourseService(data?.courseService);
        }
        fetchData()
    }, []);

  return (
    <>
        <div className="mode_tv">
           <TopBarModelTv/>
           <div className="model_tv_wrapper">
                <div className="model_tv_left">
                    <div className="model_tv_anomalie">
                    <div className="anomalie_left">
                        <h3 className="anomalie_h3">Anomalies du jour</h3>
                        <div className="anomalie_wrapper">
                        <div className="anomalie_card danger">
                            <InfoCircleFilled className="anomalie_icon" />
                            <span className="anomalie_desc">Départs sans validation {anomalies.nb_depart_non_valide}</span>
                            <span className="anomalie_badge">!</span>
                        </div>
                        <div className="anomalie_card warning">
                            <InfoCircleOutlined className="anomalie_icon" />
                            <span className="anomalie_desc">Retours en retard {anomalies.nb_retour_en_retard}</span>
                            <span className="anomalie_badge">!</span>
                        </div>
                        </div>
                    </div>
                    <div className="anomalie_right">
                        <button className="anomalie_btn">Voir tout</button>
                    </div>
                </div>

                <ModeTvCardPonct datas={data} />
                <ModeTvService dataService={courseService} />
                <TableauHorsTiming/>
                
                </div>
                <div className="model_tv_right">
                    <ModelEvenementLive/>
                    <DepartHorsTiming/>
                </div>
            </div>

        </div>
    </>
  )
}

export default ModeTv