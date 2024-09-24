import { Tabs } from 'antd'
import React from 'react'

const TableauBord = () => {
  return (
    <div>
    <Tabs defaultActiveKey="0">
        <Tabs.TabPane tab='Tableau de bord' key="0">

        </Tabs.TabPane>
        <Tabs.TabPane tab="les rapports d'entretien" key="1">
            
        </Tabs.TabPane>
    </Tabs>

    </div>
  )
}

export default TableauBord