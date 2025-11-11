import React, { useState } from "react";
import { DatePicker, Button } from "antd";
import "antd/dist/reset.css";
import moment from "moment";

const { RangePicker } = DatePicker;

const RapportHeader = ({ generatedBy, generatedAt, onPeriodChange }) => {
  const today = moment();
  const [dates, setDates] = useState([today, today]);

  const handleChange = (dates) => {
    setDates(dates);
  };

  const handleGenerate = () => {
    if (dates && dates.length === 2 && onPeriodChange) {
      // Transmettre au parent les dates au format YYYY-MM-DD
      onPeriodChange([dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")]);
    }
  };

  return (
    <header className="rapport__header">
      <div>
        <h1 className="rapport__title">Rapport de gestion du carburant</h1>

        <div style={{ margin: "10px 0" }}>
          <RangePicker
            format="YYYY-MM-DD"
            value={dates}
            onChange={handleChange}
            allowClear
          />
          <Button type="primary" style={{ marginLeft: 10 }} onClick={handleGenerate}>
            Générer le rapport
          </Button>
        </div>

        {dates.length === 2 && (
          <p className="rapport__meta">
            Période sélectionnée : <strong>{dates[0].format("YYYY-MM-DD")}</strong> au{" "}
            <strong>{dates[1].format("YYYY-MM-DD")}</strong>
          </p>
        )}

        <p className="rapport__meta">
          Généré le : <strong>{new Date(generatedAt).toLocaleString("fr-FR")}</strong>
          <span className="rapport__meta-sep">•</span>
        </p>
      </div>
    </header>
  );
};

export default RapportHeader;
