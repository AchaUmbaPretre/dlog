import { useEffect, useRef, useState } from 'react';
import './releveBonDeSortie.scss';
import { getVehiculeCourseOne } from '../../../../../services/charroiService';
import config from '../../../../../config';
import html2pdf from 'html2pdf.js';

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

const toBase64 = (url) =>
  fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

const ReleveBonDeSortie = ({ id_bon }) => {
  const [groupedData, setGroupedData] = useState({});
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const pdfRef = useRef();

  const fetchDatas = async () => {
    try {
      const response = await getVehiculeCourseOne(id_bon);
      const grouped = groupBy(response.data, 'id_bande_sortie');

      for (const group of Object.values(grouped)) {
        for (const entry of group) {
          const fullUrl = `${DOMAIN}/${entry.signature}`;
          const logoUrl = `${DOMAIN}/${entry.logo}`;
          entry.signatureBase64 = await toBase64(fullUrl);
          entry.logoBase64 = await toBase64(logoUrl)
        }
      }

      setGroupedData(grouped);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    const options = {
      margin: 0.3,
      filename: 'autorisation_de_sortie.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  };

  useEffect(() => {
    fetchDatas();
  }, [id_bon]);

  return (
    <div className="releveBonDeSortie">
      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
        <button onClick={handleDownloadPDF} style={{cursor:'pointer'}}>🖨️ Imprimer / Exporter en PDF</button>
      </div>

      <div ref={pdfRef}>
        {Object.entries(groupedData).map(([id, records]) => {
          const bon = records[0];
          const signataires = records.map(({ personne_signe, role, signatureBase64 }) => ({
            personne_signe,
            role,
            signatureBase64,
          }));

          return (
            <div key={id} className="bon-sortie-wrapper" style={{ border: '1px solid black', padding: 20, marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection:'column' }}>
                <div style={{display:'flex', gap:'20px'}}>
                    <img src={bon.logoBase64} alt="" style={{ height:'100px', width:'80px', objectFit:'cover'}} />
                    <div style={{ fontSize: 12 }}>
                    <strong>{bon.nom_societe}</strong><br />
                    {bon?.adresse}<br />
                    RCCM : {bon?.rccm}<br />
                    NIF : {bon?.nif}<br />
                    Tél : {bon?.telephone}<br />
                    Email : {bon?.email}
                    </div>
                </div>
                <div>
                    <h3 style={{textDecoration:'underline', fontSize:'16px', padding:'10px 0', lineHeight:'10px'}}>Département Administratif et des Ressources humaines</h3>
                </div>
                <div style={{ background: '#000', color: '#fff', padding: '10px 20px', alignSelf: 'center' }}>
                  <h2 style={{ margin: 0, fontSize:'16px' }}>AUTORISATION DE SORTIE</h2>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, fontSize: 14 }}>
                <tbody>
                  <tr>
                    <td><strong>Nom :</strong></td>
                    <td>{bon.personne_bord || '...'}</td>
                    <td><strong>Post-nom :</strong></td>
                    <td>{bon.post_nom || '...'}</td>
                    <td><strong>Matricule :</strong></td>
                    <td>{bon.matricule || '...'}</td>
                  </tr>
                  <tr>
                    <td><strong>Service :</strong></td>
                    <td colSpan={5}>{bon.nom_service}</td>
                  </tr>
                  <tr>
                    <td><strong>Heure de sortie :</strong></td>
                    <td>{new Date(bon.date_prevue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} à {new Date(bon.date_retour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td><strong>Date :</strong></td>
                    <td>{new Date(bon.date_prevue).toLocaleDateString()}</td>
                    <td><strong>Chauffeur :</strong></td>
                    <td>{bon.nom || '...'}</td>
                </tr>

                  <tr>
                    <td><strong>Véhicule :</strong></td>
                    <td>{bon.nom_marque}</td>
                    <td><strong>Plaque :</strong></td>
                    <td>{bon.immatriculation}</td>
                    <td><strong>Type :</strong></td>
                    <td>{bon.nom_type_vehicule}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: 20, fontSize: 14 }}>
                <strong>Motif de sortie :</strong>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li>{bon.nom_motif_demande === 'Se rendre au CMM' ? '☑' : '☐'} Se rendre au CMM</li>
                  <li>{bon.nom_motif_demande === 'Enterrement' ? '☑' : '☐'} Assister à un enterrement</li>
                  <li>{bon.nom_motif_demande === 'Course de service' ? '☑' : '☐'} Course de service</li>
                  <li>{!['Se rendre au CMM', 'Enterrement', 'Course de service'].includes(bon.nom_motif_demande)
                    ? '☑' : '☐'} Autre raison : {bon.nom_motif_demande}</li>
                </ul>
              </div>

              <div style={{ display: 'table', width: '100%', marginTop: 30, fontSize: 13 }}>
                <div style={{ display: 'table-row' }}>
                  <div style={{ display: 'table-cell', textAlign: 'center' }}>
                    {signataires[0]?.signatureBase64 && (
                      <>
                        <img src={signataires[0].signatureBase64} alt="sig" style={{ width: 100, height: 50, objectFit: 'contain' }} /><br />
                        <strong>{signataires[0].role}</strong><br />
                        {signataires[0].personne_signe}
                      </>
                    )}
                  </div>
                  <div style={{ display: 'table-cell', textAlign: 'center', verticalAlign: 'middle' }}>
                    <strong>POUR AVIS ET CONSIDÉRATION</strong>
                  </div>
                  <div style={{ display: 'table-cell', textAlign: 'center' }}>
                    {signataires[1]?.signatureBase64 && (
                      <>
                        <img src={signataires[1].signatureBase64} alt="sig" style={{ width: 100, height: 50, objectFit: 'contain' }} /><br />
                        <strong>{signataires[1].role}</strong><br />
                        {signataires[1].personne_signe}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReleveBonDeSortie;
