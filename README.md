# Aplikacija za najavu događaja - Općina Tešanj

FEATURES:

- AUTHENTICATION
  -login
  -logout
  -getProfile
- DASHBOARD
- SETTINGS
- EVENTS
- ORGANIZATOR
- KATEGORIJA
- NEWSLETTER
- NOTIFIKACIJE

9171211asd

PODACI:

Redni broj
Naslov
Lokacija
Kategorija
Datum i vrijeme početka
Cijena

const data = [
{
category_idguid: '4a5b1adb-516a-4f90-a90a-b6af65659545',
createdAt: '2025-06-26T14:15:05.091Z',
description: 'sadasd',
end_date: '2025-06-27T00:00:00.000Z',
id: 36,
idguid: '6c3509b7-23a4-46e7-ae13-98f3c68ff6c9',
image_url: '',
is_public: true,
location: 'aaaaa',
operater: 'bd64f803-b938-4d66-959c-0e14dfb99052',
start_date: '2025-06-27T00:00:00.000Z',
title: 'f',
updatedAt: '2025-06-26T14:15:05.091Z',
user_idguid: 'bd64f803-b938-4d66-959c-0e14dfb99052',
},
];

https://events-opcina.poruci.ba/api/auth/login

PRIMJERI: https://preporodmostar.ba/najave/ciklus-online-predavanja/
https://event.ba/
https://www.entrio.hr/en
https://www.eventbrite.com/

ZAHTJEVI:
Forma za registraciju
Pretraga po nazivu, organizatoru, izvođaču, kategoriji, vremenu i lokaciji, range cijena ili besplatno
TAB: Ovaj vikend
Filteri: Kategorija (IKONE KAO NA EVENTBRITE, velike kategorije pa podkategorije u njima) , Vrijeme (Danas, sutra, ovaj vikend, Narednih 7 dana, odaberi datum/e), Besplatno/Placeno
Sort: Name, Event time, newly published,
Vrijeme do događaja (odbrojavanje)
Dodaj u kalendar
Pravila događaja (18+, samo drzavljani i sl.)
Lokacija, Vrijeme, datum, cijene, opis, info o organizatoru.
Vise slicnih događaja
Popularni događaji (aside)
Login, Sign up, Moji događaji, moje preference, bokirani događaji,
Info na događaju da je (uskoro rasprodano, rasprodano, prodaja uskoro zavrsava, prodaje se brzo…)
Prati organizatora (info o broju pratilaca, kontaktiraj, link na web, email), prati kategoriju događaja (obavijesti u App i na email)
Galerija
Ukoliko je događaj ponavljajuci npr kino film 3 dana zaredom treba ostaviti prostor za Raspored projekcija (Dan, datum, vrijeme)
Predstaviti na listi, gridu i kalendaru
Modal za newsletter onima koji se nisu registrovali
Ocjene događaja (zvjezdice)

1. OPIS PROJEKTA Aplikacija "Najava događaja" je digitalna platforma koja omogućava organizatorima iz različitih oblasti da objavljuju događaje, dok građani mogu pregledati, filtrirati i dobijati obavijesti o predstojećim događajima. Aplikacija podržava prijavu i registraciju korisnika, kao i personalizovane podsjetnike putem emaila.
2. KORISNICI APLIKACIJE
   • Organizatori događaja (oko 20 aktivnih korisnika) – unose i uređuju događaje
   • Građani – registruju se i prijavljuju kako bi primali obavijesti o događajima
   • Administratori – nadgledaju i moderiraju sadržaj aplikacije
3. FUNKCIONALNOSTI
   3.1 Organizatori događaja
   • Kreiranje i uređivanje događaja (naziv, opis, datum, vrijeme, lokacija, kategorija, cijena, organizator, kontakt informacije, link na dodatne resurse)
   • Upravljanje vlastitim događajima (mogućnost izmjene i brisanja)
   3.2 Građani
   • Registracija i prijava
   • Mogucnost pregleda stranice I bez prijave
   • Pregled događaja sa mogućnošću filtriranja:
   o Kategorije (kultura, sport, edukacija, zabava, poslovni događaji, itd.)
   o Datum (od-do)
   o Organizator
   o Besplatni/plaćeni događaji
   o Lokacija
   • Opcija izbora prikaza događaja:
   o Kalendar
   o Grid prikaz
   o Lista
   • Pretplata na obavijesti o događajima iz određenih kategorija
   • Opcija "Podsjeti me" za pojedinačne događaje sa izborom perioda podsjetnika (1, 3, 7 dana ranije ili kombinacija)
   • Primanje obavijesti putem emaila
   • Autentifikacija: Email + lozinka (opcija za Google/Facebook prijavu)
   •
   3.3 Administracija
   • Pregled i moderacija događaja
   • Upravljanje korisnicima (dodavanje/brisanje organizatora, deaktivacija naloga)
   • Generisanje izvještaja o broju objavljenih događaja, aktivnim korisnicima, posjećenosti
4. OČEKIVANI REZULTATI
   • Funkcionalna aplikacija koja omogućava jednostavno dodavanje i pregled događaja
   • Personalizovane notifikacije i podsjetnici za korisnike
   • Intuitivan dizajn sa više opcija prikaza događaja
   • Administratorski panel za moderaciju i izvještaje
   • RSS za emitovanje na digital signage
5. DODATNE NAPOMENE
   • Aplikacija treba biti optimizovana za mobilne uređaje
   • Dizajn jednostavan i prilagođen korisnicima svih uzrasta
   • Primjer slicne aplikacije: https://villach.at/veranstaltungen?event=parlament-on-tour
