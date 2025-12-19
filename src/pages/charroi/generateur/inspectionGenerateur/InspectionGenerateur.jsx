import React, { useMemo, useState } from 'react'
import {
  DownOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import { Input, Button, Checkbox, Empty, Menu, Tooltip, Typography, message, Skeleton, Tag, Table, Space, Dropdown, Modal, notification } from 'antd';
import { useInspectionGeneratColumns } from './hook/useInspectionGeneratColumns';
import { useInspectionGeneratData } from './hook/useInspectionGeneratData';
import FormInspectionGenerateur from './formInspectionGenerateur/FormInspectionGenerateur';
import InspectionGeneDetail from './inspectionGeneDetail/InspectionGeneDetail';
import InspectionGenerateurValider from './inspectionGenerateurValider/InspectionGenerateurValider';

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
        'Modèle': true,
        'Marque': true,
        'Date': true,
        'Date rep.' : false,
        'Date validation.' : false,
        'Type de rep.': true,
        "Cat inspect." : true,
        "Avis d'expert": false,
        "Commentaire": false,
        "Budget": true,
        "#Validé": true,
        'Statut vehicule': true,
        'Statut': true,
        'Budget_valide' : true,
    });
    const scroll = { x: 'max-content' };
    const [modal, setModal] = useState({ type: null, id: null });
    const { data, loading, reload, filters, setFilters } = useInspectionGeneratData(null)

    const openModal = (type, id = null) => setModal({ type, id });
    const closeAllModals = () => setModal({ type: null, id: null });


    const handleDelete = () => {

    };

    // Columns hook
    const columns = useInspectionGeneratColumns({
        pagination,
        columnsVisibility,
        openModal,
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
                            onClick={()=> openModal('Add')}
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

        <Modal
          title=""
          visible={modal.type === 'Add'}
          onCancel={closeAllModals}
          footer={null}
          width={1000}
          centered
        >
          <FormInspectionGenerateur closeModal={closeAllModals} />
        </Modal>

        <Modal
          title=""
          visible={modal.type === 'detail'}
          onCancel={closeAllModals}
          footer={null}
          width={1000}
          centered
        >
            <InspectionGeneDetail closeModal={closeAllModals} />
        </Modal>

        <Modal
          title=""
          visible={modal.type === 'valider'}
          onCancel={closeAllModals}
          footer={null}
          width={1000}
          centered
        >
            <InspectionGenerateurValider closeModal={closeAllModals} />
        </Modal>

    </>
  )
}

export default InspectionGenerateur