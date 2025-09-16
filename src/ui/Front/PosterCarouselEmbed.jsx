// import React, { useRef, useEffect, useState } from 'react';
// import styled from 'styled-components';
// import { URL as API_BASE } from '../../utils/constants';
// import { useGetManifestationById } from '../../features/front/useManifestationById';

// const CarouselWrapper = styled.div`
//   width: 100%;
//   overflow: hidden;
//   padding: 2rem 0;
//   margin-bottom: 4rem;
//   cursor: ${(props) => (props.$dragging ? 'grabbing' : 'grab')};
//   touch-action: pan-x;
// `;

// const CarouselContent = styled.div`
//   display: flex;
//   gap: 2rem;
// `;

// const PosterCard = styled.div`
//   position: relative;
//   flex: 0 0 auto;
//   width: 210px;
//   aspect-ratio: 3 / 4;
//   background-image: url(${(props) => props.$image});
//   background-size: cover;
//   background-position: center;
//   border-radius: 12px;
//   overflow: hidden;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   transition:
//     transform 0.3s ease,
//     filter 0.3s ease,
//     opacity 0.3s ease;
//   display: block;

//   ${(p) =>
//     p.$cancelled &&
//     `
//       filter: grayscale(0.5) brightness(0.85);
//     `}

//   &:hover {
//     transform: scale(1.05);
//     filter: brightness(1);
//     z-index: 10;
//   }

//   @media (max-width: 600px) {
//     width: 150px;
//   }
// `;

// /* Bedž s nazivom manifestacije (klik vodi na /manifestation/:id) */
// const ManifestTag = styled.a`
//   position: absolute;
//   left: 8px;
//   top: 8px;
//   max-width: 85%;
//   background: rgba(255, 255, 255, 0.92);
//   color: #111827;
//   border: 1px solid #e5e7eb;
//   border-radius: 999px;
//   padding: 4px 10px;
//   font-size: 12px;
//   font-weight: 600;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   overflow: hidden;

//   &:hover {
//     background: #fff;
//     text-decoration: underline;
//   }
// `;

// /* Crveni tag OTKAZANO */
// const CancelTag = styled.div`
//   position: absolute;
//   right: 8px;
//   top: 8px;
//   background: #ef4444;
//   color: #fff;
//   border-radius: 999px;
//   padding: 4px 10px;
//   font-size: 12px;
//   font-weight: 700;
//   letter-spacing: 0.3px;
//   box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);
// `;

// /* Mali helper koji dohvaća naziv manifestacije preko hook-a */
// function ManifestChip({ manifestId }) {
//   const { manifestation } = useGetManifestationById({ id: manifestId });
//   const title = manifestation?.data?.title;
//   if (!manifestId || !title) return null;
//   const abs = (`${API_BASE}/manifestation/${manifestId}`, window.location.origin).href;
//   return (
//     <ManifestTag
//       to={abs}
//       target="_top"
//       rel="noopener"
//       onClick={(e) => e.stopPropagation()} // spriječi klik roditelja
//     >
//       {title}
//     </ManifestTag>
//   );
// }

// export default function PosterCarouselEmbed({ upcomingEvents = [] }) {
//   const containerRef = useRef(null);
//   const rafRef = useRef(null);
//   const draggingRef = useRef(false);
//   const dragStartX = useRef(0);
//   const scrollStart = useRef(0);
//   const movedRef = useRef(false); // umjesto sabiranja—flag kad pređe prag
//   const [isPaused, setIsPaused] = useState(false);
//   // const navigate = useNavigate();

//   const postersFromEvents = upcomingEvents.map((event) => {
//     const slika =
//       event.slika && event.slika !== '00000000-0000-0000-0000-000000000000'
//         ? `${API_BASE}/api/image/${event.slika}?height=300`
//         : `${API_BASE}/api/events/slika/${event.idguid}?height=300`;

//     return {
//       slika,
//       idguid: event.idguid,
//       otkazano: !!event.otkazano,
//       manifestId: event.manifestacija ? event.manif_idguid : null,
//     };
//   });

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
//     const speed = 0.5; // px po frame (usporeno)

//     function step() {
//       if (!isPaused && !draggingRef.current) {
//         container.scrollLeft += speed;
//         // kad prijeđeš polovinu sadržaja, vrati se na početak
//         if (container.scrollLeft >= container.scrollWidth / 2) {
//           container.scrollLeft -= container.scrollWidth / 2;
//         }
//       }
//       rafRef.current = requestAnimationFrame(step);
//     }

//     rafRef.current = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(rafRef.current);
//   }, [isPaused]);

//   // Helper za X koordinate
//   const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

//   // Hover pauza (desktop)
//   const handleMouseEnter = () => setIsPaused(true);
//   const handleMouseLeave = () => setIsPaused(false);

//   const DRAG_THRESHOLD = 8; // px — klik je samo ako je pomak <= ovoga

//   // Start drag
//   const handleDragStart = (e) => {
//     draggingRef.current = true;
//     movedRef.current = false;
//     dragStartX.current = getClientX(e);
//     scrollStart.current = containerRef.current.scrollLeft;
//     setIsPaused(true);
//     // Nema preventDefault — izbjegavamo passive warning
//   };

