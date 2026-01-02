import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  notification,
  Button,
  Tooltip,
  Tag
} from 'antd';
import {
  LeftCircleFilled,
  RightCircleFilled,
  TagsOutlined,
  TagOutlined,
  CalendarOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

import {
  getInspectGenerateur,
  getInspectGenerateurById
} from '../../../../../services/generateurService';

const InspectionGeneDetail = ({ inspectionId }) => {
  /* =========================
     STATE
  ========================== */
  const [currentInspectionId, setCurrentInspectionId] = useState(inspectionId);
  const [inspectionIds, setInspectionIds] = useState([]);
  const [datas, setDatas] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const activeRequestRef = useRef(null);

  /* =========================
     SYNC PROP → STATE
  ========================== */
  useEffect(() => {
    setCurrentInspectionId(inspectionId);
  }, [inspectionId]);

  /* =========================
     FETCH IDS (navigation)
  ========================== */
  const fetchInspectionIds = useCallback(async () => {
    try {
      const res = await getInspectGenerateur();
      const ids = (res?.data || [])
        .map(i => i.id_inspection_generateur)
        .sort((a, b) => a - b);

      setInspectionIds(ids);
    } catch {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger la liste des inspections.'
      });
    }
  }, []);

  useEffect(() => {
    fetchInspectionIds();
  }, [fetchInspectionIds]);

  /* =========================
     FETCH DETAILS
  ========================== */
  const fetchDatas = useCallback(async (id) => {
    setLoading(true);
    activeRequestRef.current = id;

    try {
      const res = await getInspectGenerateurById(id);

      if (activeRequestRef.current !== id) return;

      const rows = res?.data || [];
      setDatas(rows);
      setTotal(rows.reduce((sum, r) => sum + (r.montant ?? 0), 0));
    } catch {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger les détails.'
      });
    } finally {
      if (activeRequestRef.current === id) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (currentInspectionId) {
      fetchDatas(currentInspectionId);
    }
  }, [currentInspectionId, fetchDatas]);

  /* =========================
     NAVIGATION
  ========================== */
  const goToPrevious = () => {
    const index = inspectionIds.indexOf(currentInspectionId);
    if (index > 0) {
      setCurrentInspectionId(inspectionIds[index - 1]);
    }
  };

  const goToNext = () => {
    const index = inspectionIds.indexOf(currentInspectionId);
    if (index !== -1 && index < inspectionIds.length - 1) {
      setCurrentInspectionId(inspectionIds[index + 1]);
    }
  };

  /* =========================
     HEADER INFO
  ========================== */
  const headerInfo = useMemo(() => {
    if (!datas.length) return {};
    return {
      marque: datas[0].nom_marque,
      modele: datas[0].nom_modele,
      date_inspection: datas[0].date_inspection
    };
  }, [datas]);

  /* =========================
     RENDER
  ========================== */
  return (
    <>
      <div className="inspectionGenDetail">
        <Card loading={loading} className="rows">
          <div className="inspectionGen_wrapper">

            {/* Navigation */}
            <div className="inspectionGen-arrow">
              <Tooltip title="Précédent">
                <Button className="row-arrow" onClick={goToPrevious}>
                  <LeftCircleFilled className="icon-arrow" />
                </Button>
              </Tooltip>

              <h2 className="inspection_h2">
                DÉTAILS DE L'INSPECTION GENERATEUR N°{' '}
                {`${new Date().getFullYear().toString().slice(2)}${currentInspectionId
                  ?.toString()
                  .padStart(4, '0')}`}
              </h2>

              <Tooltip title="Suivant">
                <Button className="row-arrow" onClick={goToNext}>
                  <RightCircleFilled className="icon-arrow" />
                </Button>
              </Tooltip>
            </div>

            {/* Top */}
            <div className="inspectionGen_top">
              <span className="inspection_span">
                <DollarCircleOutlined style={{ color: '#13c2c2' }} /> TOTAL :
                <strong> {total} $</strong>
              </span>

              <span className="inspection_span">
                <TagOutlined style={{ color: '#722ed1' }} /> MARQUE :
                <strong> {headerInfo.marque?.toUpperCase()}</strong>
              </span>

              <span className="inspection_span">
                <TagsOutlined style={{ color: '#fa8c16' }} /> MODELE :
                <strong> {headerInfo.modele}</strong>
              </span>

              <span className="inspection_span">
                <CalendarOutlined style={{ color: '#1890ff' }} /> DATE INSPECTION :
                <strong>
                  {' '}
                  {headerInfo.date_inspection
                    ? moment(headerInfo.date_inspection).format('DD-MM-YYYY')
                    : 'N/A'}
                </strong>
              </span>
            </div>

            {/* Bottom */}
            <div className="inspectionGen_bottom_wrapper">
              {datas.map(item => (
                <div
                  className="inspectionGen_bottom"
                  key={item.id_inspection_detail}
                >
                  <div className="inspectionGen_row_icones" />

                  <div className="inspectionGen_bottom_rows">
                    <span className="inspectiongen_txt">
                      Type de réparation :
                      <strong> {item.type_rep}</strong>
                    </span>
                    <span className="inspectiongen_txt">
                      Catégorie :
                      <strong> {item.nom_cat_inspection}</strong>
                    </span>
                    <span className="inspectiongen_txt">
                      Caractéristique : {item.nom_carateristique_rep}
                    </span>
                    <span className="inspectiongen_txt">
                      Montant :
                      <strong> {item.montant} $</strong>
                    </span>
                    <span className="inspectiongen_txt">
                      Statut :
                      <Tag color="orange">{item.nom_type_statut}</Tag>
                    </span>
                    <span className="inspectiongen_txt">
                      Date d'enregistrement :
                      <Tag color="green" icon={<CalendarOutlined />}>
                        {moment(item.created_at).format('LL [à] HH:mm')}
                      </Tag>
                    </span>
                    <span className="inspectiongen_txt">
                      Date de dernière mise à jour :
                      <Tag color="blue" icon={<CalendarOutlined />}>
                        {moment(item.update_at).format('LL')}
                      </Tag>
                    </span>
                    <span className="inspectiongen_txt txt">
                      Commentaire :
                      <strong> {item.commentaire}</strong>
                    </span>
                    <span className="inspectiongen_txt txt">
                      Avis :
                      <strong> {item.avis}</strong>
                    </span>
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

export default InspectionGeneDetail;
