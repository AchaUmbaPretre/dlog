import React, { useEffect, useRef, useState } from 'react'
import { ToolOutlined, ExclamationCircleOutlined, FileImageOutlined, EditOutlined, DeleteOutlined, CarOutlined, ExportOutlined, FileExcelOutlined, FileTextOutlined, FilePdfOutlined, ShopOutlined, MenuOutlined, DownOutlined, EyeOutlined, SyncOutlined, CloseCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, MoreOutlined, PlusCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { Input, Button, Typography, Tooltip, message, Dropdown, Menu, Space, notification, Table, Tag, Modal } from 'antd';
import moment from 'moment';
import ReparationGeneratForm from './reparationGeneratForm/ReparationGeneratForm';

const { Search } = Input;
const { Text } = Typography;

const ReparationGenerat = () => {
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    }); 
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };
    const [modal, setModal] = useState({ type: null, id: null });
    const openModal = (type, id = null) => setModal({ type, id });

    const closeAllModals = () => setModal({ type: null, id: null });
    const handleAddReparation = () => {

    }

    const columns = [
        {
            title:'#',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => {
              const pageSize = pagination.pageSize || 10;
              const pageIndex = pagination.current || 1;
              return (pageIndex - 1) * pageSize + index + 1;
            }
        },
        {
            title: 'Génération',
            dataIndex: 'generation',
            render: (text) => (
                <div>{text}</div>
            )
        },
        {
            title: 'Modele',
            dataIndex: 'nom_modele',
            render: (text) => (
                <div>{text}</div>
            )
        },
        {
            title: 'Marque',
            dataIndex: 'nom_marque',
            render: (text) => (
                <div>{text}</div>
            )
        },
        {
            title: 'Type rep.',
            dataIndex: 'type_rep',
            render: (text) => (
                <div>{text}</div>
            )
        },
        {
            title: 'Date Entrée',
            dataIndex: 'date_entree',
            render: (text) => {
                <div>{text}</div>
            }
        },
        {
            title: 'Date Sortie',
            dataIndex: 'date_sortie',
            render: (text) => {
                <div>{text}</div>
            }
        },
        {
            title: 'Date rep',
            dataIndex: 'date_reparation',
            render: (text) => {
                <div>{text}</div>
            }
        },
        {
            title: 'Budget',
            dataIndex: 'montant',
            render: (text) => {
                <div>{text}</div>
            }
        }
    ]

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
                            onClick={handleAddReparation}
                        >
                            Ajouter
                        </Button>
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
            width={1250}
            centered
            destroyOnClose
        >
            <ReparationGeneratForm id_plein={modal.id} closeModal={closeAllModals} />
        </Modal>
    </>
  )
}

export default ReparationGenerat