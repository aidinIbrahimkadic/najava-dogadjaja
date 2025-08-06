import React, { useState } from 'react';
import { FILE_URL } from '../utils/constants';
import styled from 'styled-components';
import { createPortal } from 'react-dom';

const ThumbnailWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin: 0.5rem;
  width: 'fit-content';
`;
const AdditionalWrapper = styled.div``;

const Thumbnail = styled.img`
  height: auto;
  width: 6rem;
  object-fit: cover;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -1rem;
  right: -1rem;
  background-color: #e3342f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 14px;
  cursor: pointer;
  line-height: 18px;
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

export const ImageCell = ({ slika, title, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!slika) return null;

  const thumbnailImage = `${FILE_URL}${slika}?width=60`;
  const fullImage = `${FILE_URL}${slika}?width=600`;

  return (
    <>
      <AdditionalWrapper>
        <ThumbnailWrapper>
          <Thumbnail
            src={thumbnailImage}
            alt={`Sličica od ${title}`}
            onClick={() => setIsOpen(true)}
          />
          {onRemove && (
            <RemoveButton onClick={onRemove} title="Ukloni sliku">
              ×
            </RemoveButton>
          )}
        </ThumbnailWrapper>
      </AdditionalWrapper>

      {isOpen &&
        createPortal(
          <Overlay
            onClick={(e) => {
              e.stopPropagation(); // 🚫 ne propagira dalje
              setIsOpen(false); // ✅ zatvori sliku
            }}
          >
            <FullImage
              src={fullImage}
              alt={`Originalna veličina fotografije ${title}`}
              onClick={(e) => e.stopPropagation()} // 🛑 spriječi da klik na sliku zatvori overlay
            />
          </Overlay>,
          document.body
        )}
    </>
  );
};
