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
  const [groupedData, setGroupedData] = useState({ avant: [], apres: [] });
  const [loading, setLoading] = useState(true);
  const [batimentInfo, setBatimentInfo] = useState({});
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

      // Informations générales (on suppose qu'elles sont identiques pour toutes les données)
      const generalInfo = {
        name: data[0]?.nom_batiment || "Inconnu",
        typeInstruction: data[0]?.type_instruction || "Inconnu",
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
    link.download = `Instructions_${batimentInfo.name}.docx`;
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

            {/* Informations générales */}
            <Card style={{ marginBottom: 24, borderRadius: 8, display:'flex', flexDirection:"column", gap:'15px' }}>
              <Text strong>Bâtiment :</Text> <Text>{batimentInfo.name}</Text>
              <br />
              <Text strong>Type d'Instruction :</Text> <Text>{batimentInfo.typeInstruction}</Text>
              <br />
              <Text strong>Catégorie :</Text> <Text>{batimentInfo.categorie}</Text>
              <br />
              <Text strong>Date de Création :</Text> <Text>{new Date(batimentInfo.dateCreation).toLocaleString()}</Text>
            </Card>

            {/* Section "Avant" */}
            <Row gutter={[16, 16]}>
  <Col xs={24}>
    <Title level={4}>Avant</Title>
    {groupedData.avant.length > 0 && (
      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Text strong>Commentaire Avant :</Text>{" "}
        <Text>{groupedData.avant[0]?.commentaire || "Aucun commentaire"}</Text>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {groupedData.avant.map((instruction, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={`avant-img-${index}`}>
              <a
                href={`${DOMAIN}/${instruction.img}`}
                target="_blank"
                rel="noopener noreferrer"
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
                  }}
                />
              </a>
            </Col>
          ))}
        </Row>
      </Card>
    )}
  </Col>

  {/* Section "Après" */}
  <Col xs={24}>
    <Title level={4}>Après</Title>
    {groupedData.apres.length > 0 && (
      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Text strong>Commentaire Après :</Text>{" "}
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
</Row>

          </div>
        </div>
      )}
    </div>
  );
};

export default InstructionsDetail;
