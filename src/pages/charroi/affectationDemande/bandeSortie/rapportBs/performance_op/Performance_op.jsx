import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Row,
  Col,
  Statistic,
  Progress,
  message,
  Spin,
  Input,
  Typography,
  Tooltip
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { ResponsiveBar } from "@nivo/bar";
import { getRapportBonPerformance } from "../../../../../../services/rapportService";
import FilterBs from "../filterBs/FilterBs";

const { Search } = Input;
const { Title } = Typography;

const PerformanceOp = () => {
  const [vehicule, setVehicule] = useState([]);
  const [chauffeur, setChauffeur] = useState([]);
  const [dureeData, setDureeData] = useState([]);
  const [tauxData, setTauxData] = useState({ taux_retour_delais: 0 });
  const [loading, setLoading] = useState(false);
  const scroll = { x: 400 };
  const [searchVehicule, setSearchVehicule] = useState("");
  const [searchChauffeur, setSearchChauffeur] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [filters, setFilters] = useState({
    vehicule: [],
    service: [],
    destination: [],
    dateRange: [],
  });

const fetchData = async (filter) => {
  try {
    setLoading(true);
    const { data } = await getRapportBonPerformance(filter);
    setVehicule(data.vehiculeData || []);
    setChauffeur(data.chauffeurData || []);
    setDureeData(data.dureeData || []);
    setTauxData(data.tauxData || { taux_retour_delais: 0 });
  } catch (error) {
    message.error("Erreur lors du chargement des données");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData(filters);
}, [filters]);

  // Totaux pour dureeData
  const totalHeures = dureeData.reduce((acc, curr) => acc + curr.duree_totale_heures, 0);
  const totalJours = dureeData.reduce((acc, curr) => acc + curr.duree_totale_jours, 0);

  const filteredVehicules = vehicule.filter(v => v.immatriculation.toLowerCase().includes(searchVehicule.toLowerCase()));
  const filteredChauffeurs = chauffeur.filter(c => c.nom.toLowerCase().includes(searchChauffeur.toLowerCase()));
  const filteredDureeData = dureeData.filter(d =>
    d.nom_destination.toLowerCase().includes(searchDestination.toLowerCase())
  );

  const graphData = dureeData.map(c => ({
    destination: c.nom_destination,
    duree: parseFloat(c.duree_moyenne_heures) || 0
  }));

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Filtrage */}
      <div style={{ marginBottom: 24 }}>
        <FilterBs onFilter={setFilters}/>
      </div>

      <Spin spinning={loading} tip="Chargement des données..." size="large">
        {/* KPI */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <Statistic
                title="Taux retour dans les délais"
                value={tauxData.taux_retour_delais || 0}
                precision={2}
                suffix="%"
              />
              <Progress percent={tauxData.taux_retour_delais || 0} strokeColor={{ from: "#108ee9", to: "#87d068" }} strokeWidth={14} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <Statistic
                title="Véhicules mobilisés"
                value={vehicule.length}
                prefix={vehicule.length > 10 ? <ArrowUpOutlined style={{ color: "green" }} /> : <ArrowDownOutlined style={{ color: "red" }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <Statistic
                title="Chauffeurs mobilisés"
                value={chauffeur.length}
                prefix={chauffeur.length > 10 ? <ArrowUpOutlined style={{ color: "green" }} /> : <ArrowDownOutlined style={{ color: "red" }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Tables et graphique */}
        <Card title={<Title level={4}>Performance opérationnelle</Title>} bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          
          <Card type="inner" title="Véhicules" style={{ marginBottom: 16 }}>
            <Search placeholder="Rechercher véhicule" onChange={e => setSearchVehicule(e.target.value)} style={{ marginBottom: 12, width: 300 }} allowClear />
            <Table dataSource={filteredVehicules} rowKey="id_vehicule" pagination={{ pageSize: 5 }} bordered columns={[
              { title: "#", render: (_, __, index) => index + 1 },
              { title: "Immatriculation", dataIndex: "immatriculation" },
              { title: "Marque", dataIndex: "nom_marque" },
              { title: "Catégorie", dataIndex: "nom_cat" },
              { title: "Sorties", dataIndex: "total_sorties", sorter: (a, b) => a.total_sorties - b.total_sortie }
            ]}/>
          </Card>

          <Card type="inner" title="Chauffeurs" style={{ marginBottom: 16 }}>
            <Search placeholder="Rechercher chauffeur" onChange={e => setSearchChauffeur(e.target.value)} style={{ marginBottom: 12, width: 300 }} allowClear />
            <Table dataSource={filteredChauffeurs} scroll={scroll} rowKey="id_chauffeur" pagination={{ pageSize: 5 }} bordered columns={[
              { title: "#", render: (_, __, index) => index + 1 },
              { title: "Nom", dataIndex: "nom" },
              { title: "Sorties", dataIndex: "total_sorties",sorter: (a, b) => a.total_sorties - b.total_sorties }
            ]}/>
          </Card>

          <Card type="inner" title="Durée moyenne par destination" style={{ marginBottom: 16 }}>
            <div style={{ height: 400 }}>
              <ResponsiveBar
                data={graphData}
                keys={["duree"]}
                indexBy="destination"
                margin={{ top: 20, right: 50, bottom: 70, left: 60 }}
                padding={0.3}
                colors={d => d.value >= 5 ? "green" : d.value >=2 ? "orange" : "red"}
                axisBottom={{ tickRotation: -45, legend: "Destination", legendPosition: "middle", legendOffset: 50 }}
                axisLeft={{ legend: "Durée moyenne (h)", legendPosition: "middle", legendOffset: -50 }}
                enableLabel
                labelTextColor={{ from: "color", modifiers: [["darker", 1.2]] }}
                tooltip={({ indexValue, value }) => <Tooltip title={`${indexValue}: ${value} h`}><span>{value} h</span></Tooltip>}
                animate
              />
            </div>
          </Card>

          {/* Tableau duréeData amélioré */}
          <Card type="inner" title="Durée des courses par destination">
            <Search 
              placeholder="Rechercher destination" 
              onChange={e => setSearchDestination(e.target.value)} 
              style={{ marginBottom: 12, width: 300 }} 
              allowClear 
            />
            <Table
              dataSource={filteredDureeData}
              rowKey={(record, index) => index}
              pagination={{ pageSize: 5 }}
              bordered
              scroll={scroll}
              columns={[
                { title: "#", render: (_, __, index) => index + 1 },
                { title: "Destination", dataIndex: "nom_destination" },
                { 
                  title: "Durée moyenne (h)", 
                  dataIndex: "duree_moyenne_heures", 
                  sorter: (a, b) => a.duree_moyenne_heures - b.duree_moyenne_heures,
                  render: value => {
                    const color = value >=5 ? "green" : value >=2 ? "orange" : "red";
                    return <span style={{ color, fontWeight: "bold" }}>{value}</span>;
                  }
                },
                { title: "Durée totale (h)", dataIndex: "duree_totale_heures", sorter: (a, b) => a.duree_totale_heures - b.duree_totale_heures },
                { title: "Durée totale (j)", dataIndex: "duree_totale_jours", sorter: (a, b) => a.duree_totale_jours - b.duree_totale_jours },
                { title: "Nbre sortie", dataIndex:"total_sorties", sorter: (a, b) => a.total_sorties - b.total_sorties}
              ]}
              footer={() => (
                <div style={{ fontWeight: "bold" }}>
                  Totaux : {totalHeures.toFixed(2)} h / {totalJours.toFixed(2)} j
                </div>
              )}
            />
          </Card>

        </Card>
      </Spin>
    </div>
  );
};

export default PerformanceOp;
