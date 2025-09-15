import { Typography } from 'antd';
import './rapportVehiculeUtilitaire.scss';
import RapportUtilitaireDispo from './rapportUtilitaireDispo/RapportUtilitaireDispo';
import RapportUtilitaireCourse from './rapportUtilitaireCourse/RapportUtilitaireCourse';
import RapportUtilitaireHorsCourseM from './rapportUtilitaireHorsCourseM/RapportUtilitaireHorsCourseM';

const { Text } = Typography;

const RapportVehiculeUtilitaire = ({ utilitaire }) => {

  return (
    <>
      <div className="rapportVehiculeUtilitaire">
        <div className="rapport_utilitaire_wrapper">
          <div className="rapport_utilitaire_top">
            <RapportUtilitaireDispo/>
            <RapportUtilitaireCourse/>
          </div>
          <div className="rapport_utilitaire_bottom">
            <RapportUtilitaireHorsCourseM/>
          </div>
        </div>
      </div>
    </>
  );
};

export default RapportVehiculeUtilitaire;
