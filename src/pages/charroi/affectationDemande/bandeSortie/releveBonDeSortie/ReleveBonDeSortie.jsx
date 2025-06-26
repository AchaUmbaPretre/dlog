import { useEffect, useState } from 'react';
import './releveBonDeSortie.scss';
import { getVehiculeCourseOne } from '../../../../../services/charroiService';
import config from '../../../../../config';

const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

const ReleveBonDeSortie = ({ id_bon }) => {
  const [groupedData, setGroupedData] = useState({});
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

  const fetchDatas = async () => {
    try {
      const response = await getVehiculeCourseOne(id_bon);
      const grouped = groupBy(response.data, 'id_bande_sortie');
      setGroupedData(grouped);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [id_bon]);

  return (
    <div className="releveBonDeSortie">
      {Object.entries(groupedData).map(([id, records]) => {
        const bon = records[0];
        const signataires = records.map(({ personne_signe, role, signature }) => ({
          personne_signe,
          role,
          signature,
        }));

        return (
          <div key={id} className="bon-sortie-wrapper">
            <div className="header">
              <div className="entreprise">
                <p><strong>GROUPE DE TRANSPORT MULTIMODAL "G.T.M" SARLU</strong></p>
                <p>3116, Av Goodyear, Q/Kingabwa, C/Limete</p>
                <p>RCCM : CD/KNG/RCCM/13-B-0562</p>
                <p>NIF : A0700024L</p>
                <p>Tél : +243 998018090 / 898930708</p>
                <p>Email : secretariatgtm@gtmdrc.com</p>
              </div>
              <div className="titre">
                <h2>AUTORISATION DE SORTIE</h2>
              </div>
            </div>

            <table className="info-table">
              <tbody>
                <tr>
                  <td>Nom :</td>
                  <td>{bon.nom || '...'}</td>
                  <td>Post-nom :</td>
                  <td>{bon.post_nom || '...'}</td>
                  <td>Matricule :</td>
                  <td>{bon.matricule || '...'}</td>
                </tr>
                <tr>
                  <td>Service :</td>
                  <td colSpan={5}>{bon.nom_service}</td>
                </tr>
                <tr>
                  <td>Heure de sortie :</td>
                  <td>{new Date(bon.date_prevue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>Date :</td>
                  <td>{new Date(bon.date_prevue).toLocaleDateString()}</td>
                  <td>Chauffeur :</td>
                  <td>{bon.personne_bord || '...'}</td>
                </tr>
                <tr>
                  <td>Véhicule :</td>
                  <td>{bon.nom_marque}</td>
                  <td>Plaque :</td>
                  <td>{bon.immatriculation}</td>
                  <td>Type :</td>
                  <td>{bon.nom_type_vehicule}</td>
                </tr>
              </tbody>
            </table>

            <div className="motifs">
              <p><strong>Motif de sortie :</strong></p>
              <ul>
                <li>{bon.nom_motif_demande === 'Se rendre au CMM' ? '☑' : '☐'} Se rendre au CMM</li>
                <li>{bon.nom_motif_demande === 'Enterrement' ? '☑' : '☐'} Assister à un enterrement</li>
                <li>{bon.nom_motif_demande === 'Course de service' ? '☑' : '☐'} Course de service</li>
                <li>{!['Se rendre au CMM', 'Enterrement', 'Course de service'].includes(bon.nom_motif_demande) ? '☑' : '☐'} Autre raison : {bon.nom_motif_demande}</li>
              </ul>
            </div>

            <div className="signatures">
              <div className="sign-left">
                {signataires[0] && (
                  <>
                    <img src={`${DOMAIN}/${signataires[0].signature}`} alt="signature" />
                    <p>{signataires[0].role}</p>
                    <p>{signataires[0].personne_signe}</p>
                  </>
                )}
              </div>
              <div className="avis">
                <p><strong>POUR AVIS ET CONSIDÉRATION</strong></p>
              </div>
              <div className="sign-right">
                {signataires[1] && (
                  <>
                    <img src={`${DOMAIN}/${signataires[1].signature}`} alt="signature" />
                    <p>{signataires[1].role}</p>
                    <p>{signataires[1].personne_signe}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReleveBonDeSortie;
