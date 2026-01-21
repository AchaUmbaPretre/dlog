import { useEffect, useState } from 'react';
import { Table, Button, Input, Typography, notification, Modal, Tag, Tooltip } from 'antd';
import {
  FileTextOutlined,
  PrinterOutlined,
  PlusOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { getAttendanceAdjustment } from '../../../services/presenceService';
import { renderDate } from '../absence/absenceForm/utils/renderStatusAbsence';
import AdjustmentDecisionModal from './adjustmentDecisionModal/AdjustmentDecisionModal';
import moment from 'moment';

const { Search } = Input;
const { Text } = Typography;

const STATUS_COLORS = {
  PROPOSE: 'orange',
  VALIDE: 'green',
  REJETE: 'red',
};

const TYPE_LABELS = {
  RETARD_JUSTIFIE: 'Retard justifié',
  CORRECTION_HEURE: 'Correction heures',
  AUTORISATION_SORTIE: 'Autorisation de sortie',
};

const AutorisationSortie = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const scroll = { x: 1000 };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getAttendanceAdjustment();
      setData(data);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddAdjustment = () => {
        setSelectedAdjustment(null);
        setModalOpen(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const filteredData = data?.filter(item =>
        item.utilisateur_nom?.toLowerCase().includes(searchValue.toLowerCase())
    );

    const columns = [
    {
        title: '#',
        width: 50,
        align: 'center',
        render: (_, __, index) => index + 1,
    },
    {
        title: (
        <>
            <UserOutlined /> Agent
        </>
        ),
        dataIndex: 'utilisateur_nom',
        key: 'utilisateur_nom',
        render: (text) => <Text strong>{text}</Text>,
    },
    {
        title: (
        <>
            <CalendarOutlined /> Date
        </>
        ),
        dataIndex: 'date_presence',
        key: 'date_presence',
        align: 'center',
        render: (date) => renderDate(date),
    },
    {
        title: 'Type d’ajustement',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (type) => <Tag color="blue">{TYPE_LABELS[type] || type}</Tag>,
    },
    {
        title: 'Ancienne valeur',
        dataIndex: 'ancienne_valeur',
        key: 'ancienne_valeur',
        align: 'center',
        render: (v) =>
        v
            ? moment(v).isValid()
            ? moment(v).format('DD-MM-YYYY HH:mm')
            : v
            : '--',
    },
    {
        title: 'Nouvelle valeur',
        dataIndex: 'nouvelle_valeur',
        key: 'nouvelle_valeur',
        align: 'center',
        render: (v) =>
        v
            ? moment(v).isValid()
            ? <Text strong>{moment(v).format('DD-MM-YYYY HH:mm')}</Text>
            : <Text strong>{v}</Text>
            : '--',
    },
    {
        title: 'Motif',
        dataIndex: 'motif',
        key: 'motif',
        ellipsis: true,
    },
    {
        title: 'Statut RH',
        dataIndex: 'statut',
        key: 'statut',
        align: 'center',
        render: (statut) => <Tag color={STATUS_COLORS[statut]}>{statut}</Tag>,
    },
    {
        title: 'Créée le',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        render: (date) => renderDate(date),
    },
    {
        title: 'Décision',
        key: 'decision',
        align: 'center',
        render: (_, record) => {
        if (record.statut !== 'PROPOSE') {
            return (
            <Text>
                {record.statut === 'VALIDE' ? 'Validé' : 'Refusé'}
                <br />
                par {record.validated_by_nom || '—'}
            </Text>
            );
        }

        return (
            <Button
            type="primary"
            size="small"
            onClick={() => {
                setSelectedAdjustment(record);
                setModalOpen(true);
            }}
            >
            Décider
            </Button>
        );
        },
    },
    ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <FileTextOutlined className="client-icon" />
            </div>
            <h2 className="client-h2">Demandes d’ajustement de présence</h2>
          </div>

          <div className="client-actions">
            <div className="client-row-left">
              <Search
                placeholder="Recherche..."
                onChange={(e) => setSearchValue(e.target.value)}
                enterButton
                style={{ width: 280 }}
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{ pageSize: 15 }}
            rowKey="id_adjustment"
            bordered
            size="middle"
            scroll={scroll}
          />
        </div>
      </div>

      <AdjustmentDecisionModal
        open={modalOpen}
        adjustment={selectedAdjustment}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
      />
    </>
  );
};

export default AutorisationSortie;
