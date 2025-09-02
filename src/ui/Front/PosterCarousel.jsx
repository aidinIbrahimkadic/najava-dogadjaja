import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL } from '../../utils/constants';
import { useGetManifestationById } from '../../features/front/useManifestationById';

const CarouselWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 2rem 0;
  margin-bottom: 4rem;
  cursor: ${(props) => (props.$dragging ? 'grabbing' : 'grab')};
`;

const CarouselContent = styled.div`
  display: flex;
  gap: 2rem;
`;

const PosterCard = styled.div`
  position: relative;
  flex: 0 0 auto;
  width: 210px;
  aspect-ratio: 3 / 4;
  background-image: url(${(props) => props.$image});
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    filter 0.3s ease,
    opacity 0.3s ease;

  /* lagani vizualni signal za otkazano */
  ${(p) =>
    p.$cancelled &&
    `
      filter: grayscale(0.5) brightness(0.85);
    `}

  &:hover {
    transform: scale(1.05);
    filter: brightness(1);
    z-index: 10;
  }

  @media (max-width: 600px) {
    width: 150px; /* smanji, ali aspect ratio ostaje */
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
  border: none;
  border-radius: 5rem;
  width: 12rem;

  &:hover {
    background-color: var(--color-brand-700) !important;
    color: var(--color-grey-0) !important;
  }
`;

/* Bedž s nazivom manifestacije (klik vodi na /manifestation/:id) */
const ManifestTag = styled(Link)`
  position: absolute;
  left: 8px;
  top: 8px;
  max-width: 85%;
  background: rgba(255, 255, 255, 0.92);
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: #fff;
    text-decoration: underline;
  }
`;

/* Crveni tag OTKAZANO */
const CancelTag = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
  background: #ef4444;
  color: #fff;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);
`;

/* Mali helper koji dohvaća naziv manifestacije preko hook-a */
function ManifestChip({ manifestId }) {
  const { manifestation } = useGetManifestationById({ id: manifestId });
  const title = manifestation?.data?.title;
  if (!manifestId || !title) return null;

  return <ManifestTag to={`/manifestation/${manifestId}`}>{title}</ManifestTag>;
}

export default function PosterCarousel({ upcomingEvents = [] }) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const draggingRef = useRef(false);
  const dragStartX = useRef(0);
  const scrollStart = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  const postersFromEvents = upcomingEvents.map((event) => {
    const slika =
      event.slika && event.slika !== '00000000-0000-0000-0000-000000000000'
        ? `${URL}/api/image/${event.slika}?height=300`
        : `${URL}/api/events/slika/${event.idguid}?height=300`;

    return {
      slika,
      idguid: event.idguid,
      otkazano: !!event.otkazano,
      manifestId: event.manifestacija ? event.manif_idguid : null,
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
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
        {[
          ...postersFromEvents,
          ...postersFromEvents,
          ...postersFromEvents,
          ...postersFromEvents,
          ...postersFromEvents,
          ...postersFromEvents,
        ].map((img, idx) => (
          <PosterCard key={idx} $image={img.slika} $cancelled={img.otkazano}>
            {/* naziv manifestacije (ako postoji) */}
            {img.manifestId && !img.otkazano && <ManifestChip manifestId={img.manifestId} />}

            {/* oznaka otkazano */}
            {img.otkazano && <CancelTag>OTKAZANO</CancelTag>}

            <Overlay>
              <Link to={`/dogadjaj/${img.idguid}`}>
                <PosterButton icon={<EyeOutlined />}>Više</PosterButton>
              </Link>
            </Overlay>
          </PosterCard>
        ))}
      </CarouselContent>
    </CarouselWrapper>
  );
}
