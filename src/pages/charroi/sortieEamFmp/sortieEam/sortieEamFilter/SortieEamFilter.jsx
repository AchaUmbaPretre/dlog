import React, { useEffect, useMemo, useState } from 'react'
import { Select, DatePicker, Skeleton, notification } from "antd";
import { getSortieEam } from '../../../../../services/sortieEamFmp';
import { useSortieEamData } from '../hook/useSortieEamData';
const { RangePicker } = DatePicker;


const SortieEamFilter = ({ onFilter }) => {
      const [dateRange, setDateRange] = useState(null);
      const [selectedSmr, setSelectedSmr] = useState([]);
      const [selectedPart, setSelectedPart] = useState([]);
    const { data, loading, reload} = useSortieEamData(null);
    
    const smrOptions = useMemo(() => {
    const uniqueSmr = [...new Set(data.map(item => item.smr_ref))];

    return uniqueSmr.map(smr_ref => ({
        value: smr_ref,
        label: smr_ref
    }));
    }, [data]);

    const partOptions = useMemo(() => {
    return [...new Set(data.map(item => item.part))]
        .sort((a, b) => a.localeCompare(b))
        .map(part => ({
        value: part,
        label: part
        }));
    }, [data]);

    useEffect(() => {
        onFilter({
        smr: selectedSmr,
        part: selectedPart,
        dateRange,
        });
    }, [selectedSmr, selectedPart, dateRange]);

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
                <label>PART :</label>
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    options={partOptions}
                    placeholder="Sélectionnez..."
                    onChange={setSelectedPart}
                />
            </div>

        </div>
    </>
  )
}

export default SortieEamFilter