// src/components/presence/utils/exportPresenceExcel.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Exporte les données de présence au format Excel
 * @param {Array} utilisateurs Liste des utilisateurs avec leurs présences
 * @param {Array} dates Liste des dates (ex: [{ date: '2026-02-01', label: '01/02' }, ...])
 * @param {String} monthLabel Label du mois (ex: "02-2026")
 */
export const exportPresenceToExcel = (utilisateurs, dates, monthLabel) => {
  if (!utilisateurs || utilisateurs.length === 0) return;

  // En-têtes
  const headers = ["Nom", "Prénom", ...dates.map(d => d.label), "Total"];

  // Lignes
  const rows = utilisateurs.map(u => {
    const presenceValues = dates.map(d => {
      const cell = u.presences?.[d.date] || {};
      return cell.statut || "-";
    });

    const joursTravailles = presenceValues.filter(v =>
      ["PRESENT", "ABSENT", "CONGE", "AUTORISATION_SORTIE"].includes(v)
    ).length;

    const joursPresents = presenceValues.filter(v => v === "PRESENT").length;

    const total = `${joursPresents}/${joursTravailles}`;

    return [u.nom, u.prenom, ...presenceValues, total];
  });

  // Création de la feuille Excel
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Présences");

  // Export
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, `Présences_${monthLabel}.xlsx`);
};
