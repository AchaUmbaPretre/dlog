import React, { useState } from 'react'
import './consomInfoGen.scss';
import { Divider, Skeleton, Collapse, Checkbox, } from 'antd';

const ConsomInfoGen = () => {
    const [data, setData] = useState([]);

  return (
    <>
        <div className="consomInfoGen">
            <Divider>Information générales</Divider>
            <div className="consomInfoGen__container">

            </div>
        </div> 
    </>
  )
}

export default ConsomInfoGen