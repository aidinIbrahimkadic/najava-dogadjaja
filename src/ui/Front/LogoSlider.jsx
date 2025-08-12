import React, { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FaReact, FaNodeJs } from 'react-icons/fa';
import {
  SiTypescript,
  SiNextdotjs,
  SiDocker,
  SiFigma,
  SiMongodb,
  SiPostgresql,
  SiVite,
  SiAdobeillustrator,
  SiAdobepremierepro,
} from 'react-icons/si';

// ---------------------------------------------
// Default items (zamijeni svojim logotipima kasnije)
// ---------------------------------------------
const DEFAULT_ITEMS = [
  { label: 'React', Icon: FaReact, color: '#61DAFB' },
  { label: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
  { label: 'Node.js', Icon: FaNodeJs, color: '#68A063' },
  { label: 'Next.js', Icon: SiNextdotjs, color: '#000000' },
  { label: 'Docker', Icon: SiDocker, color: '#2496ED' },
  { label: 'Figma', Icon: SiFigma, color: '#F24E1E' },
  { label: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
  { label: 'PostgreSQL', Icon: SiPostgresql, color: '#336791' },
  { label: 'Vite', Icon: SiVite, color: '#646CFF' },
  { label: 'Illustrator', Icon: SiAdobeillustrator, color: '#FF9A00' },
  { label: 'Premiere', Icon: SiAdobepremierepro, color: '#9999FF' },
];

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
  margin: 10rem 0;
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
`;

// Scroller – na njega primjenjujemo ručni (drag) pomak
const Scroller = styled.div`
  --dragX: 0px;
  transform: translate3d(var(--dragX), 0, 0);
  will-change: transform;
  cursor: ${(p) => (p.$dragging ? 'grabbing' : 'grab')};
`;

const LogoLink = styled.a`
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
  pointer-events: ${(p) => (p.$dragging ? 'none' : 'auto')};

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
  items = DEFAULT_ITEMS,
  speed = 'slow',
  pauseOnHover = true,
  size = 48,
  gap = 28,
}) {
  const duration = durationFromSpeed(speed);
  const sequence = [...items, ...items, ...items, ...items]; // dupliramo radi seamless loop-a

  // Drag state/refs
  const [dragging, setDragging] = useState(false);
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
    setDragging(true);
    startX.current = e.clientX;
    startOffset.current = offsetRef.current;
    scrollerRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const delta = e.clientX - startX.current;
    let next = startOffset.current + delta;
    next = normalizeOffset(next);
    offsetRef.current = next;
    applyOffset(next);
  };

  const endDrag = (e) => {
    setDragging(false);
    try {
      scrollerRef.current?.releasePointerCapture?.(e.pointerId);
    } catch (e) {
      console.log(e);
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
            const { Icon, label, color, href } = it;
            const Comp = Icon || (() => null);
            const key = `${label}-${idx}`;
            return (
              <LogoLink
                key={key}
                href={href || '#'}
                aria-label={label}
                title={label}
                $color={color}
                $dragging={dragging}
                role="listitem"
              >
                <Comp />
              </LogoLink>
            );
          })}
        </Track>
      </Scroller>
    </Viewport>
  );
}
