import { Calendar } from 'antd';
import styled from 'styled-components';
import NextEvents from '../ui/Front/NextEvents';
import PosterCarousel from '../ui/Front/PosterCarousel';

const Container = styled.div`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ContainerBox = styled.div`
  width: 70%;
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`;

const CalendarWrapper = styled.div`
  width: 30%;
`;

export default function HomePage() {
  return (
    <Container>
      <PosterCarousel />
      <ContainerBox>
        <NextEvents />
        <CalendarWrapper>
          <Calendar />
        </CalendarWrapper>
      </ContainerBox>
    </Container>
  );
}
