// import React, { useRef, useEffect, useState } from 'react';
// import styled from 'styled-components';
// import { Button } from 'antd';
// import { EyeOutlined, HeartOutlined } from '@ant-design/icons';

// const CarouselWrapper = styled.div`
//   width: 100%;
//   overflow: hidden;
//   padding: 2rem 0;
//   cursor: ${(props) => (props.$dragging ? 'grabbing' : 'grab')};
// `;

// const CarouselContent = styled.div`
//   display: flex;
//   gap: 2rem;
// `;

// const PosterCard = styled.div`
//   position: relative;
//   flex: 0 0 210px;
//   width: 210px;
//   height: 297px;
//   background-image: url(${(props) => props.$image});
//   background-size: cover;
//   background-position: center;
//   border-radius: 12px;
//   overflow: hidden;

//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   filter: brightness(${(props) => (props.$dimmed ? 0.7 : 1)});
//   transition:
//     transform 0.3s ease,
//     filter 0.3s ease;
//   &:hover {
//     transform: scale(1.05);
//     filter: brightness(1);
//     z-index: 10;
//   }
// `;

// const Overlay = styled.div`
//   /* position: absolute;
//   bottom: 0;
//   left: 0;
//   right: 0; */
//   background: rgba(0, 0, 0, 0.5);
//   opacity: 0;
//   transition: opacity 0.3s ease;
//   padding: 0.5rem;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   gap: 1rem;
//   height: 100%;
//   align-items: center;

//   ${PosterCard}:hover & {
//     opacity: 1;
//   }
// `;

// const PosterButton = styled(Button)`
//   background-color: var(--color-grey-0) !important;
//   color: var(--color-brand-700) !important;
//   border: 1px solid var(--color-brand-700);
//   border-radius: 5rem;
//   width: 15rem;
//   height: 4rem;

//   &:hover {
//     background-color: var(--color-brand-700) !important;
//     color: var(--color-grey-0) !important;
//     border: var(--color-brand-700);
//   }
// `;

// export default function PosterCarousel() {
//   const containerRef = useRef(null);
//   const rafRef = useRef(null);
//   const draggingRef = useRef(false);
//   const dragStartX = useRef(0);
//   const scrollStart = useRef(0);
//   const [isPaused, setIsPaused] = useState(false);

//   // Tvoji posteri (A4 format), dupliramo niz radi seamless loopa
//   const posters = [
//     '/images/poster.jpg',
//     '/images/poster1.jpg',
//     '/images/poster2.jpg',
//     '/images/poster3.jpg',
//     '/images/poster4.jpg',
//     '/images/poster6.jpg',
//   ];

//   useEffect(() => {
//     const container = containerRef.current;
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

//   // Hover pauza
//   const handleMouseEnter = () => setIsPaused(true);
//   const handleMouseLeave = () => setIsPaused(false);

//   // Drag logika
//   const handleMouseDown = (e) => {
//     draggingRef.current = true;
//     dragStartX.current = e.pageX;
//     scrollStart.current = containerRef.current.scrollLeft;
//     setIsPaused(true);
//   };
//   const handleMouseUp = () => {
//     draggingRef.current = false;
//     setIsPaused(false);
//   };
//   const handleMouseMove = (e) => {
//     if (!draggingRef.current) return;
//     e.preventDefault();
//     const delta = e.pageX - dragStartX.current;
//     containerRef.current.scrollLeft = scrollStart.current - delta;
//   };

//   return (
//     <CarouselWrapper
//       ref={containerRef}
//       $dragging={draggingRef.current}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       onMouseDown={handleMouseDown}
//       onMouseUp={handleMouseUp}
//       onMouseMove={handleMouseMove}
//     >
//       <CarouselContent>
//         {[...posters, ...posters, ...posters, ...posters, ...posters].map((img, idx) => (
//           <PosterCard
//             key={idx}
//             $image={img}
//             // dimujemo samo prvu i zadnju sliku iz originalnog seta
//             $dimmed={idx % posters.length === 0 || idx % posters.length === posters.length - 1}
//           >
//             <Overlay>
//               <PosterButton icon={<EyeOutlined />}>Pogledaj više</PosterButton>
//               <PosterButton icon={<HeartOutlined />}>Like</PosterButton>
//             </Overlay>
//           </PosterCard>
//         ))}
//       </CarouselContent>
//     </CarouselWrapper>
//   );
// }

