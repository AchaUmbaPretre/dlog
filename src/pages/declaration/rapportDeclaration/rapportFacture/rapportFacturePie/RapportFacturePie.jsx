import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import moment from "moment";

const RapportFacturePie = ({ groupedData, uniqueMonths }) => {
  const prepareChartData = (groupedData, uniqueMonths) => {
    const formattedMonths = uniqueMonths.map((month) => {
      const [numMonth, year] = month.split("-");
      return moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
    });

    // Préparer les données pour le graphique en camembert
    const chartData = groupedData.flatMap((client) =>
      formattedMonths.map((month) => ({
        id: `${client.Client} - ${month}`,
        label: `${client.Client} - ${month}`,
        value: client[month] || 0,
      }))
    );

    return chartData.filter((data) => data.value > 0); // Exclure les valeurs nulles ou 0
  };

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (groupedData.length > 0 && uniqueMonths.length > 0) {
      setChartData(prepareChartData(groupedData, uniqueMonths));
    }
  }, [groupedData, uniqueMonths]);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {/* Titre du graphique */}
      <h2
        style={{
          fontSize: "1rem",
          fontWeight: "300",
          marginBottom: "15px",
          borderBottom: "2px solid #e8e8e8",
          paddingBottom: "10px",
        }}
      >
        RAPPORT M² FACTURE
      </h2>

      <div style={{ height: 400 }}>
        <ResponsivePie
          data={chartData}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          innerRadius={0.5} // Rayon intérieur pour un "donut chart"
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: "nivo" }}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          tooltip={({ datum }) => (
            <strong>
              {datum.id}: {datum.value}
            </strong>
          )}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: "#777777",
                  strokeWidth: 1,
                },
              },
              ticks: {
                line: {
                  stroke: "#777777",
                  strokeWidth: 1,
                },
                text: {
                  fill: "#777777",
                },
              },
            },
            grid: {
              line: {
                stroke: "#dddddd",
                strokeWidth: 1,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default RapportFacturePie;
