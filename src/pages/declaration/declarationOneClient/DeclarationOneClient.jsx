import { useEffect, useState } from 'react';
import { Table, Menu, Tag, Dropdown, Button, Select, Skeleton, Space } from 'antd';
import { CalendarOutlined,MenuOutlined,DownOutlined,EnvironmentOutlined, HomeOutlined, FileTextOutlined, ToolOutlined, DollarOutlined, BarcodeOutlined,UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getDeclarationOneClient, getTemplateOne } from '../../../services/templateService';
import Declaration5derners from '../declaration5derniers/Declaration5derniers';
import { getProvinceClientOne } from '../../../services/clientService';
import './../../template/templateOne/templateOne.scss'

const DeclarationOneClient = ({idClient, idTemplate, periode, idDeclarations }) => {
  const [loading, setLoading] = useState(true);
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'Template': true,
    'Desc man': false,
    'Periode': false,
    'M² occupe': false,
    "M² facture": true,
    "Tarif Entr": true,
    'Debours Entr': false,
    'Total Entr': true,
    "TTC Entr": true,
    "Ville": true,
    "Client": false,
    "Bâtiment": false,
    "Objet fact": false,
    "Manutention": false,
    "Tarif Manu": false,
    "Debours Manu": false,
    "Total Manu": false,
    "TTC Manu": false,
  });
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [nameTemplate, setNameTemplate] = useState('');
  const [province, setProvince] = useState([]);
  const [idProvince, setIdProvice] = useState('');


  const handleRowClick = (id) => {
    idDeclarations(id)
    };

  const groupDataByMonth = (data) => {
    const groupedData = {};
  
    data.forEach((item) => {
      const date = moment(item.periode);
      const key = date.format('MMMM YYYY');
  
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
  
      groupedData[key].push({
        ...item,
        key: `${item.id_declaration_super}-${date.format('YYYY-MM-DD')}`, // Unique key for each row
      });
    });
  
    return Object.entries(groupedData).map(([month, items]) => ({
      month,
      items,
    }));
  };

    const fetchData = async () => {
        setLoading(true);
        setData([]); 

      try {
        const { data } = await getDeclarationOneClient(idClient, idProvince, periode);
        const resProvince = await getProvinceClientOne(idClient);
        const res = await getTemplateOne(idTemplate)

        setProvince(resProvince.data)
        setNameTemplate(res.data[0]?.desc_template)
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error)
        setLoading(false);
      } finally {
        setLoading(false); 
      }
    };

  useEffect(() => {
    fetchData();
  }, [idClient, idProvince, idTemplate, periode]);

  const menus = (
    <Menu>
      {Object.keys(columnsVisibility).map(columnName => (
        <Menu.Item key={columnName}>
          <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
            <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
            <span style={{ marginLeft: 8 }}>{columnName}</span>
          </span>
        </Menu.Item>
      ))}
    </Menu>
  ); 

  const toggleColumnVisibility = (columnName, e) => {
    e.stopPropagation();
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };

  const groupedData = groupDataByMonth(data);
  
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
      ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' }),
    },
    {
        title: 'Template',
        dataIndex: 'desc_template',
        key: 'desc_template',
        render: (text, record) => {
          const isTrue = record.id_template === idTemplate;
          return <Space onClick={() => handleRowClick(record.id_declaration_super)}>
                    <Tag icon={<FileTextOutlined />} color= {isTrue ? 'red' : "geekblue"}>{text ?? 'Aucun'}</Tag>
                  </Space>
        },
        ...(columnsVisibility['Template'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Periode',
        dataIndex: 'periode',
        key: 'periode',
        sorter: (a, b) => moment(a.periode) - moment(b.periode),
        sortDirections: ['descend', 'ascend'],
        render: (text) => {
          const date = text ? new Date(text) : null;
          const formattedDate = date 
            ? date.toLocaleString('default', { month: 'long', year: 'numeric' })
            : 'Aucun';
          return (
            <Tag icon={<CalendarOutlined />} color="purple">{formattedDate}</Tag>
          );
        },
        ...(columnsVisibility['Periode'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'M² occupe',
        dataIndex: 'm2_occupe',
        key: 'm2_occupe',
        render: (text) => (
          <Tag icon={<BarcodeOutlined />} color="cyan">{text?.toLocaleString() ?? 'Aucun'}</Tag>
        ),
        ...(columnsVisibility['M² occupe'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'M² facture',
        dataIndex: 'm2_facture',
        key: 'm2_facture',
        render: (text) => (
          <Tag icon={<BarcodeOutlined />} color="cyan">{text?.toLocaleString() ?? 'Aucun'}</Tag>
        ),
        ...(columnsVisibility['M² facture'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Tarif Entr',
        dataIndex: 'tarif_entreposage',
        key: 'tarif_entreposage',
        render: (text) => (
          <Tag icon={<DollarOutlined />} color="green">
            {text
            ? `${parseFloat(text)
                .toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                })
                .replace(/,/g, " ")} $`
            : "0.00"}
          </Tag>
        ),
        ...(columnsVisibility['Tarif Entr'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Debours Entr',
        dataIndex: 'debours_entreposage',
        key: 'debours_entreposage',
        render: (text) => (
          <Tag icon={<DollarOutlined />} color="green">{text ?? 'Aucun'}</Tag>
        ),
        ...(columnsVisibility['Debours Entr'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Total Entr',
        dataIndex: 'total_entreposage',
        key: 'total_entreposage',
        render: (text) => (
          <Tag color="gold">{text
            ? `${parseFloat(text)
                .toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                })
                .replace(/,/g, " ")} $`
            : "0.00"}
          </Tag>
        ),
        ...(columnsVisibility['Total Entr'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'TTC Entr',
        dataIndex: 'ttc_entreposage',
        key: 'ttc_entreposage',
        render: (text) => (
          <Tag color="volcano">
            {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
          </Tag>
        ),
        ...(columnsVisibility['TTC Entr'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Desc Man',
        dataIndex: 'desc_manutation',
        key: 'desc_manutation',
        render: (text) => (
          <Tag icon={<FileTextOutlined />} color="geekblue">{text ?? 'Aucun'}</Tag>
        ),
        ...(columnsVisibility['Desc man'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Ville',
        dataIndex: 'capital',
        key: 'capital',
        render: (text) => (
          <Tag icon={<EnvironmentOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
        ),
        ...(columnsVisibility['Ville'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Client',
        dataIndex: 'nom',
        key: 'nom',
        render: (text) => (
          <Tag icon={<UserOutlined />} color="orange">{text ?? 'Aucun'}</Tag>
        ),
        ...(columnsVisibility['Client'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Bâtiment',
        dataIndex: 'nom_batiment',
        key: 'nom_batiment',
        render: (text) => (
          <Tag icon={<HomeOutlined />} color="purple">{text ?? 'Aucun'}</Tag>
        ),
        ...(columnsVisibility['Bâtiment'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Objet fact',
        dataIndex: 'nom_objet_fact',
        key: 'nom_objet_fact',
        render: (text) => (
          <Tag icon={<FileTextOutlined />} color="magenta">{text ?? 'Aucun'}</Tag>
        ),
        ...(columnsVisibility['Objet fact'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Manutention',
        dataIndex: 'manutation',
        key: 'manutation',
        render: (text) => (
          <Tag color="cyan">{text
            ? `${parseFloat(text)
                .toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                })
                .replace(/,/g, " ")} $`
            : "0.00"}</Tag>
        ),
        ...(columnsVisibility['Manutention'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Tarif Manu',
        dataIndex: 'tarif_manutation',
        key: 'tarif_manutation',
        render: (text) => (
          <Tag icon={<DollarOutlined />} color="green">
            {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
          </Tag>
        ),
        ...(columnsVisibility['Tarif Manu'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Debours Manu',
        dataIndex: 'debours_manutation',
        key: 'debours_manutation',
        render: (text) => (
          <Tag icon={<DollarOutlined />} color="green">{text?.toLocaleString() ?? 'Aucun'}</Tag>
        ),
        ...(columnsVisibility['Debours Manu'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'Total Manu',
        dataIndex: 'total_manutation',
        key: 'total_manutation',
        render: (text) => (
          <Tag icon={<DollarOutlined />} color="gold">
            {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
          </Tag>
        ),
        ...(columnsVisibility['Total Manu'] ? {} : { className: 'hidden-column' }),
      },
      {
        title: 'TTC Manu',
        dataIndex: 'ttc_manutation',
        key: 'ttc_manutation',
        render: (text) => (
          <Tag icon={<DollarOutlined />} color="volcano">
            {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
          </Tag>
        ),
        ...(columnsVisibility['TTC Manu'] ? {} : { className: 'hidden-column' }),
      },
  ];

  if(loading) {
    return (
        <Skeleton active paragraph={{ rows: 10 }} />
    )
  }
  
  return (
    <>
      <div className="clients">
        <div className="row">
            <div className="column table-container">
                <div>
                { 
                    idClient 
                    ?
                    <>
                        <div className="row-title" style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', marginBottom:'15px', borderBottom:'2px solid #e8e8e8', paddingBottom:'10px'}}>
                            <h2 className="table-title" style={{fontSize:'17px', fontWeight:'600', color:'#333'}}>Template {nameTemplate} </h2>
                            <div style={{display:'flex', gap:'10px'}}>
                                <Dropdown overlay={menus} trigger={['click']}>
                                    <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                                    Colonnes <DownOutlined />
                                    </Button>
                                </Dropdown>

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
                        </div>
                        {groupedData.map(({ month, items }) => (
                        <div key={month}>
                            <h3 style={{paddingBottom:'10px', fontSize:'14px'}}>{month}</h3>
                            <Table
                                dataSource={items}
                                columns={columns}
                                loading={loading}
                                pagination={{ pageSize: 10 }}
                                bordered
                                size="middle"
                                scroll={scroll}
                            />
                        </div>
                        ))}
                    </>
                    :
                    <Declaration5derners idDeclarations={idDeclarations}/>
                }
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default DeclarationOneClient;