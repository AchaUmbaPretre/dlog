import React, { useEffect, useRef, useState } from 'react';
import { FileExcelOutlined, FileWordOutlined, CameraOutlined } from '@ant-design/icons';
import { ResponsiveBar } from '@nivo/bar';
import moment from 'moment';
import { saveAs } from 'file-saver';
import { Button } from 'antd';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, TextRun, ImageRun } from 'docx';


const RapportFactureChart = ({ groupedData, uniqueMonths }) => {
  const prepareChartData = (groupedData, uniqueMonths) => {
    const formattedMonths = uniqueMonths.map((month) => {
      const [numMonth, year] = month.split("-");
      return moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
    });

    const chartData = groupedData.map((client) => {
      const clientData = { client: client.Client };
      formattedMonths.forEach((month) => {
        clientData[month] = client[month] || 0;
      });
      return clientData;
    });

    return chartData;
  };
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
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


  useEffect(() => {
    if (groupedData.length > 0 && uniqueMonths.length > 0) {
      setChartData(prepareChartData(groupedData, uniqueMonths));
    }
  }, [groupedData, uniqueMonths]);

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      {/* Titre du graphique */}
      <h2
        style={{
          fontSize: '1rem',
          fontWeight: '300',
          marginBottom: '15px',
          borderBottom: '2px solid #e8e8e8',
          paddingBottom: '10px',
        }}
      >
        RAPPORT M² FACTURE
      </h2>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
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
        </Button>
      </div>

      <div style={{ height: 400 }}>
        <ResponsiveBar
          data={chartData}
          keys={uniqueMonths.map((month) => {
            const [numMonth, year] = month.split("-");
            return moment(`${year}-${numMonth}-01`).format("MMM-YYYY");
          })}
          indexBy="client"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colors={['#E63946', '#F4A261', '#2A9D8F', '#264653', '#E9C46A', '#A8DADC', '#457B9D', '#1D3557']} // Palette plus contrastée
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Mois',
            legendPosition: 'middle',
            legendOffset: 36,
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Montant',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          tooltip={({ id, value }) => (
            <strong>
              {id}: {value}
            </strong>
          )}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: '#777777',
                  strokeWidth: 1,
                },
              },
              ticks: {
                line: {
                  stroke: '#777777',
                  strokeWidth: 1,
                },
                text: {
                  fill: '#777777',
                },
              },
            },
            grid: {
              line: {
                stroke: '#dddddd',
                strokeWidth: 1,
              },
            },
          }}
          groupMode="grouped"
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 0.85,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RapportFactureChart;
