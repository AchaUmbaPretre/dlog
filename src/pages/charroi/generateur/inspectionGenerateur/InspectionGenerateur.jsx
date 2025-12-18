import React, { useMemo, useState } from 'react'
import {
  ThunderboltOutlined,
  DownOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import { Input, Button, Checkbox, Empty, Menu, Tooltip, Typography, message, Skeleton, Tag, Table, Space, Dropdown, Modal, notification } from 'antd';
import { useInspectionGeneratColumns } from './hook/useInspectionGeneratColumns';
import { useInspectionGeneratData } from './hook/useInspectionGeneratData';


const { Text } = Typography;
const { Search } = Input;

const InspectionGenerateur = () => {
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const [columnsVisibility, setColumnsVisibility] = useState({
        '#': true,
        'Code' : true,
        'Marque': true,
        'Date inspection': true,
        'Date réparation' : false,
        'type_rep': true,
        "Cat inspection" : true,
        "Avis d expert": false,
        "Montant": true,
        'Statut vehicule': true,
        'Date validation':true,
        'Statut': true,
        'Type rep': true,
        'Budget_valide' : true,
    });
    const scroll = { x: 'max-content' };
    const [modal, setModal] = useState({ type: null, id: null });
    const { data, loading, reload, filters, setFilters } = useInspectionGeneratData(null)

    const openModal = (type, id = null) => setModal({ type, id });
    const closeAllModals = () => setModal({ type: null, id: null });


    const handleAddInspection = () => {

    };

    const handleDelete = () => {

    };

    // Columns hook
    const columns = useInspectionGeneratColumns({
        pagination,
        columnsVisibility,
        onEdit: (id) => openModal("Add", id),
        onDetail: (id) => openModal("Detail", id),
        onDelete: handleDelete,
    });

    const columnMenu = (
        <div style={{ padding: 10, background: "#fff" }}>
          {Object.keys(columnsVisibility).map((colName) => (
            <div key={colName}>
              <Checkbox
                checked={columnsVisibility[colName]}
                onChange={() =>
                  setColumnsVisibility((prev) => ({ ...prev, [colName]: !prev[colName] }))
                }
              >
                {colName}
              </Checkbox>
            </div>
          ))}
        </div>
      );

  const filteredData = useMemo(() => {
    const search = (searchValue || "").toLowerCase().trim();
    if (!search) return data;
    return data.filter(
      (item) =>
        item.nom_modele?.toLowerCase().includes(search) ||
        item.nom?.toLowerCase().includes(search) ||
        item.nom_marque?.toLowerCase().includes(search) ||
        item?.toLowerCase().includes(search)
    );
  }, [data, searchValue]);

    

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-rows">
                    <div className="client-row">
                        <div className="client-row-icon">
                            <FileSearchOutlined className='client-icon'/>
                        </div>
                        <h2 className="client-h2">Inspection générateur</h2>
                    </div>
                </div>
                <div className="client-actions">
                    <div className="client-row-left">
                        <Search 
                          placeholder="Recherche..." 
                          onChange={(e) => setSearchValue(e.target.value)}
                          enterButton
                        />
                    </div>
                    <div className="client-rows-right">
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            onClick={handleAddInspection}
                        >
                            Ajouter
                        </Button>

                        <Dropdown overlay={columnMenu} trigger={["click"]}>
                            <Button icon={<MenuOutlined />}>
                                Colonnes <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id_sub_inspection_generateur"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `${total} enregistrements`,
                    }}
                    scroll={scroll}
                    size="small"
                    onChange={(pagination)=> setPagination(pagination)}
                    bordered
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    locale={{
                        emptyText: <Empty description="Aucune donnée disponible" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
                    }}
                />
            </div>
        </div>
    </>
  )
}

export default InspectionGenerateur