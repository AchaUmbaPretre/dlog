import { Card, Divider, Tabs } from 'antd'
import { useState } from 'react';

const Performance_op = () => {
  const [data, setData] = useState([]);
  
  return (
    <>
      <div className="rapport_bs">
        <div className="rapport_bs_wrapper">
          <Card  type="inner" title="Performance opérationnelle" className="rapport_bs_globals">
            <div className="rapport_bs_global">
              <Card type="inner" title="Nombre moyen de sorties par véhicule">
                  
              </Card>

              <Card type="inner" title="Nombre moyen de sorties par chauffeur">
                  
              </Card>

              <Card type="inner" title="Durée moyenne d’une course">
                  
              </Card>

              <Card type="inner" title="Durée totale cumulée des courses">
                  
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Performance_op