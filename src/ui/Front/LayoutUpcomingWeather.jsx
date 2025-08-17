import React from 'react';
import { UpcomingEvents } from './UpcomingEvents';
import { EventsCalendar } from './EventsCalendar';
import { WeatherForecast3Day } from './WeatherForecast3Day';
import { Page } from './Page';
import { RightColumn } from './RightColumn';

export default function LayoutUpcomingWeather({ upcomingEvents }) {
  const allEvents = (upcomingEvents || []).map((event) => {
    const start = new Date(event.start_date);
    const end = event.end_date ? new Date(event.end_date) : new Date(event.start_date);

    const pad = (n) => String(n).padStart(2, '0');

    const dateStr = [start.getFullYear(), pad(start.getMonth() + 1), pad(start.getDate())].join(
      '-'
    );
    const timeStr = [pad(start.getHours()), pad(start.getMinutes())].join(':');

    const endDateStr = [end.getFullYear(), pad(end.getMonth() + 1), pad(end.getDate())].join('-');
    const endTimeStr = [pad(end.getHours()), pad(end.getMinutes())].join(':');

    return {
      id: event.idguid,
      title: event.title,
      price: Number.isFinite(parseFloat(event.cijena)) ? parseFloat(event.cijena) : null,
      date: dateStr,
      time: timeStr,
      end_date: endDateStr,
      end_time: endTimeStr,
      category: event.category?.naziv,
      category_idguid: event.category?.idguid,
      location: event.lokacija?.naziv,
      institution: event.institucija?.naziv,
      institution_idguid: event.institucija?.idguid,
      ima_vise_termina: !!event.ima_vise_termina,
      termini: Array.isArray(event.termini) ? event.termini : [],
      // originalni ISO za računanje u child komponentama
      _startISO: event.start_date,
      _endISO: event.end_date || event.start_date,
    };
  });

  const eventsByDate = toEventsByDate(allEvents);

  return (
    <Page>
      <EventsCalendar eventsByDate={eventsByDate} />
      <RightColumn>
        <UpcomingEvents events={allEvents} />
        <WeatherForecast3Day />
      </RightColumn>
    </Page>
  );
}

function toEventsByDate(events) {
  const map = {};

  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
  const timeHM = (d) =>
    new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);

  const push = (key, item) => {
    if (!map[key]) map[key] = [];
    map[key].push(item);
  };

  for (const e of events) {
    const hasMultiTerms =
      Boolean(e.ima_vise_termina) && Array.isArray(e.termini) && e.termini.length > 0;

    if (hasMultiTerms) {
      // Svaki termin ide kao stavka na dan njegovog starta (label = vrijeme starta)
      for (const t of e.termini) {
        if (!t?.start_date) continue;
        const s = new Date(t.start_date);
        push(ymd(s), { id: e.id, title: e.title, label: timeHM(s) });
      }
      continue;
    }

    // Jedan event (može biti višednevni)
    const start = e._startISO
      ? new Date(e._startISO)
      : new Date(`${e.date}T${e.time || '00:00'}:00`);
    const end = e._endISO
      ? new Date(e._endISO)
      : new Date(
          `${e.end_date || e.date}T${
            e.end_date && e.end_date !== e.date ? '23:59' : e.end_time || e.time || '23:59'
          }:00`
        );

    const sDay = new Date(start);
    sDay.setHours(0, 0, 0, 0);
    const eDay = new Date(end);
    eDay.setHours(0, 0, 0, 0);

    const isMultiDay = sDay.getTime() !== eDay.getTime();
    const label = isMultiDay ? null : timeHM(start); // ⟵ nema labela za višednevne!

    // Proširi kroz sve dane raspona (inkluzivno)
    for (let cur = new Date(sDay); cur <= eDay; cur.setDate(cur.getDate() + 1)) {
      const entry = { id: e.id, title: e.title };
      if (label) entry.label = label;
      push(ymd(cur), entry);
    }
  }

  return map;
}
