// import React, { useMemo } from 'react';
// import styled from 'styled-components';
// import * as Fa from 'react-icons/fa';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { Link } from 'react-router-dom';
// import Heading from '../Heading';

// /**
//  * Elegant event page component
//  * - Left: Poster image
//  * - Right: Key info (title, category, date/time, price, location, organizer)
//  * - Bottom: Leaflet map centered on event.lokacija { latitude, longitude }
//  *
//  * Notes:
//  * - Uses styled-components, minimal external UI libs
//  * - Ant Design avoided (per request) except you can add it around if desired
//  * - Pass full `event` object (data) via props: <EventPage event={data} />
//  */

// // —— Theme ——
// const BRAND = '#f97316';
// const BRAND_DARK = '#c75a0f';
// const TEXT = '#0f172a';
// const MUTED = '#64748b';
// const CARD_BG = '#fff7ed';
// const RADIUS = '18px';

// // —— Image Helpers ——
// const getImageUrl = (event) => {
//   if (!event) return '';
//   if (event.slika && event.slika !== '00000000-0000-0000-0000-000000000000') {
//     return `https://events-opcina.poruci.ba/api/image/${event.slika}?height=400`;
//   }
//   return `https://events-opcina.poruci.ba/api/events/slika/${event.idguid}`;
// };

// // —— Leaflet default marker fix (so the marker icon loads properly) ——
// const DefaultIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// // —— Styled ——
// const Page = styled.div`
//   --brand: ${BRAND};
//   --brand-dark: ${BRAND_DARK};
//   --text: ${TEXT};
//   --muted: ${MUTED};
//   --card-bg: ${CARD_BG};

//   display: grid;
//   grid-template-columns: 0.4fr 1fr;
//   /* gap: 2rem; */
//   align-items: start;
//   padding: 2rem 0;
//   margin-bottom: 7rem;

//   @media (max-width: 980px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const Poster = styled.div`
//   background: #fff;
//   border-radius: ${RADIUS} 0 0 ${RADIUS};
//   box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08);
//   overflow: hidden;
//   position: sticky;
//   top: 16px;

//   @media (max-width: 980px) {
//     position: static;
//   }
// `;

// const PosterImg = styled.img`
//   width: 100%;
//   height: auto;
//   display: block;
// `;

// const InfoCard = styled.section`
//   background: #fff;
//   border-radius: 0 ${RADIUS} ${RADIUS} 0;
//   box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
//   padding: 1.5rem;
//   display: grid;
//   height: 100%;
//   gap: 1rem;
// `;

// const HeaderRow = styled.div`
//   display: flex;
//   justify-content: space-between;
//   /* display: grid;
//   grid-template-columns: auto 1fr auto; */
//   /* gap: 0.75rem 1rem;
//   align-items: center; */
// `;

// const Pill = styled.span`
//   display: inline-flex;
//   align-items: center;
//   width: fit-content;
//   height: fit-content;
//   gap: 0.5rem;
//   background: ${(p) => p.$bg || 'var(--card-bg)'};
//   color: ${(p) => p.color || 'var(--text)'};
//   border: 1px solid rgba(0, 0, 0, 0.06);
//   padding: 0.4rem 0.75rem;
//   border-radius: 999px;
//   font-size: 0.9rem;
//   font-weight: 600;
// `;

// const Title = styled.h1`
//   margin: 0;
//   color: var(--text);
//   font-size: clamp(1.8rem, 2.2vw, 2.4rem);
//   line-height: 1.15;
// `;

// const Price = styled.div`
//   color: var(--brand);
//   font-weight: 800;
//   font-size: 1.6rem;
// `;

// const MetaGrid = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 50%;
//   /* grid-template-columns: 1fr 1fr; */
//   gap: 3rem;
//   margin-top: 0.25rem;
//   @media (max-width: 680px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const MetaItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   color: var(--text);
// `;

// const Label = styled.div`
//   font-size: 1rem;
//   color: var(--muted);
//   margin-bottom: 0.1rem;
// `;

// const Strong = styled.div`
//   font-weight: 700;
// `;

// const Divider = styled.hr`
//   border: none;
//   border-top: 1px dashed rgba(0, 0, 0, 0.08);
//   margin: 0.5rem 0 0.25rem;
// `;

// const Actions = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.75rem;
//   margin-top: 0.5rem;
// `;

// const Button = styled.button`
//   background: ${(p) => (p.$variant === 'outline' ? 'transparent' : 'var(--brand)')};
//   color: ${(p) => (p.$variant === 'outline' ? 'var(--brand)' : '#fff')};
//   border: 2px solid var(--brand);
//   padding: 0.6rem 1rem;
//   border-radius: 999px;
//   font-weight: 700;
//   cursor: pointer;
//   transition:
//     transform 0.12s ease,
//     box-shadow 0.12s ease,
//     background 0.12s ease,
//     color 0.12s ease;
//   box-shadow: ${(p) => (p.$variant === 'outline' ? 'none' : '0 8px 18px rgba(249,115,22,0.25)')};

//   &:hover {
//     transform: translateY(-1px);
//     background: ${(p) =>
//       p.$variant === 'outline' ? 'rgba(249,115,22,0.06)' : 'var(--brand-dark)'};
//   }
// `;

// const OrgRow = styled.div`
//   display: grid;
//   grid-template-columns: 44px 1fr;
//   gap: 0.75rem;
//   align-items: center;
// `;

// const OrgLogo = styled.img`
//   width: 44px;
//   height: 44px;
//   object-fit: contain;
//   border-radius: 10px;
//   border: 1px solid rgba(0, 0, 0, 0.06);
//   background: #fff;
// `;

// const OrgName = styled.div`
//   font-weight: 700;
// `;

// const MapCard = styled.section`
//   margin-top: 1rem;
//   background: #fff;
//   border-radius: ${RADIUS};
//   box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
//   overflow: hidden;
// `;

// const MapHeader = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0.85rem 1rem;
//   border-bottom: 1px solid rgba(0, 0, 0, 0.06);
//   background: linear-gradient(180deg, #fff, #fff9f3);
// `;

// const MapTitle = styled.h3`
//   margin: 0;
//   font-size: 1.6rem;
//   color: var(--text);
// `;

// const MapBody = styled.div`
//   height: 380px;
//   width: 100%;
//   @media (max-width: 680px) {
//     height: 320px;
//   }
// `;

// function formatMoney(value) {
//   if (value === null || value === undefined) return '—';
//   const n = Number(value);
//   if (Number.isNaN(n)) return String(value);
//   // Force 2 decimals with dot and " KM" suffix
//   return `${n.toFixed(2)} KM`;
// }

// function formatDateTime(iso) {
//   if (!iso) return '—';
//   try {
//     const d = new Date(iso);
//     const dd = String(d.getDate()).padStart(2, '0');
//     const mm = String(d.getMonth() + 1).padStart(2, '0');
//     const yyyy = d.getFullYear();
//     const date = `${dd}.${mm}.${yyyy}`; // e.g., 14.08.2025
//     const time = new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
//     return { date, time };
//   } catch {
//     return { date: '—', time: '—' };
//   }
// }

// function getCategoryIcon(nameOrKey, fallbackColor = '#eef2ff') {
//   // nameOrKey can be event.category.ikona like "FaBook" or category name
//   const key = nameOrKey && Fa[nameOrKey] ? nameOrKey : 'FaCalendarAlt';
//   const Icon = Fa[key];
//   return { Icon, color: fallbackColor };
// }

// export default function SingleEvent({ event }) {
//   const imageUrl = useMemo(() => getImageUrl(event), [event]);

//   const start = formatDateTime(event?.start_date);
//   //   const end = formatDateTime(event?.end_date);
//   const catColor = event?.category?.boja || '#eef2ff';
//   const { Icon: CatIcon } = getCategoryIcon(event?.category?.ikona, catColor);

