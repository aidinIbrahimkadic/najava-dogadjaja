import styled from 'styled-components';

const Wrapper = styled.div`
  display: inline-block;
  margin-bottom: 1rem;
`;

const AnotherWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const StyledLink = styled.a`
  display: inline-block;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  text-decoration: underline;
  color: #333;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #e3342f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 14px;
  cursor: pointer;
  line-height: 18px;
`;

function RemovableLink({ slikaUrl, onRemove }) {
  // POPRAVITI umjesto idguida koji je u fileName ubaciti novu varijablu sa nazivom fotografije
  const fileName = slikaUrl?.split('/').pop();

  if (!slikaUrl) return null;

  return (
    <Wrapper>
      <AnotherWrapper>
        <StyledLink href={slikaUrl} target="_blank" rel="noopener noreferrer">
          {fileName}
        </StyledLink>

        <RemoveButton onClick={onRemove} title="Ukloni sliku">
          ×
        </RemoveButton>
      </AnotherWrapper>
    </Wrapper>
  );
}

export default RemovableLink;
