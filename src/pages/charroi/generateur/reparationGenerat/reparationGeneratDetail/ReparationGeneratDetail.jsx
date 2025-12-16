import React, { useEffect, useState } from 'react'
import { getRepGenerateurOne } from '../../../../../services/generateurService';
import { Card, notification, Tag, Skeleton, Table } from 'antd';
import moment from 'moment';


const ReparationGeneratDetail = ({idRepgen}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
  });
  const scroll = { x: 'max-content' };


  useEffect(() => {
    setLoading(true)
    const fetchData = async() => {
      try {
        const res = await getRepGenerateurOne(idRepgen)
        setData(res?.data);

      } catch (error) {
        notification.error({
          message : "Erreur de changement",
          description : "Impossible de récupérer les données des réparations",
          placement: "topRight"
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [idRepgen]);

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
            {   title: 'Date début', 
                dataIndex: 'date_entree', 
                key: 'date_entree', 
                render: (text) => 
                <Tag color='purple'>{moment(text).format('LL')}</Tag> 
            },
            {   title: 'Date fin', 
                dataIndex: '"date_sortie', 
                key: '"date_sortie', 
                render: (text) => {
                    if (!text || !moment(text).isValid()) {
                        return <Tag color="default">Aucune date</Tag>;
                    }
                    return <Tag color='purple'>{moment(text).format('LL')}</Tag>;
                }
            },
            {   title: 'Fournisseur', 
                dataIndex: 'nom_fournisseur', 
                key: 'fournisseur', 
                render: (text) => <Tag color="blue">{text}</Tag> 
            }
    ]

  return (
    <>
      <div className="reparation_detail">
        <div className="reparation_detail_title">
          <h1 className="reparation_detail_h1">SUIVI D'INTERVENTION : </h1>
        </div>
        <Card>
          <div className="reparation_detail_wrapper">
            <Card type="inner" title="INFORMATIONS GENERALES"  className='reparation_detail_card'>
              <div className="reparation_detail_top">
                <Skeleton loading={loading} active paragraph={false}>
                  <Table
                    columns={columns}
                    dataSource={data}
                    onChange={(pagination) => setPagination(pagination)}
                    pagination={pagination}
                    rowKey="id"
                    bordered
                    size="small"
                    scroll={scroll}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                  />
                </Skeleton>
              </div>
            </Card>
            <Card type="inner" title="DETAIL DES REPARATIONS"  className='reparation_detail_card'>
              <div className="reparation_detail_top">
                <Skeleton loading={loading} active paragraph={false}>
                </Skeleton>
              </div>

            </Card>

          </div>

        </Card>

      </div>
    </>
  )
}

export default ReparationGeneratDetail