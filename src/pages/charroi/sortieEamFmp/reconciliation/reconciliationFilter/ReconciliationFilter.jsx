import React, { useEffect, useMemo, useState } from 'react'
import { Select, DatePicker } from "antd";
import { useReconciliationData } from '../hook/useReconciliationData';

const { RangePicker } = DatePicker;

const ReconciliationFilter = ({ onFilter }) => {
    const [dateRange, setDateRange] = useState(null);
    const { smrs, selectedSmr, setSelectedSmr, items, selectedItems, setSelectedItems } = useReconciliationData(null);

    const itemsOptions = useMemo(
        () => 
            items?.map((i) => ({
                value : i.item,
                label : i.item
            })),
        [items]
    );

    const smrOptions = useMemo(
        () => 
            smrs?.map((item) => ({
                value: item.smr,
                label: item.smr
            })),
        [smrs]
    );

    useEffect(() => {
        onFilter({
            smr: selectedSmr,
            item_code: selectedItems,
            dateRange
        });
    }, [selectedSmr, selectedItems, dateRange]);
    
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

            <div className="filter_row">
                <label>ITEM :</label>
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    options={itemsOptions}
                    placeholder="Sélectionnez..."
                    onChange={setSelectedItems}
                />
            </div>
        </div>
    </>
  )
}

export default ReconciliationFilter