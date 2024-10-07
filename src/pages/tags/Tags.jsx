import React, { useEffect, useState } from 'react';
import { Input, notification, Table, Typography } from 'antd';
import { getSearch } from '../../services/tacheService';

const { Search } = Input;
const { Text } = Typography;

const Tags = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getSearch(searchValue);
        setResults(response.data);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (searchValue) {
      fetchData(); // N'appelle fetchData que si searchValue n'est pas vide
    } else {
      setResults([]); // Réinitialiser les résultats si la recherche est vide
    }
  }, [searchValue]);

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => <Text>{highlightText(text)}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <Text>{highlightText(text)}</Text>,
    },
  ];
  

  const highlightText = (text) => {
    // Vérifiez si le texte est défini et est une chaîne de caractères
    if (!text || typeof text !== 'string') return text; // Ne pas surligner si le texte est vide ou non valide
  
    if (!searchValue) return text; // Ne pas surligner si la recherche est vide
  
    const regex = new RegExp(`(${searchValue})`, 'gi'); // Crée une expression régulière pour le terme de recherche
    const parts = text.split(regex); // Divise le texte en parties
    return parts.map((part, index) => 
      regex.test(part) ? (
        <Text key={index} style={{ backgroundColor: 'yellow' }}>{part}</Text>
      ) : (
        part
      )
    );
  };
  

  return (
    <div>
      <Search
        placeholder="Rechercher..."
        onChange={(e) => setSearchValue(e.target.value)} 
        style={{ marginBottom: 20 }}
      />
      <Table
        dataSource={results}
        columns={columns}
        rowKey="id_tache" // Assurez-vous que le champ de la clé primaire correspond à votre structure
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default Tags;
