// src/ui/Front/PosterCarouselEmbed.jsx
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { URL as API_BASE } from '../../utils/constants';
import { useGetManifestationById } from '../../features/front/useManifestationById';

const CarouselWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 2rem 0;
  margin: 0;
  cursor: default; /* nema grab/grabbling */
  touch-action: none; /* isključi gestovni drag */
`;

const CarouselContent = styled.div`
  display: flex;
  gap: 2rem;
  align-items: stretch;
`;

const PosterCard = styled.div`
  position: relative;
  flex: 0 0 auto;
  width: 210px;
  aspect-ratio: 3 / 4;
  background-image: url(${(p) => p.$image});
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    filter 0.3s ease,
    opacity 0.3s ease;

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
    width: 150px;
  }
`;

const ManifestTag = styled.a`
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

function ManifestChip({ manifestId }) {
  const { manifestation } = useGetManifestationById({ id: manifestId });
  const title = manifestation?.data?.title;
  if (!manifestId || !title) return null;

  const hrefMan = `/manifestation/${manifestId}`;

  return (
    <ManifestTag
      href={hrefMan}
      target="_top"
      rel="noopener"
      onClick={(e) => e.stopPropagation()} // spriječi klik roditelja
      title={title}
    >
      {title}
    </ManifestTag>
  );
}

export default function PosterCarouselEmbed({ upcomingEvents = [] }) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // pripremi podatke za prikaz
  const postersFromEvents = (upcomingEvents || []).map((event) => {
    const slika =
      event.slika && event.slika !== '00000000-0000-0000-0000-000000000000'
        ? `${API_BASE}/api/image/${event.slika}?height=300`
        : `${API_BASE}/api/events/slika/${event.idguid}?height=300`;

    return {
      slika,
      idguid: event.idguid,
      otkazano: !!event.otkazano,
      manifestId: event.manifestacija ? event.manif_idguid : null,
    };
  });

  // auto-scroll loop (bez draga)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const speed = 0.5; // px/frame — po potrebi prilagodi

    function step() {
      if (!isPaused) {
        container.scrollLeft += speed;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft -= container.scrollWidth / 2;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused]);

  // dupliciraj niz za beskonačni scroll
  const tiles = [
    ...postersFromEvents,
    ...postersFromEvents,
    ...postersFromEvents,
    ...postersFromEvents,
  ];

  return (
    <CarouselWrapper
      ref={containerRef}
      role="listbox"
      aria-label="Nadolazeći događaji"
      onMouseEnter={() => setIsPaused(true)} // pauza na hover
      onMouseLeave={() => setIsPaused(false)} // nastavi kad izađeš
    >
      <CarouselContent>
        {tiles.map((img, idx) => {
          const href = `/dogadjaj/${img.idguid}`;
          return (
            <a
              key={`${img.idguid}-${idx}`}
              href={href}
              target="_top"
              rel="noopener"
              aria-label="Otvori detalje događaja"
              style={{ textDecoration: 'none' }}
            >
              <PosterCard $image={img.slika} $cancelled={img.otkazano}>
                {img.manifestId && !img.otkazano && <ManifestChip manifestId={img.manifestId} />}
                {img.otkazano && <CancelTag>OTKAZANO</CancelTag>}
              </PosterCard>
            </a>
          );
        })}
      </CarouselContent>
    </CarouselWrapper>
  );
}
