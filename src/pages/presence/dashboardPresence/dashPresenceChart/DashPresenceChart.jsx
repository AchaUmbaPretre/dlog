import { useState } from 'react';
import { Tabs } from 'antd';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { LineChartOutlined, UserDeleteOutlined, BarChartOutlined, CheckCircleOutlined, ClockCircleOutlined, PieChartOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/fr';
import './../dashboardSection.scss';

const { TabPane } = Tabs;

const DashPresenceChart = ({ evolution, statuts, kpi }) => {
  const [activeTab, setActiveTab] = useState('line');

  const lineData = [
    {
      id: 'Présents',
      color: 'hsl(120, 70%, 50%)',
      data: evolution?.map((e) => ({
        x: moment(e.date).format('dddd DD/MM'),
        y: e.presents
      }))
    },
    {
      id: 'Absents',
      color: 'hsl(0, 70%, 50%)',
      data: evolution?.map((e) => ({
        x: moment(e.date).format('dddd DD/MM'),
        y: e.absents
      }))
    }
  ];

  const pieData = statuts?.map((s) => ({
    id: s.label,
    label: s.label,
    value: s.value
  }));

  return (
    <div className="dashboard-section">
      
      <div className="section-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <BarChartOutlined />
        Statistiques de présence
      </div>

            <div className="dashboard-stats" style={{ margin: '10px' }}>
        <div className="stat-item">
          <div className="stat-value">
            {kpi?.tauxPresence} %
          </div>
          <div className="stat-label">
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 6 }} />
            Taux de Présence
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-value">
            {kpi?.retardMoyen} min
          </div>
          <div className="stat-label">
            <ClockCircleOutlined style={{ color: '#faad14', marginRight: 6 }} />
            Retards Moyens
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-value">
            {kpi?.absencesTotales}
          </div>
          <div className="stat-label">
            <UserDeleteOutlined style={{ color: '#ff4d4f', marginRight: 6 }} />
            Absences Totales
          </div>
        </div>
      </div>

      <div className="section-body">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          type="card"
        >
          {/* Line Chart */}
          <TabPane 
            tab={
              <span>
                <LineChartOutlined style={{ marginRight: 6 }} />
                Évolution (7 derniers jours)
              </span>
            } 
            key="line"
          >
            {evolution?.length ? (
              <div style={{ height: 350 }}>
                <ResponsiveLine
                  data={lineData}
                  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 0 }}
                  axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: 'Date',
                    legendOffset: 36,
                    legendPosition: 'middle'
                  }}
                  axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Nombre de personnes',
                    legendOffset: -50,
                    legendPosition: 'middle'
                  }}
                  colors={{ scheme: 'set2' }}
                  pointSize={8}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  useMesh={true}
                />
              </div>
            ) : (
              <p>Aucune donnée disponible.</p>
            )}
          </TabPane>

          {/* Pie Chart */}
          <TabPane 
            tab={
              <span>
                <PieChartOutlined style={{ marginRight: 6 }} />
                Répartition par statut
              </span>
            } 
            key="pie"
          >
            {statuts?.length ? (
              <div style={{ height: 300 }}>
                <ResponsivePie
                  data={pieData}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: 'paired' }}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  enableArcLabels={true}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                />
              </div>
            ) : (
              <p>Aucune donnée disponible.</p>
            )}
          </TabPane>
        </Tabs>
      </div>

    </div>
  );
};

export default DashPresenceChart;
