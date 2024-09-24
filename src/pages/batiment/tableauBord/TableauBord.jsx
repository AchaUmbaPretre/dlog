import { Tabs } from 'antd';
import { DashboardOutlined, FileTextOutlined } from '@ant-design/icons'; // Importer les icônes appropriées
import React from 'react';
import RapportEntretien from './rapportEntretien/RapportEntretien';
import DataTableau from './dataTableau/DataTableau';

const TableauBord = ({idBatiment}) => {
  return (
    <div>
      <Tabs defaultActiveKey="0">
        <Tabs.TabPane
          tab={
            <span>
              <DashboardOutlined />
              Tableau de bord
            </span>
          }
          key="0"
        >
          <DataTableau idBatiment={idBatiment}/>
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={
            <span>
              <FileTextOutlined />
              Les rapports d'entretien
            </span>
          }
          key="1"
        >
          <RapportEntretien idBatiment={idBatiment}/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default TableauBord;