//   const lat = event?.lokacija?.latitude;
//   const lng = event?.lokacija?.longitude;
//   const hasCoords = typeof lat === 'number' && typeof lng === 'number';

//   return (
//     <div>
//       <Heading as="h1">Informacije o događaju</Heading>
//       <Page>
//         {/* Left: Poster */}
//         <Poster>
//           {imageUrl ? (
//             <PosterImg src={imageUrl} alt={event?.title || 'Poster'} />
//           ) : (
//             <PosterImg
//               src={`https://placehold.co/800x1100/fff7ed/262626?text=${encodeURIComponent(event?.title || 'Događaj')}`}
//               alt="Poster placeholder"
//             />
//           )}
//         </Poster>

//         {/* Right: Info */}
//         <div style={{ height: '100%' }}>
//           <InfoCard>
//             <div>
//               <HeaderRow>
//                 <Title>{event?.title}</Title>
//                 <MetaItem>
//                   <Fa.FaCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
//                   <div>
//                     <Label>Status</Label>
//                     <Strong>
//                       {event?.is_ongoing
//                         ? 'U toku'
//                         : event?.is_upcoming
//                           ? 'Uskoro'
//                           : event?.is_past
//                             ? 'Završeno'
//                             : '—'}
//                     </Strong>
//                   </div>
//                 </MetaItem>
//               </HeaderRow>
//               <Pill $bg={catColor}>
//                 <CatIcon /> {event?.category?.naziv || 'Kategorija'}
//               </Pill>
//             </div>
//             <div
//               style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
//             >
//               <MetaGrid>
//                 <MetaItem>
//                   <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
//                   <div>
//                     <Label>Datum</Label>
//                     <Strong>{start.date}</Strong>
//                     {event?.duration_days > 0 && (
//                       <div style={{ color: MUTED, fontSize: '0.9rem' }}>
//                         Trajanje: {event?.duration_days} dana
//                       </div>
//                     )}
//                   </div>
//                 </MetaItem>
//                 <MetaItem>
//                   <Fa.FaClock size={26} style={{ marginTop: 2, color: BRAND }} />
//                   <div>
//                     <Label>Vrijeme</Label>
//                     <Strong>{start.time}</Strong>
//                     {event?.duration_days > 0 && (
//                       <div style={{ color: MUTED, fontSize: '0.9rem' }}>
//                         Trajanje: {event?.duration_days} dana
//                       </div>
//                     )}
//                   </div>
//                 </MetaItem>
//                 <MetaItem>
//                   <Fa.FaMapMarkerAlt
//                     size={26}
//                     style={{ marginTop: 2, color: BRAND, width: '5rem' }}
//                   />
//                   <div>
//                     <Label>Lokacija</Label>
//                     <Strong>{event?.lokacija?.naziv || '—'}</Strong>
//                     <div style={{ color: MUTED, fontSize: '0.9rem' }}>
//                       {event?.lokacija?.adresa || event?.location || '—'}
//                     </div>
//                   </div>
//                 </MetaItem>
//               </MetaGrid>
//               <Price>{formatMoney(event?.cijena)}</Price>
//             </div>

//             <Divider />

//             {event?.description && (
//               <div style={{ color: TEXT, lineHeight: 1.65 }}>{event.description}</div>
//             )}

//             {/* Organizer / Institution */}
//             {event?.institucija && (
//               <div
//                 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//               >
//                 {/* <Divider /> */}
//                 <OrgRow>
//                   {/* <Label>Organizator</Label> */}
//                   {event.institucija.logo ? (
//                     <Link to={`/institution/${event.institucija.idguid}`}>
//                       <OrgLogo src={event.institucija.logo} alt={event.institucija.naziv} />
//                     </Link>
//                   ) : (
//                     <div
//                       style={{
//                         width: 44,
//                         height: 44,
//                         borderRadius: 10,
//                         border: '1px solid rgba(0,0,0,0.06)',
//                         display: 'grid',
//                         placeItems: 'center',
//                         color: BRAND,
//                       }}
//                     >
//                       <Fa.FaBuilding size={20} />
//                     </div>
//                   )}
//                   <div>
//                     <Link to={`/institution/${event.institucija.idguid}`}>
//                       <OrgName>{event.institucija.naziv}</OrgName>
//                     </Link>
//                     <div style={{ color: MUTED, fontSize: '0.9rem' }}>
//                       {event.institucija.email || event.institucija.web_stranica || ''}
//                     </div>
//                   </div>
//                 </OrgRow>
//                 <Actions>
//                   {/* <Button onClick={() => window.print()}>Sačuvaj/štampaj</Button> */}
//                   {hasCoords && (
//                     <div>
//                       <Button
//                         $variant="outline"
//                         onClick={() => {
//                           const q = encodeURIComponent(`${lat},${lng}`);
//                           window.open(`https://www.google.com/maps?q=${q}`, '_blank');
//                         }}
//                       >
//                         Otvori u Google Maps
//                       </Button>
//                     </div>
//                   )}
//                 </Actions>
//               </div>
//             )}
//           </InfoCard>
//         </div>
//       </Page>

//       {/* Map */}
//       <MapCard>
//         <MapHeader>
//           <MapTitle>Mapa događaja</MapTitle>
//           {hasCoords ? (
//             <Pill color={TEXT} $bg={'#fff'}>
//               <Fa.FaLocationArrow /> {lat.toFixed(6)}, {lng.toFixed(6)}
//             </Pill>
//           ) : (
//             <Pill color={MUTED} $bg={'#fff'}>
//               <Fa.FaInfoCircle /> Lokacija nije definirana
//             </Pill>
//           )}
//         </MapHeader>
//         <MapBody>
//           {hasCoords ? (
//             <MapContainer
//               key={`${event?.idguid}-${lat}-${lng}`}
//               center={[lat, lng]}
//               zoom={15}
//               style={{ height: '100%', width: '100%' }}
//               scrollWheelZoom={false}
//             >
//               <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               <Marker position={[lat, lng]}>
//                 <Popup>
//                   <strong>{event?.title}</strong>
//                   <br />
//                   {event?.lokacija?.naziv || ''}
//                   <br />
//                   {event?.lokacija?.adresa || ''}
//                 </Popup>
//               </Marker>
//             </MapContainer>
//           ) : (
//             <div
//               style={{
//                 height: '100%',
//                 width: '100%',
//                 display: 'grid',
//                 placeItems: 'center',
//                 color: MUTED,
//               }}
//             >
//               Nema koordinata za prikaz mape.
//             </div>
//           )}
//         </MapBody>
//       </MapCard>
//     </div>
//   );
// }

// VERZIJA 2 DODAVANJE U GOOGLE KALENDAR

// import React, { useMemo } from 'react';
// import styled from 'styled-components';
// import * as Fa from 'react-icons/fa';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { Link } from 'react-router-dom';
// import Heading from '../Heading';

// /**
//  * Elegant event page component
//  * - Left: Poster image
//  * - Right: Key info (title, category, date/time, price, location, organizer)
//  * - Bottom: Leaflet map centered on event.lokacija { latitude, longitude }
//  */

// // —— Theme ——
// const BRAND = '#f97316';
// const BRAND_DARK = '#c75a0f';
// const TEXT = '#0f172a';
// const MUTED = '#64748b';
// const CARD_BG = '#fff7ed';
// const RADIUS = '18px';

// // —— Image Helpers ——
// const getImageUrl = (event) => {
//   if (!event) return '';
//   if (event.slika && event.slika !== '00000000-0000-0000-0000-000000000000') {
//     return `https://events-opcina.poruci.ba/api/image/${event.slika}?height=400`;
//   }
//   return `https://events-opcina.poruci.ba/api/events/slika/${event.idguid}`;
// };

