import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import moment from 'moment';
import 'moment/locale/fr';

const RapportTemplatePie = ({ groupedData, uniqueMonths, selectedField }) => {
    if (!groupedData || !uniqueMonths) return null;

    // Transformation des données pour Nivo PieChart
    /* const pieData = groupedData.map(batiment => ({
        id: batiment.desc_template,
        label: batiment.desc_template,
        value: uniqueMonths.reduce((acc, month) => {
            const formattedMonth = moment(month, "M-YYYY").locale('fr').format("MMM-YYYY");
            return acc + (batiment[`${formattedMonth}_${selectedField}`] || 0); // Somme des valeurs pour chaque mois
        }, 0)
    })); */

    const pieData = groupedData.map(batiment => ({
        id: batiment.desc_template,
        label: batiment.desc_template,
        value: uniqueMonths.reduce((acc, month) => {
          const formattedMonth = moment(month, "M-YYYY").locale('fr').format("MMM-YYYY");
          const cell = batiment[`${formattedMonth}_${selectedField}`];
          return acc + (cell?.value ?? 0);
        }, 0)
      }));
      

    return (
        <div style={{
            width: '100%', 
            padding: '20px', 
            fontFamily: "'Roboto', sans-serif"
        }}>
            <h2 style={{
                textAlign: 'center', 
                marginBottom: '30px', 
                fontSize: '1.3rem', 
                color: '#333', 
                fontWeight: '600'
            }}>
                📊 Rapport des Templates (PIE)
            </h2>

            <div style={{ height: '400px', borderRadius: '12px' }}>
                <ResponsivePie
                    data={pieData}
                    margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                    innerRadius={0.5} // Contrôle la taille du cercle interne
                    padAngle={1} // Espacement entre les tranches
                    cornerRadius={5} // Arrondi des coins des tranches
                    colors={{ scheme: 'nivo' }} // Schéma de couleurs élégant
                    borderWidth={2} // Largeur du bord des tranches
                    borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }} // Couleur du bord
                    arcLinkLabelsSkipAngle={10} // Ignore les étiquettes si l'angle est trop petit
                    arcLinkLabelsDiagonalLength={16} // Longueur des liens entre le centre et l'étiquette
                    arcLinkLabelsTextColor="#333" // Couleur du texte des étiquettes
                    arcLabel="value" // Afficher la valeur à l'intérieur de chaque tranche
                    arcLabelsRadiusOffset={0.55} // Ajuste la position des étiquettes à l'intérieur du cercle
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            translateY: 30, // Déplace la légende plus bas sous le chart
                            itemWidth: 150,
                            itemHeight: 20,
                            itemsSpacing: 10,
                            symbolSize: 20,
                            symbolShape: 'circle',
                            itemTextColor: '#333',
                            effects: [
                                { on: 'hover', style: { itemTextColor: '#007bff', fontWeight: 'bold' } }
                            ]
                        }
                    ]}
                    
                    tooltip={({ datum }) => (
                        <div style={{ background: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0px 2px 10px rgba(0,0,0,0.15)' }}>
                            <strong>{datum.id}</strong><br />
                            Valeur : <span style={{ color: datum.color, fontWeight: 'bold' }}>{datum.value}</span>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default RapportTemplatePie;
