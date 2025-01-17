import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { ResponsiveLine } from '@nivo/line';

const RapportManuChart = ({ groupedData, uniqueMonths }) => {

    // Générer les données pour le graphique
    const generateNivoData = () => {
        return groupedData.map(client => {
            // Pour chaque client, nous allons générer les données en fonction de `uniqueMonths`
            const data = uniqueMonths.map(month => {
                // Formater le mois en "MMM-YYYY"
                const monthFormatted = moment(month, "M-YYYY").format("MMM-YYYY");
                
                // Récupérer le montant pour ce mois (et gérer le cas où il est `null` ou `undefined`)
                const value = client[monthFormatted] || 0;

                return {
                    x: moment(monthFormatted, "MMM-YYYY").format("MMM YYYY"),  // Format "MMM YYYY"
                    y: value  // Montant (ou 0 si inexistant)
                };
            });

            return {
                id: client.Client,  // Identifiant basé sur le client
                data: data  // Données pour ce client
            };
        });
    };

    const nivoData = generateNivoData();

    return (
        <div style={{ width: '100%', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '300', marginBottom: '15px', borderBottom:'2px solid #e8e8e8', paddingBottom:'10px' }}>
                CHART DE RAPPORT MANUTENTION
            </h2>

            <div style={{ height: 400 }}>
                <ResponsiveLine
                    data={nivoData}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Month',
                        legendOffset: 36
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Amount',
                        legendOffset: -40
                    }}
                    pointSize={10}
                    pointColor={{ from: 'serieColor' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    enableSlices="x"
                    useMesh={true}
                />
            </div>
        </div>
    );
};

export default RapportManuChart;
