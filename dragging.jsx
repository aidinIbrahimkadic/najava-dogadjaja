import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from 'antd';
import { EyeOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
// import { HiOutlineEye, HiOutlineHeart } from 'react-icons/hi2';
// 1. Animacija: od 0% do -50% translateX
const scroll = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const CarouselWrapper = styled.div`
  overflow: hidden;
  background: var(--color-grey-50);
  padding: 2rem 0;
  cursor: ${(props) => (props.$dragging ? 'grabbing' : 'grab')};
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
  background: url(${(p) => p.$image}) center/cover no-repeat;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  filter: brightness(${(p) => (p.$dimmed ? 0.7 : 1)});
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

// const PosterButtonHeart = styled(Button)`
//   background: var(--color-grey-0) !important;
//   color: var(--color-brand-700) !important;
//   border: 1px solid var(--color-brand-700) !important;
//   width: 4rem;
//   height: 4rem;
//   &:hover {
//     background: var(--color-brand-700) !important;
//     color: var(--color-grey-0) !important;
//   }
// `;

const PosterButtonHeart = styled(Button)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: var(--color-grey-0) !important;
  color: var(--color-brand-700) !important;
  border: 1px solid var(--color-brand-700) !important;
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;

  /* dvije ikone, jedna iznad druge */
  .heart-outline,
  .heart-solid {
    position: absolute;
    transition: opacity 0.2s ease;
    font-size: 20px; /* prilagodi veličinu po želji */
  }

  .heart-solid {
    opacity: 0;
  }
  .heart-outline {
    opacity: 1;
  }

  &:hover {
    /* background: var(--color-brand-700) !important; */
    color: var(--color-brand-700) !important;

    .heart-solid {
      opacity: 1;
    }
    .heart-outline {
      opacity: 0;
    }
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
      $dragging={dragging}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <CarouselInner ref={innerRef}>
        {infinite.map((img, i) => (
          <PosterCard key={i} $image={img} $dimmed={i === 0 || i === posters.length - 1}>
            <Overlay>
              <PosterButton icon={<EyeOutlined />}>Više</PosterButton>
              {/* <PosterButtonHeart icon={<HiOutlineHeart />} /> */}
              <PosterButtonHeart>
                <HeartOutlined className="heart-outline" />
                <HeartFilled className="heart-solid" />
              </PosterButtonHeart>
            </Overlay>
          </PosterCard>
        ))}
      </CarouselInner>
    </CarouselWrapper>
  );
}
