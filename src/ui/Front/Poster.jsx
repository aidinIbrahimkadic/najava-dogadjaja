import React, { useState } from 'react';
import styled from 'styled-components';

const PosterImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  cursor: pointer; /* show hand cursor */
`;

const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const FullscreenImg = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

const StyledPoster = styled.div`
  grid-area: poster;

  @media (max-width: 980px) {
    position: static;
  }
  @media (max-width: 700px) {
    height: 400px;
    width: auto;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    object-fit: cover;
  }
  @media (max-width: 400px) {
    height: 300px;
    width: auto;
  }
`;

export default function Poster({ imageUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledPoster>
      <PosterImg src={imageUrl} alt="Poster" onClick={() => setIsOpen(true)} />
      {isOpen && (
        <FullscreenOverlay onClick={() => setIsOpen(false)}>
          <FullscreenImg src={imageUrl} alt="Poster fullscreen" />
        </FullscreenOverlay>
      )}
    </StyledPoster>
  );
}
