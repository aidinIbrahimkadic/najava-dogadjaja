import styled from 'styled-components';
import PosterCarousel from './PosterCarousel';

const Container = styled.div`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  max-width: 80%;
`;

export default function HomePage() {
  return (
    <Container>
      <Content>
        <PosterCarousel />
      </Content>
    </Container>
  );
}
