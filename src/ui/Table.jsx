// import { useContext, createContext } from 'react';
// import styled from 'styled-components';

// const StyledTable = styled.div`
//   /* margin: 30px; */
//   width: 100%;
//   border: 1px solid var(--color-grey-200);
//   font-size: 1.4rem;
//   background-color: var(--color-grey-0);
//   border-radius: 7px;
//   overflow: hidden;
// `;

// const CommonRow = styled.div.withConfig({
//   shouldForwardProp: (prop) => prop !== 'columns',
// })`
//   display: grid;
//   grid-template-columns: ${(props) => props.columns};
//   column-gap: 2.4rem;
//   align-items: center;
//   transition: none;
// `;

// const StyledHeader = styled(CommonRow)`
//   padding: 1rem 2.4rem;
//   cursor: pointer;
//   background-color: var(--color-grey-100);
//   border-bottom: 1px solid var(--color-grey-200);
//   letter-spacing: 0.4px;
//   font-weight: 600;
//   font-size: 1.5rem;
//   color: var(--color-grey-600);
// `;
// const StyledRow = styled(CommonRow)`
//   padding: 0.2rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-200);
//   }

//   &:hover {
//     background-color: var(--color-hover-50);
//   }
// `;

// const StyledBody = styled.section``;

// const Footer = styled.footer`
//   background-color: var(--color-grey-100);
//   display: flex;
//   justify-content: center;
//   padding: 1rem;
//   border-top: 1px solid var(--color-grey-100);
//   &:not(:has(*)) {
//     display: none;
//   }
// `;

// const Empty = styled.p`
//   font-size: 1.6rem;
//   font-weight: 500;
//   text-align: center;
//   margin: 2.4rem;
// `;

// const TableContext = createContext();

// function Table({ columns, children }) {
//   return (
//     <TableContext.Provider value={{ columns }}>
//       <StyledTable role="table">{children}</StyledTable>
//     </TableContext.Provider>
//   );
// }

// function Header({ children }) {
//   const { columns } = useContext(TableContext);
//   return (
//     <StyledHeader role="row" columns={columns} as="header">
//       {children}
//     </StyledHeader>
//   );
// }
// function Row({ children }) {
//   const { columns } = useContext(TableContext);
//   return (
//     <StyledRow role="row" columns={columns}>
//       {children}
//     </StyledRow>
//   );
// }

// function Body({ data, render }) {
//   if (!data?.length) return <Empty>No data to show at the moment</Empty>;

//   return <StyledBody>{data.map(render)}</StyledBody>;
// }

// Table.Header = Header;
// Table.Body = Body;
// Table.Row = Row;
// Table.Footer = Footer;

// export default Table;

import React, { useContext, createContext, useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';

/**
 * Table.jsx (server-side ready)
 * ---------------------------------------------------------
 * Backward compatible:
 *  - <Table columns="..."><Table.Header>{children}</Table.Header>...</Table>
 * New optional features (server-side):
 *  - <Table.Toolbar enableSearch placeholder="Pretraži..." />
 *  - <Table.Header config={[ { id:'title', label:'Naziv', field:'title', sortable:true, filter:{type:'text'} }, ... ]}/>
 *  - <Table.FilterRow />
 *  - Controlled query state via props:
 *      query = { page, limit, search, sort:{field,order}, filters:{} }
 *      onQueryChange(nextQuery)
 *  - Query → API param map (no filter[]; uses ?title=, ?price_gte=, ?date_from=, ...)
 *
 * Minimal integration in parent:
 *  1) Držiš query state i prosleđuješ u hook koji zove API.
 *  2) Table kontroli daješ {query, onQueryChange, total}.
 *  3) Header zamijeniš sa config varijantom i (po želji) dodaš Toolbar + FilterRow.
 */

// ---------- Styled ----------
const StyledTable = styled.div`
  width: 100%;
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
  background-color: var(--color-grey-100);
  border-bottom: 1px solid var(--color-grey-200);
  letter-spacing: 0.4px;
  font-weight: 600;
  font-size: 1.5rem;
  color: var(--color-grey-600);
`;

const HeaderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  user-select: none;

  button.sort {
    all: unset;
    cursor: ${(p) => (p.$sortable ? 'pointer' : 'default')};
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: inherit;

    &:hover {
      color: ${(p) => (p.$sortable ? 'var(--color-grey-700)' : 'inherit')};
    }
  }

  .indicator {
    font-size: 1.1rem;
    opacity: 0.9;
  }
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

const ToolbarWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1.2rem;
  border-bottom: 1px solid var(--color-grey-200);
  background: var(--color-grey-0);
`;

const SearchInput = styled.input`
  width: min(420px, 100%);
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 6px;
  font-size: 1.4rem;
  background: var(--color-grey-0);
`;

const FilterRowWrap = styled(CommonRow)`
  padding: 0.6rem 2.4rem;
  background: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-200);
