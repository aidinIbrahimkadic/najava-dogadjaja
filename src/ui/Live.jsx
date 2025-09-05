import styled, { keyframes } from 'styled-components';
import { MdFiberManualRecord } from 'react-icons/md';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  60% { transform: scale(1.8); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
`;

const LiveWrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  line-height: 1;
  color: #ef4444; /* crvena; po želji zamijeni svojim var(--color-danger) */
`;

const DotWrap = styled.span`
  position: relative;
  width: 10px;
  height: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Ping = styled.span`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: currentColor;
  animation: ${pulse} 1.4s ease-out infinite;
`;

const Dot = styled(MdFiberManualRecord)`
  width: 10px;
  height: 10px;
`;

export function LiveBadge() {
  return (
    <LiveWrap>
      <DotWrap>
        <Ping />
        <Dot />
      </DotWrap>
    </LiveWrap>
  );
}
