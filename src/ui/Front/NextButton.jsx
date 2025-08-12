import { Button } from 'antd';
import styled from 'styled-components';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useState } from 'react';

const StyledNextButton = styled(Button)`
  color: var(--color-brand-700) !important;
  box-shadow: 10px 5px 9px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-brand-700)' : 'transparent')} !important;
  border-radius: 5rem;
  transition: all 0.2s;
  width: 12rem;

  &:hover {
    box-shadow: 14px 8px 12px rgba(0, 0, 0, 0.1) !important;
    border: 1px solid var(--color-brand-700) !important;
  }
`;

export default function NextButton({ children, active = false }) {
  const [hovered, setHovered] = useState(active);

  return (
    <StyledNextButton
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      $active={hovered}
      icon={
        hovered ? (
          <HeartFilled style={{ color: 'red' }} />
        ) : (
          <HeartOutlined style={{ color: 'var(--color-brand-700)' }} />
        )
      }
    >
      {children}
    </StyledNextButton>
  );
}
