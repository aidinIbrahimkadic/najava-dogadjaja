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
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function HomePage() {
  return (
    <Container>
      <PosterCarousel />
      <ContainerBox>
        <NextEvents />
      </ContainerBox>
    </Container>
  );
}
