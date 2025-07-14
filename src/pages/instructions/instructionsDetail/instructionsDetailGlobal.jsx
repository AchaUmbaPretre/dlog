import { useEffect, useRef, useState } from "react";
import { Card, Spin, notification, Divider, Button, Space, Pagination } from "antd";
import { getInspectionDetailAll } from "../../../services/batimentService";
import html2pdf from "html2pdf.js";
import htmlDocx from "html-docx-js/dist/html-docx";
import config from "../../../config";
import "./instructionsDetail.scss";

const InstructionsDetailGlobal = ({ idInspection }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [groupedData, setGroupedData] = useState({ avant: [], apres: [] });
  const [loading, setLoading] = useState(true);
  const [batimentInfo, setBatimentInfo] = useState({});
  const [inspectionId, setInspectionId] = useState(idInspection);
  const exportRef = useRef();

  // Pagination states
  const [currentPageAvant, setCurrentPageAvant] = useState(1);
  const [currentPageApres, setCurrentPageApres] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setInspectionId(idInspection);
  }, [idInspection]);

  const fetchData = async () => {
    try {
      const { data } = await getInspectionDetailAll(inspectionId, pageSize);

      if (data.data.length === 0) {
        notification.warning({
          message: "Aucune donnée trouvée",
          description: "Il n'y a aucune instruction disponible pour cet ID d'inspection.",
        });
        return;
      }

      const avant = data.data.filter((instruction) => instruction.nom_type_photo === "Avant");
      const apres = data.data.filter((instruction) => instruction.nom_type_photo === "Après");

      setGroupedData({ avant, apres });
    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description: `Une erreur est survenue lors du chargement des données : ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inspectionId) {
      fetchData();
    }
  }, [inspectionId]);

  // Export PDF
  const exportToPDF = () => {
    const element = exportRef.current;

    const images = element.querySelectorAll("img");
    const loadPromises = Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else img.onload = resolve;
        })
    );

    Promise.all(loadPromises).then(() => {
      const options = {
        margin: 1,
        filename: `Instructions_${idInspection}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(options).from(element).save();
    });
  };

  // Export Word
  const exportToWord = () => {
    const content = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Instructions</title>
      </head>
      <body>
        ${exportRef.current.innerHTML}
      </body>
      </html>
    `;

    const blob = htmlDocx.asBlob(content);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Instructions_${batimentInfo.name}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Paginated data
  const paginatedAvant = groupedData.avant.slice((currentPageAvant - 1) * pageSize, currentPageAvant * pageSize);
  const paginatedApres = groupedData.apres.slice((currentPageApres - 1) * pageSize, currentPageApres * pageSize);

  return (
    <div className="instruction">
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <div className="instruction_wrapper">
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={exportToPDF}>
              Exporter en PDF
            </Button>
            <Button type="default" onClick={exportToWord}>
              Exporter en Word
            </Button>
          </Space>
          <Divider style={{ margin: 0 }} />
          <div ref={exportRef} className="instruction_rows">
            <h2 className="instruction_h2" style={{padding:'10px', background:'#f5f5f5', fontSize:'1.2rem', marginBottom:'10px', borderRadius:'5px', fontWeight:'700'}}>Détails globaux des inspections</h2>
            <div className="inspection_bottom">
              {/* Avant */}
              <div className="inspection_bottom_wrapper">
                <h2 className="inspection_title_h2">Avant</h2>
                {paginatedAvant.length > 0 && (
                  <Card style={{ marginBottom: 24, borderRadius: 8 }}>
                    <div className="inspection_bottom_rows">
                      {paginatedAvant.map((instruction, index) => (
                        <div className="inspection_bottom_row" key={`avant-img-${index}`}>
                          <strong className="title_sous_inspection">Commentaire :</strong>{" "}
                          <span className="inspection_desc">{instruction?.commentaire || "Aucun commentaire"}</span>
                          <a
                            href={`${DOMAIN}/${instruction.img}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ width: '100%' }}
                          >
                            <img
                              alt="Avant"
                              src={`${DOMAIN}/${instruction.img}`}
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: 8,
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                                marginTop: '20px',
                              }}
                            />
                          </a>
                        </div>
                      ))}
                    </div>
                    <Pagination
                      current={currentPageAvant}
                      pageSize={pageSize}
                      total={groupedData.avant.length}
                      onChange={(page) => setCurrentPageAvant(page)}
                      style={{ textAlign: 'center', marginTop: 16 }}
                    />
                  </Card>
                )}
              </div>

              {/* Après */}
              <div className="inspection_bottom_wrapper">
                <h2 className="inspection_title_h2">Après</h2>
                {paginatedApres.length > 0 && (
                  <Card style={{ marginBottom: 24, borderRadius: 8 }}>
                    <div className="inspection_bottom_rows">
                      {paginatedApres.map((instruction, index) => (
                        <div className="inspection_bottom_row" key={`apres-img-${index}`}>
                          <strong className="title_sous_inspection">Commentaire :</strong>{" "}
                          <span className="inspection_desc">{instruction?.commentaire || "Aucun commentaire"}</span>
                          <a
                            href={`${DOMAIN}/${instruction.img}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ width: '100%' }}
                          >
                            <img
                              alt="Après"
                              src={`${DOMAIN}/${instruction.img}`}
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: 8,
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                                marginTop: '20px',
                              }}
                            />
                          </a>
                        </div>
                      ))}
                    </div>
                    <Pagination
                      current={currentPageApres}
                      pageSize={pageSize}
                      total={groupedData.apres.length}
                      onChange={(page) => setCurrentPageApres(page)}
                      style={{ textAlign: 'center', marginTop: 16 }}
                    />
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionsDetailGlobal;
