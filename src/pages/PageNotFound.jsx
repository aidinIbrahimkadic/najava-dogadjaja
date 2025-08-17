// PageNotFound.jsx
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { HiOutlineHome, HiOutlineArrowPathRoundedSquare } from 'react-icons/hi2';
import { FaSearch } from 'react-icons/fa';
import { useGetUpcomingEvents } from '../features/front/useUpcomingEvents';
import CalendarSpinner from '../ui/CalendarSpinner';
import { Page } from '../ui/Front/Page';
import { RightColumn } from '../ui/Front/RightColumn';
import { UpcomingEvents } from '../ui/Front/UpcomingEvents';
import { WeatherForecast3Day } from '../ui/Front/WeatherForecast3Day';
import Button from '../ui/Button';

const BRAND = '#f97316';
const TEXT = '#0f172a';

export default function PageNotFound() {
  const navigate = useNavigate();
  const { isLoading: isLoadingEvents, upcomingEvents } = useGetUpcomingEvents();

  const allEvents = (upcomingEvents || []).map((event) => {
    const startDate = new Date(event.start_date);
    const formatedDate =
      startDate.getFullYear() +
      '-' +
      String(startDate.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(startDate.getDate()).padStart(2, '0');

    const formattedTime =
      String(startDate.getHours()).padStart(2, '0') +
      ':' +
      String(startDate.getMinutes()).padStart(2, '0');

    return {
      id: event.idguid,
      title: event.title,
      price: isNaN(parseFloat(event?.cijena)) ? null : parseFloat(event.cijena),
      date: formatedDate,
      time: formattedTime,
      category: event?.category?.naziv ?? 'Kategorija',
      category_idguid: event?.category?.idguid,
      location: event?.lokacija?.naziv ?? 'Lokacija',
      institution: event?.institucija?.naziv ?? 'Organizator',
      institution_idguid: event?.institucija?.idguid,
    };
  });

  if (isLoadingEvents) return <CalendarSpinner />;

  return (
    <Page>
      <Main>
        <Badge404>404</Badge404>
        <Title>Stranica nije pronađena</Title>
        <Subtitle>
          Ups! Link koji ste otvorili ne postoji ili je premješten. Provjerite URL ili se vratite na
          početnu stranicu.
        </Subtitle>

        <Actions>
          <Button variation="primary" size="medium" as={Link} to="/">
            <HiOutlineHome />
            Na početnu
          </Button>

          <Button variation="secondary" size="medium" onClick={() => navigate(-1)}>
            <HiOutlineArrowPathRoundedSquare />
            Nazad
          </Button>
        </Actions>
      </Main>

      <RightColumn>
        <UpcomingEvents events={allEvents} />

        <WeatherForecast3Day />
      </RightColumn>
    </Page>
  );
}

/* —— Styled —— */

const Main = styled.section`
  background: linear-gradient(135deg, #fff, #fff8f1);
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  gap: 2rem;
  border: 1px solid #f3f4f6;
  border-radius: 1.25rem;
  padding: 10rem 2.25rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
`;

const Badge404 = styled.div`
  display: inline-block;
  font-weight: 800;
  font-size: 3.25rem;
  line-height: 1;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, ${BRAND}, #fb923c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Title = styled.h1`
  margin-top: 0.25rem;
  font-size: 1.75rem;
  color: ${TEXT};
`;

const Subtitle = styled.p`
  margin-top: 0.5rem;
  color: #475569;
  max-width: 52ch;
`;

const Actions = styled.div`
  margin-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.75rem 1.1rem;
  border-radius: 999px;
  font-weight: 600;
  border: 1px solid transparent;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  cursor: pointer;

  svg {
    font-size: 1.05rem;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: white;
  color: ${TEXT};
  border-color: #e5e7eb;

  &:hover {
    border-color: ${BRAND};
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  }
`;

const HintRow = styled.div`
  margin-top: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;

  svg {
    opacity: 0.85;
  }
`;
