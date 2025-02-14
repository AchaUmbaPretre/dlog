import React, { useEffect, useState } from 'react';
import { Modal, notification, Table, Tag, Tooltip } from 'antd';
import { getRapportVariation } from '../../../../services/templateService';
import moment from 'moment';
import RapportVariationVille from './rapportVariationVille/RapportVariationVille';
import RapportFiltrage from '../rapportFiltrage/RapportFiltrage';

const RapportVariation = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const scroll = { x: 400 };
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [filteredDatas, setFilteredDatas] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [mois, setMois] = useState('');
  const [annee, setAnnee] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

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
        ...generateMonthColumns(data),
      ];

      const generateDataSource = () => {
        const types = [
          { type: "Total Entrep & Manu", 
            dataIndex: "total_entreManu",
          },
/*           { type: "TTC Entrep & Manu", dataIndex: "ttc_entreManu" },
 */       { type: "Total M2 occupé", dataIndex: "total_occupe" },
          { type: "Total M2 facturé", dataIndex: "total_facture" },
        ];

        return types.map((type, index) => ({
          key: index,
          type: type.type,
          ...data.reduce((acc, item) => {
            const month = `${item.Mois}-${item.Année}`;
            acc[month] = item[type.dataIndex];
            return acc;
          }, {}),
        }));
      };

      const generateMonthColumns = (data) => {
        return data.map((item) => {
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
      notification.error({
        message: 'Erreur',
        description: `${error.response.data.message}`,
      });
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
    <div className="rapport-facture">
      <div className="rapport_wrapper_facture">
      {filterVisible && <RapportFiltrage onFilter={handleFilterChange} filtraVille={true} filtraClient={true} filtraStatus={false} filtreBatiment={false} filtreTemplate={false} filtreMontant={false} />}
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
  );
};

export default RapportVariation;
