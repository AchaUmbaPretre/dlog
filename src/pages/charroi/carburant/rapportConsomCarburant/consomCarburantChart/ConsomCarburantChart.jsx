import React from 'react'
import { Divider, Card, Table, Tag, Tooltip } from 'antd';
import './consomCarburantChart.scss';
import ConsomCarburantLine from './consomCarburantLine/ConsomCarburantLine';
import ConsomCarburantBar from './consomCarburantBar/ConsomCarburantBar';

const ConsomCarburantChart = ({consomMonth, consomYear}) => {

  return (
    <>
        <div className="consomCarburantChart">
            <Divider>Consommation mensuelle</Divider>
            <div className="consomCarburant_chart_wrapper">
                <div className="consom_chart">
                    <ConsomCarburantLine consomYear={consomYear} />
                </div>
                <div className="consom_chart">
                    <ConsomCarburantBar consomMonth={consomMonth} />
                </div>
            </div>
        </div>
    </>
  )
}

export default ConsomCarburantChart