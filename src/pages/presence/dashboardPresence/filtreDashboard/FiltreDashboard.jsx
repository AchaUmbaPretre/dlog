import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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

const FiltreDashboard = ({ onFilterChange, reload }) => {
  const { data, sites, departments, loading, period, setPeriod } = useFiltreDashData();

  const [filters, setFilters] = useState({
    userIds: [],
    siteIds: [],
    departementIds: [],
  });

  // Utiliser une ref pour stocker les filtres précédents
  const previousFiltersRef = useRef(filters);
  const previousPeriodRef = useRef(period);

  // Fonction pour comparer les filtres
  const haveFiltersChanged = useCallback((oldFilters, newFilters, oldPeriod, newPeriod) => {
    if (oldPeriod !== newPeriod) return true;
    
    return (
      JSON.stringify(oldFilters.userIds) !== JSON.stringify(newFilters.userIds) ||
      JSON.stringify(oldFilters.siteIds) !== JSON.stringify(newFilters.siteIds) ||
      JSON.stringify(oldFilters.departementIds) !== JSON.stringify(newFilters.departementIds)
    );
  }, []);

  // Notifier le parent SEULEMENT quand les filtres changent vraiment
  useEffect(() => {
    if (onFilterChange) {
      if (haveFiltersChanged(previousFiltersRef.current, filters, previousPeriodRef.current, period)) {
        previousFiltersRef.current = { ...filters };
        previousPeriodRef.current = period;
        
        onFilterChange({
          ...filters,
          period
        });
      }
    }
  }, [filters, period, onFilterChange, haveFiltersChanged]);

  // Optimiser les handlers avec useCallback
  const handleChange = useCallback((key, value) => {
    setFilters((prev) => {
      const newValue = value || [];
      // Ne pas mettre à jour si c'est identique
      if (JSON.stringify(prev[key]) === JSON.stringify(newValue)) {
        return prev;
      }
      return {
        ...prev,
        [key]: newValue,
      };
    });
  }, []);

  const handleSelectAll = useCallback((key, list, idField) => {
    const allIds = list.map((item) => item[idField]);
    setFilters((prev) => {
      // Ne pas mettre à jour si c'est identique
      if (JSON.stringify(prev[key]) === JSON.stringify(allIds)) {
        return prev;
      }
      return {
        ...prev,
        [key]: allIds,
      };
    });
  }, []);

  const handleReset = useCallback(() => {
    const emptyFilters = {
      userIds: [],
      siteIds: [],
      departementIds: [],
    };
    
    setFilters(emptyFilters);
    setPeriod("TODAY");
    
    if (reload) {
      reload(); // Recharge les données sans filtres
    }
  }, [reload, setPeriod]);

  // Mémoriser les options pour éviter les re-rendus inutiles
  const userOptions = useMemo(() => (
    <>
      <Option
        key="all_users"
        value="__all__"
        onClick={() => handleSelectAll("userIds", data, "id_utilisateur")}
      >
        🔹 Tout sélectionner
      </Option>
      {data?.map((d) => (
        <Option key={d.id_utilisateur} value={d.id_utilisateur}>
          {d.nom}
        </Option>
      ))}
    </>
  ), [data, handleSelectAll]);

  const siteOptions = useMemo(() => (
    <>
      <Option
        key="all_sites"
        value="__all__"
        onClick={() => handleSelectAll("siteIds", sites, "id_site")}
      >
        🔹 Tout sélectionner
      </Option>
      {sites?.map((site) => (
        <Option key={site.id_site} value={site.id_site}>
          {site.nom_site}
        </Option>
      ))}
    </>
  ), [sites, handleSelectAll]);

  const departmentOptions = useMemo(() => (
    <>
      <Option
        key="all_departments"
        value="__all__"
        onClick={() => handleSelectAll("departementIds", departments, "id_departement")}
      >
        🔹 Tout sélectionner
      </Option>
      {departments?.map((dep) => (
        <Option key={dep.id_departement} value={dep.id_departement}>
          {dep.nom_departement}
        </Option>
      ))}
    </>
  ), [departments, handleSelectAll]);

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
                {userOptions}
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
                {siteOptions}
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
                {departmentOptions}
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