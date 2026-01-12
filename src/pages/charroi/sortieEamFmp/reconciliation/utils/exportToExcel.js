import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = ({
  data,
  columns,
  fileName = "export.xlsx",
  sheetName = "Données",
}) => {
  // Colonnes visibles uniquement
  const exportableColumns = columns.filter(
    (c) => c.dataIndex && c.key && c.title
  );

  // Mapping des données
  const formattedData = data.map((row) => {
    const obj = {};
    exportableColumns.forEach((col) => {
      obj[
        typeof col.title === "string"
          ? col.title
          : col.key
      ] = row[col.dataIndex];
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, fileName);
};
