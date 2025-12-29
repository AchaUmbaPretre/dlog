import React, { useMemo, useState } from 'react'
import { Select, DatePicker, Skeleton, notification } from "antd";
import { useReconciliationData } from '../hook/useReconciliationData';

const { RangePicker } = DatePicker;

const ReconciliationFilter = () => {
    const [dateRange, setDateRange] = useState(null);
    const { smrs, setSelectedSmr } = useReconciliationData(null);

    const smrOptions = useMemo(
        () => 
            smrs?.map((item) => ({
                value: item.smr,
                label: item.smr
            })),
        [smrs]
    );
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
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    options={smrOptions}
                    placeholder="Sélectionnez..."
                    onChange={setSelectedSmr}
                />
            </div>
        </div>
    </>
  )
}

export default ReconciliationFilter