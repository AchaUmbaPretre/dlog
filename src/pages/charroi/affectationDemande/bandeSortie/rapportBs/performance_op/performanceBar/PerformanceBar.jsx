import React, { useEffect, useState } from 'react'
import {
  Card,
  Tooltip,
} from "antd";
import { ResponsiveBar } from '@nivo/bar';

const PerformanceBar = ({graphData}) => {  
    const [tickRotation, setTickRotation] = useState(0);
    const [tickFontSize, setTickFontSize] = useState(13);

  useEffect(() => {
    const adjustSettings = () => {
      if (graphData.length > 6 || window.innerWidth < 900) {
        setTickRotation(-45);
        setTickFontSize(11);
      } else {
        setTickRotation(0);
        setTickFontSize(13);
      }
    };
    adjustSettings();
    window.addEventListener("resize", adjustSettings);
    return () => window.removeEventListener("resize", adjustSettings);
  }, [graphData.length]);

  return (
    <div>
        <Card type="inner" title="Durée moyenne par destination" style={{ marginBottom: 16 }}>
            <div style={{ height: 400 }}>
              <ResponsiveBar
                data={graphData}
                keys={["duree"]}
                indexBy="destination"
                margin={{ top: 20, right: 50, bottom: 90, left: 70 }}
                padding={0.3}
                colors={(bar) => bar.value >= 5 ? "green" : bar.value >= 2 ? "orange" : "red"}
                axisBottom={{
                  tickRotation,
                  legend: "Destination",
                  legendPosition: "middle",
                  legendOffset: 70,
                }}
                axisLeft={{
                  legend: "Durée moyenne (h)",
                  legendPosition: "middle",
                  legendOffset: -60,
                }}
                enableLabel={true}
                labelSkipWidth={20}
                labelSkipHeight={14}
                labelTextColor={{ from: "color", modifiers: [["darker", 1.4]] }}
                tooltip={({ indexValue, value }) => (
                  <Tooltip title={`${indexValue}: ${value} h`}>
                    <span>{value} h</span>
                  </Tooltip>
                )}
                theme={{
                  axis: {
                    ticks: { text: { fontSize: tickFontSize } },
                    legend: { text: { fontSize: 13, fontWeight: 600 } },
                  },
                  labels: { text: { fontSize: 11, fontWeight: 500 } },
                }}
                animate
              />
            </div>
          </Card>
    </div>
  )
}

export default PerformanceBar