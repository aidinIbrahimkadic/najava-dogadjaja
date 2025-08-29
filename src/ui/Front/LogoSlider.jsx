import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

// ---------------------------------------------
// Utils
// ---------------------------------------------
const durationFromSpeed = (speed) => {
  if (typeof speed === 'number') return `${speed}s`;
  switch (speed) {
    case 'slow':
      return '50s';
    case 'fast':
      return '20s';
    default:
      return '30s'; // normal
  }
};

// ---------------------------------------------
// Styles
// ---------------------------------------------
const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// Track (unutar scroller-a) – animacija za automatsko klizanje
const Track = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap);
  width: max-content; /* širina prati sadržaj */
  padding: 0.75rem 0;
  /* margin: 10rem 0; */
  animation: ${marquee} var(--duration) linear infinite;
`;

// Vanjski viewport
const Viewport = styled.div`
  --size: ${(p) => p.$size || 48}px; /* ikonica dimenzija */
  --gap: ${(p) => p.$gap || 28}px; /* razmak između */
  --duration: ${(p) => p.$duration || '30s'};

  width: 100%;
  overflow: hidden;
  position: relative;
  user-select: none;
  -webkit-user-drag: none;
  touch-action: pan-y; /* dozvoli vertikalno skrolanje na mobilnim uređajima */
  margin: 10rem 0 6rem 0;
  ${(p) =>
    p.$pauseOnHover &&
    css`
      &:hover ${Track} {
        animation-play-state: paused;
      }
    `}

  ${(p) =>
    p.$dragging &&
    css`
      & ${Track} {
        animation-play-state: paused;
      }
    `}

  @media (prefers-reduced-motion: reduce) {
    & ${Track} {
      animation: none;
    }
  }
  @media (max-width: 1250px) {
    margin: 2rem 0 0rem 0;
  }
`;

// Scroller – na njega primjenjujemo ručni (drag) pomak
const Scroller = styled.div`
  --dragX: 0px;
  transform: translate3d(var(--dragX), 0, 0);
  will-change: transform;
  cursor: ${(p) => (p.$dragging ? 'grabbing' : 'grab')};
`;

const LogoLink = styled(Link)`
  display: grid;
  place-items: center;
  width: calc(var(--size) + 8px);
  height: calc(var(--size) + 8px);
  border-radius: 12px;
  text-decoration: none;
  outline: none;
  color: ${(p) => p.$color || '#111827'};
  transition:
    transform 0.25s ease,
    filter 0.25s ease,
    opacity 0.25s ease,
    color 0.15s ease;
  filter: grayscale(1) opacity(0.6);
  /* Uklonjen pointer-events: none kada je dragging aktivan */
  pointer-events: auto;

  svg {
    width: var(--size);
    height: var(--size);
  }

  /* Forsiramo originalnu boju u svim stanjima linka da globalni stilovi ne preboje (plavo) */
  &:link,
  &:visited {
    color: ${(p) => p.$color || '#111827'};
  }
  &:hover,
  &:focus {
    color: ${(p) => p.$color || '#111827'};
  }
  &:active {
    color: ${(p) => p.$color || '#111827'};
  }

  &:hover {
    filter: none;
    opacity: 1;
    transform: scale(1.06);
  }
  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.15);
  }
