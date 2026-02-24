import React, { useState } from "react";
import { Select, Spin, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import "./filtreDashboard.scss";
import { useFiltreDashData } from "./hooks/useFiltreDashData";

const { Option } = Select;

const FiltreDashboard = () => {
  const { data, sites, departm, loading, period, setPeriod } =
    useFiltreDashData();

  const [filters, setFilters] = useState({
    userId: null,
    siteId: null,
    departementId: null,
  });

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || null,
    }));
  };

  const handleReset = () => {
    setFilters({
      userId: null,
      siteId: null,
      departementId: null,
    });
    setPeriod("TODAY");
  };

  return (
    <div className="filtre__dashboard">
      <div className="filtre__wrapper">
        {loading ? (
          <div className="filtre__loading">
            <Spin />
          </div>
        ) : (
          <>
            {/* Période */}
            <div className="filtre__item">
              <label>Période</label>
              <Select
                value={period}
                onChange={setPeriod}
                className="filtre__select"
              >
                <Option value="TODAY">Aujourd’hui</Option>
                <Option value="WEEK">Cette semaine</Option>
                <Option value="MONTH">Ce mois</Option>
                <Option value="YEAR">Cette année</Option>
              </Select>
            </div>

            {/* Employé */}
            <div className="filtre__item">
              <label>Employé</label>
              <Select
                value={filters.userId}
                onChange={(v) => handleChange("userId", v)}
                placeholder="Tous les utilisateurs"
                allowClear
                className="filtre__select"
              >
                {data?.map((d) => (
                  <Option key={d.id_utilisateur} value={d.id_utilisateur}>
                    {d.nom}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Site */}
            <div className="filtre__item">
              <label>Site</label>
              <Select
                value={filters.siteId}
                onChange={(v) => handleChange("siteId", v)}
                placeholder="Tous les sites"
                allowClear
                className="filtre__select"
              >
                {sites?.map((site) => (
                  <Option key={site.id_site} value={site.id_site}>
                    {site.nom_site}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Département */}
            <div className="filtre__item">
              <label>Département</label>
              <Select
                value={filters.departementId}
                onChange={(v) => handleChange("departementId", v)}
                placeholder="Tous les départements"
                allowClear
                className="filtre__select"
              >
                {departm?.map((dep) => (
                  <Option key={dep.id_departement} value={dep.id_departement}>
                    {dep.nom_departement}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Reset */}
            <div className="filtre__item">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                className="filtre__reset"
              >
                Réinitialiser
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FiltreDashboard;