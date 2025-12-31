import React, { useEffect, useMemo, useState } from 'react'
import { Select, DatePicker } from "antd";
import { useSortieFmpData } from '../hook/useSortieFmpData';
import { renderField } from '../../../../../utils/renderFieldSkeleton';
const { RangePicker } = DatePicker;


const SortieFmpFilter = ({ onFilter }) => {
    const [dateRange, setDateRange] = useState(null);
    const [selectedSmr, setSelectedSmr] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const { data, loading } = useSortieFmpData(null);

    
    const smrOptions = useMemo(() => {
    const uniqueSmr = [...new Set(data.map(item => item.smr))];

    return uniqueSmr.map(smr => ({
        value: smr,
        label: smr
    }));
    }, [data]);

    const ItemOptions = useMemo(() => {
        return [...new Set(data.map(item => item.item_code))]
            .filter(item_code => item_code != null) // <-- filtre null et undefined
            .sort((a, b) => a.localeCompare(b))
            .map(item_code => ({
            value: item_code,
            label: item_code
            }));
    }, [data]);


    useEffect(() => {
        onFilter({
        smr: selectedSmr,
        item_code : selectedItems,
        dateRange,
        });
    }, [selectedSmr, selectedItems, dateRange]);

  return (
    <>
        <div className="filterTache" style={{marginBottom:'20px'}}>
            <div className="filter_row">
                <label>Date :</label>
                {renderField(loading, (
                <RangePicker
                    style={{ width: "100%" }}
                    onChange={setDateRange}
                />
                ))}
            </div>

            <div className="filter_row">
                <label>SMR :</label>
                {renderField(loading, (
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    options={smrOptions}
                    placeholder="Sélectionnez..."
                    onChange={setSelectedSmr}
                />
                ))}
            </div>

            <div className="filter_row">
                <label>ITEM :</label>
                {renderField(loading, (
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    options={ItemOptions}
                    placeholder="Sélectionnez..."
                    onChange={setSelectedItems}
                />
                ))}
            </div>

        </div>
    </>
  )
}

export default SortieFmpFilter