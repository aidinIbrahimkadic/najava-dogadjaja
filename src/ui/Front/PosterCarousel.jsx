import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { EyeOutlined, HeartOutlined } from '@ant-design/icons';

const CarouselWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 2rem 0;
  cursor: ${(props) => (props.$dragging ? 'grabbing' : 'grab')};
`;

const CarouselContent = styled.div`
  display: flex;
  gap: 2rem;
`;

const PosterCard = styled.div`
  position: relative;
  flex: 0 0 210px;
  width: 210px;
  height: 297px;
  background-image: url(${(props) => props.$image});
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  overflow: hidden;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  filter: brightness(${(props) => (props.$dimmed ? 0.7 : 1)});
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
  &:hover {
    transform: scale(1.05);
    filter: brightness(1);
    z-index: 10;
  }
`;

const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  align-items: center;

  ${PosterCard}:hover & {
    opacity: 1;
  }
`;

const PosterButton = styled(Button)`
  background-color: var(--color-grey-0) !important;
  color: var(--color-brand-700) !important;
  /* border: 1px solid var(--color-brand-700); */
  border: none;
  border-radius: 5rem;
  width: 15rem;
  height: 4rem;

  &:hover {
    background-color: var(--color-brand-700) !important;
    color: var(--color-grey-0) !important;
    /* border: var(--color-brand-700); */
  }
`;

export default function PosterCarousel() {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const draggingRef = useRef(false);
  const dragStartX = useRef(0);
  const scrollStart = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  // Tvoji posteri (A4 format), dupliramo niz radi seamless loopa
  const posters = [
    '/images/poster.jpg',
    '/images/poster1.jpg',
    '/images/poster2.jpg',
    '/images/poster3.jpg',
    '/images/poster4.jpg',
    '/images/poster6.jpg',
  ];

  useEffect(() => {
    const container = containerRef.current;
    const speed = 0.5; // px po frame (usporeno)

    function step() {
      if (!isPaused && !draggingRef.current) {
        container.scrollLeft += speed;
        // kad prijeđeš polovinu sadržaja, vrati se na početak
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft -= container.scrollWidth / 2;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused]);

  // Hover pauza
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Drag logika
  const handleMouseDown = (e) => {
    draggingRef.current = true;
    dragStartX.current = e.pageX;
    scrollStart.current = containerRef.current.scrollLeft;
    setIsPaused(true);
  };
  const handleMouseUp = () => {
    draggingRef.current = false;
    setIsPaused(false);
  };
  const handleMouseMove = (e) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    const delta = e.pageX - dragStartX.current;
    containerRef.current.scrollLeft = scrollStart.current - delta;
  };

  return (
    <CarouselWrapper
      ref={containerRef}
      $dragging={draggingRef.current}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <CarouselContent>
        {[...posters, ...posters, ...posters, ...posters, ...posters].map((img, idx) => (
          <PosterCard
            key={idx}
            $image={img}
            // dimujemo samo prvu i zadnju sliku iz originalnog seta
            $dimmed={idx % posters.length === 0 || idx % posters.length === posters.length - 1}
          >
            <Overlay>
              <PosterButton icon={<EyeOutlined />}>Više</PosterButton>
              <PosterButton icon={<HeartOutlined />}>Dolazim</PosterButton>
            </Overlay>
          </PosterCard>
        ))}
      </CarouselContent>
    </CarouselWrapper>
  );
}
