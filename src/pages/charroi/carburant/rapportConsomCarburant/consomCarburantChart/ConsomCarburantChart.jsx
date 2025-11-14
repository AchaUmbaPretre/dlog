import React from 'react'
import { Divider, Card, Table, Tag, Tooltip } from 'antd';
import './consomCarburantChart.scss';

const ConsomCarburantChart = () => {

  return (
    <>
        <div className="consomCarburantChart">
            <Divider>Consommation mensuelle</Divider>
            <div className="consomCarburant_chart_wrapper">
                <div className="consom_line">

                </div>
                <div className="consom_bar">
                    
                </div>
            </div>
        </div>
    </>
  )
}

export default ConsomCarburantChart