// // —— Leaflet default marker fix ——
// const DefaultIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// // —— Styled ——
// const Page = styled.div`
//   --brand: ${BRAND};
//   --brand-dark: ${BRAND_DARK};
//   --text: ${TEXT};
//   --muted: ${MUTED};
//   --card-bg: ${CARD_BG};

//   display: grid;
//   grid-template-columns: 0.4fr 1fr;
//   align-items: start;
//   padding: 2rem 0;
//   margin-bottom: 7rem;

//   @media (max-width: 980px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const Poster = styled.div`
//   background: #fff;
//   border-radius: ${RADIUS} 0 0 ${RADIUS};
//   box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08);
//   overflow: hidden;
//   position: sticky;
//   top: 16px;

//   @media (max-width: 980px) {
//     position: static;
//   }
// `;

// const PosterImg = styled.img`
//   width: 100%;
//   height: auto;
//   display: block;
// `;

// const InfoCard = styled.section`
//   background: #fff;
//   border-radius: 0 ${RADIUS} ${RADIUS} 0;
//   box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
//   padding: 1.5rem;
//   display: grid;
//   height: 100%;
//   gap: 1rem;
// `;

// const HeaderRow = styled.div`
//   display: flex;
//   justify-content: space-between;
// `;

// const Pill = styled.span`
//   display: inline-flex;
//   align-items: center;
//   width: fit-content;
//   height: fit-content;
//   gap: 0.5rem;
//   background: ${(p) => p.$bg || 'var(--card-bg)'};
//   color: ${(p) => p.color || 'var(--text)'};
//   border: 1px solid rgba(0, 0, 0, 0.06);
//   padding: 0.4rem 0.75rem;
//   border-radius: 999px;
//   font-size: 0.9rem;
//   font-weight: 600;
// `;

// const Title = styled.h1`
//   margin: 0;
//   color: var(--text);
//   font-size: clamp(1.8rem, 2.2vw, 2.4rem);
//   line-height: 1.15;
// `;

// const Price = styled.div`
//   color: var(--brand);
//   font-weight: 800;
//   font-size: 1.6rem;
// `;

// const MetaGrid = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 50%;
//   gap: 1rem;
//   margin-top: 0.25rem;
//   @media (max-width: 680px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const MetaItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   color: var(--text);
// `;

// const Label = styled.div`
//   font-size: 1rem;
//   color: var(--muted);
//   margin-bottom: 0.1rem;
// `;

// const Strong = styled.div`
//   font-weight: 700;
// `;

// const Divider = styled.hr`
//   border: none;
//   border-top: 1px dashed rgba(0, 0, 0, 0.08);
//   margin: 0.5rem 0 0.25rem;
// `;

// const Actions = styled.div`
//   display: flex;
//   /* flex-wrap: wrap; */
//   align-items: center;
//   gap: 0.75rem;
//   margin-top: 0.5rem;
// `;

// // const Button = styled.button`
// //   background: ${(p) => (p.$variant === 'outline' ? 'transparent' : 'var(--brand)')};
// //   color: ${(p) => (p.$variant === 'outline' ? 'var(--brand)' : '#fff')};
// //   border: 2px solid var(--brand);
// //   padding: 0.6rem 1rem;
// //   border-radius: 999px;
// //   font-weight: 700;
// //   cursor: pointer;
// //   transition:
// //     transform 0.12s ease,
// //     box-shadow 0.12s ease,
// //     background 0.12s ease,
// //     color 0.12s ease;
// //   box-shadow: ${(p) => (p.$variant === 'outline' ? 'none' : '0 8px 18px rgba(249,115,22,0.25)')};

// //   &:hover {
// //     transform: translateY(-1px);
// //     background: ${(p) =>
// //       p.$variant === 'outline' ? 'rgba(249,115,22,0.06)' : 'var(--brand-dark)'};
// //   }
// // `;

// const Button = styled.button`
//   display: inline-flex; /* poravnaj sadržaj kao flex */
//   align-items: center; /* vertikalno centriraj ikonu + tekst */
//   gap: 0.5rem; /* razmak ikona–tekst */
//   height: 42px; /* JEDNAKA visina za sva dugmad */
//   padding: 0 10px; /* samo horizontalni padding */
//   line-height: 1; /* ukloni višak visine od fonta */
//   box-sizing: border-box; /* uračunaj border u visinu/širinu */

//   background: ${(p) => (p.$variant === 'outline' ? 'transparent' : 'var(--brand)')};
//   color: ${(p) => (p.$variant === 'outline' ? 'var(--brand)' : '#fff')};
//   border: 2px solid var(--brand);
//   border-radius: 999px;
//   font-weight: 700;
//   cursor: pointer;
//   transition:
//     transform 0.12s ease,
//     box-shadow 0.12s ease,
//     background 0.12s ease,
//     color 0.12s ease;
//   box-shadow: ${(p) => (p.$variant === 'outline' ? 'none' : '0 8px 18px rgba(249,115,22,0.25)')};

//   &:hover {
//     transform: translateY(-1px);
//     background: ${(p) =>
//       p.$variant === 'outline' ? 'rgba(249,115,22,0.06)' : 'var(--brand-dark)'};
//   }

//   /* spriječi da SVG utiče na visinu */
//   & > svg {
//     display: block;
//     flex-shrink: 0;
//   }
// `;

// const OrgRow = styled.div`
//   display: grid;
//   grid-template-columns: 44px 1fr;
//   gap: 0.75rem;
//   align-items: center;
// `;

// const OrgLogo = styled.img`
//   width: 44px;
//   height: 44px;
//   object-fit: contain;
//   border-radius: 10px;
//   border: 1px solid rgba(0, 0, 0, 0.06);
//   background: #fff;
// `;

// const OrgName = styled.div`
//   font-weight: 700;
// `;

// const MapCard = styled.section`
//   margin-top: 1rem;
//   background: #fff;
//   border-radius: ${RADIUS};
//   box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
//   overflow: hidden;
// `;

// const MapHeader = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0.85rem 1rem;
//   border-bottom: 1px solid rgba(0, 0, 0, 0.06);
//   background: linear-gradient(180deg, #fff, #fff9f3);
// `;

// const MapTitle = styled.h3`
//   margin: 0;
//   font-size: 1.6rem;
//   color: var(--text);
// `;

// const MapBody = styled.div`
//   height: 380px;
//   width: 100%;
//   @media (max-width: 680px) {
//     height: 320px;
//   }
// `;

// // —— Helpers: format date/time & build Google Calendar URL ——
// // Format date to YYYYMMDDTHHmmssZ in UTC
// function toGCalUTC(isoString) {
//   const d = new Date(isoString);
//   const yyyy = d.getUTCFullYear();
//   const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
//   const dd = String(d.getUTCDate()).padStart(2, '0');
//   const HH = String(d.getUTCHours()).padStart(2, '0');
//   const MM = String(d.getUTCMinutes()).padStart(2, '0');
//   const SS = String(d.getUTCSeconds()).padStart(2, '0');
//   return `${yyyy}${mm}${dd}T${HH}${MM}${SS}Z`;
// }

// function toGCalDateRange(startISO, endISO) {
//   return `${toGCalUTC(startISO)}/${toGCalUTC(endISO)}`;
// }

// function buildGCalHref(ev) {
//   if (!ev?.start_date) return null;

//   const start = new Date(ev.start_date);
//   // end iz event.end_date ili default +2h
//   const end = ev.end_date ? new Date(ev.end_date) : new Date(start.getTime() + 2 * 60 * 60 * 1000);

//   const dates = toGCalDateRange(start.toISOString(), end.toISOString());

//   const location =
//     (ev?.lokacija?.naziv || '') + (ev?.lokacija?.adresa ? `, ${ev.lokacija.adresa}` : '') ||
//     ev?.location ||
//     '';

//   const params = new URLSearchParams({
//     text: ev?.title || 'Događaj',
//     dates,
//     details: ev?.description || '',
//     location,
//   });

