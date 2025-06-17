import { useEffect, useRef, useState } from "react";
import { Card, Spin, notification, Divider, Tooltip, Typography, Row, Col, Button, Space } from "antd";
import { getInspectionOneV } from "../../../services/batimentService";
import html2pdf from "html2pdf.js";
import htmlDocx from "html-docx-js/dist/html-docx";
import config from "../../../config";
import "./instructionsDetail.scss";
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

const InstructionsDetail = ({ idInspection }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [groupedData, setGroupedData] = useState({ avant: [], apres: [] });
  const [loading, setLoading] = useState(true);
  const [batimentInfo, setBatimentInfo] = useState({});
  const [inspectionId, setInspectionId] = useState(idInspection)
  const exportRef = useRef();

    useEffect(() => {
      setInspectionId(idInspection);
    }, [idInspection]);

  const goToNext = () => {
    setInspectionId((prevId) => prevId + 1);
  };

  const goToPrevious = () => {
    setInspectionId((prevId) => (prevId > 1 ? prevId - 1 : prevId));
  };

  const fetchData = async () => {
    try {
      const { data } = await getInspectionOneV(inspectionId);
      
      if (data.length === 0) {
        notification.warning({
          message: "Aucune donnée trouvée",
          description: "Il n'y a aucune instruction disponible pour cet ID d'inspection.",
        });
        return;
      }

      const generalInfo = {
        name: data[0]?.nom_batiment || "Inconnu",
        typeInstruction: data[0]?.nom_type_instruction || "Inconnu",
        categorie: data[0]?.nom_cat_inspection || "Inconnu",
        dateCreation: data[0]?.date_creation || "Inconnu",
      };
      setBatimentInfo(generalInfo);

      // Séparer les données en "Avant" et "Après"
      const avant = data.filter((instruction) => instruction.nom_type_photo === "Avant");
      const apres = data.filter((instruction) => instruction.nom_type_photo === "Après");

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

  // Fonction pour exporter en PDF
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

  // Fonction pour exporter en Word
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
          <Divider style={{margin:0}}/>
          <div ref={exportRef} className="instruction_rows">
            <h2 className="instruction_h2">
              Détails des Instructions
            </h2>
            <Card style={{background: '#f5f5f5', margin:0, marginBottom:'20px'}}>
              <div className="row_inspections">
                <Tooltip title="Précédent">
                  <Button className="row-arrow" onClick={goToPrevious}>
                    <LeftCircleFilled className="icon-arrow" />
                  </Button>
                </Tooltip>
                <div className="instruction_row">
                  <div className="instruction_sous_row">
                    <strong className="instruction_desc_strong">🏢 Bâtiment : </strong>
                    <span className="instruction_desc">{batimentInfo.name}</span>
                  </div>

                  <div className="instruction_sous_row">
                    <strong className="instruction_desc_strong">🛠️ Type d'Inspection : </strong>
                    <span className="instruction_desc">{batimentInfo.typeInstruction}</span>
                  </div>

                  <div className="instruction_sous_row">
                    <strong className="instruction_desc_strong">🏷️ Catégorie : </strong>
                    <span className="instruction_desc">{batimentInfo.categorie}</span>
                  </div>

                  <div className="instruction_sous_row">
                    <strong className="instruction_desc_strong">🗓️ Date de Création : </strong>
                    <span className="instruction_desc">{new Date(batimentInfo.dateCreation).toLocaleString()}</span>
                  </div>
                </div>
                <Tooltip title="Suivant">
                  <Button className="row-arrow" onClick={goToNext}>
                    <RightCircleFilled className="icon-arrow" />
                  </Button>
                </Tooltip>
              </div>  
            </Card>          

            {/* Section "Avant" */}
            <div className="inspection_bottom">
              <div className="inspection_bottom_wrapper">
                <h2 className="inspection_title_h2">Avant</h2>
                {groupedData.avant.length > 0 && (
                  <Card style={{ marginBottom: 24, borderRadius: 8 }}>
                    <div className="inspection_bottom_rows">
                      {groupedData.avant.map((instruction, index) => (
                        <div className="inspection_bottom_row" key={`avant-img-${index}`}>
                          <strong className="title_sous_inspection">Commentaire :</strong>{" "}
                          <span className="inspection_desc">{instruction?.commentaire || "Aucun commentaire"}</span>
                          <a
                            href={`${DOMAIN}/${instruction.img}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{width:'100%'}}
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
                                marginTop:'20px',
                              }}
                            />
                          </a>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Section "Après" */}
              <Col xs={24}>
                <Title level={4}>Après</Title>
                {groupedData.apres.length > 0 && (
                  <Card style={{ marginBottom: 24, borderRadius: 8 }}>
                    <Text strong>Commentaire : </Text>{" "}
                    <Text>{groupedData.apres[0]?.commentaire || "Aucun commentaire"}</Text>
                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                      {groupedData.apres.map((instruction, index) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={`apres-img-${index}`}>
                          <a
                            href={`${DOMAIN}/${instruction.img}`}
                            target="_blank"
                            rel="noopener noreferrer"
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
                              }}
                            />
                          </a>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                )}
              </Col>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionsDetail;
