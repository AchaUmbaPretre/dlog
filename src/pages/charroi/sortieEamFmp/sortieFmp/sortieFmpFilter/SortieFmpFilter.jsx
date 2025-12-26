import React, { useEffect, useMemo, useState } from 'react'
import { Select, DatePicker, Skeleton, notification } from "antd";
import { getSortieEam, getSortieFmp } from '../../../../../services/sortieEamFmp';
const { RangePicker } = DatePicker;


const SortieFmpFilter = ({ onFilter }) => {
      const [dateRange, setDateRange] = useState(null);
      const [loading, setLoading] = useState(false);
      const [selectedSmr, setSelectedSmr] = useState([]);
      const [selectedItems, setSelectedItems] = useState([]);
      const [smr, setSmr] = useState([]);

      useEffect(()=> {
        const fetchData = async() => {
            try {
                const res = await getSortieFmp();
                setSmr(res?.data)
            } catch (err) {
                notification.error({
                    message: "Erreur lors du chargement",
                    description: err?.response?.data?.message || "Impossible de charger les sorties EAM.",
                });
            } finally {
                setLoading(false)
            }
        }

        fetchData();
      }, []);
    
    const smrOptions = useMemo(() => {
    const uniqueSmr = [...new Set(smr.map(item => item.smr))];

    return uniqueSmr.map(smr => ({
        value: smr,
        label: smr
    }));
    }, [smr]);

    const ItemOptions = useMemo(() => {
    return [...new Set(smr.map(item => item.item_code))]
        .sort((a, b) => a.localeCompare(b))
        .map(item_code => ({
        value: item_code,
        label: item_code
        }));
    }, [smr]);

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
                    options={ItemOptions}
                    placeholder="Sélectionnez..."
                    onChange={setSelectedItems}
                />
            </div>

        </div>
    </>
  )
}

export default SortieFmpFilter