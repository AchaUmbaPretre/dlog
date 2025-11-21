import  { useEffect, useState,  useRef } from 'react';
import { Typography, DatePicker, Radio, Card, Table, notification, Input } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { CarOutlined, SearchOutlined } from '@ant-design/icons';
import { formatNumber } from '../../../../../../utils/formatNumber';
import { getRapportVehiculePeriode } from '../../../../../../services/carburantService';
import { availableFieldsRapPeriode } from '../../../../../../utils/availableFields';

const { Text, Title } = Typography;

const RapportVehiculePeriode = () => {
    const [month, setMonth] = useState(moment().format('YYYY-MM'));
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectedField, setSelectedField] = useState('total_plein');
    const [searchText, setSearchText] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [uniqueMonths, setUniqueMonths] = useState([]);
    const [activeKeys, setActiveKeys] = useState(['1', '2']);
    const [detail, setDetail] = useState([]);
    const tableRef = useRef();

    const fetchData = async() => {
        setLoading(true)
        try {
            const { data } = await getRapportVehiculePeriode(month);
            setData(data)           
        } catch (error) {
            notification.error({
                message: "Erreur de chargement",
                description: "Impossible de récupérer les données carburant.",
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }

    }

      useEffect(() => {
        fetchData();
      }, [month]);
    const columns = [
        {
          title: '#',
          render: (text, record, index) => index + 1,
          width: 10,
          fixed: 'left',
        },
        {
          title: 'Marque',
          dataIndex: 'nom_marque',
          fixed: 'left',
          filterDropdown: () => (
            <Input
              placeholder="Rechercher véhicule"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 180, marginBottom: 8 }}
              prefix={<SearchOutlined />}
            />
          ),
          render: (text) => (
            <strong>
              <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
              {text?? 'N/A'}
            </strong>
          ),
        }, 
        {
          title: 'Immatriculation',
          dataIndex: 'immatriculation',
          fixed: 'left',
          filterDropdown: () => (
            <Input
              placeholder="Rechercher véhicule"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 180, marginBottom: 8 }}
              prefix={<SearchOutlined />}
            />
          ),
          render: (text) => (
            <strong>
              {text ?? 'N/A'}
            </strong>
          ),
        },
        {
            title: "#Plein",
            dataIndex: "total_pleins",
            key: "total_pleins",
            align: "right",
            render: (text) => <Text>{formatNumber(text)}</Text>,
        },
        {
            title: "Qté (L)",
            dataIndex: "total_litres",
            key: "total_litres",
            align: "right",
            render: (text) => <Text>{formatNumber(text)}</Text>,
        },
        {
            title: "Dist. (km)",
            dataIndex: "total_distance",
            key: "total_distance",
            align: "right",
            render: (text) => <Text>{formatNumber(text)}</Text>,
        },
        {
            title: "Km actuel",
            dataIndex: "total_kilometrage",
            key: "total_kilometrage",
            align: "right",
            render: (text) => <Text>{formatNumber(text)} km</Text>,
        },
        {
            title: "Cons./100km",
            dataIndex: "total_consom",
            key: "total_consom",
            align: "right",
            render: (text) => <Text>{formatNumber(text, " L")}</Text>,
        },
        {
            title: "Montant CDF",
            dataIndex: "total_total_cdf",
            key: "total_total_cdf",
            align: "right",
            render: (text) => <Text>{formatNumber(text, " L")}</Text>,
        },
        {
            title: "Montant USD",
            dataIndex: "total_total_usd",
            key: "total_total_usd",
            align: "right",
            render: (text) => <Text>{formatNumber(text, " L")}</Text>,
        },
    ]

  return (
    <div className="client">
        <div className="client-wrapper">
            <Card>
                <div>
                    <span>Afficher : </span>
                    <Radio.Group
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                    >
                        {availableFieldsRapPeriode.map(({ key, label }) => (
                        <Radio key={key} value={key}>
                            {label}
                        </Radio>
                        ))}
                    </Radio.Group>
                </div>
            </Card>
            <div ref={tableRef}>
                <Table
                    dataSource={data}
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                    rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    pagination={false}
                    loading={loading}
                    bordered
                    size="middle"
                />
            </div>
        </div>
    </div>
  )
}

export default RapportVehiculePeriode