//   return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
// }

// function formatMoney(value) {
//   if (value === null || value === undefined) return '—';
//   const n = Number(value);
//   if (Number.isNaN(n)) return String(value);
//   return `${n.toFixed(2)} KM`;
// }

// function formatDateTime(iso) {
//   if (!iso) return '—';
//   try {
//     const d = new Date(iso);
//     const dd = String(d.getDate()).padStart(2, '0');
//     const mm = String(d.getMonth() + 1).padStart(2, '0');
//     const yyyy = d.getFullYear();
//     const date = `${dd}.${mm}.${yyyy}`;
//     const time = new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
//     return { date, time };
//   } catch {
//     return { date: '—', time: '—' };
//   }
// }

// function getCategoryIcon(nameOrKey, fallbackColor = '#eef2ff') {
//   const key = nameOrKey && Fa[nameOrKey] ? nameOrKey : 'FaCalendarAlt';
//   const Icon = Fa[key];
//   return { Icon, color: fallbackColor };
// }

// export default function SingleEvent({ event }) {
//   const imageUrl = useMemo(() => getImageUrl(event), [event]);

//   const start = formatDateTime(event?.start_date);
//   const catColor = event?.category?.boja || '#eef2ff';
//   const { Icon: CatIcon } = getCategoryIcon(event?.category?.ikona, catColor);

//   const lat = event?.lokacija?.latitude;
//   const lng = event?.lokacija?.longitude;
//   const hasCoords = typeof lat === 'number' && typeof lng === 'number';

//   // GCal link (memoized)
//   const gcalHref = useMemo(() => buildGCalHref(event), [event]);

//   return (
//     <div>
//       <Heading as="h1">Informacije o događaju</Heading>
//       <Page>
//         {/* Left: Poster */}
//         <Poster>
//           {imageUrl ? (
//             <PosterImg src={imageUrl} alt={event?.title || 'Poster'} />
//           ) : (
//             <PosterImg
//               src={`https://placehold.co/800x1100/fff7ed/262626?text=${encodeURIComponent(
//                 event?.title || 'Događaj'
//               )}`}
//               alt="Poster placeholder"
//             />
//           )}
//         </Poster>

//         {/* Right: Info */}
//         <div style={{ height: '100%' }}>
//           <InfoCard>
//             <div>
//               <HeaderRow>
//                 <Title>{event?.title}</Title>
//                 <MetaItem>
//                   <Fa.FaCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
//                   <div>
//                     <Label>Status</Label>
//                     <Strong>
//                       {event?.is_ongoing
//                         ? 'U toku'
//                         : event?.is_upcoming
//                           ? 'Uskoro'
//                           : event?.is_past
//                             ? 'Završeno'
//                             : '—'}
//                     </Strong>
//                   </div>
//                 </MetaItem>
//               </HeaderRow>
//               <Pill $bg={catColor}>
//                 <CatIcon /> {event?.category?.naziv || 'Kategorija'}
//               </Pill>
//             </div>
//             <div
//               style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
//             >
//               <MetaGrid>
//                 <MetaItem>
//                   <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
//                   <div>
//                     <Label>Datum</Label>
//                     <Strong>{start.date}</Strong>
//                     {event?.duration_days > 0 && (
//                       <div style={{ color: MUTED, fontSize: '0.9rem' }}>
//                         Trajanje: {event?.duration_days} dana
//                       </div>
//                     )}
//                   </div>
//                 </MetaItem>
//                 <MetaItem>
//                   <Fa.FaClock size={26} style={{ marginTop: 2, color: BRAND }} />
//                   <div>
//                     <Label>Vrijeme</Label>
//                     <Strong>{start.time}</Strong>
//                     {event?.duration_days > 0 && (
//                       <div style={{ color: MUTED, fontSize: '0.9rem' }}>
//                         Trajanje: {event?.duration_days} dana
//                       </div>
//                     )}
//                   </div>
//                 </MetaItem>
//                 <MetaItem>
//                   <Fa.FaMapMarkerAlt size={26} style={{ marginTop: 2, color: BRAND }} />
//                   <div>
//                     <Label>Lokacija</Label>
//                     <Strong>{event?.lokacija?.naziv || '—'}</Strong>
//                     {/* <div style={{ color: MUTED, fontSize: '0.9rem' }}>
//                       {event?.lokacija?.adresa || event?.location || '—'}
//                     </div> */}
//                   </div>
//                 </MetaItem>
//               </MetaGrid>
//               <Price>{formatMoney(event?.cijena)}</Price>
//             </div>

//             {/* {event?.description && (
//               <div style={{ color: TEXT, lineHeight: 1.65 }}>{event.description}</div>
//             )} */}

//             <Divider />
//             {/* Organizer / Institution */}
//             {event?.institucija && (
//               <div
//                 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//               >
//                 <OrgRow>
//                   {event.institucija.logo ? (
//                     <Link to={`/institution/${event.institucija.idguid}`}>
//                       <OrgLogo src={event.institucija.logo} alt={event.institucija.naziv} />
//                     </Link>
//                   ) : (
//                     <div
//                       style={{
//                         width: 44,
//                         height: 44,
//                         borderRadius: 10,
//                         border: '1px solid rgba(0,0,0,0.06)',
//                         display: 'grid',
//                         placeItems: 'center',
//                         color: BRAND,
//                       }}
//                     >
//                       <Fa.FaBuilding size={20} />
//                     </div>
//                   )}
//                   <div>
//                     <Link to={`/institution/${event.institucija.idguid}`}>
//                       <OrgName>{event.institucija.naziv}</OrgName>
//                     </Link>
//                     <div style={{ color: MUTED, fontSize: '0.9rem' }}>
//                       {event.institucija.email || event.institucija.web_stranica || ''}
//                     </div>
//                   </div>
//                 </OrgRow>
//                 <Actions>
//                   {/* Add to Google Calendar */}
//                   {gcalHref && (
//                     <div>
//                       <Button onClick={() => window.open(gcalHref, '_blank')}>
//                         <Fa.FaGoogle style={{ marginRight: 8 }} />
//                         Dodaj u Google kalendar
//                       </Button>
//                       {/* <a
//                         href={gcalHref}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         style={{ textDecoration: 'none' }}
//                       >
//                         <Button>
//                           <Fa.FaGoogle style={{ marginRight: 8 }} />
//                           Dodaj u Google kalendar
//                         </Button>
//                       </a> */}
//                     </div>
//                   )}

//                   {/* Google Maps */}
//                   {hasCoords && (
//                     <div>
//                       <Button
//                         $variant="outline"
//                         onClick={() => {
//                           const q = encodeURIComponent(`${lat},${lng}`);
//                           window.open(`https://www.google.com/maps?q=${q}`, '_blank');
//                         }}
//                       >
//                         Otvori u Google Maps
//                       </Button>
//                     </div>
//                   )}
//                 </Actions>
//               </div>
//             )}
//           </InfoCard>
//         </div>
//       </Page>

//       {/* Map */}
//       <MapCard>
//         <MapHeader>
//           <MapTitle>Mapa događaja</MapTitle>
//           {hasCoords ? (
//             <Pill color={TEXT} $bg={'#fff'}>
//               <Fa.FaLocationArrow /> {lat.toFixed(6)}, {lng.toFixed(6)}
//             </Pill>
//           ) : (
//             <Pill color={MUTED} $bg={'#fff'}>
//               <Fa.FaInfoCircle /> Lokacija nije definirana
//             </Pill>
//           )}
//         </MapHeader>
//         <MapBody>
//           {hasCoords ? (
//             <MapContainer
//               key={`${event?.idguid}-${lat}-${lng}`}
//               center={[lat, lng]}
//               zoom={15}
//               style={{ height: '100%', width: '100%' }}
//               scrollWheelZoom={false}
//             >
//               <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               <Marker position={[lat, lng]}>
//                 <Popup>
//                   <strong>{event?.title}</strong>
//                   <br />
//                   {event?.lokacija?.naziv || ''}
//                   <br />
//                   {event?.lokacija?.adresa || ''}
//                 </Popup>
//               </Marker>
//             </MapContainer>
//           ) : (
//             <div
//               style={{
//                 height: '100%',
//                 width: '100%',
//                 display: 'grid',
//                 placeItems: 'center',
//                 color: MUTED,
//               }}
//             >
//               Nema koordinata za prikaz mape.
//             </div>
//           )}
//         </MapBody>
//       </MapCard>
//     </div>
//   );
// }

