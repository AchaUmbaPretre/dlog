import React, { useState } from 'react'
import { ToolOutlined, MenuOutlined, DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Input, Button, Checkbox,  Dropdown, Table, Modal } from 'antd';
import ReparationGeneratForm from './reparationGeneratForm/ReparationGeneratForm';
import { useReparationData } from './hook/useReparationGenData';
import { useReparateurGenColumns } from './hook/useReparateurGenColumns';
import ReparationGeneratDetail from './reparationGeneratDetail/ReparationGeneratDetail';

const { Search } = Input;

const ReparationGenerat = () => {
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    }); 
    const scroll = { x: 'max-content' };
    const [columnsVisibility, setColumnsVisibility] = useState({
        "#": true,
        'N° série' : false,
        'Modèle' : true,
        'Marque': true,
        "Type rep.": true,
        "Date Entrée": true,
        "Date Sortie": false,
        "Date rep": false,
        "Coût" : false,
        "Montant" : true,
        "Fournisseur": true,
        "Créé par" : false
    }); 
    const { data, setData, loading, reload, filters, setFilters} = useReparationData(null)
    const [modal, setModal] = useState({ type: null, id: null });
    const openModal = (type, id = null) => setModal({ type, id });

    const closeAllModals = () => setModal({ type: null, id: null });
    
    const handleDelete = () => {

    }

    const columns = useReparateurGenColumns({
        pagination,
        columnsVisibility,
        onEdit: (id) => openModal('Add', id),
        onDetail: (id) => openModal('Detail', id),
        onDelete: handleDelete
    })

    const columnMenu = (
        <div style={{ padding: 10, background:'#fff' }}>
            {Object.keys(columnsVisibility).map((colName) => (
                    <div key={colName}>
                    <Checkbox
                        checked={columnsVisibility[colName]}
                        onChange={() =>
                        setColumnsVisibility((prev) => ({
                            ...prev,
                            [colName]: !prev[colName],
                        }))
                        }
                    >
                        {colName}
                    </Checkbox>
                    </div>
            ))}
        </div>
    );

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <ToolOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Liste des réparations</h2>
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
                            onClick={() => openModal('Add')}
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
                    dataSource={data}
                    loading={loading}
                    scroll={scroll}
                    size="small"
                    onChange={(pagination)=> setPagination(pagination)}
                    bordered
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                />

            </div>
        </div>
        <Modal
            open={modal.type === "Add"}
            onCancel={closeAllModals}
            footer={null}
            width={1000}
            centered
            destroyOnClose
        >
            <ReparationGeneratForm id_plein={modal.id} closeModal={closeAllModals} onSaved={reload} />
        </Modal>

        <Modal
            open={modal.type === "Detail"}
            onCancel={closeAllModals}
            footer={null}
            width={1000}
            centered
            destroyOnClose
        >
            <ReparationGeneratDetail idRepgen={modal.id} closeModal={closeAllModals} />
        </Modal>
    </>
  )
}

export default ReparationGenerat