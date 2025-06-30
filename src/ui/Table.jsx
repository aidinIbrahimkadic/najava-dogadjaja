import { useContext, createContext } from 'react';
import styled from 'styled-components';

const StyledTable = styled.div`
  margin: 30px;
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const CommonRow = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'columns',
})`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1rem 2.4rem;
  cursor: pointer;
  background-color: var(--color-grey-100);
  border-bottom: 1px solid var(--color-grey-200);
  letter-spacing: 0.4px;
  font-weight: 600;
  font-size: 1.5rem;
  color: var(--color-grey-600);
`;
const StyledRow = styled(CommonRow)`
  padding: 0.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-200);
  }

  &:hover {
    background-color: var(--color-hover-50);
  }
`;

const StyledBody = styled.section``;

const Footer = styled.footer`
  background-color: var(--color-grey-100);
  display: flex;
  justify-content: center;
  padding: 1rem;
  border-top: 1px solid var(--color-grey-100);
  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

const TableContext = createContext();

function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledHeader role="row" columns={columns} as="header">
      {children}
    </StyledHeader>
  );
}
function Row({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledRow role="row" columns={columns}>
      {children}
    </StyledRow>
  );
}

function Body({ data, render }) {
  if (!data.length) return <Empty>No data to show at the moment</Empty>;

  return <StyledBody>{data.map(render)}</StyledBody>;
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

export default Table;
