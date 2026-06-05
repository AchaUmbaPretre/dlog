// StatCarbDepense.jsx
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  ArrowUpOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Segmented,
  DatePicker,
  Button,
  Popover,
  Spin,
  Empty,
} from "antd";
import moment from "moment";
import "./statCarbDepense.scss";

const { RangePicker } = DatePicker;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const StatCarbDepense = ({ 
  data, 
  loading, 
  periode, 
  updatePeriode, 
  updateDateRange, 
  refresh 
}) => {
  const [open, setOpen] = React.useState(false);

  // Vérification que les props sont bien présentes
  console.log('StatCarbDepense props:', { 
    hasData: !!data, 
    loading, 
    periode, 
    hasUpdatePeriode: typeof updatePeriode === 'function',
    hasUpdateDateRange: typeof updateDateRange === 'function',
    hasRefresh: typeof refresh === 'function'
  });

  const chartData = useMemo(() => {
    if (!data?.evolution) {
      return {
        labels: [],
        datasets: []
      };
    }

    return {
      labels: data.evolution.labels,
      datasets: [
        {
          label: "Dépenses",
          data: data.evolution.depenses,
          borderColor: "#3A5FCD",
          borderWidth: 3,
          tension: 0.45,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#3A5FCD",
          pointHoverBorderWidth: 3,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, "rgba(58,95,205,.25)");
            gradient.addColorStop(1, "rgba(58,95,205,0)");
            return gradient;
          },
        },
        {
          label: "Période précédente",
          data: data.evolution.depenses_prec,
          borderColor: "rgba(140,140,140,.4)",
          borderDash: [6, 6],
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.45,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#111827",
        cornerRadius: 14,
        padding: 14,
        displayColors: false,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'USD' 
            }).format(context.raw)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          color: "rgba(148,163,184,.08)",
        },
        ticks: {
          callback: (value) => `${value / 1000}k`,
        },
      },
    },
  };

  const handlePeriodChange = (value) => {
    console.log('handlePeriodChange called with:', value);
    if (updatePeriode && typeof updatePeriode === 'function') {
      updatePeriode(value);
    } else {
      console.error('updatePeriode is not a function:', updatePeriode);
    }
  };

  const handleDateRangeChange = (dates) => {
    console.log('handleDateRangeChange called with:', dates);
    if (dates && dates[0] && dates[1]) {
      if (updateDateRange && typeof updateDateRange === 'function') {
        updateDateRange(dates);
        setOpen(false);
      } else {
        console.error('updateDateRange is not a function:', updateDateRange);
      }
    }
  };

  const handleRefresh = () => {
    console.log('handleRefresh called');
    if (refresh && typeof refresh === 'function') {
      refresh();
    } else {
      console.error('refresh is not a function:', refresh);
    }
  };

  if (loading && !data) {
    return (
      <div className="fuelExpenseChart">
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" tip="Chargement des données..." />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fuelExpenseChart">
        <Empty description="Aucune donnée disponible" />
      </div>
    );
  }

  return (
    <div className="fuelExpenseChart">
      <div className="chartHeader">
        <div className="chartInfo">
          <span className="chartTitle">
            Evolution des dépenses carburant
          </span>
        </div>

        <div className="chartToolbar">
          <Segmented
            size="small"
            value={periode}
            onChange={handlePeriodChange}
            options={[
              { label: "7J", value: "7j" },
              { label: "30J", value: "30j" },
              { label: "90J", value: "90j" },
              { label: "1A", value: "1y" },
            ]}
          />

          <Popover
            trigger="click"
            open={open}
            onOpenChange={setOpen}
            content={
              <RangePicker 
                onChange={handleDateRangeChange}
                disabledDate={(current) => {
                  return current && current > moment().endOf('day');
                }}
              />
            }
          >
            <Button icon={<CalendarOutlined />} />
          </Popover>

          <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
        </div>
      </div>

      <div className="chartDivider" />

      <div className="chartContainer">
        {chartData.labels.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <Empty description="Aucune donnée d'évolution disponible" />
        )}
      </div>
    </div>
  );
};

export default StatCarbDepense;