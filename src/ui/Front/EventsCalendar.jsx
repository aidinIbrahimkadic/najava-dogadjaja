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
  overflow: hidden;
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
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((e) => (
          <li key={e.id} style={{ marginBottom: 4 }}>
            <Badge status="processing" text={<Link to={`/dogadjaj/${e.id}`}>{e.title}</Link>} />
          </li>
        ))}
      </ul>
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
        <div style={{ display: 'flex ', gap: '1rem', alignItems: 'center' }}>
          <HiOutlineCalendarDateRange size={30} style={{ color: 'var(--color-brand-500)' }} />
          <Heading as="h2">Kalendar događaja</Heading>
        </div>
        <Button onClick={toggleFullscreen} type="default">
          Proširi preko cijelog ekrana
        </Button>
      </TitleRow>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Calendar fullscreen={true} cellRender={cellRender} />
      </div>
    </Square>
  );
}
