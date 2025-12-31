import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Form,
  InputNumber,
  Input,
  Button,
  notification,
  Card,
  Tag,
  Divider,
  Typography,
  Space,
} from 'antd';
import { getSortieByFmp, putSortieFmp } from '../../../../../services/sortieEamFmp';

const { Title, Text } = Typography;

// Cellule éditable
const EditableCell = ({ editing, dataIndex, title, record, onSave, children, inputType, ...restProps }) => (
  <td {...restProps}>
    {editing ? (
      <Form.Item
        name={dataIndex}
        style={{ margin: 0 }}
        rules={[{ required: true, message: `Veuillez saisir ${title}` }]}
      >
        {inputType === 'number' ? (
          <InputNumber min={0} style={{ width: '100%' }} />
        ) : (
          <Input style={{ width: '100%' }} />
        )}
      </Form.Item>
    ) : (
      children
    )}
  </td>
);

const SortieByFmp = ({ item_code, smr }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [loading, setLoading] = useState(false);

  // Récupération des données depuis l'API
  useEffect(() => {
    fetchData();
  }, [item_code, smr]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getSortieByFmp(item_code, smr);
      setData(res?.data?.data || []);
    } catch (err) {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de charger les données FMP',
      });
    } finally {
      setLoading(false);
    }
  };

  const isEditing = (record) => record.id_sortie_fmp === editingKey;

  // Activer l'édition d'une ligne
  const edit = (record) => {
    form.setFieldsValue({
      nbre_colis: record.nbre_colis,
      smr: record.smr,
    });
    setEditingKey(record.id_sortie_fmp);
  };

  // Sauvegarder les modifications
  const save = async (id_sortie_fmp) => {
    try {
      const values = await form.validateFields();

      // Mise à jour en base
      await putSortieFmp({
        id_sortie_fmp,
        nbre_colis: values.nbre_colis,
        smr: values.smr,
      });

      // Mise à jour locale du tableau
      setData((prev) =>
        prev.map((item) =>
          item.id_sortie_fmp === id_sortie_fmp ? { ...item, ...values } : item
        )
      );

      notification.success({
        message: 'Sauvegardé',
        description: 'Sortie FMP mise à jour',
        placement: 'bottomRight',
        duration: 2,
      });

      setEditingKey(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Colonnes du tableau
  const columns = [
    { title: 'ITEM', dataIndex: 'item_code' },
    { title: 'Désignation', dataIndex: 'designation', ellipsis: true },
    { title: 'Unité', dataIndex: 'unite', width: 90 },
    {
      title: 'SMR',
      dataIndex: 'smr',
      editable: true,
      inputType: 'text',
      render: (v) => <Text>{v}</Text>,
    },
    {
      title: 'Nb Colis',
      dataIndex: 'nbre_colis',
      editable: true,
      inputType: 'number',
      render: (v) => <Text strong>{v}</Text>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Button type="link" onClick={() => save(record.id_sortie_fmp)}>
            Sauvegarder
          </Button>
        ) : (
          <Button type="link" onClick={() => edit(record)}>Edit</Button>
        );
      },
    },
  ];

  // Merge pour les cellules éditables
  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        onSave: save,
        inputType: col.inputType,
      }),
    };
  });

  // Total des colis
  const totalColis = useMemo(
    () => data.reduce((sum, r) => sum + (r.nbre_colis || 0), 0),
    [data]
  );

  return (
    <Card bordered={false} style={{ borderRadius: 12 }}>
      <Space direction="vertical" size={6}>
        <Title level={4} style={{ marginBottom: 0 }}>Sorties FMP</Title>
        <Space wrap>
          <Tag color="blue">ITEMS : {item_code}</Tag>
          <Tag color="geekblue">SMR : {smr}</Tag>
        </Space>
        {data?.[0]?.designation && (
          <Text type="secondary">{data[0].designation}</Text>
        )}
      </Space>

      <Divider />

      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          rowKey="id_sortie_fmp"
          dataSource={data}
          columns={mergedColumns}
          loading={loading}
          bordered
          pagination={false}
          size="middle"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3}><strong>Total colis</strong></Table.Summary.Cell>
              <Table.Summary.Cell><strong>{totalColis}</strong></Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2} />
            </Table.Summary.Row>
          )}
        />
      </Form>
    </Card>
  );
};

export default SortieByFmp;