`;

// ---------------------------------------------
// Component
// ---------------------------------------------
/**
 * LogoSlider
 *
 * Props:
 * - items: { label: string; Icon: React.ComponentType; color?: string; href?: string }[]
 * - speed: 'slow' | 'normal' | 'fast' | number  // broj = sekunde trajanja jedne petlje
 * - pauseOnHover?: boolean
 * - size?: number   // px
 * - gap?: number    // px
 */

export default function LogoSlider({
  allInstitutions,
  speed = 'slow',
  pauseOnHover = true,
  size = 48,
  gap = 28,
}) {
  const institutionsData = allInstitutions?.map((institution) => {
    return {
      label: institution.naziv,
      color: institution.boja_pozadine_postera,
      logo: institution.logo, // base64 string koji dolazi iz API-ja
      href: `/institution/${institution.idguid}`,
    };
  });

  const duration = durationFromSpeed(speed);
  let sequence;
  if (institutionsData) {
    sequence = [
      ...institutionsData,
      ...institutionsData,
      ...institutionsData,
      ...institutionsData,
      ...institutionsData,
      ...institutionsData,
      ...institutionsData,
      ...institutionsData,
      ...institutionsData,
    ]; // dupliramo radi seamless loop-a
  } else {
    sequence = [];
  }

  // Drag state/refs
  const [dragging, setDragging] = useState(false);
  const [isDragMove, setIsDragMove] = useState(false); // Track if actual dragging occurred
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0); // širina jedne "petlje" (polovina dupliranog tracka)

  // Izračunaj polovinu širine (za wrap-around) kad se promijene itemi/veličina
  useEffect(() => {
    if (!trackRef.current) return;
    const half = trackRef.current.offsetWidth / 2;
    halfWidthRef.current = half;
  }, [sequence.length, size, gap]);

  // Helper za postavljanje CSS varijable bez re-rendera
  const applyOffset = (val) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.style.setProperty('--dragX', `${val}px`);
  };

  const normalizeOffset = (val) => {
    const half = halfWidthRef.current || 0;
    if (!half) return val;
    // Držimo offset u rasponu [-half, half]
    if (val > half) return val - half;
    if (val < -half) return val + half;
    return val;
  };

  const onPointerDown = (e) => {
    // Ne pokreći drag na linkovima
    if (e.target.closest('a')) {
      return;
    }

    setDragging(true);
    setIsDragMove(false);
    startX.current = e.clientX;
    startOffset.current = offsetRef.current;
    scrollerRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;

    const delta = e.clientX - startX.current;

    // Ako je pomeraj veći od 5px, smatramo da je stvarno drag
    if (Math.abs(delta) > 5) {
      setIsDragMove(true);
    }

    let next = startOffset.current + delta;
    next = normalizeOffset(next);
    offsetRef.current = next;
    applyOffset(next);
  };

  const endDrag = (e) => {
    setDragging(false);
    setIsDragMove(false);
    try {
      scrollerRef.current?.releasePointerCapture?.(e.pointerId);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLinkClick = (e) => {
    // Spreci klik na link ako je bio drag
    if (isDragMove) {
      e.preventDefault();
      return false;
    }
  };

  return (
    <Viewport
      $duration={duration}
      $pauseOnHover={pauseOnHover}
      $size={size}
      $gap={gap}
      $dragging={dragging}
    >
      <Scroller
        ref={scrollerRef}
        $dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        role="application"
        aria-label="logo marquee scroller"
      >
        <Track ref={trackRef} role="list" aria-label="logo marquee">
          {sequence.map((it, idx) => {
            const { label, color, href, logo } = it;
            const key = `${label}-${idx}`;
            return (
              <LogoLink
                key={key}
                to={href || '#'}
                aria-label={label || ''}
                title={label || ''}
                $color={color || ''}
                onClick={handleLinkClick}
                role="listitem"
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={label}
                    style={{
                      width: 'auto',
                      height: '5rem',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      pointerEvents: 'none', // Spreci da slika bude drag target
                    }}
                  />
                ) : null}
              </LogoLink>
            );
          })}
        </Track>
      </Scroller>
    </Viewport>
  );
}

// STARI NEVALJALI KOD
// import React, { useEffect, useRef, useState } from 'react';
// import styled, { css, keyframes } from 'styled-components';

// // ---------------------------------------------
// // Utils
// // ---------------------------------------------
// const durationFromSpeed = (speed) => {
//   if (typeof speed === 'number') return `${speed}s`;
//   switch (speed) {
//     case 'slow':
//       return '50s';
//     case 'fast':
//       return '20s';
//     default:
//       return '30s'; // normal
//   }
// };

// // ---------------------------------------------
// // Styles
// // ---------------------------------------------
// const marquee = keyframes`
//   0% { transform: translateX(0); }
//   100% { transform: translateX(-50%); }
// `;

