import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaClock, FaMoneyBillAlt, FaTicketAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { HiTicket } from 'react-icons/hi2';
import Heading from '../Heading';
import { BROJ_EVENATA_ZA_PRIKAZ } from '../../utils/constants';

const Card = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 1rem;
`;

const Title = styled.div`
  margin: 0 0 2rem 0;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  letter-spacing: 0.2px;
`;

const Ticket = styled.div`
  position: relative;
  background: linear-gradient(180deg, #ffffff 0%, #fcfcff 100%);
  border: 1px solid #eef2ff;
  border-radius: 16px;
  padding: 0.9rem 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.85rem;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background: #fbfdff;
    border: 1px solid #eef2ff;
    border-radius: 50%;
  }
  &::before {
    left: -8px;
  }
  &::after {
    right: -8px;
  }
`;

const TicketStripe = styled.div`
  width: 6px;
  height: 100%;
  background: linear-gradient(180deg, var(--color-brand-300) 0%, var(--color-brand-500) 100%);
  border-radius: 8px;
`;

const TicketTitle = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  a:hover {
    text-decoration: underline;
    color: #4f46e5;
  }
  ${(p) =>
    p.$cancelled
      ? `
    color: #991b1b;
    a {
      color: #991b1b;
      text-decoration: line-through;
      text-decoration-color: #ef4444;
      text-decoration-thickness: 2px;
    }
    a:hover {
      color: #991b1b;
      text-decoration: line-through;
      text-decoration-color: #ef4444;
      text-decoration-thickness: 2px;
    }
  `
      : ''}
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1rem;
  color: #52525b;
  font-size: 1rem;
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const DateHeader = styled.div`
  margin: 1rem 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #374151;
  font-weight: 600;
