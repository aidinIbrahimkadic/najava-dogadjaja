import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { WiDaySunny, WiRain, WiCloudy } from 'react-icons/wi';

const WeatherGrid = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  /* display: grid;
  grid-template-columns: repeat(3, 1fr); */
  gap: 0.8rem;
`;

const WeatherCard = styled.div`
  border: 1px solid #eef2ff;
  border-radius: 14px;
  padding: 0.9rem;
  display: grid;
  gap: 0.4rem;
  text-align: center;
`;

const TitleW = styled.h2`
  margin: 0 0 0.75rem 0;
`;

const Day = styled.div`
  font-weight: 600;
`;

const Temp = styled.div`
  font-size: 1.1rem;
`;

function codeToIcon(code) {
  // Simplified mapping
  if ([0, 1].includes(code)) return <WiDaySunny size={36} />;
  if ([2, 3].includes(code)) return <WiCloudy size={36} />;
  // rain/snow codes
  return <WiRain size={36} />;
}

export function WeatherForecast3Day() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tešanj approx coords
    const lat = 44.6119;
    const lon = 17.9855;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=Europe%2FSarajevo`;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        const data = await res.json();
        const out = data.daily.time.map((dateISO, i) => ({
          dateISO,
          tmax: data.daily.temperature_2m_max[i],
          tmin: data.daily.temperature_2m_min[i],
          code: data.daily.weathercode[i],
        }));
        setDays(out);
      } catch (e) {
        console.log(e);
        setError('Greška pri preuzimanju prognoze');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDay = (iso) =>
    new Intl.DateTimeFormat('bs-BA', { weekday: 'short' }).format(new Date(iso));

  return (
    <WeatherGrid>
      <div>
        <TitleW>☀️ Vremenska prognoza</TitleW>
      </div>
      <div>
        {loading && <div>Učitavanje...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && (
          <div style={{ display: 'contents' }}>
            {days.map((d, idx) => (
              <WeatherCard key={idx}>
                <Day>{idx === 0 ? 'Danas' : idx === 1 ? 'Sutra' : formatDay(d.dateISO)}</Day>
                <div>{codeToIcon(d.code)}</div>
                <Temp>
                  {Math.round(d.tmin)}° / {Math.round(d.tmax)}°C
                </Temp>
              </WeatherCard>
            ))}
          </div>
        )}
      </div>
    </WeatherGrid>
  );
}
