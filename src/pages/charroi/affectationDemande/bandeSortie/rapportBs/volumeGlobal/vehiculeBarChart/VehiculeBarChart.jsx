import { ResponsiveBar } from '@nivo/bar';

const VehiculeBarChart = ({ data }) => {
  const formattedData = data.map(item => ({
    type: item.nom_cat,
    véhicules: item.nbre,
  }));

  return (
    <div style={{ height: 300 }}>
      <ResponsiveBar
        data={formattedData}
        keys={['véhicules']}
        indexBy="type"
        margin={{ top: 40, right: 40, bottom: 60, left: 60 }}
        padding={0.3}
        layout="vertical"
        colors={{ scheme: 'nivo' }}
        borderRadius={4}
        enableLabel={true}
        labelTextColor="#ffffff"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Type de véhicule',
          legendPosition: 'middle',
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Nombre',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
        tooltip={({ id, value, indexValue }) => (
          <strong style={{ fontSize: 14 }}>
            {indexValue} : {value}
          </strong>
        )}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default VehiculeBarChart;