`;

function ymd(d) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function formatDateLabel(isoYmd) {
  const d = new Date(`${isoYmd}T00:00:00`);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const weekdayRaw = new Intl.DateTimeFormat('bs-BA', { weekday: 'long' }).format(d);
  const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1);
  return `${dd}.${mm}.${yyyy} - ${weekday}`;
}

function fmtDateHuman(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function timeHM(dateStr, timeStr) {
  try {
    const d = new Date(`${dateStr}T${timeStr || '00:00'}:00`);
    return new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
  } catch {
    return timeStr || '';
  }
}

// Label za prikaz u redu karte:
// - višednevni: "DD.MM.YYYY – DD.MM.YYYY"
// - jednokratni: samo vrijeme (iz starta)
function labelForRow(base) {
  if (base._isMultiDay) {
    const s = new Date(`${base.date}T${base.time || '00:00'}:00`);
    const e = new Date(`${base.end_date}T${base.end_time || '23:59'}:00`);
    return `${fmtDateHuman(s)} – ${fmtDateHuman(e)}`;
  }
  return timeHM(base.date, base.time);
}

export function UpcomingEvents({ events = [] }) {
  // Ekspanzija u "instancije" po danu:
  // - višednevni → jedna instanca po svakom budućem danu (dok ne istekne)
  // - više termina → svaka buduća stavka iz `termini` kao posebna instanca
  // - jednokratni → ako je start u budućnosti, jedna instanca
  const flat = useMemo(() => {
    if (!events.length) return [];
    const now = new Date();
    const today0 = startOfDay(now);
    const tomorrow0 = addDays(today0, 1); // "samo buduće dane" → od sutra nadalje

    const out = [];

    for (const e of events) {
      const hasMultiTerms =
        Boolean(e.ima_vise_termina) && Array.isArray(e.termini) && e.termini.length > 0;

      if (hasMultiTerms) {
        // Svaki budući termin -> posebna instanca; koristi start_date termina
        for (const t of e.termini) {
          if (!t?.start_date) continue;
          const s = new Date(t.start_date);
          if (s <= now) continue; // samo buduće

          const dayKey = ymd(startOfDay(s));
          out.push({
            ...e,
            // per-termin otkazano (ako je otkazan termin ili cijeli event)
            otkazano: !!t?.otkazano || !!e?.otkazano,

            // group po danu prikaza
            _dayKey: dayKey,

            // za prikaz vremena/reda
            date: ymd(s), // "YYYY-MM-DD"
            time: `${String(s.getHours()).padStart(2, '0')}:${String(s.getMinutes()).padStart(2, '0')}`,
            _isMultiDay: false, // ovo je konkretan termin
            // koristimo originalni e.id (link vodi na isti event)
          });
        }
        continue;
      }

      // Jedan raspon (single ili multi-day)
      const s = e._startISO ? new Date(e._startISO) : new Date(`${e.date}T${e.time || '00:00'}:00`);
      const eEnd = e._endISO
        ? new Date(e._endISO)
        : new Date(`${e.end_date || e.date}T${e.end_time || '23:59'}:00`);

      const sDay = startOfDay(s);
      const eDay = startOfDay(eEnd);

      const isMultiDay =
        sDay.getFullYear() !== eDay.getFullYear() ||
        sDay.getMonth() !== eDay.getMonth() ||
        sDay.getDate() !== eDay.getDate();

      if (isMultiDay) {
        // dodaj po danu, ali samo buduće dane (>= sutra 00:00)
        let cursor = sDay < tomorrow0 ? tomorrow0 : sDay; // počni od sutra ili startDay, šta je kasnije
        while (cursor <= eDay) {
          const dayKey = ymd(cursor);
          out.push({
            ...e,
            _dayKey: dayKey, // dan u kojem ga prikazujemo
            _isMultiDay: true,
            // za label koristimo originalni raspon; ali `date`/`time` možemo ostaviti iz originalnog starta
          });
          cursor = addDays(cursor, 1);
        }
      } else {
        // jednokratni → samo ako je start u budućnosti (strogo)
        if (s > now) {
          const dayKey = ymd(startOfDay(s));
          out.push({
            ...e,
            _dayKey: dayKey,
            _isMultiDay: false,
          });
        }
      }
    }

    // Sort: po danu, pa po početnom vremenu (ako ima)
    out.sort((a, b) => {
      if (a._dayKey !== b._dayKey) return a._dayKey.localeCompare(b._dayKey);
      // ako su oba "termina", poredi po konkretnom vremenu
      const aTime = a.time || '00:00';
      const bTime = b.time || '00:00';
      return aTime.localeCompare(bTime);
    });

    // uzmi prvih 5 instanci
    return out.slice(0, BROJ_EVENATA_ZA_PRIKAZ);
  }, [events]);

  // Grupisanje po danu prikaza (_dayKey)
  const groups = useMemo(() => {
    const map = new Map();
    for (const row of flat) {
      const key = row._dayKey;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [flat]);

  return (
    <Card>
      <Title>
        <HiTicket style={{ color: 'var(--color-brand-500)' }} />
        <Heading as="h3">Predstojeći događaji</Heading>
      </Title>

      {groups.length === 0 && <div>Nema predstojećih događaja.</div>}

      {groups.map(([dayKey, items]) => (
        <div key={dayKey}>
          <DateHeader>
            <FaTicketAlt /> {formatDateLabel(dayKey)}
          </DateHeader>

          <div style={{ display: 'grid', gap: '0.8rem' }}>
            {items.map((e) => (
              <Ticket key={`${e.id}-${e._dayKey}-${e.time || 'xx'}`}>
                <TicketStripe />
                <div>
                  {/* <TicketTitle>
                    <Link to={`/dogadjaj/${e.id}`}>{e.title}</Link>
                  </TicketTitle> */}
                  <TicketTitle $cancelled={!!e.otkazano}>
                    <Link to={`/dogadjaj/${e.id}`}>{e.title}</Link>
                  </TicketTitle>
                  <Meta>
                    <MetaItem>
                      <FaClock /> {labelForRow(e)}
                    </MetaItem>

                    {e.price != null && Number.isFinite(e.price) && (
                      <MetaItem>
                        <FaMoneyBillAlt /> {e.price === 0 ? 'Besplatno' : `${e.price} KM`}
                      </MetaItem>
                    )}

                    {e.location && (
                      <MetaItem>
                        <FaMapMarkerAlt /> {e.location}
                      </MetaItem>
                    )}
                  </Meta>
                </div>

                <div />
              </Ticket>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}
