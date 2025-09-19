import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { URL } from '../../utils/constants';
import Heading from '../Heading';

// ----- Styles -----
const Row = styled.div`
  display: flex;
  flex-wrap: wrap; /* prioritet je jedan red, ali wrap ako baš mora */
  gap: 12px;
  align-items: stretch;
`;

const ImgBox = styled.div`
  /* aspect-ratio: 3 / 2; */
  border-radius: 14px;
  overflow: hidden;
  background: #f3f4f6;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: auto;
    height: 350px;
    object-fit: cover; /* centralni crop */
    display: block;
  }
`;

const Wrapper = styled.div`
  margin: 1rem 0;
  display: flex;
  width: 80%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
`;
// ----- Helper -----
const ZERO_GUID = '00000000-0000-0000-0000-000000000000';

const ManifestationBox = styled(Link)`
  display: flex;
  flex: 1 1 clamp(90px, 12vw, 240px); /* min 90px, ciljno ~12vw, max 240px */
  flex-direction: column;
  transition: 0.2s all;

  &:hover * {
    color: var(--color-brand-500);
    text-decoration: underline;
  }
`;

/**
 * EventPhotosRow
 * @param {Object[]|Object} events   - niz (ili jedan) objekata sa poljima: idguid/id/slika/title
 * @param {number} [height=300]      - query visina: /api/image/:id?height=...
 * @param {string} [routePrefix='manifestation'] - ruta prije ID-a (npr. 'manifestation')
 */
export default function EventPhotosRow({
  events = [],
  height = 500,
  routePrefix = 'manifestation',
}) {
  console.log(events);

  const photos = useMemo(() => {
    const list = Array.isArray(events) ? events : [events].filter(Boolean); // ← nema reasigna
    return list
      .filter((e) => e?.slika && e.slika !== ZERO_GUID)
      .filter((e, i, arr) => arr.findIndex((x) => x.slika === e.slika) === i) // dedupe po slici
      .map((e) => {
        const id = e.idguid ?? e.id ?? e.slika; // šta imaš za rutu
        const src = `${URL}/api/image/${e.slika}?height=${height}`;
        return { id, alt: e.title || 'Fotografija', to: `/${routePrefix}/${id}`, src };
      });
  }, [events, height, routePrefix]);

  if (!photos.length) return null;

  return (
    <Wrapper>
      <Heading as="h1">Manifestacije</Heading>
      <Row>
        {photos.map((p) => (
          <ManifestationBox key={p.id} to={p.to}>
            <Heading as="h3">{p.alt}</Heading>
            <ImgBox>
              <img src={p.src} alt={p.alt} loading="lazy" />
            </ImgBox>
          </ManifestationBox>
        ))}
      </Row>
    </Wrapper>
  );
}
