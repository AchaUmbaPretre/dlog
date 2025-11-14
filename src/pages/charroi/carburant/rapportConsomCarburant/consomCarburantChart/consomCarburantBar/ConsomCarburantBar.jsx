import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { Card } from 'antd';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ConsomCarburantBar = () => {
    const [datas, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Organiser les données récupérées pour les afficher sur le graphique
    const prepareChartData = () => {
    const dieselData = Array(12).fill(0); // Initialiser un tableau pour Diesel
    const essenceData = Array(12).fill(0); // Initialiser un tableau pour Essence

    // Remplir les données par type de carburant et par mois
    datas.forEach(({ annee, mois, total_conso, nom_type_carburant }) => {
      const moisIndex = mois - 1; // Pour avoir un index de 0 à 11 (janvier = index 0, décembre = index 11)
      if (nom_type_carburant === 'Diesel') {
        dieselData[moisIndex] += total_conso;
      } else if (nom_type_carburant === 'Essence') {
        essenceData[moisIndex] += total_conso;
      }
    });

    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Mois de l'année
      datasets: [
        {
          label: 'Diesel',
          data: dieselData,
          backgroundColor: '#1a73e8',
          borderColor: '#1a73e8',
          borderWidth: 1,
        },
        {
          label: 'Essence',
          data: essenceData,
          backgroundColor: 'rgb(255, 99, 132)', // Couleur des barres pour l'essence
          borderColor: '#fbbc04',
          borderWidth: 1,
        },
      ],
    };
  };

  const data = prepareChartData();

  // Options du diagramme
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Position de la légende
      },
      title: {
        display: true,
        text: 'Consommation Mensuelle: Diesel vs Essence', // Titre du diagramme
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Supprime les lignes de la grille horizontale
        },
      },
      y: {
        grid: {
          color: '#e0e0e0', // Couleur des lignes de la grille verticale
        },
      },
    },
  };

  return (
    <>
        <Card>
            <div className="consomCarburantBar">
                <Bar data={data} options={options} />
            </div>
        </Card>
    </>
  )
}

export default ConsomCarburantBar