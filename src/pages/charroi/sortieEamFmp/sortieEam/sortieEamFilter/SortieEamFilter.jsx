import React, { useEffect, useMemo, useState } from 'react'
import { Select, DatePicker, Skeleton, notification } from "antd";
import { getSortieEam } from '../../../../../services/sortieEamFmp';
const { RangePicker } = DatePicker;


const SortieEamFilter = ({ onFilter }) => {
      const [dateRange, setDateRange] = useState(null);
      const [loading, setLoading] = useState(false);
      const [selectedSmr, setSelectedSmr] = useState([]);
      const [selectedPart, setSelectedPart] = useState([]);
      const [smr, setSmr] = useState([]);

      useEffect(()=> {
        const fetchData = async() => {
            try {
                const res = await getSortieEam();
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
    const uniqueSmr = [...new Set(smr.map(item => item.smr_ref))];

    return uniqueSmr.map(smr_ref => ({
        value: smr_ref,
        label: smr_ref
    }));
    }, [smr]);

    const partOptions = useMemo(() => {
    return [...new Set(smr.map(item => item.part))]
        .sort((a, b) => a.localeCompare(b))
        .map(part => ({
        value: part,
        label: part
        }));
    }, [smr]);

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