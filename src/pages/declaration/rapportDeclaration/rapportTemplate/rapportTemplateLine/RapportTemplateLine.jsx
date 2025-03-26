import React, { useEffect, useRef, useState } from "react";
import { ResponsiveLine } from '@nivo/line';
import { FileExcelOutlined, FileWordOutlined, CameraOutlined } from "@ant-design/icons";
import moment from 'moment';
import 'moment/locale/fr';
import { saveAs } from "file-saver";
import { Button, message } from "antd";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";

const RapportTemplateLine = ({ groupedData, uniqueMonths, selectedField }) => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const chartData = groupedData.map(batiment => ({
      id: batiment.desc_template,
      data: uniqueMonths.map(month => {
          const formattedMonth = moment(month, "M-YYYY").locale('fr').format("MMM-YYYY");  // Correction ici
          const key = `${formattedMonth}_${selectedField}`;
  
          return {
              x: formattedMonth,
              y: batiment[key] || 0
          };
      })
  }));

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
                      children: [new TextRun({ text: "Rapport Template", bold: true, size: 28 })],
                    }),
                    new Paragraph({
                      children: [new ImageRun({ data: reader.result, transformation: { width: 600, height: 300 } })],
                    }),
                  ],
                },
              ],
            });
  
            const wordBlob = await Packer.toBlob(doc);
            saveAs(wordBlob, "RapportTemplate.docx");
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
            const worksheet = workbook.addWorksheet("Rapport Template");
  
            worksheet.getCell("A1").value = "Rapport Template";
            worksheet.getCell("A1").font = { bold: true, size: 14 };
            worksheet.getRow(1).height = 20;
            worksheet.getColumn(1).width = 40;
  
            const imageId = workbook.addImage({ buffer: reader.result, extension: "png" });
            worksheet.addImage(imageId, { tl: { col: 0, row: 2 }, ext: { width: canvas.width / 2, height: canvas.height / 2 } });
  
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "RapportTemplate.xlsx");
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

  return (
    <div style={{ height: 400 }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '1.3rem', color: '#333', fontWeight: '600' }}>
        📈 Rapport des templates
      </h2>

      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', padding: '15px', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Button icon={<FileExcelOutlined />} onClick={exportToExcel} loading={loading} type="primary" style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}>
        </Button>
        <Button icon={<FileWordOutlined />} onClick={exportToWord} loading={loading} type="primary" style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}>
        </Button>
        <Button icon={<CameraOutlined />} onClick={() => captureChartAsImage((blob) => saveAs(blob, "RapportTemplate.png"))} type="primary" style={{ backgroundColor: "#ff9800", borderColor: "#ff9800" }}>
        </Button>
      </div>

      <div style={{ height: '400px' }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
          }}
          axisLeft={{
            legend: 'Valeur',
            legendOffset: -40,
            legendPosition: 'middle',
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Mois',
            legendPosition: 'middle',
            legendOffset: 36,
          }}
          colors={{ scheme: 'category10' }}
          lineWidth={3}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableSlices="x"
          useMesh={true}
        />
      </div>
    </div>
  );
};

export default RapportTemplateLine;
