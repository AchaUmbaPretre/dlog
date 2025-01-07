import React, { useEffect, useState } from 'react';
import { Table, Tag, Empty, Select } from 'antd';
import { CalendarOutlined, FileTextOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getTemplate5derniers, getTemplateDeuxMoisPrecedent } from '../../../services/templateService';
import './templateOne.scss';
import { getProvince } from '../../../services/clientService';

const TemplateOne = ({ idClient, idTemplate, periode }) => {
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState([]);
  const [dernier, setDernier] = useState([]);
  const [nomClient, setNomClient] = useState('');
  const [province, setProvince] = useState([]);
  const [idProvince, setIdProvice] = useState('');
  const scroll = { x: 400 };

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const response = await getTemplateDeuxMoisPrecedent(idClient, idProvince);
      const resProvince = await getProvince();

      setProvince(resProvince?.data)

      if (response?.data) {
        setData(response.data);
        setNomClient(response.data[0]?.nom_client || 'Client non spécifié');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchData5derniers = async () => {
    setLoadingData(true);
    try {
      const response = await getTemplate5derniers(idClient, periode, idProvince);
      if (response?.data) {
        setDernier(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des 5 derniers:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchData5derniers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idClient, periode, idProvince, idTemplate]);

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', render: (_, __, index) => index + 1, width: "5%" },
    {
      title: 'Template',
      dataIndex: 'desc_template',
      key: 'desc_template',
      render: (text, record) => {
        const isTemplateMatch = idTemplate && record.id_template === idTemplate;
        return (
          <Tag icon={<FileTextOutlined />} color={isTemplateMatch ? "red" : "blue"}>
            {text ?? 'Aucun'}
          </Tag>
        );
      }
    },
    {
      title: 'Client',
      dataIndex: 'nom_client',
      key: 'nom_client',
      render: (text) => <Tag icon={<UserOutlined />} color="blue">{text ?? 'Aucun'}</Tag>,
    },
    { title: 'Type', dataIndex: 'nom_type_d_occupation', key: 'nom_type_d_occupation', render: (text) => <Tag color="blue">{text ?? 'Aucun'}</Tag> },
    { title: 'Bâtiment', dataIndex: 'nom_batiment', key: 'nom_batiment', render: (text) => <Tag color="blue">{text ?? 'Aucun'}</Tag> },
    { title: 'Niveau', dataIndex: 'nom_niveau', key: 'nom_niveau', render: (text) => <Tag color="cyan">{text ?? 'Aucune'}</Tag> },
    {
      title: 'Statut',
      dataIndex: 'id_statut_template',
      key: 'id_statut_template',
      render: (text) => (
        text === 1 ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>Activé</Tag>
        ) : (
          <Tag color="red" icon={<CloseCircleOutlined />}>Désactivé</Tag>
        )
      ),
    },
    { title: 'Dénomination', dataIndex: 'nom_denomination_bat', key: 'nom_denomination_bat', render: (text) => <Tag color="purple">{text}</Tag> },
    { title: 'Objet', dataIndex: 'nom_objet_fact', key: 'nom_objet_fact', render: (text) => <Tag color="green">{text}</Tag> },
    {
      title: 'Date active',
      dataIndex: 'date_actif',
      key: 'date_actif',
      sorter: (a, b) => moment(a.date_actif).unix() - moment(b.date_actif).unix(),
      render: text => <Tag icon={<CalendarOutlined />} color="purple">{moment(text).format('LL')}</Tag>,
    }
  ];

  const formatPeriod = (period) => {
    return moment(period, "YYYY-MM").format("MMMM");
  };

  const renderEmptyData = (message) => (
    <Empty description={message || 'Aucune donnée disponible'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );

  return (
    <div className="clients">
      <div className="row">
        <div className="column table-container">
            <div>
              <div className="row-title">
                <h2 className='table-title'>{ idTemplate ? `Liste des templates de ${nomClient}` : 'Aucun client sélectionné'}</h2>
                { idTemplate && 
                  <div>
                    <Select
                      showSearch
                      options={province.map((item) => ({
                        value: item.id,
                        label: item.capital,
                        }))}
                        placeholder="Sélectionnez une ville..."
                        optionFilterProp="label"
                        onChange={setIdProvice}
                    />
                  </div> 
                }
              </div>
              {data.length > 0 ? (
              <Table
                columns={columns}
                dataSource={data}
                loading={loadingData}
                pagination={{ pageSize: 8 }}
                rowKey="id"
                bordered
                size="middle"
                scroll={scroll}
              /> ) : (
                renderEmptyData('Aucun template trouvé pour ce client.')
              )}
            </div>
        </div>

        {dernier.length > 0 ? (
          <div className="column table-container">
            <div className="row-title">
              <h2 className='table-title'>Période de {formatPeriod(periode)}</h2>
            </div>
            <Table
              columns={columns}
              dataSource={dernier}
              loading={loadingData}
              pagination={{ pageSize: 5 }}
              rowKey="id"
              bordered
              size="middle"
              scroll={scroll}
            />
          </div>
        ) : (
          renderEmptyData('Aucune donnée pour la période spécifiée.')
        )}
      </div>
    </div>
  );
};

export default TemplateOne;