// END DATE VERZIJA 3

// === File: SingleEvent.jsx ===
// import React, { useMemo } from 'react';
// import styled from 'styled-components';
// import * as Fa from 'react-icons/fa';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { Link } from 'react-router-dom';
// import Heading from '../Heading';

// // —— Theme ——
// const BRAND = '#f97316';
// const BRAND_DARK = '#c75a0f';
// const TEXT = '#0f172a';
// const MUTED = '#64748b';
// const CARD_BG = '#fff7ed';
// const RADIUS = '18px';

// // —— Image Helpers ——
// const getImageUrl = (event) => {
//   if (!event) return '';
//   if (event.slika && event.slika !== '00000000-0000-0000-0000-000000000000') {
//     return `https://events-opcina.poruci.ba/api/image/${event.slika}?height=400`;
//   }
//   return `https://events-opcina.poruci.ba/api/events/slika/${event.idguid}`;
// };

// // —— Leaflet marker fix ——
// const DefaultIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// // —— Styled ——
// const PageWrap = styled.div`
//   --brand: ${BRAND};
//   --brand-dark: ${BRAND_DARK};
//   --text: ${TEXT};
//   --muted: ${MUTED};
//   --card-bg: ${CARD_BG};

//   display: grid;
//   grid-template-columns: 0.4fr 1fr;
//   align-items: start;
//   padding: 2rem 0;
//   margin-bottom: 7rem;

//   @media (max-width: 980px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const Poster = styled.div`
//   background: #fff;
//   border-radius: ${RADIUS} 0 0 ${RADIUS};
//   box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08);
//   overflow: hidden;
//   position: sticky;
//   top: 16px;

//   @media (max-width: 980px) {
//     position: static;
//   }
// `;

// const PosterImg = styled.img`
//   width: 100%;
//   height: auto;
//   display: block;
// `;

// const InfoCard = styled.section`
//   background: #fff;
//   border-radius: 0 ${RADIUS} ${RADIUS} 0;
//   box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
//   padding: 1.5rem;
//   display: grid;
//   height: 100%;
//   gap: 1rem;
// `;

// const HeaderRow = styled.div`
//   display: flex;
//   justify-content: space-between;
// `;

// const Pill = styled.span`
//   display: inline-flex;
//   align-items: center;
//   width: fit-content;
//   height: fit-content;
//   gap: 0.5rem;
//   background: ${(p) => p.$bg || 'var(--card-bg)'};
//   color: ${(p) => p.color || 'var(--text)'};
//   border: 1px solid rgba(0, 0, 0, 0.06);
//   padding: 0.4rem 0.75rem;
//   border-radius: 999px;
//   font-size: 0.9rem;
//   font-weight: 600;
// `;

// const Title = styled.h1`
//   margin: 0;
//   color: var(--text);
//   font-size: clamp(1.8rem, 2.2vw, 2.4rem);
//   line-height: 1.15;
// `;

// const Price = styled.div`
//   color: var(--brand);
//   font-weight: 800;
//   font-size: 1.6rem;
// `;

// const MetaGrid = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 50%;
//   gap: 1rem;
//   margin-top: 0.25rem;
//   @media (max-width: 680px) {
//     width: 100%;
//   }
// `;

// const MetaItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   color: var(--text);
// `;

// const Label = styled.div`
//   font-size: 1rem;
//   color: var(--muted);
//   margin-bottom: 0.1rem;
// `;

// const Strong = styled.div`
//   font-weight: 700;
// `;

// const Divider = styled.hr`
//   border: none;
//   border-top: 1px dashed rgba(0, 0, 0, 0.08);
//   margin: 0.5rem 0 0.25rem;
// `;

// const Actions = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.75rem;
//   margin-top: 0.5rem;
// `;

// const Button = styled.button`
//   display: inline-flex;
//   align-items: center;
//   gap: 0.5rem;
//   height: 42px;
//   padding: 0 10px;
//   line-height: 1;
//   box-sizing: border-box;

//   background: ${(p) => (p.$variant === 'outline' ? 'transparent' : 'var(--brand)')};
//   color: ${(p) => (p.$variant === 'outline' ? 'var(--brand)' : '#fff')};
//   border: 2px solid var(--brand);
//   border-radius: 999px;
//   font-weight: 700;
//   cursor: pointer;
//   transition:
//     transform 0.12s ease,
//     box-shadow 0.12s ease,
//     background 0.12s ease,
//     color 0.12s ease;
//   box-shadow: ${(p) => (p.$variant === 'outline' ? 'none' : '0 8px 18px rgba(249,115,22,0.25)')};

//   &:hover {
//     transform: translateY(-1px);
//     background: ${(p) =>
//       p.$variant === 'outline' ? 'rgba(249,115,22,0.06)' : 'var(--brand-dark)'};
//   }

//   & > svg {
//     display: block;
//     flex-shrink: 0;
//   }
// `;

// const OrgRow = styled.div`
//   display: grid;
//   grid-template-columns: 44px 1fr;
//   gap: 0.75rem;
//   align-items: center;
// `;

// const OrgLogo = styled.img`
//   width: 44px;
//   height: 44px;
//   object-fit: contain;
//   border-radius: 10px;
//   border: 1px solid rgba(0, 0, 0, 0.06);
//   background: #fff;
// `;

// const OrgName = styled.div`
//   font-weight: 700;
// `;

// const MapCard = styled.section`
//   margin-top: 1rem;
//   background: #fff;
//   border-radius: ${RADIUS};
//   box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
//   overflow: hidden;
// `;

// const MapHeader = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0.85rem 1rem;
//   border-bottom: 1px solid rgba(0, 0, 0, 0.06);
//   background: linear-gradient(180deg, #fff, #fff9f3);
// `;

// const MapTitle = styled.h3`
//   margin: 0;
//   font-size: 1.6rem;
//   color: var(--text);
// `;

// const MapBody = styled.div`
//   height: 380px;
//   width: 100%;
//   @media (max-width: 680px) {
//     height: 320px;
//   }
// `;

// // —— Helpers ——
// // 1) GCal datetime UTC
// function toGCalUTC(isoString) {
//   const d = new Date(isoString);
//   const yyyy = d.getUTCFullYear();
//   const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
//   const dd = String(d.getUTCDate()).padStart(2, '0');
//   const HH = String(d.getUTCHours()).padStart(2, '0');
//   const MM = String(d.getUTCMinutes()).padStart(2, '0');
//   const SS = String(d.getUTCSeconds()).padStart(2, '0');
//   return `${yyyy}${mm}${dd}T${HH}${MM}${SS}Z`;
// }
// function toGCalDateRange(startISO, endISO) {
//   return `${toGCalUTC(startISO)}/${toGCalUTC(endISO)}`;
// }
// function buildGCalHref(ev) {
//   if (!ev?.start_date) return null;
//   const start = new Date(ev.start_date);
//   const end = ev.end_date ? new Date(ev.end_date) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
//   const dates = toGCalDateRange(start.toISOString(), end.toISOString());
//   const location =
//     (ev?.lokacija?.naziv || '') + (ev?.lokacija?.adresa ? `, ${ev.lokacija.adresa}` : '') ||
//     ev?.location ||
//     '';
//   const params = new URLSearchParams({
//     text: ev?.title || 'Događaj',
//     dates,
//     details: ev?.description || '',
//     location,
//   });
//   return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
// }

