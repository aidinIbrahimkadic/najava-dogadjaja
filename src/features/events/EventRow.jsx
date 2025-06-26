import styled from 'styled-components';

import Table from '../../ui/Table';

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Amount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
`;

function EventRow({ event: { start_date, end_date, title, location } }) {
  console.log('test');
  return (
    <Table.Row>
      <div>{title}</div>
      <div>{location}</div>
      <div>{start_date}</div>
      <div>{end_date}</div>
    </Table.Row>
  );
}

export default EventRow;
