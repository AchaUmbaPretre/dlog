import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getControle } from '../../../services/controleService';
import { notification } from 'antd';

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

    // Fonction pour calculer les dates de début et de fin en fonction de la fréquence
    const calculateDates = (frequency) => {
        const today = moment().startOf('day');
        let startDate, endDate;

        switch (frequency) {
            case 'Quotidienne': // Daily
                startDate = moment(today); // Convertir en objet moment
                endDate = moment(today);   // Convertir en objet moment
                break;
            case 'Hebdomadaire': // Weekly
                startDate = moment(today).startOf('week'); // Convertir en objet moment
                endDate = moment(today).endOf('week');     // Convertir en objet moment
                break;
            case 'Mensuelle': // Monthly
                startDate = moment(today).startOf('month'); // Convertir en objet moment
                endDate = moment(today).endOf('month');     // Convertir en objet moment
                break;
            case 'Trimestrielle': // Quarterly
                startDate = moment(today).startOf('quarter'); // Convertir en objet moment
                endDate = moment(today).endOf('quarter');     // Convertir en objet moment
                break;
            default: // Autres fréquences spécifiques à un jour de la semaine
                const dayMapping = {
                    "Lundi": 1,
                    "Mardi": 2,
                    "Mercredi": 3,
                    "Jeudi": 4,
                    "Vendredi": 5,
                    "Samedi": 6,
                    "Dimanche": 0
                };
                const targetDay = moment().day(dayMapping[frequency]);

                if (today.day() > dayMapping[frequency]) {
                    startDate = moment().day(dayMapping[frequency] + 7); // Convertir en objet moment
                } else {
                    startDate = targetDay; // C'est déjà un objet moment
                }

                endDate = moment(startDate); // Convertir en objet moment
                break;
        }

        // Log pour déboguer
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);

        // Vérifiez si startDate et endDate sont des objets moment
        if (!moment.isMoment(startDate) || !moment.isMoment(endDate)) {
            console.error('Invalid dates:', startDate, endDate);
            return { startDate: null, endDate: null }; // Retourner des valeurs null pour les dates invalides
        }

        return { startDate, endDate };
    };

    // Convertir les données en événements pour le calendrier
    const events = data.map((item) => {
        const { startDate, endDate } = calculateDates(item.frequence);

        // Vérifiez si startDate et endDate sont des objets moment
        if (!moment.isMoment(startDate) || !moment.isMoment(endDate)) {
            console.error('Invalid dates:', startDate, endDate);
            return null; // Ignorer cet événement si les dates ne sont pas valides
        }

        return {
            id: item.id_controle,
            title: `${item.controle_de_base} - ${item.departement} - ${item.responsable}`,
            start: startDate.toDate(), // Convertir en objet Date pour react-big-calendar
            end: endDate.toDate(),     // Convertir en objet Date pour react-big-calendar
            allDay: true,
            client: item.nom_client,
            responsable: item.responsable,
        };
    }).filter(event => event !== null); // Filtrer les événements invalides

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
