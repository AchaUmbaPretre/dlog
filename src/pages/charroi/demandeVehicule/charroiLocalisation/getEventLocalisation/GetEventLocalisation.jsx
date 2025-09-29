import './getEventLocalisation.scss'
import { useEffect, useState } from 'react';
import { Select, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const GetEventLocalisation = () => {
  const [dateRange, setDateRange] = useState([]);

  return (
    <>
      <div className="event_container">
        <div className="event_wrapper">
          <div className="event_top">
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
              allowClear
              // ✅ Affiche les heures + minutes
              showTime={{ format: 'HH:mm' }}
              format="DD/MM/YYYY HH:mm"
              placeholder={['Date et heure début', 'Date et heure fin']}
            />
          </div>
          <div className="event_bottom">
            {/* Tu pourras afficher la sélection ici */}
          </div>
        </div>
      </div>
    </>
  );
};

export default GetEventLocalisation;
