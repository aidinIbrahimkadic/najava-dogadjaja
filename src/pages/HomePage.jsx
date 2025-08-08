import styled from 'styled-components';
import PosterCarousel from './PosterCarousel';

const Container = styled.div`
  background-color: var(--color-grey-50);
`;

export default function HomePage() {
  return (
    <Container>
      <PosterCarousel />
    </Container>
  );
}