// // Track (unutar scroller-a) – animacija za automatsko klizanje
// const Track = styled.div`
//   display: flex;
//   align-items: center;
//   gap: var(--gap);
//   width: max-content; /* širina prati sadržaj */
//   padding: 0.75rem 0;
//   /* margin: 10rem 0; */
//   animation: ${marquee} var(--duration) linear infinite;
// `;

// // Vanjski viewport
// const Viewport = styled.div`
//   --size: ${(p) => p.$size || 48}px; /* ikonica dimenzija */
//   --gap: ${(p) => p.$gap || 28}px; /* razmak između */
//   --duration: ${(p) => p.$duration || '30s'};

//   width: 100%;
//   overflow: hidden;
//   position: relative;
//   user-select: none;
//   -webkit-user-drag: none;
//   touch-action: pan-y; /* dozvoli vertikalno skrolanje na mobilnim uređajima */
//   margin: 10rem 0;
//   ${(p) =>
//     p.$pauseOnHover &&
//     css`
//       &:hover ${Track} {
//         animation-play-state: paused;
//       }
//     `}

//   ${(p) =>
//     p.$dragging &&
//     css`
//       & ${Track} {
//         animation-play-state: paused;
//       }
//     `}

//   @media (prefers-reduced-motion: reduce) {
//     & ${Track} {
//       animation: none;
//     }
//   }
// `;

// // Scroller – na njega primjenjujemo ručni (drag) pomak
// const Scroller = styled.div`
//   --dragX: 0px;
//   transform: translate3d(var(--dragX), 0, 0);
//   will-change: transform;
//   cursor: ${(p) => (p.$dragging ? 'grabbing' : 'grab')};
// `;

// const LogoLink = styled.a`
//   display: grid;
//   place-items: center;
//   width: calc(var(--size) + 8px);
//   height: calc(var(--size) + 8px);
//   border-radius: 12px;
//   text-decoration: none;
//   outline: none;
//   color: ${(p) => p.$color || '#111827'};
//   transition:
//     transform 0.25s ease,
//     filter 0.25s ease,
//     opacity 0.25s ease,
//     color 0.15s ease;
//   filter: grayscale(1) opacity(0.6);
//   pointer-events: ${(p) => (p.$dragging ? 'none' : 'auto')};

//   svg {
//     width: var(--size);
//     height: var(--size);
//   }

//   /* Forsiramo originalnu boju u svim stanjima linka da globalni stilovi ne preboje (plavo) */
//   &:link,
//   &:visited {
//     color: ${(p) => p.$color || '#111827'};
//   }
//   &:hover,
//   &:focus {
//     color: ${(p) => p.$color || '#111827'};
//   }
//   &:active {
//     color: ${(p) => p.$color || '#111827'};
//   }

//   &:hover {
//     filter: none;
//     opacity: 1;
//     transform: scale(1.06);
//   }
//   &:focus-visible {
//     box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.15);
//   }
// `;

// // ---------------------------------------------
// // Component
// // ---------------------------------------------
// /**
//  * LogoSlider
//  *
//  * Props:
//  * - items: { label: string; Icon: React.ComponentType; color?: string; href?: string }[]
//  * - speed: 'slow' | 'normal' | 'fast' | number  // broj = sekunde trajanja jedne petlje
//  * - pauseOnHover?: boolean
//  * - size?: number   // px
//  * - gap?: number    // px
//  */

