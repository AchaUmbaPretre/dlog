import React, { useState } from 'react'
import { Select, DatePicker, Skeleton, notification } from "antd";
const { RangePicker } = DatePicker;


const SortieEamFilter = () => {
      const [dateRange, setDateRange] = useState(null);
      const [loading, setLoading] = useState(false);
    
  return (
    <>
        <div className="filterTache" style={{marginBottom:'20px'}}>
            <div className="filter_row">
                <label>Date :</label>
                <RangePicker
                    style={{ width: "100%" }}
                    onChange={setDateRange}
                />
            </div>

            <div className="filter_row">
                <label>SMR :</label>
                <RangePicker
                    style={{ width: "100%" }}
                    onChange={setDateRange}
                />
            </div>

        </div>
    </>
  )
}

export default SortieEamFilter