import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from 'antd';
import { EyeOutlined, HeartOutlined } from '@ant-design/icons';

// 1. Animacija: od 0% do -50% translateX
const scroll = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const CarouselWrapper = styled.div`
  overflow: hidden;
  background: var(--color-grey-50);
  padding: 2rem 0;
  cursor: ${(props) => (props.dragging ? 'grabbing' : 'grab')};
`;

const CarouselInner = styled.div`
  display: flex;
  width: 200%; /* jer ćemo duplirati sadržaj */
  animation: ${scroll} 60s linear infinite;
  /* vendor prefix za Chrome */
  -webkit-animation: ${scroll} 60s linear infinite;
  will-change: transform;

  /* pauziraj na hover */
  &:hover {
    animation-play-state: paused;
    -webkit-animation-play-state: paused;
  }
`;

const PosterCard = styled.div`
  flex: 0 0 auto;
  width: 210px;
  height: 297px;
  margin-right: 2rem;
  overflow: hidden;
  background: url(${(p) => p.image}) center/cover no-repeat;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  filter: brightness(${(p) => (p.dimmed ? 0.7 : 1)});
  transition:
    transform 0.3s ease,
    filter 0.3s ease;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1);
    z-index: 1;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
  gap: 1rem;
  transition: opacity 0.3s ease;

  ${PosterCard}:hover & {
    opacity: 1;
  }
`;

const PosterButton = styled(Button)`
  background: var(--color-grey-0) !important;
  color: var(--color-brand-700) !important;
  border: 1px solid var(--color-brand-700) !important;
  width: 12rem;
  height: 4rem;
  &:hover {
    background: var(--color-brand-700) !important;
    color: var(--color-grey-0) !important;
  }
`;

const PosterButtonHeart = styled(Button)`
  background: var(--color-grey-0) !important;
  color: var(--color-brand-700) !important;
  border: 1px solid var(--color-brand-700) !important;
  width: 4rem;
  height: 4rem;
  &:hover {
    background: var(--color-brand-700) !important;
    color: var(--color-grey-0) !important;
  }
`;

export default function PosterCarousel() {
  const innerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const baseX = useRef(0);

  // originalni niz
  const posters = [
    '/images/poster1.jpg',
    '/images/poster2.jpg',
    '/images/poster3.jpg',
    '/images/poster4.jpg',
    '/images/poster.jpg',
    '/images/poster6.jpg',
  ];
  // dupliramo za 200% width
  const infinite = [...posters, ...posters];

  const onMouseDown = (e) => {
    setDragging(true);
    innerRef.current.style.animationPlayState = 'paused';
    innerRef.current.style.webkitAnimationPlayState = 'paused';
    startX.current = e.clientX;
    // trenutni transform:
    const style = window.getComputedStyle(innerRef.current);
    const matrix = new DOMMatrixReadOnly(style.transform);
    baseX.current = matrix.m41;
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    const delta = e.clientX - startX.current;
    const x = baseX.current + delta;
    innerRef.current.style.transform = `translateX(${x}px)`;
  };

  const onMouseUp = () => {
    setDragging(false);
    innerRef.current.style.animationPlayState = '';
    innerRef.current.style.webkitAnimationPlayState = '';
  };

  return (
    <CarouselWrapper
      dragging={dragging}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <CarouselInner ref={innerRef}>
        {infinite.map((img, i) => (
          <PosterCard key={i} image={img} dimmed={i === 0 || i === posters.length - 1}>
            <Overlay>
              <PosterButton icon={<EyeOutlined />}>Više</PosterButton>
              <PosterButtonHeart icon={<HeartOutlined />} />
            </Overlay>
          </PosterCard>
        ))}
      </CarouselInner>
    </CarouselWrapper>
  );
}
