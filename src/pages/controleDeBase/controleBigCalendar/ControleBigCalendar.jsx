import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getControle } from '../../../services/controleService';
import { notification } from 'antd'; // Assurez-vous d'avoir installé Ant Design pour utiliser les notifications

const ControleBigCalendar = () => {
    const [data, setData] = useState([]);
    const localizer = momentLocalizer(moment);

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
          }
        };

        fetchData();
    }, []);

    // Mapping des jours de la semaine en anglais pour moment.js
    const dayMapping = {
        "Lundi": "Monday",
        "Mardi": "Tuesday",
        "Mercredi": "Wednesday",
        "Jeudi": "Thursday",
        "Vendredi": "Friday",
        "Samedi": "Saturday",
        "Dimanche": "Sunday"
    };

    // Fonction pour calculer la prochaine date à partir de la fréquence
    const getNextDate = (dayOfWeek) => {
        const today = moment().startOf('day');
        const targetDay = moment().day(dayMapping[dayOfWeek]);

        if (today.isAfter(targetDay)) {
            targetDay.add(1, 'week');
        }

        return targetDay.toDate();
    };

    // Convertir les données en événements pour le calendrier
    const events = data.map((item) => {
        const startDate = getNextDate(item.frequence); // Calcule la date à partir de la fréquence

        return {
            id: item.id_controle,
            title: `${item.controle_de_base} - ${item.departement}`,
            start: startDate,
            end: startDate,
            allDay: true,
            client: item.nom_client,
            responsable: item.responsable,
        };
    });

    return (
        <>
            <div className="calendar" style={{ height: '500px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                />
            </div>
        </>
    );
};

export default ControleBigCalendar;
