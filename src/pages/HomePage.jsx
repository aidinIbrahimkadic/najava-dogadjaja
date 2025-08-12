import styled from 'styled-components';
import AllEvents from '../ui/Front/AllEvents';
import CategorySubscriptions from '../ui/Front/CategorySubscriptions';
import LogoSlider from '../ui/Front/LogoSlider';
import NextEvents from '../ui/Front/NextEvents';
import PosterCarousel from '../ui/Front/PosterCarousel';

const Container = styled.div`
  background-color: #fbfdff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ContainerBox = styled.div`
  width: 80%;
  display: flex;
  gap: 2rem;
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
      <AllEvents />
      <LogoSlider />
      <CategorySubscriptions
        isAuthenticated={true}
        initialSelectedIds={['kultura', 'film']}
        onSave={async (ids) => {
          // npr. await fetch('/api/me/subscriptions', { method: 'POST', body: JSON.stringify({ categories: ids })})
          console.log('Spremam na backend:', ids);
        }}
      />
    </Container>
  );
}
