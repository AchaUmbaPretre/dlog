import React, { useState } from "react";
import { Select, Spin, Button } from "antd";
import {
  ReloadOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import "./filtreDashboard.scss";
import { useFiltreDashData } from "./hooks/useFiltreDashData";

const { Option } = Select;

const FiltreDashboard = () => {
  const { data, sites, departments, loading, period, setPeriod } = useFiltreDashData();

  const [filters, setFilters] = useState({
    userIds: [],
    siteIds: [],
    departementIds: [],
  });

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || [],
    }));
  };

  const handleSelectAll = (key, list, idField) => {
    const allIds = list.map((item) => item[idField]);
    setFilters((prev) => ({
      ...prev,
      [key]: allIds,
    }));
  };

  const handleReset = () => {
    setFilters({
      userIds: [],
      siteIds: [],
      departementIds: [],
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
              <label>
                <CalendarOutlined /> Période
              </label>
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
              <label>
                <UserOutlined /> Employé
              </label>
              <Select
                mode="multiple"
                value={filters.userIds}
                onChange={(v) => handleChange("userIds", v)}
                placeholder="Tous les utilisateurs"
                allowClear
                className="filtre__select"
              >
                <Option
                  key="all_users"
                  value="__all__"
                  onClick={() =>
                    handleSelectAll("userIds", data, "id_utilisateur")
                  }
                >
                  🔹 Tout sélectionner
                </Option>

                {data?.map((d) => (
                  <Option key={d.id_utilisateur} value={d.id_utilisateur}>
                    {d.nom}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Site */}
            <div className="filtre__item">
              <label>
                <EnvironmentOutlined /> Site
              </label>
              <Select
                mode="multiple"
                value={filters.siteIds}
                onChange={(v) => handleChange("siteIds", v)}
                placeholder="Tous les sites"
                allowClear
                className="filtre__select"
              >
                <Option
                  key="all_sites"
                  value="__all__"
                  onClick={() =>
                    handleSelectAll("siteIds", sites, "id_site")
                  }
                >
                  🔹 Tout sélectionner
                </Option>

                {sites?.map((site) => (
                  <Option key={site.id_site} value={site.id_site}>
                    {site.nom_site}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Département */}
            <div className="filtre__item">
              <label>
                <ApartmentOutlined /> Département
              </label>
              <Select
                mode="multiple"
                value={filters.departementIds}
                onChange={(v) => handleChange("departementIds", v)}
                placeholder="Tous les départements"
                allowClear
                className="filtre__select"
              >
                <Option
                  key="all_departments"
                  value="__all__"
                  onClick={() =>
                    handleSelectAll(
                      "departementIds",
                      departments,
                      "id_departement"
                    )
                  }
                >
                  🔹 Tout sélectionner
                </Option>

                {departments?.map((dep) => (
                  <Option
                    key={dep.id_departement}
                    value={dep.id_departement}
                  >
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