// function formatMoney(value) {
//   if (value === null || value === undefined) return '—';
//   const n = Number(value);
//   if (Number.isNaN(n)) return String(value);
//   return `${n.toFixed(2)} KM`;
// }

// function fmtDate(d) {
//   const dd = String(d.getDate()).padStart(2, '0');
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const yyyy = d.getFullYear();
//   return `${dd}.${mm}.${yyyy}`;
// }
// function fmtTime(d) {
//   return new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
// }
// // 2) Lijep prikaz raspona
// function formatRange(startISO, endISO) {
//   if (!startISO) return { date: '—', time: '—', label: '—' };
//   const s = new Date(startISO);
//   const e = endISO ? new Date(endISO) : null;

//   if (!e || s.toDateString() === new Date(endISO || startISO).toDateString()) {
//     return {
//       date: fmtDate(s),
//       time: fmtTime(s),
//       label: `${fmtDate(s)} • ${fmtTime(s)}`,
//     };
//   }
//   // različiti dani
//   return {
//     date: `${fmtDate(s)} – ${fmtDate(e)}`,
//     time: `${fmtTime(s)} – ${fmtTime(e)}`,
//     label: `${fmtDate(s)} – ${fmtDate(e)}`,
//   };
// }

// function getCategoryIcon(nameOrKey, fallbackColor = '#eef2ff') {
//   const key = nameOrKey && Fa[nameOrKey] ? nameOrKey : 'FaCalendarAlt';
//   const Icon = Fa[key];
//   return { Icon, color: fallbackColor };
// }

// export default function SingleEvent({ event }) {
//   const imageUrl = useMemo(() => getImageUrl(event), [event]);

//   // Range & status (ako backend nije poslao is_ongoing/is_upcoming/is_past)
//   const startISO = event?.start_date;
//   const endISO = event?.end_date || event?.start_date;
//   const range = useMemo(() => formatRange(startISO, endISO), [startISO, endISO]);

//   const now = new Date();
//   const s = startISO ? new Date(startISO) : null;
//   const e = endISO ? new Date(endISO) : null;
//   const computed = {
//     is_ongoing: s && e ? s <= now && e >= now : false,
//     is_past: e ? e < now : false,
//   };
//   const is_ongoing = event?.is_ongoing ?? computed.is_ongoing;
//   const is_past = event?.is_past ?? computed.is_past;
//   const is_upcoming = event?.is_upcoming ?? (!is_ongoing && !is_past);

//   const catColor = event?.category?.boja || '#eef2ff';
//   const { Icon: CatIcon } = getCategoryIcon(event?.category?.ikona, catColor);

//   const lat = event?.lokacija?.latitude;
//   const lng = event?.lokacija?.longitude;
//   const hasCoords = typeof lat === 'number' && typeof lng === 'number';

//   const gcalHref = useMemo(() => buildGCalHref(event), [event]);

//   return (
//     <div>
//       <Heading as="h1">Informacije o događaju</Heading>
//       <PageWrap>
//         {/* Left: Poster */}
//         <Poster>
//           {imageUrl ? (
//             <PosterImg src={imageUrl} alt={event?.title || 'Poster'} />
//           ) : (
//             <PosterImg
//               src={`https://placehold.co/800x1100/fff7ed/262626?text=${encodeURIComponent(
//                 event?.title || 'Događaj'
//               )}`}
//               alt="Poster placeholder"
//             />
//           )}
//         </Poster>

//         {/* Right: Info */}
//         <div style={{ height: '100%' }}>
//           <InfoCard>
//             <div>
//               <HeaderRow>
//                 <Title>{event?.title}</Title>
//                 <MetaItem>
//                   <Fa.FaCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
//                   <div>
//                     <Label>Status</Label>
//                     <Strong>
//                       {is_ongoing ? 'U toku' : is_upcoming ? 'Uskoro' : is_past ? 'Završeno' : '—'}
//                     </Strong>
//                   </div>
//                 </MetaItem>
//               </HeaderRow>
//               <Pill $bg={catColor}>
//                 <CatIcon /> {event?.category?.naziv || 'Kategorija'}
//               </Pill>
//             </div>

//             <div
//               style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
//             >
//               <MetaGrid>
//                 <MetaItem>
//                   <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
//                   <div>
//                     <Label>Datum</Label>
//                     <Strong>{range.date}</Strong>
//                   </div>
//                 </MetaItem>

//                 <MetaItem>
//                   <Fa.FaClock size={26} style={{ marginTop: 2, color: BRAND }} />
//                   <div>
//                     <Label>Vrijeme početka</Label>
//                     <Strong>{fmtTime(new Date(startISO))}</Strong>
//                   </div>
//                 </MetaItem>

//                 <MetaItem>
//                   <Fa.FaMapMarkerAlt size={26} style={{ marginTop: 2, color: BRAND }} />
//                   <div>
//                     <Label>Lokacija</Label>
//                     <Strong>{event?.lokacija?.naziv || '—'}</Strong>
//                     {/* <div style={{ color: MUTED, fontSize: '0.9rem' }}>
//                       {event?.lokacija?.adresa || event?.location || '—'}
//                     </div> */}
//                   </div>
//                 </MetaItem>
//               </MetaGrid>

//               <Price>{formatMoney(event?.cijena)}</Price>
//             </div>

//             <Divider />

//             {/* Organizator */}
//             {event?.institucija && (
//               <div
//                 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//               >
//                 <OrgRow>
//                   {event.institucija.logo ? (
//                     <Link to={`/institution/${event.institucija.idguid}`}>
//                       <OrgLogo src={event.institucija.logo} alt={event.institucija.naziv} />
//                     </Link>
//                   ) : (
//                     <div
//                       style={{
//                         width: 44,
//                         height: 44,
//                         borderRadius: 10,
//                         border: '1px solid rgba(0,0,0,0.06)',
//                         display: 'grid',
//                         placeItems: 'center',
//                         color: BRAND,
//                       }}
//                     >
//                       <Fa.FaBuilding size={20} />
//                     </div>
//                   )}
//                   <div>
//                     <Link to={`/institution/${event.institucija.idguid}`}>
//                       <OrgName>{event.institucija.naziv}</OrgName>
//                     </Link>
//                     <div style={{ color: MUTED, fontSize: '0.9rem' }}>
//                       {event.institucija.email || event.institucija.web_stranica || ''}
//                     </div>
//                   </div>
//                 </OrgRow>

//                 <Actions>
//                   {gcalHref && (
//                     <Button onClick={() => window.open(gcalHref, '_blank')}>
//                       <Fa.FaGoogle />
//                       Dodaj u Google kalendar
//                     </Button>
//                   )}
//                   {hasCoords && (
//                     <Button
//                       $variant="outline"
//                       onClick={() => {
//                         const q = encodeURIComponent(`${lat},${lng}`);
//                         window.open(`https://www.google.com/maps?q=${q}`, '_blank');
//                       }}
//                     >
//                       Otvori u Google Maps
//                     </Button>
//                   )}
//                 </Actions>
//               </div>
//             )}
//           </InfoCard>
//         </div>
//       </PageWrap>

