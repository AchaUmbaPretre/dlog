import React, { useEffect, useRef, useState } from 'react'
import { Button, notification, Popover, Skeleton, Space, Table, Tabs, Tag, Tooltip } from 'antd';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';

const RapportComplet = () => {
    const [filteredDatas, setFilteredDatas] = useState(null);
    const [filterVisible, setFilterVisible] = useState(false);

    const handleFilterChange = (newFilters) => {
        setFilteredDatas(newFilters); 
      };

  return (
    <>
        <div className="rapport_facture">
            <div className="rapport_row_excel">

            </div>
            { filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} filtraStatus={true} filtreMontant={true}/>}
            <div className="rapport_wrapper_facture">
aaaaaaaa
            </div>
        </div>
    </>
  )
}

export default RapportComplet