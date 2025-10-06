import React, { useEffect, useState } from 'react'
import { getDevices } from '../../../../../services/eventService';
import { Table, Space, Typography, Tabs, Spin, Button, DatePicker, notification, Tag, Collapse } from 'antd';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';

const RapportDevice = () => {
    const [data, setData] = useState([]);

    useEffect(()=> {
        const fetchData = async()=> {
            try {
                const { data } = await getDevices()
                setData(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, []);

  return (
    <>
        <div className="rapport_device">
            <div className="rapport_device_wrapper">
                <RangePicker
                value={dateRange}
                onChange={dates => dates && setDateRange(dates)}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
              />
            </div>
        </div>
    </>
  )
}

export default RapportDevice