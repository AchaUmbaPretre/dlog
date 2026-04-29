// services/export.service.js

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

export const ExportService = {
  // Export Excel
  toExcel: (vehicles, stats, filename = 'rapport-flotte') => {
    // Préparer les données
    const data = vehicles.map(v => ({
      'Véhicule': v.name,
      'Immatriculation': v.registration,
      'Chauffeur': v.driver,
      'Statut': v.status === 'moving' ? 'En marche' : v.status === 'stopped' ? 'Arrêté' : 'Stationné',
      'Vitesse (km/h)': v.speed,
      'Distance totale (km)': v.totalDistance.toFixed(1),
      'Efficacité (%)': v.efficiency,
      'Dernière MAJ': v.lastUpdate,
      'Destination': v.destination || '-',
      'Service': v.service || '-'
    }));
    
    // Ajouter la ligne de statistiques
    data.unshift({
      'Véhicule': '📊 STATISTIQUES',
      'Immatriculation': '',
      'Chauffeur': `Total véhicules: ${stats.total}`,
      'Statut': `En marche: ${stats.moving} | Arrêtés: ${stats.stopped}`,
      'Vitesse (km/h)': '',
      'Distance totale (km)': stats.totalDistance,
      'Efficacité (%)': stats.avgEfficiency,
      'Dernière MAJ': new Date().toLocaleString(),
      'Destination': '',
      'Service': ''
    });
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rapport Flotte');
    
    // Ajuster les colonnes
    ws['!cols'] = [
      { wch: 25 }, // Véhicule
      { wch: 15 }, // Immatriculation
      { wch: 20 }, // Chauffeur
      { wch: 15 }, // Statut
      { wch: 12 }, // Vitesse
      { wch: 15 }, // Distance
      { wch: 12 }, // Efficacité
      { wch: 20 }, // Dernière MAJ
      { wch: 30 }, // Destination
      { wch: 20 }  // Service
    ];
    
    XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
  },
  
  // Export PDF
  toPDF: (vehicles, stats, filename = 'rapport-flotte') => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    
    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 297, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Rapport de Monitoring Flotte', 20, 20);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleString()}`, 20, 40);
    
    // Statistiques
    doc.setFontSize(12);
    doc.text('📊 Synthèse', 20, 55);
    doc.setFontSize(10);
    doc.text(`Total véhicules: ${stats.total}`, 20, 65);
    doc.text(`En marche: ${stats.moving}`, 20, 72);
    doc.text(`Arrêtés: ${stats.stopped}`, 20, 79);
    doc.text(`Distance totale: ${stats.totalDistance} km`, 20, 86);
    doc.text(`Efficacité moyenne: ${stats.avgEfficiency}%`, 20, 93);
    
    // Tableau des véhicules
    const tableData = vehicles.map(v => [
      v.name,
      v.registration,
      v.driver,
      v.status === 'moving' ? '🟢 En marche' : v.status === 'stopped' ? '🟡 Arrêté' : '🔵 Stationné',
      `${v.speed} km/h`,
      `${v.totalDistance.toFixed(1)} km`,
      `${v.efficiency}%`,
      v.lastUpdate?.split(' ')[0] || '-'
    ]);
    
    doc.autoTable({
      startY: 100,
      head: [['Véhicule', 'Immatriculation', 'Chauffeur', 'Statut', 'Vitesse', 'Distance', 'Efficacité', 'Dernière MAJ']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 20, right: 20 }
    });
    
    doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
  },
  
  // Export JSON
  toJSON: (vehicles, stats) => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: stats,
      vehicles: vehicles.map(v => ({
        id: v.id,
        name: v.name,
        registration: v.registration,
        driver: v.driver,
        status: v.status,
        speed: v.speed,
        totalDistance: v.totalDistance,
        efficiency: v.efficiency,
        lastUpdate: v.lastUpdate,
        destination: v.destination,
        service: v.service,
        position: { lat: v.lat, lng: v.lng }
      })),
      alerts: vehicles.filter(v => v.isSignalLost || v.isEngineCut || (v.batteryLevel && v.batteryLevel <= 20))
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    saveAs(blob, `rapport-flotte-${new Date().toISOString().split('T')[0]}.json`);
  }
};