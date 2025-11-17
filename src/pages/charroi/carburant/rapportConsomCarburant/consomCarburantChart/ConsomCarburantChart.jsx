import React from 'react'
import { Divider, Card, Table, Tag, Tooltip } from 'antd';
import './consomCarburantChart.scss';
import ConsomCarburantLine from './consomCarburantLine/ConsomCarburantLine';
import ConsomCarburantBar from './consomCarburantBar/ConsomCarburantBar';

const ConsomCarburantChart = ({consomMonth, consomYear}) => {

  return (
    <>
        <div className="consomCarburantChart">
            <Card type="inner" title="Chart de consommation">
                <div className="consomCarburant_chart_wrapper">
                    <div className="consom_chart_left">
                        <ConsomCarburantBar consomMonth={consomMonth} />
                    </div>
                    <div className="consom_chart">
                        <ConsomCarburantLine consomYear={consomYear} />
                    </div>
                </div>
            </Card>
        </div>
    </>
  )
}

export default ConsomCarburantChart