// export default function LogoSlider({
//   allInstitutions,
//   speed = 'slow',
//   pauseOnHover = true,
//   size = 48,
//   gap = 28,
// }) {
//   const institutionsData = allInstitutions.map((institution) => {
//     return {
//       label: institution.naziv,
//       color: institution.boja_pozadine_postera,
//       logo: institution.logo, // base64 string koji dolazi iz API-ja
//       href: `/institution/${institution.idguid}`,
//     };
//   });

//   const duration = durationFromSpeed(speed);
//   const sequence = [
//     ...institutionsData,
//     ...institutionsData,
//     ...institutionsData,
//     ...institutionsData,
//   ]; // dupliramo radi seamless loop-a

//   // Drag state/refs
//   const [dragging, setDragging] = useState(false);
//   const scrollerRef = useRef(null);
//   const trackRef = useRef(null);
//   const startX = useRef(0);
//   const startOffset = useRef(0);
//   const offsetRef = useRef(0);
//   const halfWidthRef = useRef(0); // širina jedne "petlje" (polovina dupliranog tracka)

//   // Izračunaj polovinu širine (za wrap-around) kad se promijene itemi/veličina
//   useEffect(() => {
//     if (!trackRef.current) return;
//     const half = trackRef.current.offsetWidth / 2;
//     halfWidthRef.current = half;
//   }, [sequence.length, size, gap]);

//   // Helper za postavljanje CSS varijable bez re-rendera
//   const applyOffset = (val) => {
//     if (!scrollerRef.current) return;
//     scrollerRef.current.style.setProperty('--dragX', `${val}px`);
//   };

//   const normalizeOffset = (val) => {
//     const half = halfWidthRef.current || 0;
//     if (!half) return val;
//     // Držimo offset u rasponu [-half, half]
//     if (val > half) return val - half;
//     if (val < -half) return val + half;
//     return val;
//   };

//   const onPointerDown = (e) => {
//     setDragging(true);
//     startX.current = e.clientX;
//     startOffset.current = offsetRef.current;
//     scrollerRef.current?.setPointerCapture?.(e.pointerId);
//   };

//   const onPointerMove = (e) => {
//     if (!dragging) return;
//     const delta = e.clientX - startX.current;
//     let next = startOffset.current + delta;
//     next = normalizeOffset(next);
//     offsetRef.current = next;
//     applyOffset(next);
//   };

//   const endDrag = (e) => {
//     setDragging(false);
//     try {
//       scrollerRef.current?.releasePointerCapture?.(e.pointerId);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   return (
//     <Viewport
//       $duration={duration}
//       $pauseOnHover={pauseOnHover}
//       $size={size}
//       $gap={gap}
//       $dragging={dragging}
//     >
//       <Scroller
//         ref={scrollerRef}
//         $dragging={dragging}
//         onPointerDown={onPointerDown}
//         onPointerMove={onPointerMove}
//         onPointerUp={endDrag}
//         onPointerCancel={endDrag}
//         onPointerLeave={endDrag}
//         role="application"
//         aria-label="logo marquee scroller"
//       >
//         <Track ref={trackRef} role="list" aria-label="logo marquee">
//           {sequence.map((it, idx) => {
//             const { label, color, href, logo } = it;
//             // const Comp = Icon || (() => null);
//             const key = `${label}-${idx}`;
//             return (
//               <LogoLink
//                 key={key}
//                 href={href || '#'}
//                 aria-label={label}
//                 title={label}
//                 $color={color}
//                 $dragging={dragging}
//                 role="listitem"
//               >
//                 {logo ? (
//                   <img
//                     src={logo}
//                     alt={label}
//                     style={{
//                       width: 'auto',
//                       height: '5rem',
//                       objectFit: 'contain',
//                       borderRadius: '8px',
//                     }}
//                   />
//                 ) : null}
//                 {/* <Comp /> */}
//               </LogoLink>
//             );
//           })}
//         </Track>
//       </Scroller>
//     </Viewport>
//   );
// }
