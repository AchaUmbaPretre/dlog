import React, { useRef, useState } from 'react';
import moment from 'moment';
import { ResponsiveLine } from '@nivo/line';
import { Button } from 'antd';
import { FileExcelOutlined, FileWordOutlined, CameraOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, TextRun, ImageRun } from 'docx';

const RapportEntreposageChart = ({ groupedData, uniqueMonths }) => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const captureChartAsImage = (callback) => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then(canvas => {
        canvas.toBlob(blob => {
          if (callback) callback(blob, canvas);
        });
      });
    }
  };

  const exportToWord = () => {
    setLoading(true);
    captureChartAsImage((blob) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onloadend = () => {
        const imageBuffer = reader.result;
        const doc = new Document({
          sections: [
            {
              children: [
                new Paragraph({ children: [new TextRun({ text: "Rapport d'Entreposage", bold: true, size: 28 })] }),
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: imageBuffer,
                      transformation: { width: 600, height: 300 },
                    }),
                  ],
                }),
              ],
            },
          ],
        });

        Packer.toBlob(doc).then(blob => {
          saveAs(blob, "RapportEntreposage.docx");
          setLoading(false);
        });
      };
    });
  };

  const exportToExcel = () => {
    setLoading(true);
    captureChartAsImage((blob, canvas) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onloadend = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Rapport Entreposage");
        worksheet.getCell("A1").value = "Rapport Entreposage";
        worksheet.getCell("A1").font = { bold: true, size: 14 };
        worksheet.getRow(1).height = 20;
        worksheet.getColumn(1).width = 40;

        const imageId = workbook.addImage({ buffer: reader.result, extension: 'png' });
        worksheet.addImage(imageId, { tl: { col: 0, row: 2 }, ext: { width: canvas.width / 2, height: canvas.height / 2 } });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "RapportEntreposage.xlsx");
        setLoading(false);
      };
    });
  };

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '300', marginBottom: '15px', borderBottom: '2px solid #e8e8e8', paddingBottom: '10px' }}>
        Rapport Entreposage
      </h2>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '12px', 
        marginBottom: '20px', 
        padding: '15px', 
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' 
      }}>
        <Button 
          type="primary" 
          icon={<FileExcelOutlined />} 
          onClick={exportToExcel} 
          loading={loading} 
          style={{ 
            fontSize: '16px', 
            padding: '12px 24px', 
            backgroundColor: '#28a745', // Vert Excel
            borderColor: '#28a745',
            color: '#fff'
          }}
        >
          Exporter Excel
        </Button>

        <Button 
          type="primary" 
          icon={<FileWordOutlined />} 
          onClick={exportToWord} 
          loading={loading} 
          style={{ 
            fontSize: '16px', 
            padding: '12px 24px', 
            backgroundColor: '#007bff', // Bleu Word
            borderColor: '#007bff',
            color: '#fff'
          }}
        >
          Exporter Word
        </Button>

        <Button 
          type="primary" 
          icon={<CameraOutlined />} 
          onClick={() => captureChartAsImage(blob => saveAs(blob, "RapportEntreposage.png"))} 
          style={{ 
            fontSize: '16px', 
            padding: '12px 24px', 
            backgroundColor: '#ff9800', // Orange Image
            borderColor: '#ff9800',
            color: '#fff'
          }}
        >
          Exporter Image
        </Button>
      </div>


      <div ref={chartRef} style={{ height: 400, background: "white", padding: 10 }}>
        <ResponsiveLine
          data={groupedData.map(client => ({
            id: client.Client,
            data: uniqueMonths.map(month => ({
              x: moment(month, "M-YYYY").format("MMM YYYY"),
              y: client[moment(month, "M-YYYY").format("MMM-YYYY")] || 0
            }))
          }))}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
          curve="monotoneX"
          axisBottom={{ orient: 'bottom', legend: 'Mois', legendOffset: 36 }}
          axisLeft={{ orient: 'left', legend: 'Montant', legendOffset: -40 }}
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

export default RapportEntreposageChart;
