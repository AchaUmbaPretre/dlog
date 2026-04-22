import { useMemo } from "react";
import moment from "moment";
import {
  Space,
  Tooltip,
  Tag,
  Button,
  Popconfirm,
  Typography,
} from "antd";
import {
  CarOutlined,
  DeleteOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  FieldTimeOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  CloseOutlined,
  TrademarkOutlined,
  CheckCircleOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export const useBandeColumns = ({
  pagination,
  columnsVisibility = {},
  columnStyles,
  statusIcons,
  handleDetail,
  handleUpdateTime,
  handleReleve,
  handlSortie,
  handleAnnuler,
  handleDelete,
}) => {
  return useMemo(() => {
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
            width: "3%"
          },
          {
            title: (
              <Space>
                <AppstoreOutlined style={{ color: '#1890ff' }} />
                <Text strong>Service</Text>
              </Space>
            ),
            dataIndex: 'nom_motif_demande',
            key:'nom_motif_demande',
            ellipsis: {
              showTitle: false,
            },
              render : (text) => (
                <Tooltip placement="topLeft" title={text}>
                  <Text type="secondary">{text}</Text>
                </Tooltip>
              ),
            ...(columnsVisibility['Service'] ? {} : { className: 'hidden-column' }),
    
          },
          {
            title: (
              <span>
                <ApartmentOutlined style={{ marginRight: 6, color: '#1d39c4' }} />
                Demandeur
              </span>
            ),
            dataIndex: 'nom_service',
            key:'nom_service',
            ellipsis: {
              showTitle: false,
            },
              render : (text) => (
                <Tooltip placement="topLeft" title={text}>
                  <Text type="secondary">{text}</Text>
                </Tooltip>
              ),
            ...(columnsVisibility['Demandeur'] ? {} : { className: 'hidden-column' }),
    
          },
          {
            title: (
              <Space>
                <UserOutlined  style={{color:'orange'}}/>
                <Text strong>Chauffeur</Text>
              </Space>
            ),
            dataIndex: 'nom',
            key: 'nom',
            ellipsis: {
              showTitle: false,
            },
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                <Text type="secondary">{text}</Text>
              </Tooltip>
            ),
            ...(columnsVisibility['Chauffeur'] ? {} : { className: 'hidden-column' }),
    
          },
          {
            title: (
              <Space>
                <EnvironmentOutlined style={{ color: 'red' }} />
                <Text strong>Destination</Text>
              </Space>
            ),
            dataIndex: 'nom_destination',
            key: 'nom_destination',
            ellipsis: {
              showTitle: false,
            },
            render: (text, record) => (
              <Tooltip placement="topLeft" title={text}>
                <div style={columnStyles.title} className={columnStyles.hideScroll} onClick={() => handleDetail(record.id_bande_sortie)}>
                  <Text  type="secondary">{text}</Text>
                </div>
              </Tooltip>
            ),
            ...(columnsVisibility['Destination'] ? {} : { className: 'hidden-column' }),
          },
          {
            title: (
              <Space>
                <UserOutlined  style={{color:'orange'}}/>
                <Text strong>Agent</Text>
              </Space>
            ),
            dataIndex: 'personne_bord',
            key: 'personne_bord',
            ellipsis: {
              showTitle: false,
            },
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                <Text type="secondary">{text}</Text>
              </Tooltip>
            ),
            ...(columnsVisibility['Agent'] ? {} : { className: 'hidden-column' }),
          },
          {
            title: (
              <Space>
                <CarOutlined style={{ color: 'green' }} />
                <Text strong>Véhicule</Text>
              </Space>
            ),
            dataIndex:'nom_cat',
            key: 'nom_cat',
            ellipsis: {
              showTitle: false,
            },
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                <div style={columnStyles.title} className={columnStyles.hideScroll}>
                  <Text  type="secondary">{text}</Text>
                </div>
              </Tooltip>
            ),
            ...(columnsVisibility['Véhicule'] ? {} : { className: 'hidden-column' })
          },
          {
            title: (
              <Space>
                <CarOutlined style={{ color: 'green' }} />
                <Text strong>Immatriculation</Text>
              </Space>
            ),
            dataIndex:'immatriculation',
            key: 'immatriculation',
            ellipsis: {
              showTitle: false,
            },
            align: 'center',
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                <div style={columnStyles.title} className={columnStyles.hideScroll}>
                  <Text  type="secondary">{text}</Text>
                </div>
              </Tooltip>
            ),
            ...(columnsVisibility['Immatriculation'] ? {} : { className: 'hidden-column' })
          },
          {
            title: (
              <Space>
                <CarOutlined style={{ color: '#2db7f5' }} />
                <Text strong>Marque</Text>
              </Space>
            ),
            dataIndex: 'nom_marque',
            key: 'nom_marque',
            align: 'center',
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                <Tag icon={<TrademarkOutlined />} color="blue">
                  {text}
                </Tag>
              </Tooltip>
            ),
            ...(columnsVisibility['Marque'] ? {} : { className: 'hidden-column' })
          },
          {
            title: (
              <Space>
                <FieldTimeOutlined style={{ color: 'blue' }} />
                <Text strong>Sortie prevue</Text>
              </Space>
            ),
            dataIndex: 'date_prevue',
            key: 'date_prevue',
            align: 'center',
            ellipsis: {
              showTitle: false,
            },
            render: (text) => {
              if (!text) {
                return (
                  <Tag icon={<CalendarOutlined />} color="red">
                    Aucune date
                  </Tag>
                );
              }
    
              const date = moment(text);
              const isValid = date.isValid();
    
              return (
                <Tag icon={<FieldTimeOutlined />} color={isValid ? "blue" : "red"}>
                  {isValid ? date.format('DD-MM-YYYY HH:mm') : 'Aucune'}
                </Tag>
              );
            },  
            ...(columnsVisibility['Preuve'] ? {} : { className: 'hidden-column' })
          },
          {
            title: (
              <Space>
                <FieldTimeOutlined style={{ color: 'blue' }} />
                <Text strong>Retour prevu</Text>
              </Space>
            ),
            dataIndex: 'date_retour',
            key: 'date_retour',
            align: 'center',
            ellipsis: {
              showTitle: false,
            },
            render: (text) => {
              if (!text) {
                return (
                  <Tag icon={<CalendarOutlined />} color="red">
                    Aucune date
                  </Tag>
                );
              }
    
              const date = moment(text);
              const isValid = date.isValid();
    
              return (
                <Tag icon={<FieldTimeOutlined />} color={isValid ? "blue" : "red"}>
                  {isValid ? date.format('DD-MM-YYYY HH:mm') : 'Aucune'}
                </Tag>
              );
            },
            ...(columnsVisibility['Retour'] ? {} : { className: 'hidden-column' })
    
          },
          {
            title: (
              <Space>
                <CalendarOutlined style={{ color: 'blue' }} />
                <Text strong>Depart</Text>
              </Space>
            ),
            dataIndex: 'sortie_time',
            key: 'sortie_time',
            align: 'center',
            ellipsis: {
              showTitle: false,
            },
            render: (text, record) => {
              if (!text) {
                return (
                  <Tag icon={<CalendarOutlined />} color="red" onClick={() => handleUpdateTime(record.id_bande_sortie)}>
                    N'est pas sorti
                  </Tag>
                );
              }
              const date = moment(text);
              const isValid = date.isValid();              
                return (
                  <Tag icon={<CalendarOutlined />} color={isValid ? "purple" : "red"} onDoubleClick={() => handleUpdateTime(record.id_bande_sortie)}>
                    {isValid ? date.format('DD-MM-YYYY HH:mm') : "N'est pas sorti"}
                  </Tag>
                );
            },
            ...(columnsVisibility['Depart'] ? {} : { className: 'hidden-column' })
          },
          {
            title: (
              <Space>
                <CalendarOutlined style={{ color: 'blue' }} />
                <Text strong>Retour</Text>
              </Space>
            ),
            dataIndex: 'retour_time',
            key: 'retour_time',
            ellipsis: {
              showTitle: false,
            },
            render: (text, record) => {
              if (!text) {
                  return (
                      <Tag icon={<CalendarOutlined />} color="red" onClick={() => handleUpdateTime(record.id_bande_sortie)}>
                          N'est pas retourné
                      </Tag>
                  );
              }
              const date = moment(text);
              const isValid = date.isValid();              
                  return (
                      <Tag icon={<CalendarOutlined />} color={isValid ? "purple" : "red"} onDoubleClick={() => handleUpdateTime(record.id_bande_sortie)}>
                        {isValid ? date.local().format('DD-MM-YYYY HH:mm ') : 'Nest pas retourné'}
                      </Tag>
                  );
              },
            ...(columnsVisibility['Retour effectif'] ? {} : { className: 'hidden-column' })
          },
          {
            title: (
              <Space>
                  <CheckCircleOutlined style={{ color: '#1890ff' }} />
                  <Text strong>Statut</Text>
              </Space>
              ),
              dataIndex: 'nom_statut_bs',
              key: 'nom_statut_bs',
              render: text => {
                  const { icon, color } = statusIcons[text] || {};
                  return (
                    <div style={columnStyles.title} className={columnStyles.hideScroll}>
                      <Tag icon={icon} color={color}>{text}</Tag>
                    </div>
                  );
              },
          },
          {
            title: (
              <Space>
                <UserOutlined style={{ color: 'orange' }} />
                <Text strong>Créé par</Text>
              </Space>
            ),
            dataIndex: 'created',
            key: 'created',
            align: 'center',
            ellipsis: {
              showTitle: false,
            },
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                <Text  type="secondary">{text}</Text>
              </Tooltip>
            ),
            ...(columnsVisibility['Créé par'] ? {} : { className: 'hidden-column' })
          },
          {
              title: (
              <Text strong>Actions</Text>
              ),
              key: 'action',
              align: 'center',
              ellipsis: {
                showTitle: false,
              },
              render: (text, record) => (
              <Space size="small">
    
                  <Tooltip title="Relevé des bons de sortie">
                    <Button
                      icon={<FileTextOutlined />}
                      style={{ color: 'blue' }}
                      onClick={() => handleReleve(record.id_bande_sortie)}
                      aria-label="Relevé"
                    />
                  </Tooltip>
    
                  <Tooltip title={record.utilisateur_a_valide ? "Vous avez déjà validé" : "Valider"}>
                  <Button
                    icon={
                      record.utilisateur_a_valide
                        ? <CheckCircleOutlined style={{ color: 'gray' }} />
                        : <CheckCircleOutlined />
                    }
                    style={{
                      color: record.utilisateur_a_valide ? 'gray' : 'green',
                    }}
                    onClick={() => handlSortie(record.id_bande_sortie)}
                    disabled={record.utilisateur_a_valide}
                    aria-label="Valider"
                  />
                </Tooltip>
    
    
                  <Tooltip title="Annuler le BS">
                      <Button
                        icon={<CloseOutlined />}
                        style={{ color: 'red' }}
                        onClick={() => handleAnnuler(record.id_bande_sortie, record.id_vehicule)}
                        aria-label="Annuler"
                        disabled = {record.nom_statut_bs === 'Retour' || record.nom_statut_bs === 'Annulé' || record.nom_statut_bs === 'Départ' }
                      />
                  </Tooltip>
    
                  <Tooltip title="Supprimer">
                    <Popconfirm
                      title="Êtes-vous sûr de vouloir supprimer ce bon de sortie ?"
                      onConfirm={() => handleDelete(record.id_bande_sortie, record.id_vehicule)}
                      okText="Oui"
                      cancelText="Non"
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        style={{ color: 'red' }}
                        aria-label="Delete bon"
                        disabled = {record.nom_statut_bs === 'Retour'}
                      />
                    </Popconfirm>
                </Tooltip>
              </Space>
              ),
          },
        ]
    return columns;
  }, [
    pagination,
    columnsVisibility,
    columnStyles,
    statusIcons,
    handleDetail,
    handleUpdateTime,
    handleReleve,
    handlSortie,
    handleAnnuler,
    handleDelete,
  ]);
};