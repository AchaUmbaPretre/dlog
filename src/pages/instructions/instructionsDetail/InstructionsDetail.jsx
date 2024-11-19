import React, { useEffect, useRef, useState } from "react";
import { Card, Spin, notification, Typography, Row, Col, Button, Space } from "antd";
import { getInspectionOneV } from "../../../services/batimentService";
import html2pdf from "html2pdf.js";
import htmlDocx from "html-docx-js/dist/html-docx";
import config from "../../../config";
import "./instructionsDetail.scss";

const { Title, Text } = Typography;

const InstructionsDetail = ({ idInspection }) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameBatiment, setNameBatiment] = useState("");
  const exportRef = useRef();

  const fetchData = async () => {
    try {
      const { data } = await getInspectionOneV(idInspection);

      if (data.length === 0) {
        notification.warning({
          message: "Aucune donnée trouvée",
          description: "Il n'y a aucune instruction disponible pour cet ID d'inspection.",
        });
        return;
      }

      setNameBatiment(data[0]?.nom_batiment || "Inconnu");

      // Regrouper les données par leurs champs communs
      const grouped = data.reduce((acc, instruction) => {
        const key = `${instruction.nom_batiment}_${instruction.nom_type_instruction}_${instruction.commentaire}_${instruction.date_creation}`;
        if (!acc[key]) {
          acc[key] = {
            ...instruction,
            images: [],
          };
        }
        acc[key].images.push(instruction.img);
        return acc;
      }, {});

      setGroupedData(Object.values(grouped));
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
    if (idInspection) {
      fetchData();
    }
  }, [idInspection]);

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
    const content = `<html><body>${exportRef.current.innerHTML}</body></html>`;
    const blob = htmlDocx.asBlob(content);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Instructions_${nameBatiment}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: 16 }}>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <div>
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={exportToPDF}>
              Exporter en PDF
            </Button>
            <Button type="default" onClick={exportToWord}>
              Exporter en Word
            </Button>
          </Space>
          <div ref={exportRef}>
            <Title level={3} style={{ textAlign: "center", marginBottom: 24, fontWeight: 300 }}>
              Détails des Instructions
            </Title>
            <Row gutter={[16, 16]}>
              {groupedData.map((instruction, index) => (
                <Col xs={24} key={index}>
                  <Card hoverable style={{ borderRadius: 8 }}>
                    <Title level={4}>{instruction.nom_batiment}</Title>
                    <Text strong>Type d'Instruction :</Text>{" "}
                    <Text>{instruction.nom_type_instruction}</Text>
                    <br />
                    <Text strong>Commentaire :</Text>{" "}
                    <Text>{instruction.commentaire}</Text>
                    <br />
                    <Text strong>Date de Création :</Text>{" "}
                    <Text>{new Date(instruction.date_creation).toLocaleString()}</Text>
                    <br />
                    <div style={{ marginTop: 16 }}>
                      <Text strong>Images :</Text>
                      <Row gutter={[16, 16]}>
                        {instruction.images.map((img, imgIndex) => (
                          <Col xs={24} sm={12} lg={8} key={imgIndex}>
                            <a
                              href={`${DOMAIN}/${img}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                alt="Instruction"
                                src={`${DOMAIN}/${img}`}
                                style={{
                                  width: "100%",
                                  height: 200,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                }}
                              />
                            </a>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionsDetail;
