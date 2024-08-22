import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getControle } from '../../../services/controleService';

const ControleBigCalendar = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getControle();
            setData(response.data);
          } catch (error) {
            notification.error({
              message: 'Erreur de chargement',
              description: 'Une erreur est survenue lors du chargement des données.',
            });
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [DOMAIN]);

  return (
    <>
        <div className="calendar">

        </div>
    </>
  )
}

export default ControleBigCalendar