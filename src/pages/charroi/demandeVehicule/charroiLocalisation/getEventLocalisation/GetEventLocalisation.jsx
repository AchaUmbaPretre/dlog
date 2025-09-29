import './getEventLocalisation.scss'
import { useEffect, useState } from 'react';
import { Select, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const GetEventLocalisation = () => {
    const [dateRange, setDateRange] = useState([]);
    
  return (
    <>
        <div className="event_container">
            <div className="event_wrapper">
                <div className="event_top">
                <RangePicker
                    style={{ width: '100%' }}
                    value={dateRange}
                    onChange={setDateRange}
                    allowClear
                    format="DD/MM/YYYY"
                    placeholder={['Date début', 'Date fin']}
                />
                </div>
                <div className="event_bottom">

                </div>
            </div>
        </div>
    </>
  )
}

export default GetEventLocalisation