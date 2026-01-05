import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  InputNumber,
  Input,
  Button,
  Space,
  notification,
  Card,
  Tag,
  Divider,
  Typography,
} from 'antd';
import { getSortieByEam, putSortieEam } from '../../../../../services/sortieEamFmp';
import moment from 'moment';

const { Title, Text } = Typography;

const EditableCell = ({ editing, dataIndex, title, inputType, children, ...restProps }) => (
  <td {...restProps}>
    {editing ? (
      <Form.Item
        name={dataIndex}
        style={{ margin: 0 }}
        rules={[{ required: true, message: `Veuillez saisir ${title}` }]}
      >
        {inputType === 'number' ? (
          <InputNumber style={{ width: '100%' }} />
        ) : (
          <Input style={{ width: '100%' }} />
        )}
      </Form.Item>
    ) : (
      children
    )}
  </td>
);

const SortieByEam = ({ eam, part, reload }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [eam, part]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getSortieByEam(eam, part);
      setData(res?.data?.data || []);
    } catch {
      notification.error({
        message: 'Erreur',
        description: 'Impossible de charger les données',
      });
    } finally {
      setLoading(false);
    }
  };

  const isEditing = (record) => record.id_sortie_eam === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      smr_ref: record.smr_ref,
      quantite_out: record.quantite_out,
      quantite_in: record.quantite_in,
    });
    setEditingKey(record.id_sortie_eam);
  };

  const cancel = () => setEditingKey('');

  const save = async (id_sortie_eam) => {
    try {
      const values = await form.validateFields();

      await putSortieEam({ id_sortie_eam, ...values });

      // mise à jour locale
      setData((prev) =>
        prev.map((item) =>
          item.id_sortie_eam === id_sortie_eam ? { ...item, ...values } : item
        )
      );

      notification.success({
        message: 'Succès',
        description: 'Modification enregistrée',
      });

      reload?.();
      setEditingKey('');
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'transanction_date',
      sorter: (a,b) => moment(a.transanction_date).unix() - moment(b.transanction_date).unix(),
      render: (v) => new Date(v).toLocaleDateString(),
    },
    { title: 'Transaction #', dataIndex: 'transanction_num', sorter: (a,b) => a.transanction_num - b.transanction_num },
    { title: 'Part desc.', dataIndex: 'part_description' },
    { title: 'SMR', dataIndex: 'smr_ref', editable: true, inputType: 'text', sorter: (a,b) => a.smr_ref.localeCompare(b.smr_ref) },
    { title: 'Qté OUT', dataIndex: 'quantite_out', editable: true, inputType: 'number', sorter: (a,b) => a.quantite_out - b.quantite_out },
    { title: 'Qté IN', dataIndex: 'quantite_in', editable: true, inputType: 'number', sorter: (a,b) => a.quantite_in - b.quantite_in },
    {
      title: 'Action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type="primary" onClick={() => save(record.id_sortie_eam)}>Sauvegarder</Button>
            <Button onClick={cancel}>Annuler</Button>
          </Space>
        ) : (
          <Button onClick={() => edit(record)}>Éditer</Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        inputType: col.inputType,
      }),
    };
  });

  return (
    <Card bordered={false} style={{ borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <Title level={4} style={{ marginBottom: 0 }}>Historique des sorties EAM</Title>
        <Space wrap>
          <Tag color="blue"><strong>SMR REF :</strong> {eam || 'N/A'}</Tag>
          <Tag color="geekblue"><strong>PART :</strong> {part || 'N/A'}</Tag>
        </Space>
        {data?.[0]?.part_description && <Text type="secondary">{data[0].part_description}</Text>}
      </Space>

      <Divider />

      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          rowKey="id_sortie_eam"
          bordered
          loading={loading}
          dataSource={data}
          columns={mergedColumns}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          size="middle"
        />
      </Form>
    </Card>
  );
};

export default SortieByEam;
