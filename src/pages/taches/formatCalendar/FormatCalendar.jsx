import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getTache } from '../../../services/tacheService';
import { Spin, notification } from 'antd';

const localizer = momentLocalizer(moment);

const FormatCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTaches = useCallback(async () => {
    try {
      const response = await getTache();
      const formattedEvents = response.data.map((tache) => ({
        id: tache.id_tache,
        title: `${tache.nom_tache} - ${tache.description}`,
        start: new Date(tache.date_debut),
        end: new Date(tache.date_fin),
        status: tache.statut,
        client: tache.nom_client,
        frequency: tache.frequence,
        owner: tache.owner,
        city: tache.ville,
        department: tache.departement,
        control: tache.controle_de_base,
        days: tache.nbre_jour,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaches();
  }, [fetchTaches]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ height: '80vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default FormatCalendar;