//       {/* Mapa */}
//       <MapCard>
//         <MapHeader>
//           <MapTitle>Mapa događaja</MapTitle>
//           {hasCoords ? (
//             <Pill color={TEXT} $bg={'#fff'}>
//               <Fa.FaLocationArrow /> {lat.toFixed(6)}, {lng.toFixed(6)}
//             </Pill>
//           ) : (
//             <Pill color={MUTED} $bg={'#fff'}>
//               <Fa.FaInfoCircle /> Lokacija nije definirana
//             </Pill>
//           )}
//         </MapHeader>
//         <MapBody>
//           {hasCoords ? (
//             <MapContainer
//               key={`${event?.idguid}-${lat}-${lng}`}
//               center={[lat, lng]}
//               zoom={15}
//               style={{ height: '100%', width: '100%' }}
//               scrollWheelZoom={false}
//             >
//               <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               <Marker position={[lat, lng]}>
//                 <Popup>
//                   <strong>{event?.title}</strong>
//                   <br />
//                   {event?.lokacija?.naziv || ''}
//                   <br />
//                   {event?.lokacija?.adresa || ''}
//                 </Popup>
//               </Marker>
//             </MapContainer>
//           ) : (
//             <div
//               style={{
//                 height: '100%',
//                 width: '100%',
//                 display: 'grid',
//                 placeItems: 'center',
//                 color: MUTED,
//               }}
//             >
//               Nema koordinata za prikaz mape.
//             </div>
//           )}
//         </MapBody>
//       </MapCard>
//     </div>
//   );
// }

// VERZIJA 4 dodani svi termini i google calendar na sve termine, end date popravljen

// === File: SingleEvent.jsx ===
import React, { useMemo } from 'react';
import styled from 'styled-components';
import * as Fa from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import Heading from '../Heading';

// —— Theme ——
const BRAND = '#f97316';
const BRAND_DARK = '#c75a0f';
const TEXT = '#0f172a';
const MUTED = '#64748b';
const CARD_BG = '#fff7ed';
const RADIUS = '18px';

// —— Image Helpers ——
const getImageUrl = (event) => {
  if (!event) return '';
  if (event.slika && event.slika !== '00000000-0000-0000-0000-000000000000') {
    return `https://events-opcina.poruci.ba/api/image/${event.slika}?height=400`;
  }
  return `https://events-opcina.poruci.ba/api/events/slika/${event.idguid}`;
};

// —— Leaflet marker fix ——
const DefaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// —— Styled ——
const PageWrap = styled.div`
  --brand: ${BRAND};
  --brand-dark: ${BRAND_DARK};
  --text: ${TEXT};
  --muted: ${MUTED};
  --card-bg: ${CARD_BG};

  display: grid;
  grid-template-columns: 0.4fr 1fr;
  align-items: start;
  padding: 2rem 0;
  margin-bottom: 7rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Poster = styled.div`
  background: #fff;
  border-radius: ${RADIUS} 0 0 ${RADIUS};
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: sticky;
  top: 16px;

  @media (max-width: 980px) {
    position: static;
  }
`;

const PosterImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const InfoCard = styled.section`
  background: #fff;
  border-radius: 0 ${RADIUS} ${RADIUS} 0;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  display: grid;
  height: 100%;
  gap: 1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: fit-content;
  gap: 0.5rem;
  background: ${(p) => p.$bg || 'var(--card-bg)'};
  color: ${(p) => p.color || 'var(--text)'};
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const Title = styled.h1`
  margin: 0;
  color: var(--text);
  font-size: clamp(1.8rem, 2.2vw, 2.4rem);
  line-height: 1.15;
`;

const Price = styled.div`
  color: var(--brand);
  font-weight: 800;
  font-size: 1.6rem;
`;

const MetaGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 1rem;
  margin-top: 0.25rem;
  @media (max-width: 680px) {
    width: 100%;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text);
`;

const Label = styled.div`
  font-size: 1rem;
  color: var(--muted);
  margin-bottom: 0.1rem;
`;

const Strong = styled.div`
  font-weight: 700;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed rgba(0, 0, 0, 0.08);
  margin: 0.5rem 0 0.25rem;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 32px;
  padding: 0 10px;
  line-height: 1;
  box-sizing: border-box;
  font-size: 1.2rem;
  background: ${(p) => (p.$variant === 'outline' ? 'transparent' : 'var(--brand)')};
  color: ${(p) => (p.$variant === 'outline' ? 'var(--brand)' : '#fff')};
  border: 2px solid var(--brand);
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    background 0.12s ease,
    color 0.12s ease;
  box-shadow: ${(p) => (p.$variant === 'outline' ? 'none' : '0 8px 18px rgba(249,115,22,0.25)')};

  &:hover {
    transform: translateY(-1px);
    background: ${(p) =>
      p.$variant === 'outline' ? 'rgba(249,115,22,0.06)' : 'var(--brand-dark)'};
  }

  & > svg {
    display: block;
    flex-shrink: 0;
  }
`;

const OrgRow = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 0.75rem;
  align-items: center;
`;

const OrgLogo = styled.img`
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: #fff;
`;

const OrgName = styled.div`
  font-weight: 700;
`;

const MapCard = styled.section`
  margin-top: 1rem;
  background: #fff;
  border-radius: ${RADIUS};
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const MapHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(180deg, #fff, #fff9f3);
`;

const MapTitle = styled.h3`
  margin: 0;
  font-size: 1.6rem;
  color: var(--text);
`;

const MapBody = styled.div`
  height: 380px;
  width: 100%;
  @media (max-width: 680px) {
    height: 320px;
  }
`;

// ---- Helpers ----
function fmtDate(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}
function fmtTime(d) {
  return new Intl.DateTimeFormat('bs-BA', { hour: '2-digit', minute: '2-digit' }).format(d);
}

// Google Calendar helpers
function toGCalUTC(isoString) {
  const d = new Date(isoString);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const HH = String(d.getUTCHours()).padStart(2, '0');
  const MM = String(d.getUTCMinutes()).padStart(2, '0');
  const SS = String(d.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}T${HH}${MM}${SS}Z`;
}
function toGCalDateRange(startISO, endISO) {
  return `${toGCalUTC(startISO)}/${toGCalUTC(endISO)}`;
}
function buildGCalHref(ev, startISO, endISO) {
  if (!startISO) return null;
  const s = new Date(startISO);
  const e = endISO ? new Date(endISO) : new Date(s.getTime() + 2 * 60 * 60 * 1000);
  const dates = toGCalDateRange(s.toISOString(), e.toISOString());
  const location =
    (ev?.lokacija?.naziv || '') + (ev?.lokacija?.adresa ? `, ${ev.lokacija.adresa}` : '') ||
    ev?.location ||
    '';
  const params = new URLSearchParams({
    text: ev?.title || 'Događaj',
    dates,
    details: ev?.description || '',
    location,
  });
  return `https://calendar.google.com/calendar/u/0/r/eventedit?${params.toString()}`;
}

function formatMoney(value) {
  if (value === null || value === undefined) return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return `${n.toFixed(2)} KM`;
}

// napari termine iz više mogućih oblika
function parseTerms(ev) {
  const raw =
    (Array.isArray(ev?.termini) && ev.termini) ||
    (Array.isArray(ev?.termini_lista) && ev.termini_lista) ||
    [];
  return raw
    .map((t) => {
      const startISO =
        t?.start_date ||
        t?.pocetak ||
        t?.start ||
        t?.datum ||
        t?.date ||
        (typeof t === 'string' ? t : null);
      const endISO = t?.end_date || t?.kraj || t?.end || null;
      return startISO ? { startISO, endISO } : null;
    })
    .filter(Boolean);
}

