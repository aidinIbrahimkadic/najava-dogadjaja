import React, { useRef } from 'react';
import styled from 'styled-components';
import { Calendar, Badge, Button } from 'antd';
import { HiOutlineCalendarDateRange } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import Heading from '../Heading';

const Square = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  display: flex;
  flex-direction: column;

  /* ——— Bez scrollbara u ćelijama: neka visina prati sadržaj ——— */
  .ant-picker-calendar-full .ant-picker-cell {
    vertical-align: top;
  }
  .ant-picker-calendar-date {
    height: auto !important; /* ukloni fiksnu visinu */
    padding-bottom: 6px;
  }
  .ant-picker-calendar-date-content {
    height: auto !important; /* neka raste s listom */
    max-height: none !important;
    overflow: visible !important; /* bez scrollbara */
    margin-top: 6px;
  }

  /* lista unutar ćelije */
  .events-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .events-list li {
    margin-bottom: 4px;
    line-height: 1.2;
  }
  .event-label {
    margin-left: 6px;
    font-size: 12px;
    color: #6b7280; /* muted */
    white-space: nowrap;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

export function EventsCalendar({ eventsByDate = {} }) {
  const ref = useRef(null);

  const cellRender = (value) => {
    const key = value.format('YYYY-MM-DD');
    const items = eventsByDate[key] || [];

    return (
      <div>
        <ul className="events-list">
          {items.map((e, idx) => (
            <li key={`${e.id}-${idx}`}>
              <Badge
                status="processing"
                text={
                  <>
                    <Link to={`/dogadjaj/${e.id}`}>{e.title}</Link>
                    {e.label && <span className="event-label">— {e.label}</span>}
                  </>
                }
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && ref.current) {
      await ref.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  return (
    <Square ref={ref}>
      <TitleRow>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <HiOutlineCalendarDateRange size={30} style={{ color: 'var(--color-brand-500)' }} />
          <Heading as="h2">Kalendar događaja</Heading>
        </div>
        <Button onClick={toggleFullscreen} type="default">
          Proširi preko cijelog ekrana
        </Button>
      </TitleRow>

      <div style={{ flex: 1, minHeight: 0 }}>
        <Calendar fullscreen cellRender={cellRender} />
      </div>
    </Square>
  );
}
