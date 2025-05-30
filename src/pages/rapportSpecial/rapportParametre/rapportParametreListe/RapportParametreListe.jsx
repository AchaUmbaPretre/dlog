import React, { useEffect, useState } from 'react';
import { Table, message, notification } from 'antd';
import { getParametreOne } from '../../../../services/rapportService';

const RapportParametreListe = ({idContrat}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const scroll = { x: 400 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getParametreOne(idContrat);
  
        setData(data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };
  
    fetchData();
  }, [idContrat]);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
    },
    {
      title: 'Titre',
      dataIndex: 'nom_parametre',
      key: 'nom_parametre',
      render: (text) => (
        <div>{text}</div>
      ),
    }
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
{/*               <TeamOutlined className='client-icon' />
 */}            </div>
            <h2 className="client-h2">Parametre</h2>
          </div>
          <div className="client-actions">
            <div className="client-rows-right">
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            bordered
            size="small"
            scroll={scroll}
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          />
        </div>
      </div>
    </>
  );
};

export default RapportParametreListe;
