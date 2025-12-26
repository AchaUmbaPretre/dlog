import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  InputNumber,
  Button,
  Space,
  notification,
  Card,
  Tag,
  Divider,
  Typography,
} from 'antd';
import { getSortieByEam, putSortieEam } from '../../../../../services/sortieEamFmp';

const { Title, Text} = Typography;
const EditableCell = ({
  editing,
  dataIndex,
  title,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Veuillez saisir ${title}`,
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const SortieByEam = ({ eam, part }) => {
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
      quantite_out: record.quantite_out,
      quantite_in: record.quantite_in,
    });
    setEditingKey(record.id_sortie_eam);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id_sortie_eam) => {
    try {
      const values = await form.validateFields();

      await putSortieEam({
        id_sortie_eam,
        ...values,
      });

      notification.success({
        message: 'Succès',
        description: 'Modification enregistrée',
      });

      setEditingKey('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'transanction_date',
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      title: 'Transaction #',
      dataIndex: 'transanction_num',
    },
    {
      title: 'Store',
      dataIndex: 'store_description',
    },
    {
      title: 'Qté OUT',
      dataIndex: 'quantite_out',
      editable: true,
    },
    {
      title: 'Qté IN',
      dataIndex: 'quantite_in',
      editable: true,
    },
    {
      title: 'Action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type="primary" onClick={() => save(record.id_sortie_eam)}>
              Sauvegarder
            </Button>
            <Button onClick={cancel}>Annuler</Button>
          </Space>
        ) : (
          <Button
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          >
            Éditer
          </Button>
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
      }),
    };
  });

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 12 }}
      bodyStyle={{ padding: 20 }}
    >
      {/* ===== HEADER / CONTEXTE ===== */}
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <Title level={4} style={{ marginBottom: 0 }}>
          Historique des sorties EAM
        </Title>

        <Space wrap>
          <Tag color="blue">
            <strong>SMR REF :</strong> {eam || 'N/A'}
          </Tag>
          <Tag color="geekblue">
            <strong>PART :</strong> {part || 'N/A'}
          </Tag>
        </Space>

        {data?.[0]?.part_description && (
          <Text type="secondary">
            {data[0].part_description}
          </Text>
        )}
      </Space>

      <Divider />

      {/* ===== TABLE ===== */}
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowKey="id_sortie_eam"
          bordered
          loading={loading}
          dataSource={data}
          columns={mergedColumns}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          size="middle"
        />
      </Form>
    </Card>
  );
};

export default SortieByEam;
