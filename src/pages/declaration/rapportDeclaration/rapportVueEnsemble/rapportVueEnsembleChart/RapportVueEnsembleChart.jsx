import React, { useEffect, useRef, useState } from "react";
import { FileExcelOutlined, FileWordOutlined, CameraOutlined } from "@ant-design/icons";
import { ResponsiveBar } from "@nivo/bar";
import moment from "moment";
import { saveAs } from "file-saver";
import { Button, message } from "antd";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";

const RapportVueEnsembleChart = ({ groupedData, showPercentage }) => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(false);

  /** Capture le graphique sous forme d'image */
  const captureChartAsImage = async (callback) => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current);
      canvas.toBlob((blob) => {
        if (!blob) {
          message.error("Échec de la capture d'image");
          return;
        }
        callback && callback(blob, canvas);
      });
    } catch (error) {
      message.error("Erreur lors de la capture du graphique.");
      console.error("Erreur html2canvas:", error);
    }
  };

  /** Exporter vers Word */
  const exportToWord = async () => {
    setLoading(true);
    captureChartAsImage((blob) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onloadend = async () => {
        try {
          const doc = new Document({
            sections: [
              {
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "Rapport Ville", bold: true, size: 28 })],
                  }),
                  new Paragraph({
                    children: [new ImageRun({ data: reader.result, transformation: { width: 600, height: 300 } })],
                  }),
                ],
              },
            ],
          });

          const wordBlob = await Packer.toBlob(doc);
          saveAs(wordBlob, "RapportVille.docx");
          message.success("Rapport Word généré avec succès !");
        } catch (error) {
          message.error("Erreur lors de l'exportation Word.");
          console.error("Erreur export Word:", error);
        } finally {
          setLoading(false);
        }
      };
    });
  };

  /** Exporter vers Excel */
  const exportToExcel = async () => {
    setLoading(true);
    captureChartAsImage((blob, canvas) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onloadend = async () => {
        try {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Rapport Ville");

          worksheet.getCell("A1").value = "Rapport Ville";
          worksheet.getCell("A1").font = { bold: true, size: 14 };
          worksheet.getRow(1).height = 20;
          worksheet.getColumn(1).width = 40;

          const imageId = workbook.addImage({ buffer: reader.result, extension: "png" });
          worksheet.addImage(imageId, { tl: { col: 0, row: 2 }, ext: { width: canvas.width / 2, height: canvas.height / 2 } });

          const buffer = await workbook.xlsx.writeBuffer();
          saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "RapportVille.xlsx");
          message.success("Rapport Excel généré avec succès !");
        } catch (error) {
          message.error("Erreur lors de l'exportation Excel.");
          console.error("Erreur export Excel:", error);
        } finally {
          setLoading(false);
        }
      };
    });
  };

  /** Formater les données pour Nivo */
  const formatDataForNivo = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const grouped = {};

    data.forEach((item) => {
      const mois = moment(item.Mois, "MMM-YY").format("MMM-YYYY");

      if (!grouped[mois]) {
        grouped[mois] = { Mois: mois, Entreposage: 0, Manutention: 0, total: 0 };
      }

      Object.keys(item).forEach((key) => {
        if (key.includes("Entreposage")) {
          grouped[mois].Entreposage += item[key] || 0;
        }
        if (key.includes("Manutention")) {
          grouped[mois].Manutention += item[key] || 0;
        }
      });

      grouped[mois].total = grouped[mois].Entreposage + grouped[mois].Manutention;
    });

    let nivoData = Object.values(grouped).sort((a, b) => moment(a.Mois, "MMM-YYYY").toDate() - moment(b.Mois, "MMM-YYYY").toDate());

    if (showPercentage) {
      nivoData = nivoData.map((item) => ({
        Mois: item.Mois,
        Entreposage: item.total ? ((item.Entreposage / item.total) * 100).toFixed(2) : 0,
        Manutention: item.total ? ((item.Manutention / item.total) * 100).toFixed(2) : 0,
      }));
    }

    return nivoData;
  };

  let nivoData = formatDataForNivo(groupedData);

  const formatValue = (value) => {
    if (showPercentage) return `${value}%`;
    return value >= 1000 ? `${(value / 1000).toFixed(1).replace(".0", "")}k` : value;
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: "300", marginBottom: "15px", borderBottom: "2px solid #e8e8e8", paddingBottom: "10px" }}>
        RAPPORT CHART DES VILLES
      </h2>

      <div style={{ display: "flex", justifyContent: "flex-start", gap: "12px", marginBottom: "20px" }}>
        <Button icon={<FileExcelOutlined />} onClick={exportToExcel} loading={loading} type="primary" style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}>
          Excel
        </Button>
        <Button icon={<FileWordOutlined />} onClick={exportToWord} loading={loading} type="primary" style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}>
          Word
        </Button>
        <Button icon={<CameraOutlined />} onClick={() => captureChartAsImage((blob) => saveAs(blob, "RapportVille.png"))} type="primary" style={{ backgroundColor: "#ff9800", borderColor: "#ff9800" }}>
          Image
        </Button>
      </div>

      <div ref={chartRef} style={{ height: 400 }}>
      <ResponsiveBar
          data={nivoData}
          keys={['Entreposage', 'Manutention']} // 🔹 Juste Entreposage et Manutention
          indexBy="Mois"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          groupMode="stacked"
          colors={{ scheme: 'nivo' }}
          borderRadius={2}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Mois',
            legendPosition: 'middle',
            legendOffset: 36,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: showPercentage ? 'Pourcentage (%)' : 'Montant ($)',
            legendPosition: 'middle',
            legendOffset: -40,
            format: formatValue // 🔹 Applique le format personnalisé
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              symbolSize: 20
            }
          ]}
          tooltip={({ id, value, color }) => (
            <div style={{ color, padding: '5px', background: '#fff', borderRadius: '3px', boxShadow: '0px 0px 5px rgba(0,0,0,0.2)' }}>
              <strong>{id}: {formatValue(value)}</strong>
            </div>
          )}
          label={(d) => formatValue(d.value)}
        />
      </div>
    </div>
  );
};

export default RapportVueEnsembleChart;