export default function SingleEvent({ event }) {
  const imageUrl = useMemo(() => getImageUrl(event), [event]);

  const startISO = event?.start_date || null;
  const endISO = event?.end_date || null;

  const startD = startISO ? new Date(startISO) : null;
  const endD = endISO ? new Date(endISO) : null;

  const differentDay = startD && endD ? startD.toDateString() !== endD.toDateString() : false;

  const hasMulti = Boolean(event?.ima_vise_termina) || parseTerms(event).length > 1;

  // Za globalni GCal (koristi osnovni start/end)
  const globalGcalHref = useMemo(
    () => buildGCalHref(event, startISO, endISO),
    [event, startISO, endISO]
  );

  const terms = useMemo(() => (hasMulti ? parseTerms(event) : []), [event, hasMulti]);

  const catColor = event?.category?.boja || '#eef2ff';
  const { Icon: CatIcon } = (() => {
    const key =
      event?.category?.ikona && Fa[event.category.ikona] ? event.category.ikona : 'FaCalendarAlt';
    return { Icon: Fa[key] };
  })();

  const lat = event?.lokacija?.latitude;
  const lng = event?.lokacija?.longitude;
  const hasCoords = typeof lat === 'number' && typeof lng === 'number';

  return (
    <div>
      <Heading as="h1">Informacije o događaju</Heading>
      <PageWrap>
        {/* Left: Poster */}
        <Poster>
          {imageUrl ? (
            <PosterImg src={imageUrl} alt={event?.title || 'Poster'} />
          ) : (
            <PosterImg
              src={`https://placehold.co/800x1100/fff7ed/262626?text=${encodeURIComponent(
                event?.title || 'Događaj'
              )}`}
              alt="Poster placeholder"
            />
          )}
        </Poster>

        {/* Right: Info */}
        <div style={{ height: '100%' }}>
          <InfoCard>
            <div>
              <HeaderRow>
                <Title>{event?.title}</Title>
                <MetaItem>
                  <Fa.FaCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
                  <div>
                    <Label>Status</Label>
                    <Strong>
                      {event?.is_ongoing
                        ? 'U toku'
                        : event?.is_upcoming
                          ? 'Uskoro'
                          : event?.is_past
                            ? 'Završeno'
                            : '—'}
                    </Strong>
                  </div>
                </MetaItem>
              </HeaderRow>
              <Pill $bg={catColor}>
                <CatIcon /> {event?.category?.naziv || 'Kategorija'}
              </Pill>
            </div>

            <div
              style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
            >
              <MetaGrid>
                {/* === DATUM/VRIJEME: 3 slučaja === */}
                {!hasMulti && differentDay && startD && endD && (
                  <>
                    <MetaItem>
                      <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
                      <div>
                        <Label>Početak</Label>
                        <Strong>
                          {fmtDate(startD)} - {fmtTime(startD)}
                        </Strong>
                      </div>
                    </MetaItem>
                    <MetaItem>
                      <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
                      <div>
                        <Label>Kraj</Label>
                        <Strong>
                          {fmtDate(endD)} - {fmtTime(endD)}
                        </Strong>
                      </div>
                    </MetaItem>
                  </>
                )}

                {!hasMulti && !differentDay && startD && (
                  <>
                    <MetaItem>
                      <Fa.FaRegCalendarCheck size={26} style={{ marginTop: 2, color: BRAND }} />
                      <div>
                        <Label>Datum</Label>
                        <Strong>{fmtDate(startD)}</Strong>
                      </div>
                    </MetaItem>
                    <MetaItem>
                      <Fa.FaClock size={26} style={{ marginTop: 2, color: BRAND }} />
                      <div>
                        <Label>Vrijeme</Label>
                        <Strong>{fmtTime(startD)}</Strong>
                      </div>
                    </MetaItem>
                  </>
                )}

                {/* === VIŠE TERMINA === */}
                {hasMulti && terms.length > 0 && (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <Label style={{ fontWeight: 700, color: TEXT }}>Termini ({terms.length})</Label>
                    <div
                      style={{
                        display: 'grid',
                        gap: '0.8rem',
                        gridTemplateColumns: `repeat(${terms.length}, minmax(180px, 1fr))`,
                      }}
                    >
                      {terms.map((t, idx) => {
                        const sd = new Date(t.startISO);
                        // const ed = t.endISO ? new Date(t.endISO) : null;
                        const href = buildGCalHref(event, t.startISO, t.endISO);
                        return (
                          <div
                            key={`${t.startISO}-${t.endISO || idx}`}
                            style={{
                              background: '#fff',
                              border: '1px solid #eef2ff',
                              borderRadius: 12,
                              padding: '0.75rem',
                            }}
                          >
                            <div style={{ marginBottom: 6 }}>
                              <Label>Datum</Label>
                              <Strong>{fmtDate(sd)}</Strong>
                            </div>
                            <div style={{ marginBottom: 10 }}>
                              <Label>Vrijeme</Label>
                              <Strong>{fmtTime(sd)}</Strong>
                            </div>
                            <div>
                              <Button onClick={() => window.open(href, '_blank')}>
                                <Fa.FaGoogle />
                                Dodaj u Google kalendar
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Lokacija */}
                <MetaItem>
                  <Fa.FaMapMarkerAlt size={26} style={{ marginTop: 2, color: BRAND }} />
                  <div>
                    <Label>Lokacija</Label>
                    <Strong>{event?.lokacija?.naziv || '—'}</Strong>
                    {/* <div style={{ color: MUTED, fontSize: '0.9rem' }}>
                      {event?.lokacija?.adresa || event?.location || '—'}
                    </div> */}
                  </div>
                </MetaItem>
              </MetaGrid>

              <Price>{formatMoney(event?.cijena)}</Price>
            </div>

            <Divider />

            {/* Organizator */}
            {event?.institucija && (
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <OrgRow>
                  {event.institucija.logo ? (
                    <Link to={`/institution/${event.institucija.idguid}`}>
                      <OrgLogo src={event.institucija.logo} alt={event.institucija.naziv} />
                    </Link>
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        border: '1px solid rgba(0,0,0,0.06)',
                        display: 'grid',
                        placeItems: 'center',
                        color: BRAND,
                      }}
                    >
                      <Fa.FaBuilding size={20} />
                    </div>
                  )}
                  <div>
                    <Link to={`/institution/${event.institucija.idguid}`}>
                      <OrgName>{event.institucija.naziv}</OrgName>
                    </Link>
                    <div style={{ color: MUTED, fontSize: '0.9rem' }}>
                      {event.institucija.email || event.institucija.web_stranica || ''}
                    </div>
                  </div>
                </OrgRow>

                <Actions>
                  {/* Globalni GCal prikazujemo SAMO ako nema više termina */}
                  {!hasMulti && globalGcalHref && (
                    <Button onClick={() => window.open(globalGcalHref, '_blank')}>
                      <Fa.FaGoogle />
                      Dodaj u Google kalendar
                    </Button>
                  )}
                  {hasCoords && (
                    <Button
                      $variant="outline"
                      onClick={() => {
                        const q = encodeURIComponent(`${lat},${lng}`);
                        window.open(`https://www.google.com/maps?q=${q}`, '_blank');
                      }}
                    >
                      Otvori u Google Maps
                    </Button>
                  )}
                </Actions>
              </div>
            )}
          </InfoCard>
        </div>
      </PageWrap>

      {/* Mapa */}
      <MapCard>
        <MapHeader>
          <MapTitle>Mapa događaja</MapTitle>
          {hasCoords ? (
            <Pill color={TEXT} $bg={'#fff'}>
              <Fa.FaLocationArrow /> {lat.toFixed(6)}, {lng.toFixed(6)}
            </Pill>
          ) : (
            <Pill color={MUTED} $bg={'#fff'}>
              <Fa.FaInfoCircle /> Lokacija nije definirana
            </Pill>
          )}
        </MapHeader>
        <MapBody>
          {hasCoords ? (
            <MapContainer
              key={`${event?.idguid}-${lat}-${lng}`}
              center={[lat, lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>
                  <strong>{event?.title}</strong>
                  <br />
                  {event?.lokacija?.naziv || ''}
                  <br />
                  {event?.lokacija?.adresa || ''}
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'grid',
                placeItems: 'center',
                color: MUTED,
              }}
            >
              Nema koordinata za prikaz mape.
            </div>
          )}
        </MapBody>
      </MapCard>
    </div>
  );
}
