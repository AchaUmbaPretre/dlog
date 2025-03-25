import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Composant RapportEntreposageChart
 * Affiche un graphique interactif avec exportation native (Image, Excel, Word).
 * 
 * @param {Array} groupedData - Données groupées par client.
 * @param {Array} uniqueMonths - Mois uniques pour l'axe X.
 * @returns {JSX.Element} - Le composant du graphique.
 */
const RapportEntreposageChart = ({ groupedData, uniqueMonths }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    // Génération des données pour ECharts
    const seriesData = groupedData.map(client => ({
      name: client.Client,
      type: "line",
      smooth: true,
      data: uniqueMonths.map(month => client[month] || 0),
    }));

    const option = {
      title: { text: "Rapport Entreposage", left: "center" },
      tooltip: { trigger: "axis" },
      legend: { data: groupedData.map(client => client.Client), bottom: 0 },
      xAxis: { type: "category", data: uniqueMonths },
      yAxis: { type: "value" },
      series: seriesData,
    };

    chartInstance.current.setOption(option);

    return () => chartInstance.current.dispose();
  }, [groupedData, uniqueMonths]);

  /** 📷 Exporter le graphique en image (PNG) */
  const exportAsImage = () => {
    const chart = chartInstance.current;
    if (!chart) return;

    const imageURL = chart.getDataURL({ type: "png", pixelRatio: 2, backgroundColor: "#fff" });
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "rapport_entreposage.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /** 📊 Exporter les données en Excel */
  const exportAsExcel = () => {
    const data = groupedData.map(client => ({
      Client: client.Client,
      ...uniqueMonths.reduce((acc, month) => {
        acc[month] = client[month] || 0;
        return acc;
      }, {}),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rapport Entreposage");
    XLSX.writeFile(workbook, "rapport_entreposage.xlsx");
  };

  /** 📝 Exporter en Word */
  const exportAsWord = () => {
    const textContent = `Rapport Entreposage\n\n` + groupedData.map(client => 
      `Client: ${client.Client}\n` +
      uniqueMonths.map(month => `${month}: ${client[month] || 0}`).join("\n")
    ).join("\n\n");

    const blob = new Blob([textContent], { type: "application/msword" });
    saveAs(blob, "rapport_entreposage.doc");
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {/* Boutons d'exportation */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={exportAsImage} style={{ marginRight: "10px" }}>📷 Exporter en Image</button>
        <button onClick={exportAsExcel} style={{ marginRight: "10px" }}>📊 Exporter en Excel</button>
        <button onClick={exportAsWord}>📝 Exporter en Word</button>
      </div>

      {/* Graphique */}
      <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default RapportEntreposageChart;