//   // End drag
//   const handleDragEnd = () => {
//     draggingRef.current = false;
//     setIsPaused(false);
//     // movedRef NE resetujemo ovdje; onClick dolazi odmah poslije mouseup/touchend
//   };

//   // Move drag
//   const handleDragMove = (e) => {
//     if (!draggingRef.current) return;
//     const currentX = getClientX(e);
//     const delta = currentX - dragStartX.current;

//     // scrollaj
//     containerRef.current.scrollLeft = scrollStart.current - delta;

//     // označi kao "drag" ako je ukupno pomjeranje prešlo prag
//     if (Math.abs(delta) > DRAG_THRESHOLD) movedRef.current = true;
//   };

//   // Klik na poster — navigacija samo ako nije bilo povlačenja
//   // const handlePosterClick = (idguid) => {
//   //   if (movedRef.current) {
//   //     // reset flag za naredni klik
//   //     movedRef.current = false;
//   //     return;
//   //   }
//   //   const path = `/dogadjaj/${idguid}`;
//   //   if (inIframe()) openInTop(path);
//   //   else navigate(path);
//   //   movedRef.current = false;
//   // };

//   // Mouse eventi
//   const handleMouseDown = (e) => handleDragStart(e);
//   const handleMouseUp = () => handleDragEnd();
//   const handleMouseMove = (e) => handleDragMove(e);

//   // Touch eventi
//   const handleTouchStart = (e) => handleDragStart(e);
//   const handleTouchEnd = () => handleDragEnd();
//   const handleTouchMove = (e) => handleDragMove(e);

//   const tiles = [
//     ...postersFromEvents,
//     ...postersFromEvents,
//     ...postersFromEvents,
//     ...postersFromEvents,
//     ...postersFromEvents,
//     ...postersFromEvents,
//   ];

//   return (
//     <CarouselWrapper
//       ref={containerRef}
//       $dragging={draggingRef.current}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       onMouseDown={handleMouseDown}
//       onMouseUp={handleMouseUp}
//       onMouseMove={handleMouseMove}
//       onTouchStart={handleTouchStart}
//       onTouchEnd={handleTouchEnd}
//       onTouchMove={handleTouchMove}
//       role="listbox"
//       aria-label="Nadolazeći događaji"
//     >
//       <CarouselContent>
//         {tiles.map((img, idx) => {
//           const abs = (`${API_BASE}/dogadjaj/${img.idguid}`, window.location.origin).href;

//           return (
//             <a
//               key={`${img.idguid}-${idx}`}
//               href={abs}
//               target="_top"
//               rel="noopener"
//               onClick={(e) => {
//                 if (movedRef.current) {
//                   // bio je drag — ne otvaraj link
//                   e.preventDefault();
//                   movedRef.current = false;
//                 }
//               }}
//               aria-label="Otvori detalje događaja"
//               style={{ textDecoration: 'none' }}
//             >
//               <PosterCard
//                 $image={img.slika}
//                 $cancelled={img.otkazano}
//                 role="link"
//                 tabIndex={0}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     // Enter na linku već radi; zadržano radi11/aria
//                   }
//                 }}
//               >
//                 {img.manifestId && !img.otkazano && <ManifestChip manifestId={img.manifestId} />}
//                 {img.otkazano && <CancelTag>OTKAZANO</CancelTag>}
//               </PosterCard>
//             </a>
//           );
//         })}
//       </CarouselContent>
//     </CarouselWrapper>
//   );
// }

import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { URL as API_BASE } from '../../utils/constants';
import { useGetManifestationById } from '../../features/front/useManifestationById';

const CarouselWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 2rem 0;
  margin: 0;
  cursor: ${(props) => (props.$dragging ? 'grabbing' : 'grab')};
  touch-action: pan-x;
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
  const draggingRef = useRef(false);
  const dragStartX = useRef(0);
  const scrollStart = useRef(0);
  const movedRef = useRef(false);
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

  // auto-scroll loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const speed = 0.5; // px/frame — po potrebi prilagodi

    function step() {
      if (!isPaused && !draggingRef.current) {
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

  // helpers
  const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);
  const DRAG_THRESHOLD = 8; // px — klik je samo ako je pomak <= ovoga

  // hover pauza (desktop)
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // drag start/move/end
  const handleDragStart = (e) => {
    draggingRef.current = true;
    movedRef.current = false;
    dragStartX.current = getClientX(e);
    scrollStart.current = containerRef.current.scrollLeft;
    setIsPaused(true);
  };

  const handleDragMove = (e) => {
    if (!draggingRef.current) return;
    const currentX = getClientX(e);
    const delta = currentX - dragStartX.current;
    containerRef.current.scrollLeft = scrollStart.current - delta;
    if (Math.abs(delta) > DRAG_THRESHOLD) movedRef.current = true;
  };

  const handleDragEnd = () => {
    draggingRef.current = false;
    setIsPaused(false);
    // movedRef.current ostaje — provjerava se u onClick handleru
  };

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
      $dragging={draggingRef.current}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDragMove}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
      onTouchMove={handleDragMove}
      role="listbox"
      aria-label="Nadolazeći događaji"
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
              onClick={(e) => {
                if (movedRef.current) {
                  e.preventDefault(); // bio je drag — ne otvaraj link
                  movedRef.current = false;
                }
              }}
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
