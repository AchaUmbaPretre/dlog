import './getEventLocalisation.scss'
import { useEffect, useState } from 'react';
import { Select, DatePicker } from 'antd';
import config from '../../../../../config';

const { RangePicker } = DatePicker;

const GetEventLocalisation = () => {
  const [dateRange, setDateRange] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const apiHash = config.api_hash;

  const fetchData = async() => {
    try {
        const { data } = axios.get(`http://falconeyesolutions.com/api/get_events?date_from=2025-09-28%2000:00:00&date_to=2025-09-29%2023:59:59&lang=fr&limit=1000&user_api_hash=${apiHash  }`)
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(()=> {
    fetchData()
  }, []);

  const column = [
    {
        title: '#', dataIndex:'id', key:'id', render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
        }, width: "4%",
    }
  ]

  return (
    <>
      <div className="event_container">
        <h2 className="title_event">Detail des événements</h2>
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
