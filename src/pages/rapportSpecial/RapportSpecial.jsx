import React, { useState } from 'react'
import { Modal, Button, Input, Table } from 'antd';
import { AuditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import RapportSpecialForm from './rapportSpecialForm/RapportSpecialForm';

const { Search } = Input;

const RapportSpecial = () => {
    const [searchValue, setSearchValue] = useState('');
    const [modalType, setModalType] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 25,
      });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const scroll = { x: 'max-content' };

    const handleAddRapport = (id) => {
        openModal('Add', id);
    }

    const closeAllModals = () => {
        setModalType(null);
      };
      
    const openModal = (type, idDeclaration = '') => {
        closeAllModals();
        setModalType(type);
      };

      const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => {
              const pageSize = pagination.pageSize || 10;
              const pageIndex = pagination.current || 1;
              return (pageIndex - 1) * pageSize + index + 1;
            },
            width: "4%"      
          },
          {
            title: 'ENTREPOSAGE GLOBAL',
            children : [
                {
                    title: 'Superficie',
                    dataIndex: 'superficie',
                    key: 'superficie',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                },
                {
                    title: 'Entreposage',
                    dataIndex: 'entreposage',
                    key: 'entreposage',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                }
            ]
          },
          {
            title: 'TRANSPORT NRJ',
            children : [
                {
                    title: 'TRANSP NRJ',
                    dataIndex: 'transp_nrj',
                    key: 'transp_nrj',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: 'TEU',
                    dataIndex: 'teu',
                    key: 'teu',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "20' LOURDS",
                    dataIndex: 'lourds',
                    key: 'lourds',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Tonnage",
                    dataIndex: 'tonnage',
                    key: 'tonnage',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Peage Camion",
                    dataIndex: 'peage_camion',
                    key: 'peage_camion',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "TEU retour",
                    dataIndex: 'teu_retour',
                    key: 'teu_retour',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
            ]
          },
          {
            title: 'MANUTENTION',
            children: [
                {

                    title: "MANUT",
                    dataIndex: 'manut',
                    key: 'manut',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "MANUT1",
                    dataIndex: 'manut1',
                    key: 'manut1',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>  
                    )
                  },
                  {
                    title: "Camions Manut",
                    dataIndex: 'camions_manut',
                    key: 'camions_manut',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Sacs manut IN",
                    dataIndex: 'sacs_manut_IN',
                    key: 'sacs_manut_IN',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Sacs manut OUT",
                    dataIndex: 'sacs_manut_OUT',
                    key: 'sacs_manut_OUT',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "MANUT2",
                    dataIndex: 'manut2',
                    key: 'manut2',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Bout. /Intrants (T)",
                    dataIndex: 'intrants_t',
                    key: 'intrants_t',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "CAMION charge/décharge",
                    dataIndex: 'charge_decharge',
                    key: 'charge_decharge',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Sacs ( Tonne)",
                    dataIndex: 'sacs_tonne',
                    key: 'sacs_tonne',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Palettes (mise en bac)",
                    dataIndex: 'palette_mise',
                    key: 'palette_mise',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "MANUT3",
                    dataIndex: 'manut3',
                    key: 'manut3',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Bout. (T)",
                    dataIndex: 'bout',
                    key: 'bout',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Palettes",
                    dataIndex: 'palettes',
                    key: 'palettes',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
            ]
          },
          {
            title: 'LIVRAISON',
            children : [
                {
                    title: "LIV LOCALE",
                    dataIndex: 'liv_locale',
                    key: '',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                },
                {
                    title: "Camions livrés",
                    dataIndex: 'camions_livres',
                    key: '',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
                  {
                    title: "Camions livrés",
                    dataIndex: 'camions_livres',
                    key: '',
                    render: (text, record) => (
                      <div>
                        {text}
                      </div>
                    )
                  },
            ]
          }
      ]
    
  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-rows">
                    <div className="client-row">
                        <div className="client-row-icon">
                            <AuditOutlined className='client-icon' />
                        </div>
                        <div className="client-h2">
                            Rapport spécial
                        </div>
                    </div>
                    <div className="client-row-lefts">

                    </div>
                </div>
                <div className="client-actions">
                    <div className="client-row-left">
                        <Search 
                        placeholder="Recherche..." 
                        enterButton
                        onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>

                    <div className="client-rows-right">
                        <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={handleAddRapport}
                        >
                            Ajouter un rapport
                        </Button>
                    </div>
                </div>

                <Table
                  columns={ columns }
                  dataSource={data}
                  loading={loading}
                  rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                  rowKey="id"
                  bordered
                  size="small"
                  scroll={scroll}
                />
            </div>
            <Modal
              title=""
              visible={modalType === 'Add'}
              onCancel={closeAllModals}
              footer={null}
              width={950}
              centered
          >
            <RapportSpecialForm  />
          </Modal>
        </div>
    </>
  )
}

export default RapportSpecial