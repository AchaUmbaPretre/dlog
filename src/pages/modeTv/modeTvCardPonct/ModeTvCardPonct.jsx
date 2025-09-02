import { useState, useEffect } from 'react';
import { Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './modeTvCardPonct.scss';

const ModeTvCardPonct = () => {
  const [data, setData] = useState({
    depart: 92,
    departTrend: 'up',
    retour: 85,
    retourTrend: 'down',
    usage: 76,
    usageTrend: 'up',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const depart = Math.min(100, Math.max(0, prev.depart + (Math.random() * 6 - 3)));
        const retour = Math.min(100, Math.max(0, prev.retour + (Math.random() * 6 - 3)));
        const usage = Math.min(100, Math.max(0, prev.usage + (Math.random() * 6 - 3)));

        return {
          depart: Math.round(depart),
          departTrend: depart >= prev.depart ? 'up' : 'down',
          retour: Math.round(retour),
          retourTrend: retour >= prev.retour ? 'up' : 'down',
          usage: Math.round(usage),
          usageTrend: usage >= prev.usage ? 'up' : 'down',
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tv_ponct_container">
      {/* Ponctualité Départ */}
      <div className="tv_card kpi_card departure">
        <h3>Ponctualité Départ</h3>
        <div className="tv_card_body">
          <span className="tv_value">{data.depart}%</span>
          <Progress 
            percent={data.depart} 
            strokeColor={data.depart >= 90 ? '#52c41a' : data.depart >= 75 ? '#faad14' : '#ff4d4f'} 
            trailColor="#e6e6e6" 
            strokeWidth={12} 
            showInfo={false} 
          />
          <div className={`tv_trend ${data.departTrend}`}>
            {data.departTrend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <span>{data.departTrend === 'up' ? 'En hausse' : 'En baisse'}</span>
          </div>
        </div>
      </div>

      {/* Ponctualité Retour */}
      <div className="tv_card kpi_card retour">
        <h3>Ponctualité Retour</h3>
        <div className="tv_card_body">
          <span className="tv_value">{data.retour}%</span>
          <Progress 
            percent={data.retour} 
            strokeColor={data.retour >= 90 ? '#52c41a' : data.retour >= 75 ? '#faad14' : '#ff4d4f'} 
            trailColor="#e6e6e6" 
            strokeWidth={12} 
            showInfo={false} 
          />
          <div className={`tv_trend ${data.retourTrend}`}>
            {data.retourTrend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <span>{data.retourTrend === 'up' ? 'En hausse' : 'En baisse'}</span>
          </div>
        </div>
      </div>

      {/* Utilisation du Parc */}
      <div className="tv_card kpi_card usage">
        <h3>Utilisation du Parc</h3>
        <div className="tv_card_body circle_card">
          <Progress 
            type="circle" 
            percent={data.usage} 
            strokeColor={data.usage >= 80 ? '#52c41a' : data.usage >= 50 ? '#faad14' : '#ff4d4f'} 
            trailColor="#e6e6e6" 
            width={120} 
            strokeWidth={10}
          />
          <span className="tv_value_circle">{data.usage}%</span>
          <div className={`tv_trend ${data.usageTrend}`}>
            {data.usageTrend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <span>{data.usageTrend === 'up' ? 'En hausse' : 'En baisse'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeTvCardPonct;
