import { useCallback, useEffect, useMemo, useState } from 'react';
import { notification, Tooltip, Skeleton, Alert, Button, Divider, Tag } from 'antd';
import {
  CarOutlined,
  UserOutlined,
  DashboardOutlined,
  DollarOutlined,
  RightCircleFilled,
  LeftCircleFilled,
  CalendarOutlined,
  FireOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { formatNumber } from '../../../../utils/formatNumber';
import { getGenerateurOne } from '../../../../services/generateurService';

const DetailGenerateur = ({ id_generateur, allIds = [] }) => {
  const [data, setData] = useState(null);
  const [currentId, setCurrentId] = useState(id_generateur);
  const [loading, setLoading] = useState(true);

  const currentIndex = allIds.indexOf(currentId);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === allIds.length - 1;

  const loadData = useCallback(async () => {
    if (!currentId) return;

    setLoading(true);

    try {
      const { data } = await getGenerateurOne(currentId);

      if (!data || !data[0]) {
        setData(null);
        return;
      }

      setData(data[0]);
    } catch (err) {
      notification.error({
        message: 'Erreur de chargement',
        description:
          err.response?.data?.message ||
          "Impossible de charger les détails du générateur.",
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [currentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const goNext = () => !isLast && setCurrentId(allIds[currentIndex + 1]);
  const goPrevious = () => !isFirst && setCurrentId(allIds[currentIndex - 1]);

  return (
    <div className="carburantPro fadeIn">

      <div className="top-navigation floating-nav">
        <Tooltip title="Précédent">
          <Button
            className="nav-arrow-btn"
            onClick={goPrevious}
            disabled={isFirst}
            icon={<LeftCircleFilled />}
          />
        </Tooltip>

        <div className="title-block">
          <FireOutlined className="main-icon pulse" />
          <h2>Détails Générateur</h2>
        </div>

        <Tooltip title="Suivant">
          <Button
            className="nav-arrow-btn"
            onClick={goNext}
            disabled={isLast}
            icon={<RightCircleFilled />}
          />
        </Tooltip>
      </div>

      <div id="pdf-content" className="content-wrapper">

        <div className="col">

          {/* SECTION IDENTIFICATION */}
          <section className="box elevated">
            <h3><CarOutlined style={{ color: "#1677ff" }}/> Informations Générateur</h3>
            <Divider />
            <p><strong>Marque :</strong> {data?.nom_marque}</p>
            <p><strong>Modèle :</strong> {data?.nom_modele}</p>
            <p><strong>Numéro Série :</strong> {data?.num_serie || "Non renseigné"}</p>
            <p><strong>Année Fabrication :</strong> {data?.annee_fabrication}</p>
            <p><strong>Année Mise en Service :</strong> {data?.annee_service || "Non renseigné"}</p>
          </section>

          {/* IMAGE */}
          <section className="box elevated">
            <h3><FireOutlined style={{ color: "#ff4d4f" }}/> Photo</h3>
            <Divider />
            {data?.img ? (
              <img
                src={data.img}
                alt="Générateur"
                style={{
                  width: "100%",
                  borderRadius: 10,
                  maxHeight: 220,
                  objectFit: "cover",
                }}
              />
            ) : (
              <p>Aucune image disponible</p>
            )}
          </section>
        </div>

        <div className="col">

          {/* SECTION CARACTÉRISTIQUES */}
          <section className="box elevated">
            <h3><DollarOutlined style={{ color: "#faad14" }} /> Caractéristiques Techniques</h3>
            <Divider />
            <p><strong>Puissance :</strong> {data?.puissance} kVA</p>
            <p><strong>Puissance Secondaire :</strong> {data?.puissance_sec || "—"}</p>
            <p><strong>Tension :</strong> {data?.tension} V</p>
            <p><strong>Fréquence :</strong> {data?.frequence || "—"}</p>
            <p><strong>Cos Phi :</strong> {data?.cos_phi}</p>
            <p><strong>Nbre Cylindres :</strong> {data?.nbre_cylindre}</p>
            <p><strong>Refroidissement :</strong> {data?.nom_refroidissement}</p>
            <p><strong>Type Carburant :</strong> {data?.nom_type_carburant}</p>
            <p><strong>Capacité Radiateur :</strong> {data?.capacite_radiateur} L</p>
          </section>

          {/* SECTION DIMENSIONS */}
          <section className="box elevated">
            <h3><DashboardOutlined style={{ color: "#0958d9" }}/> Dimensions & Poids</h3>
            <Divider />
            <p><strong>Longueur :</strong> {data?.longueur} cm</p>
            <p><strong>Largeur :</strong> {data?.largeur} cm</p>
            <p><strong>Poids :</strong> {data?.poids} kg</p>
            <p><strong>Réservoir Carburant :</strong> {data?.reservoir} L</p>
            <p><strong>Valeur d'Acquisition :</strong> {formatNumber(data?.valeur_acquisition)}</p>
          </section>

        </div>

      </div>
    </div>
  );
};

export default DetailGenerateur;
