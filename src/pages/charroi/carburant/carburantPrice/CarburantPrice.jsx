import React, { useEffect, useState } from 'react'
import { Table, Button, Modal } from 'antd';
import CarburantPriceForm from './carburantPriceForm/CarburantPriceForm';
import { PlusCircleOutlined } from '@ant-design/icons';
import { getCarburantPrice } from '../../../../services/carburantService';

const CarburantPrice = () => {
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 20,
    });
    const [data, setData] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [loading, setLoading] = useState(true);
    const scroll = { x: 400 };

      const fetchData = async() => {
        try {
          const { data } = await getCarburantPrice();
          setData(data) 
        } catch (error) {
          console.log(error)
        }
      }

      useEffect(() => {
        fetchData()
      }, [])

    const handleAdd = (id) => {
      openModal('Add', id)
    }

    const closeAllModals = () => {
      setModalType(null);
    };
  
    const openModal = (type) => {
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
        title: 'CDF', 
        dataIndex: 'prix_cdf', 
        key: 'prix_cdf'
      },
      { 
        title: 'USD', 
        dataIndex: 'taux_usd', 
        key: 'taux_usd'
      },
      {
        title: 'Date effective', 
        dataIndex: 'date_effective', 
        key: 'date_effective'
      }
    ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              📝
            </div>
            <h2 className="client-h2">Liste des prix</h2>
          </div>
          <div className="client-actions">
          <div className="client-row-left">
          </div>
          <div className="client-rows-right">
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={handleAdd}
            >
              Ajouter
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={pagination}
          rowKey="id_prix_carburant "
          bordered
          size="small"
          scroll={scroll}
          loading={loading}
        />
        </div>
      </div>

      <Modal
        title=""
        visible={modalType === 'Add'}
        onCancel={closeAllModals}
        footer={null}
        width={1000}
        centered
      >
        <CarburantPriceForm fetchData={fetchData} />
      </Modal>
    </>
  )
}

export default CarburantPrice