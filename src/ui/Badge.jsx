import styled from 'styled-components';

const StyledBadge = styled.span`
  background-color: ${(props) =>
    props.$is_public ? 'var(--color-hover-100)' : 'var(--color-red-100)'};
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  color: ${(props) => (props.$is_public ? 'var(--color-blue-700)' : 'var(--color-red-700)')};
`;

export default function Badge({ is_public, children }) {
  return <StyledBadge $is_public={is_public}>{children}</StyledBadge>;
}
