import {
  Card,
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
import { useInspectionNavigation } from '../hook/useInspectionNavigation';
import InspectionSkeleton from '../service/InspectionSkeleton';

const InspectionGeneDetail = ({ inspectionId }) => {
  const {
    currentInspectionId,
    datas,
    total,
    loading,
    headerInfo,
    goToPrevious,
    goToNext
  } = useInspectionNavigation(inspectionId);

  return (
    <div className="inspectionGenDetail">
      <Card loading={false} className="rows">
        <div className="inspectionGen_wrapper">

          {/* Navigation */}
          <div className="inspectionGen-arrow">
            <Tooltip title="Précédent">
              <Button className="row-arrow" onClick={goToPrevious}>
                <LeftCircleFilled className="icon-arrow" />
              </Button>
            </Tooltip>

            <h2 className="inspection_h2">
              DÉTAILS DE L'INSPECTION GENERATEUR N°
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

          {loading ? (
            <InspectionSkeleton />
          ) : (
            <>
              {/* Top */}
              <div className="inspectionGen_top">
                <span className="inspection_span">
                  <DollarCircleOutlined /> TOTAL :
                  <strong> {total} $</strong>
                </span>

                <span className="inspection_span">
                  <TagOutlined /> MARQUE :
                  <strong> {headerInfo.marque?.toUpperCase()}</strong>
                </span>

                <span className="inspection_span">
                  <TagsOutlined /> MODELE :
                  <strong> {headerInfo.modele}</strong>
                </span>

                <span className="inspection_span">
                  <CalendarOutlined /> DATE INSPECTION :
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
                    <div className="inspectionGen_bottom_rows">
                        <span className="inspectiongen_txt">
                            Type : <strong>{item.type_rep}</strong>
                        </span>

                        <span className="inspectiongen_txt">
                            Catégorie : <strong>{item.nom_cat_inspection}</strong>
                        </span>

                        <span className="inspectiongen_txt">
                            Montant : <strong>{item.montant} $</strong>
                        </span>

                        <span className="inspectiongen_txt">
                            Statut : <Tag color="orange">{item.nom_type_statut}</Tag>
                        </span>

                        <span className="inspectiongen_txt">Date d'enregistrement : 
                            <Tag color="green" icon={<CalendarOutlined />}> {moment(item.created_at).format('LL [à] HH:mm')} </Tag> 
                        </span> 

                        <span className="inspectiongen_txt">Date de dernière mise à jour : 
                            <Tag color="blue" icon={<CalendarOutlined />}>{moment(item.update_at).format('LL')}</Tag>
                        </span> 

                        <span className="inspectiongen_txt txt">Commentaire : 
                            <strong>{item.commentaire}</strong>
                        </span> 

                        <span className="inspectiongen_txt txt">Avis : 
                            <strong>{item.avis}</strong>
                        </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InspectionGeneDetail;
