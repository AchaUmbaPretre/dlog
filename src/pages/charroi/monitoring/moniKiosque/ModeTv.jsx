import { useEffect, useState } from 'react';
import ModeTvCardPonct from './modeTvCardPonct/ModeTvCardPonct';
import ModeTvService from './modeTvService/ModeTvService';
import AlertTimeline from './alertTimeline/AlertTimeline';
import TableauHorsTiming from './tableauHorsTiming/TableauHorsTiming';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getRapportKiosque } from '../../../../services/rapportService';
import './modeTv.scss';

const ModeTv = () => {
  const [data, setData] = useState([]);
  const [anomalies, setAnomalies] = useState({});
  const [courseService, setCourseService] = useState([]);
  const [courseChauffeur, setCourseChauffeur] = useState([]);
  const [departHorsTimingRow, setDepartHorsTimingRow] = useState([]);
  const [departHorsTimingCompletRow, setDepartHorsTimingCompletRow] = useState([]);
  const [motif, setMotif] = useState([]);
  const [utilisationParc, setUtilisationParc] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getRapportKiosque();
      setAnomalies(data?.anomalies || {});
      setData(data?.total || []);
      setCourseService(data?.courseService || []);
      setCourseChauffeur(data?.courseChauffeur || []);
      setDepartHorsTimingRow(data?.departHorsTiming || []);
      setUtilisationParc(data?.utilisationParc || []);
      setDepartHorsTimingCompletRow(data?.departHorsTimingCompletRows || []);
      setMotif(data?.motifRows || []);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const anomalyItems = [
    { type: 'warning', label: 'Départs en retard', value: anomalies.depart_en_retard },
    { type: 'warning', label: 'Retours en retard', value: anomalies.retour_en_retard },
  ];

  return (
    <div className="mode_tv">
      <div className="model_tv_wrapper">
        <div className="model_tv_left">
          <div className="model_tv_anomalie">
            <h3 className="anomalie_h3">Anomalies du jour</h3>
            <div className="anomalie_wrapper">
              {anomalyItems.map((item, idx) => (
                <div key={idx} className={`anomalie_card ${item.type}`}>
                  <div className="anomalie_icon"><InfoCircleOutlined /></div>
                  <span className="anomalie_desc">{item.label} : <strong>{item.value || 0}</strong></span>
                  {item.value > 0 && <span className="anomalie_badge">!</span>}
                </div>
              ))}
            </div>
          </div>

          <ModeTvCardPonct datas={data} utilisationParc={utilisationParc} />
          <ModeTvService dataService={courseService} courseVehicule={courseChauffeur} motif={motif} />
        </div>

        <div className="model_tv_right">
          <AlertTimeline departHorsTimingRow={departHorsTimingRow} />
        </div>
      </div>

      <TableauHorsTiming departHorsTimingRow={departHorsTimingCompletRow} />
    </div>
  );
};

export default ModeTv;