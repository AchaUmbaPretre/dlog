import React, { useEffect, useState } from 'react';
import { Table, InputNumber, Button, Space, notification } from 'antd';
import { getSortieByEam, putSortieEam } from '../../../../../services/sortieEamFmp';

const SortieByEam = ({ eam, part }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  useEffect(() => {
    fetchData();
  }, [eam, part]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getSortieByEam(eam, part);
      setData(res?.data?.data || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de récupérer les données',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  const isEditing = (record) => record.id_sortie_eam === editingKey;

  const edit = (record) => {
    setEditingKey(record.id_sortie_eam);
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const save = async (record) => {
    try {
      await putSortieEam({
        id_sortie_eam: record.id_sortie_eam,
        quantite_out: record.quantite_out,
        quantite_in: record.quantite_in,
      });

      notification.success({
        message: 'Succès',
        description: 'EAM modifié avec succès',
        placement: 'topRight',
      });

      setEditingKey(null);
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Échec de la mise à jour',
      });
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
      title: 'Quantité OUT',
      dataIndex: 'quantite_out',
      render: (_, record) =>
        isEditing(record) ? (
          <InputNumber
            value={record.quantite_out}
            onChange={(value) => {
              const newData = [...data];
              const index = newData.findIndex(
                (item) => item.id_sortie_eam === record.id_sortie_eam
              );
              newData[index].quantite_out = value;
              setData(newData);
            }}
          />
        ) : (
          record.quantite_out
        ),
    },
    {
      title: 'Quantité IN',
      dataIndex: 'quantite_in',
      render: (_, record) =>
        isEditing(record) ? (
          <InputNumber
            value={record.quantite_in}
            onChange={(value) => {
              const newData = [...data];
              const index = newData.findIndex(
                (item) => item.id_sortie_eam === record.id_sortie_eam
              );
              newData[index].quantite_in = value;
              setData(newData);
            }}
          />
        ) : (
          record.quantite_in
        ),
    },
    {
      title: 'Action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type="primary" onClick={() => save(record)}>
              Enregistrer
            </Button>
            <Button onClick={cancel}>Annuler</Button>
          </Space>
        ) : (
          <Button onClick={() => edit(record)} disabled={editingKey !== null}>
            Éditer
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id_sortie_eam"
      columns={columns}
      dataSource={data}
      loading={loading}
      bordered
      size="middle"
    />
  );
};

export default SortieByEam;
