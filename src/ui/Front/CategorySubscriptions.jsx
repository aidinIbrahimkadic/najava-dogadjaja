import React, { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { FiBell, FiBellOff } from 'react-icons/fi';
import { FaMusic } from 'react-icons/fa';
import Heading from '../Heading';
import * as FaIcons from 'react-icons/fa';

/**
 * CategorySubscriptions
 *
 * Komponenta omogućava korisniku (ulogovan) da se pretplati na obavijesti po kategorijama.
 * Radi sa dummy kategorijama (u API stilu) i spremna je za backend integraciju (props.onSave).
 *
 * Props:
 * - categories?: Array<{ id: string; naziv: string; boja?: string; Icon?: any }>
 * - initialSelectedIds?: string[]
 * - isAuthenticated?: boolean (default true)
 * - onSave?: (selectedIds: string[]) => Promise<void> | void
 * - autoSave?: boolean (default false) // ako je true, poziva onSave pri svakoj promjeni
 */

// ---------- Dummy kategorije (API-ish) + "generisana" nova (Pozorište) ----------

// (opcionalno) lokalna persistencija za demo
// const STORAGE_KEY = 'cat_subscriptions_demo';

const Container = styled.div`
  /* background-color: var(--color-brand-50); */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10rem 0 25rem;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 1rem;
  width: 80%;
`;

const Header = styled.div`
  display: flex;
  margin-top: 2rem;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.8rem;
  color: #111827;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionBtn = styled.button`
  height: 34px;
  padding: 0 0.8rem;
  background: #fff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
  &:hover {
    background: #f9fafb;
    border: 1px solid var(--color-brand-500);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 0.75rem;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(8, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(6, 1fr);
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 540px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.button`
  grid-column: span 3;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  grid-template-areas:
    'icon name toggle'
    'icon badge toggle';
  align-items: center;
  gap: 0.5rem 0.75rem;
  padding: 0.8rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  ${(p) =>
    p.$selected &&
    css`
      border-color: ${p.$color};
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
      background: ${p.$bg};
    `}

  &:hover {
    background: #f9fafb;
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const IconWrap = styled.div`
  grid-area: icon;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  border: 1px solid ${(p) => p.$color}22;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Name = styled.div`
  grid-area: name;
  font-size: 1.6rem;
  font-weight: 600;
  color: #111827;
`;

const Badge = styled.span`
  grid-area: badge;
  font-size: 12px;
  color: #065f46;
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  border-radius: 999px;
  padding: 2px 8px;
  width: max-content;
  visibility: ${(p) => (p.$show ? 'visible' : 'hidden')};
`;

const Toggle = styled.span`
  grid-area: toggle;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 1.6rem;
  color: ${(p) => (p.$active ? 'var(--color-brand-700)' : '#9ca3af')};

  .icon {
    width: 18px;
    height: 18px;
    display: grid;
    place-items: center;
  }
`;

const SaveBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0.75rem;
  background: #ffffff;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
`;

const SaveBtn = styled.button`
  padding: 0.7rem 1rem;
  background: var(--color-brand-500);
  color: #fff;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  transition:
    filter 0.15s ease,
    opacity 0.15s ease;
  &:hover {
    filter: brightness(0.95);
  }
  ${(p) =>
    p.disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
`;

const Note = styled.div`
  font-size: 1.4rem;
  color: #4b5563;
`;

const Hint = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
`;

function withAlpha(hex, alpha = '22') {
  if (!hex || !/^#([0-9a-fA-F]{6})$/.test(hex)) return '#f3f4f6';
  return `${hex}${alpha}`;
}

export default function CategorySubscriptions({
  categories,
  initialSelectedIds,
  isAuthenticated = true,
  onSave,
  autoSave = false,
}) {
  const childrenOnly = (categories ?? []).flatMap((p) => p.children ?? []);

  const kategorije = childrenOnly.map((category) => {
    const IconComponent = FaIcons[category.ikona] || FaIcons.FaQuestion;

    return {
      id: category.idguid,
      naziv: category.naziv,
      boja: category.boja,
      Icon: IconComponent,
    };
  });

  const cats = useMemo(() => kategorije, [kategorije]);
  const defaultSelected = useMemo(() => {
    if (initialSelectedIds?.length) return new Set(initialSelectedIds);

    return new Set();
  }, [initialSelectedIds]);

  const [selected, setSelected] = useState(defaultSelected);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  const toggle = (id) => {
    if (!isAuthenticated) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setDirty(true);
  };

  useEffect(() => {
    if (!autoSave || !onSave || !dirty) return;
    (async () => {
      setSaving(true);
      await onSave?.(selectedIds);
      setSaving(false);
      setDirty(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, autoSave]);

  const selectAll = () => {
    if (!isAuthenticated) return;
    setSelected(new Set(cats.map((c) => c.id)));
    setDirty(true);
  };

  const clearAll = () => {
    if (!isAuthenticated) return;
    setSelected(new Set());
    setDirty(true);
  };

  const save = async () => {
    if (!onSave || !dirty) return;
    setSaving(true);
    await onSave(selectedIds);
    setSaving(false);
    setDirty(false);
  };

  return (
    <Container>
      <Wrapper>
        <Heading as="h2">Dobijajte obavijesti iz odabranih kategorija</Heading>
        <Header>
          <Actions>
            <ActionBtn onClick={selectAll} disabled={!isAuthenticated}>
              Označi sve
            </ActionBtn>
            <ActionBtn onClick={clearAll} disabled={!isAuthenticated}>
              Poništi sve
            </ActionBtn>
          </Actions>
        </Header>

        {!isAuthenticated && <Hint>Morate biti prijavljeni da upravljate obavijestima.</Hint>}

        <Grid>
          {cats.map((c) => {
            const active = selected.has(c.id);
            const bg = withAlpha(c.boja || '#e5e7eb', '22');
            const Icon = c.Icon || FaMusic;
            return (
              <Card
                key={c.id}
                onClick={() => toggle(c.id)}
                $selected={active}
                $color={c.boja || '#111827'}
                $bg={active ? withAlpha(c.boja || '#111827', '33') : '#fff'}
                aria-pressed={active}
              >
                <IconWrap $bg={bg} $color={c.boja || '#111827'}>
                  <Icon />
                </IconWrap>
                <Name>{c.naziv}</Name>
                <Badge $show={active}>Pretplaćeno</Badge>
                <Toggle $active={active}>
                  <span className="icon">{active ? <FiBell /> : <FiBellOff />}</span>
                </Toggle>
              </Card>
            );
          })}
        </Grid>

        <SaveBar>
          <Note>
            Odaberite kategorije za koje želite dobivati push/email obavijesti. Možete promijeniti u
            bilo kojem trenutku.
          </Note>
          <SaveBtn onClick={save} disabled={!dirty || saving || !isAuthenticated}>
            {saving ? 'Spremam…' : 'Sačuvaj'}
          </SaveBtn>
        </SaveBar>
      </Wrapper>
    </Container>
  );
}