`;

const FilterCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  input,
  select {
    width: 100%;
    min-width: 0;
    padding: 0.5rem 0.6rem;
    border: 1px solid var(--color-grey-200);
    border-radius: 6px;
    font-size: 1.35rem;
  }

  .range {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    width: 100%;
  }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-left: auto;

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.6rem;
    font-size: 1.2rem;
    border: 1px solid var(--color-grey-200);
    border-radius: 999px;
    background: #fff;
    cursor: pointer;
  }
`;

// ---------- Utilities ----------
function useDebouncedValue(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

const nextOrder = (ord) => {
  if (!ord) return 'ASC';
  if (ord === 'ASC') return 'DESC';
  return null; // remove sort
};

// For filters: default keys per type (no filter[] wrapper)
function defaultFilterKey(field, type, bound) {
  if (type === 'numberRange') return bound === 'min' ? `${field}_gte` : `${field}_lte`;
  if (type === 'dateRange') return bound === 'from' ? `${field}_from` : `${field}_to`;
  return field;
}

// ---------- Context ----------
const TableContext = createContext();

// ---------- Root ----------
function Table({
  columns,
  children,
  // Controlled server-state (optional but recommended)
  query, // { page, limit, search, sort:{field,order}, filters:{} }
  onQueryChange, // (next) => void
  total, // total rows (server)
  server = false, // enables server behaviors (reset page on filter/sort/search)
}) {
  const value = useMemo(
    () => ({
      columns,
      query: query || {},
      onQueryChange: onQueryChange || (() => {}),
      total: typeof total === 'number' ? total : undefined,
      server,
    }),
    [columns, query, onQueryChange, total, server]
  );

  return (
    <TableContext.Provider value={value}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

// ---------- Toolbar (Search + applied filters) ----------
function Toolbar({
  enableSearch = false,
  placeholder = 'Search...',
  showChips = true,
  chipLabelMap,
}) {
  const { query, onQueryChange, server } = useContext(TableContext);
  const [local, setLocal] = useState(query?.search || '');
  const debounced = useDebouncedValue(local, 400);

  useEffect(() => setLocal(query?.search || ''), [query?.search]);

  useEffect(() => {
    if (!server || debounced === query?.search) return;
    onQueryChange({
      ...query,
      page: 1,
      search: debounced || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const filters = query?.filters || {};

  const clearAll = () => {
    onQueryChange({ ...query, page: 1, filters: {}, search: undefined });
  };

  const removeKey = (k) => {
    const next = { ...(filters || {}) };
    delete next[k];
    onQueryChange({ ...query, page: 1, filters: next });
  };

  return (
    <ToolbarWrap>
      {enableSearch && (
        <SearchInput
          value={local}
          placeholder={placeholder}
          onChange={(e) => setLocal(e.target.value)}
        />
      )}

      {showChips && !!Object.keys(filters || {}).length && (
        <Chips>
          {Object.entries(filters).map(([k, v]) => {
            const lbl = chipLabelMap?.[k] || k;
            const display = Array.isArray(v) ? v.join(' – ') : String(v);
            return (
              <button className="chip" key={k} onClick={() => removeKey(k)} title="Ukloni filter">
                <span>{lbl}:</span> <strong>{display}</strong> ✕
              </button>
            );
          })}
          <button className="chip" onClick={clearAll} title="Ukloni sve filtere">
            Reset filtera ✕
          </button>
        </Chips>
      )}
    </ToolbarWrap>
  );
}

// ---------- Header (supports config or children) ----------
function Header({ children, config }) {
  const { columns, query, onQueryChange, server } = useContext(TableContext);

  // Backward compatible path
  if (!config?.length) {
    return (
      <StyledHeader role="row" columns={columns} as="header">
        {children}
      </StyledHeader>
    );
  }

  const sortBy = query?.sort?.field;
  const sortOrder = query?.sort?.order;

  const onClickSort = (col) => {
    if (!col.sortable) return;
    const next = nextOrder(col.id === sortBy ? sortOrder : null);
    if (!next) {
      onQueryChange({ ...query, page: 1, sort: undefined });
    } else {
      onQueryChange({
        ...query,
        page: 1,
        sort: { field: col.sortKey || col.field || col.id, order: next },
      });
    }
  };

  return (
    <StyledHeader role="row" columns={columns} as="header">
      {config.map((col) => {
        const active = col.id === sortBy;
        const indicator = active ? (sortOrder === 'ASC' ? '▲' : '▼') : '⇵';
        return (
          <HeaderCell key={col.id} $sortable={!!col.sortable}>
            <button
              type="button"
              className="sort"
              onClick={() => server && onClickSort(col)}
              title={col.sortable ? 'Sortiraj' : undefined}
            >
              <span>{col.label}</span>
              {col.sortable && <span className="indicator">{indicator}</span>}
            </button>
          </HeaderCell>
        );
      })}
    </StyledHeader>
  );
}

// ---------- Filter row (renders from config) ----------
function FilterRow({ config }) {
  const { columns, query, onQueryChange, server } = useContext(TableContext);
  const filters = query?.filters || {};

  if (!config?.some((c) => c.filter)) return null;

  const update = (key, value, removeIfEmpty = true) => {
    const next = { ...(filters || {}) };
    const empty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && !value.some(Boolean));
    if (removeIfEmpty && empty) delete next[key];
    else next[key] = value;
    onQueryChange({ ...query, page: 1, filters: next });
  };

  const renderCell = (col) => {
    if (!col.filter) return <div />;

    const f = col.filter;
    const baseKey = f.key || defaultFilterKey(col.field || col.id, f.type);

    // TEXT
    if (f.type === 'text') {
      const v = filters[baseKey] ?? '';
      return (
        <FilterCell>
          <input
            type="text"
            placeholder={f.placeholder || 'Filtriraj...'}
            value={v}
            onChange={(e) => server && update(baseKey, e.target.value)}
          />
        </FilterCell>
      );
    }

    // SELECT
    if (f.type === 'select') {
      const v = filters[baseKey] ?? '';
      return (
        <FilterCell>
          <select value={v} onChange={(e) => server && update(baseKey, e.target.value)}>
            <option value="">{f.placeholder || '— Sve —'}</option>
            {(f.options || []).map((opt) => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                {opt.label ?? opt}
              </option>
            ))}
          </select>
        </FilterCell>
      );
    }

    // BOOLEAN
    if (f.type === 'boolean') {
      const v = filters[baseKey] ?? '';
      return (
        <FilterCell>
          <select
            value={v}
            onChange={(e) => server && update(baseKey, e.target.value || undefined)}
          >
            <option value="">— Sve —</option>
            <option value="true">Da</option>
            <option value="false">Ne</option>
          </select>
        </FilterCell>
      );
    }

    // NUMBER RANGE
    if (f.type === 'numberRange') {
      const minKey = f.minKey || defaultFilterKey(col.field || col.id, 'numberRange', 'min');
      const maxKey = f.maxKey || defaultFilterKey(col.field || col.id, 'numberRange', 'max');
      const minVal = filters[minKey] ?? '';
      const maxVal = filters[maxKey] ?? '';
      return (
        <FilterCell>
          <div className="range">
            <input
              type="number"
              placeholder={f.minPlaceholder || 'Min'}
              value={minVal}
              onChange={(e) => server && update(minKey, e.target.value, false)}
            />
            <input
              type="number"
              placeholder={f.maxPlaceholder || 'Max'}
              value={maxVal}
              onChange={(e) => server && update(maxKey, e.target.value, false)}
            />
          </div>
        </FilterCell>
      );
    }

    // DATE RANGE (ISO date)
    if (f.type === 'dateRange') {
      const fromKey = f.fromKey || defaultFilterKey(col.field || col.id, 'dateRange', 'from');
      const toKey = f.toKey || defaultFilterKey(col.field || col.id, 'dateRange', 'to');
      const fromVal = filters[fromKey] ?? '';
      const toVal = filters[toKey] ?? '';
      return (
        <FilterCell>
          <div className="range">
            <input
              type="date"
              value={fromVal}
              onChange={(e) => server && update(fromKey, e.target.value, false)}
            />
            <input
              type="date"
              value={toVal}
              onChange={(e) => server && update(toKey, e.target.value, false)}
            />
          </div>
        </FilterCell>
      );
    }

    return <div />;
  };

  return (
    <FilterRowWrap role="row" columns={columns}>
      {config.map((c) => (
        <React.Fragment key={c.id}>{renderCell(c)}</React.Fragment>
      ))}
    </FilterRowWrap>
  );
}

// ---------- Rows & Body (unchanged API) ----------
function Row({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledRow role="row" columns={columns}>
      {children}
    </StyledRow>
  );
}

function Body({ data, render }) {
  if (!data?.length) return <Empty>No data to show at the moment</Empty>;
  return <StyledBody>{data.map(render)}</StyledBody>;
}

// ---------- Exports ----------
Table.Toolbar = Toolbar;
Table.Header = Header;
Table.FilterRow = FilterRow;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

export default Table;
