import React, { useState } from 'react';
import { FILE_URL } from '../utils/constants';
import styled from 'styled-components';

const Thumbnail = styled.img`
  height: 6rem;
  width: 6rem;
  object-fit: cover;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const FullImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
`;

export const ImageCell = ({ slika, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const imageUrl = `${FILE_URL}${slika}`;

  return (
    <>
      <Thumbnail src={imageUrl} alt={`Sličica od ${title}`} onClick={() => setIsOpen(true)} />

      {isOpen && (
        <Overlay onClick={() => setIsOpen(false)}>
          <FullImage src={imageUrl} alt={`Originalna veličina fotografije ${title}`} />
        </Overlay>
      )}
    </>
  );
};
