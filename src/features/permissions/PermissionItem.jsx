// PermissionItem.jsx
import styled from 'styled-components';
import Checkbox from '../../ui/Checkbox';

const Card = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 2px solid transparent;
  color: #df6c1b;
  border: 1px solid #df6c1b;
  background: '#ffff';

  width: 100%;
  min-height: 12rem;
  transition: all 0.2s ease;

  &:hover {
    background: #fffdfb;
    cursor: pointer;
  }
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;

  &:hover {
    color: '#fffff';
  }
`;

const Description = styled.div`
  font-size: 1.2rem;
  color: #df6c1b;
  flex-grow: 1;
`;

function PermissionItem({ permission, checked, onChange }) {
  return (
    <Card>
      <Name>{permission.description}</Name>
      <Description>{permission.name}</Description>
      <Checkbox checked={checked} onChange={() => onChange(permission.idguid)} />
    </Card>
  );
}

export default PermissionItem;
