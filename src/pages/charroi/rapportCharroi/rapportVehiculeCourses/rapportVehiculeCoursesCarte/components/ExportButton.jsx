import React, { useState } from 'react';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { Dropdown, Menu, message, Tooltip } from 'antd';
import { ExportService } from '../services/export.service';

export const ExportButton = ({ vehicles, stats }) => {
  const [loading, setLoading] = useState(false);
  
  const handleExport = async (type) => {
    setLoading(true);
    try {
      switch(type) {
        case 'excel':
          ExportService.toExcel(vehicles, stats);
          message.success('Rapport Excel exporté avec succès');
          break;
        case 'pdf':
          ExportService.toPDF(vehicles, stats);
          message.success('Rapport PDF exporté avec succès');
          break;
        case 'json':
          ExportService.toJSON(vehicles, stats);
          message.success('Données JSON exportées avec succès');
          break;
        default:
          break;
      }
    } catch (error) {
      message.error('Erreur lors de l\'export');
    } finally {
      setLoading(false);
    }
  };
  
  const menu = (
    <Menu className="export-menu">
      <Menu.Item key="excel" onClick={() => handleExport('excel')} icon={<FileExcelOutlined style={{ color: '#10b981' }} />}>
        Exporter Excel (.xlsx)
      </Menu.Item>
      <Menu.Item key="pdf" onClick={() => handleExport('pdf')} icon={<FilePdfOutlined style={{ color: '#ef4444' }} />}>
        Exporter PDF (.pdf)
      </Menu.Item>
{/*       <Menu.Item key="json" onClick={() => handleExport('json')} icon={<CodeOutlined style={{ color: '#f59e0b' }} />}>
        Exporter JSON (.json)
      </Menu.Item> */}
    </Menu>
  );
  
  return (
    <Dropdown overlay={menu} placement="bottomRight" trigger={['click']} disabled={loading}>
      <Tooltip title="Exporter le rapport">
        <button className="action-btn">
          <DownloadOutlined spin={loading} />
        </button>
      </Tooltip>
    </Dropdown>
  );
};