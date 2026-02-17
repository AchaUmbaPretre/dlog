import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Exporte les données de présence au format Excel
 * @param {Array} data Utilisateurs avec leurs présences
 * @param {Array} dates Liste des dates (labels)
 * @param {String} monthLabel Label du mois (ex: "Janvier 2026")
 */
export const exportPresenceToExcel = (data, dates, monthLabel) => {
  if (!data || data.length === 0) return;

  // Construction des en-têtes
  const headers = ["Nom", "Prénom", ...dates.map(d => d.label), "Total"];

  // Construction des lignes
  const rows = data.map(u => {
    const presenceValues = dates.map(d => {
      const cell = u.presences?.[d.date] || {};
      return cell.statut || "-";
    });

    // Total présent
    const joursTravailles = presenceValues.filter(v => ["PRESENT", "ABSENT", "CONGE", "AUTORISATION_SORTIE"].includes(v)).length;
    const joursPresents = presenceValues.filter(v => v === "PRESENT").length;
    const total = `${joursPresents}/${joursTravailles}`;

    return [u.nom, u.prenom, ...presenceValues, total];
  });

  // Création de la feuille de calcul
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Création du classeur
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Présences");

  // Export
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, `Présences_${monthLabel}.xlsx`);
};
