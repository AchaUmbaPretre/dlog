import React, { useEffect, useState } from 'react';
import { Button, Modal, Table,Skeleton, Tag, Tooltip } from 'antd';
import { getRapportVariation } from '../../../../services/templateService';
import moment from 'moment';
import RapportVariationVille from './rapportVariationVille/RapportVariationVille';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';

const RapportVariation = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const scroll = { x: 'max-content' };
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [filteredDatas, setFilteredDatas] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [mois, setMois] = useState('');
  const [annee, setAnnee] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [detail, setDetail] = useState([]);

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, mois ='', annee ='') => {
    closeAllModals();
    setModalType(type);
    setMois(mois);
    setAnnee(annee)
  };

  const handlePeriode = (mois, annee) => {
    openModal('periode', mois, annee );
  };

  const fetchData = async () => {
    try {
      const { data } = await getRapportVariation(filteredDatas);

      setDetail(data?.resume)
      const generatedColumns = () => [
        {
          title: "#",
          dataIndex: "id",
          key: "id",
          render: (text, record, index) => index + 1,
          width: "4%",
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
          fixed: "left",
          render: (text) => <div>{text}</div>,
          align: "left",
        },
        ...generateMonthColumns({data:data.data}),
      ];

      const generateDataSource = () => {
        const types = [
          { type: "Entrep & Manu", 
            dataIndex: "total_entreManu",
          },
/*           { type: "TTC Entrep & Manu", dataIndex: "ttc_entreManu" },
 */       { type: "M² occupé", dataIndex: "total_occupe" },
          { type: "M² facturé", dataIndex: "total_facture" },
        ];

        return types.map((type, index) => ({
          key: index,
          type: type.type,
          ...data?.data.reduce((acc, item) => {
            const month = `${item.Mois}-${item.Année}`;
            acc[month] = item[type.dataIndex];
            return acc;
          }, {}),
        }));
      };

      const generateMonthColumns = (data) => {
        return data.data.map((item) => {
          const month = `${item.Mois}-${item.Année}`;
          const formattedMonth = moment(`${item.Année}-${item.Mois}-01`, "YYYY-MM-DD").format("MMM.YYYY");
          return {
            title: <div style={{ textAlign: 'center' }}><Tag color={"#2db7f5"}>{formattedMonth}</Tag></div>,
            dataIndex: month,
            key: month,
            render: (text) => (
                <Tooltip title={`Clique ici pour voir le détail de la variation de ${text}`}>
                  <div onClick={()=> handlePeriode(item.Mois, item.Année)}>
                    {text ? text.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}
                  </div>
                </Tooltip>
            ),
            align: "right",
          };
        });
      };

      setColumns(generatedColumns());
      setDataSource(generateDataSource());
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filteredDatas]);

  const handleFilterChange = newFilters => {
    setFilteredDatas(newFilters);
  };

  return (
    <>
        {
            loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
                <div
                style={{
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    width: 'fit-content',
                    margin: '20px 0',
                    padding: '15px',
                }}
                >
                    <span
                        style={{
                        display: 'block',
                        padding: '10px 15px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        borderBottom: '1px solid #f0f0f0',
                        }}
                    >
                        Résumé :
                    </span>
                <div
                    style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '15px',
                    padding: '15px',
                    }}
                >
                    
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    Entrep & Manu :{' '}
                    <strong>{Math.round(parseFloat(detail.total_entreManu))?.toLocaleString()} $</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    M² Facturé :{' '}
                    <strong>{detail.total_facture?.toLocaleString()}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>
                    M² Occupé :{' '}
                    <strong>{detail.total_occupe?.toLocaleString()}</strong>
                    </span>
                </div>
                </div>
            )
        }
      <div className="rapport-facture">
        <div className="rapport_row_excel">
          <Button
            type={filterVisible ? 'primary' : 'default'}
            onClick={() => setFilterVisible(!filterVisible)}
            style={{ margin: '10px 10px 10px 0' }}
          >
            {filterVisible ? '🚫 Cacher les filtres' : '👁️ Afficher les filtres'}
          </Button>
        </div>
        <div className="rapport_wrapper_facture">
        {filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} filtraStatus={true} filtreBatiment={false} filtreTemplate={false} filtreMontant={false} />}
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            scroll={scroll}
            loading={loading}
            size="small"
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
            rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
          />
        </div>
        <Modal
          title=""
          visible={modalType === 'periode'}
          onCancel={closeAllModals}
          footer={null}
          width={1120}
          centered
        >
          <RapportVariationVille annee={annee} mois={mois} />
        </Modal>
      </div>
    </>
  );
};

export default RapportVariation;
