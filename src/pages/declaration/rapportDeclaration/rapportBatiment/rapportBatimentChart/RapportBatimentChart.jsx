import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import moment from 'moment';
import 'moment/locale/fr'; // Import de la locale française pour moment.js

const RapportBatimentChart = ({ groupedData, uniqueMonths, selectedField }) => {
    if (!groupedData || !uniqueMonths) return null;

    // Transformation des données pour Nivo LineChart
    const lineData = groupedData.map(batiment => ({
        id: batiment.desc_template,
        data: uniqueMonths.map(month => {
            const formattedMonth = moment(month, "M-YYYY").locale('fr').format("MMM-YYYY"); // Mois abrégé en français (janv-2025)

            return {
                x: formattedMonth, // Affiche le mois sous forme de "janv-2025"
                y: batiment[`${formattedMonth}_${selectedField}`] || 0 // Utilisation du champ sélectionné dynamiquement
            };
        })
    }));

    return (
        <div style={{ width: '100%', height: '500px', padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.3rem', color: '#333' }}>
                📈 Rapport des Bâtiments
            </h2>

            <div style={{ height: '400px' }}>
                <ResponsiveLine
                    data={lineData}
                    margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
                    curve="monotoneX"
                    axisBottom={{
                        legend: 'Mois',
                        legendOffset: 36,
                        legendPosition: 'middle',
                        tickRotation: -30,
                        tickSize: 5,
                        tickPadding: 5,
                        format: value => value.substring(0, 3), // Utiliser les 3 premiers caractères pour un format compact
                    }}
                    axisLeft={{
                        legend: 'Valeur',
                        legendOffset: -50,
                        legendPosition: 'middle',
                        tickSize: 5,
                        tickPadding: 5,
                    }}
                    colors={{ scheme: 'category10' }}
                    pointSize={8}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={3}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabel="y"
                    pointLabelYOffset={-12}
                    enableGridX={false}
                    enableGridY={true}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'top-right',
                            direction: 'column',
                            translateX: 40,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemTextColor: '#333',
                            symbolSize: 12,
                            symbolShape: 'circle',
                            effects: [{ on: 'hover', style: { itemTextColor: '#000', fontWeight: 'bold' } }]
                        }
                    ]}
                    tooltip={({ point }) => (
                        <div style={{ background: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0px 2px 10px rgba(0,0,0,0.15)' }}>
                            <strong>{point.serieId}</strong> <br />
                            Mois : {point.data.x} <br />
                            Valeur : <span style={{ color: point.serieColor, fontWeight: 'bold' }}>{point.data.y}</span>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default RapportBatimentChart;
