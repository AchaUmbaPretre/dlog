import { useState, useEffect, useRef } from 'react'; // Ajoutez useRef
import { Card, Checkbox, Input, Space, Tag, Badge, Button, Typography, Tooltip, Divider, message } from 'antd';
import { 
  SearchOutlined, 
  CarOutlined, 
  CheckSquareOutlined, 
  CloseSquareOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  WifiOutlined,
  DashboardOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { VehicleAddress } from '../../../../../../utils/vehicleAddress';
import TimeFilter from './TimeFilter';
import { getEventHistory } from '../../../../../../services/rapportService';
import config from '../../../../../../config';

const { Text } = Typography;

const VehicleFilter = ({ vehicles, onFilterChange, onHistoryLoad }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyCache, setHistoryCache] = useState(new Map());
  const [isInitialized, setIsInitialized] = useState(false); // Ajouté
  const apiHash = config.api_hash;

  // INITIALISATION UNIQUE : Sélectionner tous les véhicules une seule fois
  useEffect(() => {
    if (!isInitialized && vehicles.length > 0) {
      const allIds = vehicles.map(v => v.id);
      setSelectedVehicles(allIds);
      onFilterChange(allIds);
      setSelectAll(true);
      setIsInitialized(true);
      console.log('✅ Initialisation unique: tous les véhicules sélectionnés');
    }
  }, [vehicles, onFilterChange, isInitialized]);

  // Mettre à jour selectAll quand selectedVehicles change (après initialisation)
  useEffect(() => {
    if (isInitialized && vehicles.length > 0) {
      setSelectAll(selectedVehicles.length === vehicles.length);
    }
  }, [selectedVehicles, vehicles, isInitialized]);

  // Filtrer les véhicules par recherche
  const filteredVehicles = vehicles.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

const fetchVehicleHistory = async (vehicle, dateRange = null) => {
  const cacheKey = `${vehicle.id}_${dateRange?.from || 'default'}_${dateRange?.to || 'default'}`;
  
  console.log(`🔍 fetchVehicleHistory appelé pour: ${vehicle.name} (ID: ${vehicle.id})`);
  
  if (historyCache.has(cacheKey)) {
    console.log(`💾 Utilisation du cache pour ${vehicle.name}, ${historyCache.get(cacheKey)?.length || 0} points`);
    if (onHistoryLoad) {
      onHistoryLoad(vehicle.id, historyCache.get(cacheKey));
    }
    return historyCache.get(cacheKey);
  }

  try {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const from = dateRange?.from || yesterday.toISOString().slice(0, 19).replace('T', ' ');
    const to = dateRange?.to || now.toISOString().slice(0, 19).replace('T', ' ');
    
    const params = {
      device_id: vehicle.id,
      from_date: from.split(' ')[0],
      from_time: from.split(' ')[1] || '00:00:00',
      to_date: to.split(' ')[0],
      to_time: to.split(' ')[1] || '23:59:59',
      lang: 'fr',
      limit: 1000,
      user_api_hash: apiHash
    };
    
    console.log(`📡 Appel API pour ${vehicle.name}`);
    
    const response = await getEventHistory(params);
    
    console.log(`📥 Réponse API reçue pour ${vehicle.name}`);
    
    // DÉCLARER positions AVANT de l'utiliser
    let positions = [];
    
    if (response?.data?.items && Array.isArray(response.data.items)) {
      console.log(`📊 ${response.data.items.length} éléments trouvés dans response.data.items`);
      
      for (const event of response.data.items) {
        if (event?.items && Array.isArray(event.items)) {
          for (const point of event.items) {
            if (point.lat && point.lng) {
              // Stocker comme tableau [lat, lng] pour Leaflet
              positions.push([parseFloat(point.lat), parseFloat(point.lng)]);
            }
          }
        }
      }
    }
    
    console.log(`📍 Positions extraites pour ${vehicle.name}: ${positions.length}`);
    
    if (positions.length > 0) {
      console.log(`📌 Première position: [${positions[0][0]}, ${positions[0][1]}]`);
      console.log(`📌 Dernière position: [${positions[positions.length-1][0]}, ${positions[positions.length-1][1]}]`);
    }
    
    setHistoryCache(prev => new Map(prev).set(cacheKey, positions));
    
    if (onHistoryLoad) {
      console.log(`📢 Appel de onHistoryLoad pour ${vehicle.name} avec ${positions.length} points`);
      onHistoryLoad(vehicle.id, positions);
    }
    
    return positions;
  } catch (error) {
    console.error('❌ Erreur lors du chargement de l\'historique:', error);
    message.error(`Impossible de charger l'historique pour ${vehicle.name}`);
    return [];
  }
};

  // Charger l'historique pour un véhicule sélectionné
  const loadHistoryForVehicle = async (vehicle, isSelected) => {
    if (isSelected) {
      setLoadingHistory(true);
      await fetchVehicleHistory(vehicle);
      setLoadingHistory(false);
    }
  };

  // Gérer la sélection d'un véhicule avec chargement de l'historique
  const handleVehicleSelect = async (vehicleId, checked) => {
    let newSelected;
    if (checked) {
      newSelected = [...selectedVehicles, vehicleId];
    } else {
      newSelected = selectedVehicles.filter(id => id !== vehicleId);
    }
    
    setSelectedVehicles(newSelected);
    onFilterChange(newSelected);
    
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle && checked) {
      console.log("Chargement historique pour:", vehicle.name);
      await loadHistoryForVehicle(vehicle, checked);
    }
  };

  // Sélectionner tous les véhicules
  const handleSelectAll = async (checked) => {
    if (checked) {
      const allIds = vehicles.map(v => v.id);
      setSelectedVehicles(allIds);
      onFilterChange(allIds);
      setSelectAll(true);
      
      message.info('Chargement des historiques en cours...');
      setLoadingHistory(true);
      
      for (const vehicle of vehicles) {
        await fetchVehicleHistory(vehicle);
      }
      
      setLoadingHistory(false);
      message.success('Historiques chargés');
    } else {
      setSelectedVehicles([]);
      onFilterChange([]);
      setSelectAll(false);
    }
  };

  // Recharger l'historique pour tous les véhicules sélectionnés
  const reloadAllHistories = async () => {
    if (selectedVehicles.length === 0) {
      message.warning('Aucun véhicule sélectionné');
      return;
    }
    
    setLoadingHistory(true);
    message.info(`Chargement de l'historique pour ${selectedVehicles.length} véhicule(s)...`);
    
    const selectedVehiclesList = vehicles.filter(v => selectedVehicles.includes(v.id));
    
    for (const vehicle of selectedVehiclesList) {
      await fetchVehicleHistory(vehicle);
    }
    
    setLoadingHistory(false);
    message.success('Historiques mis à jour');
  };

  // Compter les véhicules
  const activeCount = vehicles.filter(v => v.online === 'online').length;
  const movingCount = vehicles.filter(v => v.speed > 0).length;
  const alertCount = vehicles.filter(v => v.alarm === 1).length;

  return (
    <Card 
      size="small"
      title={
        <Space size={4}>
          <CarOutlined style={{ color: '#1890ff', fontSize: 14 }} />
          <span style={{ fontWeight: 600, fontSize: 13 }}>Filtre véhicules</span>
          <Badge count={selectedVehicles.length} showZero color="#1890ff" style={{ fontSize: 10 }} />
        </Space>
      }
      extra={
        <Tooltip title="Recharger les historiques">
          <Button
            type="text"
            size="small"
            icon={<HistoryOutlined style={{ fontSize: 12 }} />}
            onClick={reloadAllHistories}
            loading={loadingHistory}
            disabled={selectedVehicles.length === 0}
          />
        </Tooltip>
      }
      style={{ marginBottom: 12, borderRadius: 12 }}
      bodyStyle={{ padding: '12px' }}
    >
      {/* Actions rapides compactes */}
      <div style={{ 
        display: 'flex', 
        gap: 6, 
        marginBottom: 12,
        flexWrap: 'wrap'
      }}>
        {/* Bouton Tous */}
        <Tooltip title="Tous les véhicules">
          <Button
            size="small"
            style={{
              padding: '2px 8px',
              height: '26px',
              background: selectAll ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f5f5f5',
              border: 'none',
              color: selectAll ? 'white' : '#666',
              fontSize: 11,
              fontWeight: 500,
              borderRadius: 6
            }}
            onClick={() => handleSelectAll(!selectAll)}
          >
            <Space size={4}>
              <CarOutlined style={{ fontSize: 11 }} />
              <span>Tous</span>
              <span style={{ 
                backgroundColor: selectAll ? 'rgba(255,255,255,0.25)' : '#1890ff',
                padding: '0 4px',
                borderRadius: 10,
                fontSize: 10,
                color: 'white'
              }}>
                {vehicles.length}
              </span>
            </Space>
          </Button>
        </Tooltip>

        {/* Bouton En ligne */}
        <Tooltip title="Véhicules connectés">
          <Button
            size="small"
            style={{
              padding: '2px 8px',
              height: '26px',
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              color: '#52c41a',
              fontSize: 11,
              fontWeight: 500,
              borderRadius: 6
            }}
            onClick={async () => {
              const onlineIds = vehicles.filter(v => v.online === 'online').map(v => v.id);
              setSelectedVehicles(onlineIds);
              onFilterChange(onlineIds);
              
              setLoadingHistory(true);
              const onlineVehicles = vehicles.filter(v => v.online === 'online');
              for (const vehicle of onlineVehicles) {
                await fetchVehicleHistory(vehicle);
              }
              setLoadingHistory(false);
            }}
          >
            <Space size={4}>
              <WifiOutlined style={{ fontSize: 11 }} />
              <span>En ligne</span>
              <span style={{ 
                backgroundColor: '#52c41a',
                padding: '0 4px',
                borderRadius: 10,
                fontSize: 10,
                color: 'white'
              }}>
                {activeCount}
              </span>
            </Space>
          </Button>
        </Tooltip>

        {/* Bouton En mouvement */}
        <Tooltip title="Véhicules en déplacement">
          <Button
            size="small"
            style={{
              padding: '2px 8px',
              height: '26px',
              background: '#e6f7ff',
              border: '1px solid #91d5ff',
              color: '#1890ff',
              fontSize: 11,
              fontWeight: 500,
              borderRadius: 6
            }}
            onClick={async () => {
              const movingIds = vehicles.filter(v => v.speed > 0).map(v => v.id);
              setSelectedVehicles(movingIds);
              onFilterChange(movingIds);
              
              setLoadingHistory(true);
              const movingVehicles = vehicles.filter(v => v.speed > 0);
              for (const vehicle of movingVehicles) {
                await fetchVehicleHistory(vehicle);
              }
              setLoadingHistory(false);
            }}
          >
            <Space size={4}>
              <DashboardOutlined style={{ fontSize: 11 }} />
              <span>Mouvement</span>
              <span style={{ 
                backgroundColor: '#1890ff',
                padding: '0 4px',
                borderRadius: 10,
                fontSize: 10,
                color: 'white'
              }}>
                {movingCount}
              </span>
            </Space>
          </Button>
        </Tooltip>

        {/* Bouton Alertes */}
        <Tooltip title="Véhicules avec alertes">
          <Button
            size="small"
            style={{
              padding: '2px 8px',
              height: '26px',
              background: '#fff1f0',
              border: '1px solid #ffccc7',
              color: '#ff4d4f',
              fontSize: 11,
              fontWeight: 500,
              borderRadius: 6
            }}
            onClick={async () => {
              const alertIds = vehicles.filter(v => v.alarm === 1).map(v => v.id);
              setSelectedVehicles(alertIds);
              onFilterChange(alertIds);
              
              setLoadingHistory(true);
              const alertVehicles = vehicles.filter(v => v.alarm === 1);
              for (const vehicle of alertVehicles) {
                await fetchVehicleHistory(vehicle);
              }
              setLoadingHistory(false);
            }}
          >
            <Space size={4}>
              <AlertOutlined style={{ fontSize: 11 }} />
              <span>Alertes</span>
              <span style={{ 
                backgroundColor: '#ff4d4f',
                padding: '0 4px',
                borderRadius: 10,
                fontSize: 10,
                color: 'white'
              }}>
                {alertCount}
              </span>
            </Space>
          </Button>
        </Tooltip>
      </div>

      {/* Barre de recherche compacte */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <Input
            placeholder="Rechercher un véhicule..."
            prefix={<SearchOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, borderRadius: 6, fontSize: 12, height: 30 }}
            allowClear
            size="small"
        />
        <TimeFilter vehicles={vehicles} onTimeFilterChange={(ids) => {
            setSelectedVehicles(ids);
            onFilterChange(ids);
        }} />
      </div>

      {/* Actions globales compactes */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, justifyContent: 'space-between' }}>
        <Button 
          size="small" 
          icon={<CheckSquareOutlined style={{ fontSize: 11 }} />}
          onClick={() => handleSelectAll(true)}
          disabled={selectAll}
          loading={loadingHistory}
          style={{ fontSize: 11, height: 26, borderRadius: 6 }}
        >
          Tout sélectionner
        </Button>
        <Button 
          size="small" 
          icon={<CloseSquareOutlined style={{ fontSize: 11 }} />}
          onClick={() => handleSelectAll(false)}
          disabled={selectedVehicles.length === 0}
          style={{ fontSize: 11, height: 26, borderRadius: 6 }}
        >
          Tout désélectionner
        </Button>
      </div>

      <Divider style={{ margin: '8px 0 12px 0' }} />

      {/* Liste des véhicules compacte */}
      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {filteredVehicles.map(vehicle => {
          const hasAlarm = vehicle.sensors?.find(s => s.type === 'textual')?.value !== '-';
          const isSelected = selectedVehicles.includes(vehicle.id);
          
          return (
            <div 
              key={vehicle.id} 
              style={{ 
                padding: '8px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isSelected ? '#e6f7ff' : 'transparent',
                borderRadius: 6,
                marginBottom: 2
              }}
              onClick={() => handleVehicleSelect(vehicle.id, !isSelected)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Checkbox 
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleVehicleSelect(vehicle.id, e.target.checked);
                  }}
                  style={{ marginTop: 1 }}
                  size="small"
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Space size={6}>
                      <Text strong style={{ fontSize: 12 }}>{vehicle.name}</Text>
                      <Badge 
                        color={vehicle.online === 'online' ? '#52c41a' : '#faad14'}
                        status={vehicle.online === 'online' ? 'success' : 'warning'}
                      />
                      {isSelected && historyCache.has(`${vehicle.id}_default_default`) && (
                        <Tooltip title="Historique chargé">
                          <HistoryOutlined style={{ fontSize: 10, color: '#52c41a' }} />
                        </Tooltip>
                      )}
                    </Space>
                    <Tag color={vehicle.speed > 0 ? 'blue' : 'default'} style={{ margin: 0, fontSize: 10, padding: '0 6px', height: 18, lineHeight: '18px' }}>
                      {vehicle.speed} km/h
                    </Tag>
                  </div>
                  
                  <div style={{ fontSize: 10, color: '#8c8c8c', marginBottom: 4, display: 'flex', gap: 12 }}>
                    <span>{vehicle.online === 'online' ? '🟢 Connecté' : '🟡 ACK'}</span>
                    {vehicle.speed > 0 && <span>Déplacement</span>}
                  </div>
                  
                  <Tooltip title="Localisation">
                    <div style={{ 
                      fontSize: 10, 
                      color: '#1890ff',
                      marginBottom: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer'
                    }}>
                      <EnvironmentOutlined style={{ fontSize: 10 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <VehicleAddress record={vehicle} />
                      </span>
                    </div>
                  </Tooltip>
                  
                  <div style={{ 
                    fontSize: 9, 
                    color: '#b0b0b0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <ClockCircleOutlined style={{ fontSize: 9 }} />
                    {vehicle.time}
                  </div>
                  
                  {hasAlarm && (
                    <div style={{ marginTop: 4 }}>
                      <Tag color="orange" icon={<AlertOutlined />} style={{ fontSize: 9, padding: '0 6px', height: 18, lineHeight: '18px' }}>
                        {vehicle.sensors.find(s => s.type === 'textual')?.value}
                      </Tag>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <div style={{ textAlign: 'center', padding: 30, color: '#8c8c8c' }}>
          <CarOutlined style={{ fontSize: 24, marginBottom: 8 }} />
          <div style={{ fontSize: 12 }}>Aucun véhicule trouvé</div>
        </div>
      )}
    </Card>
  );
};

export default VehicleFilter;