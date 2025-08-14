import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaClock, FaMoneyBillAlt, FaTicketAlt } from 'react-icons/fa';
import { Calendar, Badge } from 'antd';
import { Link } from 'react-router-dom';
import { HiTicket } from 'react-icons/hi2';
import Heading from '../Heading';

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

  &:hover {
    text-decoration: underline;
    color: #4f46e5;
  }
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

const Square = styled(Card)`
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

function formatDateLabel(isoDate) {
  const d = new Date(isoDate);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const weekdayRaw = new Intl.DateTimeFormat('bs-BA', { weekday: 'long' }).format(d);
  const weekday = weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1);
  return `${dd}.${mm}.${yyyy} - ${weekday}`;
}

function timeHM(dateStr, timeStr) {
  try {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    return new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
  } catch {
    return timeStr;
  }
}

export function UpcomingEvents({ events = [] }) {
  const upcoming = useMemo(() => {
    if (!events.length) return [];
    return [...events]
      .sort((a, b) => new Date(`${a.date}T${a.time}:00`) - new Date(`${b.date}T${b.time}:00`))
      .slice(0, 5);
  }, [events]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const e of upcoming) {
      const key = e.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [upcoming]);

  return (
    <Card>
      <Title>
        <HiTicket style={{ color: 'var(--color-brand-500)' }} />
        <Heading as="h3">Predstojeći događaji</Heading>
      </Title>
      {groups.length === 0 && <div>Nema predstojećih događaja.</div>}
      {groups.map(([dateKey, items]) => (
        <div key={dateKey}>
          <DateHeader>
            <FaTicketAlt /> {formatDateLabel(dateKey)}
          </DateHeader>
          <div style={{ display: 'grid', gap: '0.8rem' }}>
            {items.map((e) => (
              <Ticket key={e.id}>
                <TicketStripe />
                <div>
                  <TicketTitle>
                    <Link to={`/dogadjaj/${e.id}`}>{e.title}</Link>
                  </TicketTitle>
                  <Meta>
                    <MetaItem>
                      <FaClock /> {timeHM(e.date, e.time)}
                    </MetaItem>
                    {e.price != null && (
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

export function EventsCalendar({ eventsByDate = {} }) {
  const dateCellRender = (value) => {
    const key = value.format('YYYY-MM-DD');
    const items = eventsByDate[key] || [];
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((e) => (
          <li key={e.id} style={{ marginBottom: 4 }}>
            <Badge status="processing" text={e.title} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Square>
      <Title>📅 Kalendar događaja</Title>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Calendar
          fullscreen={true}
          cellRender={(current, info) => {
            if (info.type === 'date') return dateCellRender(current);
            return info.originNode;
          }}
        />
      </div>
    </Square>
  );
}
