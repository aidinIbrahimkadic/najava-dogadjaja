// import {
//   FaFutbol,
//   FaBasketballBall,
//   FaVolleyballBall,
//   FaSwimmer,
//   FaRunning,
//   FaDumbbell,
//   FaChess,
//   FaTableTennis,
//   FaFish,
//   FaSkiing,
//   FaBullseye, // streljaštvo
//   FaHandRock, // borilački sportovi (karate, judo, taekwondo, KBS)
//   FaBaseballBall, // rukomet (nema posebne ikone pa koristimo loptu)
//   FaMusic,
//   FaMicrophone,
//   FaTheaterMasks,
//   FaFilm,
//   FaBook,
//   FaPaintBrush,
//   FaDrum,
//   FaChild,
//   FaChalkboardTeacher,
//   FaGraduationCap,
//   FaStore,
//   FaTractor,
//   FaHandHoldingHeart,
//   FaHandPeace,
//   FaUsers,
//   FaHandshake,
//   FaGlobeEurope,
//   FaLeaf,
//   FaBullhorn,
//   FaStar,
//   FaStarAndCrescent, // religija / kultura sjećanja
// } from 'react-icons/fa';

// export const ICON_OPTIONS = [
//   // SPORT
//   { value: 'FaFutbol', icon: FaFutbol }, // nogomet
//   { value: 'FaBasketballBall', icon: FaBasketballBall }, // košarka
//   { value: 'FaVolleyballBall', icon: FaVolleyballBall }, // odbojka
//   { value: 'FaBaseballBall', icon: FaBaseballBall }, // rukomet
//   { value: 'FaSwimmer', icon: FaSwimmer }, // plivanje
//   { value: 'FaRunning', icon: FaRunning }, // atletika / trčanje
//   { value: 'FaDumbbell', icon: FaDumbbell }, // fitness / teretana
//   { value: 'FaHandRock', icon: FaHandRock }, // borilački sportovi
//   { value: 'FaChess', icon: FaChess }, // šah
//   { value: 'FaTableTennis', icon: FaTableTennis }, // stoni tenis
//   { value: 'FaFish', icon: FaFish }, // ribolov
//   { value: 'FaSkiing', icon: FaSkiing }, // planinarenje / rekreacija
//   { value: 'FaBullseye', icon: FaBullseye }, // streljaštvo

//   // KULTURA & ZABAVA
//   { value: 'FaMusic', icon: FaMusic }, // koncerti
//   { value: 'FaMicrophone', icon: FaMicrophone }, // stand-up / zabava
//   { value: 'FaTheaterMasks', icon: FaTheaterMasks }, // pozorište
//   { value: 'FaFilm', icon: FaFilm }, // film
//   { value: 'FaBook', icon: FaBook }, // književni program
//   { value: 'FaPaintBrush', icon: FaPaintBrush }, // izložbe
//   { value: 'FaDrum', icon: FaDrum }, // folklor & etno

//   // DJECA & EDUKACIJA
//   { value: 'FaChild', icon: FaChild }, // dječiji program
//   { value: 'FaChalkboardTeacher', icon: FaChalkboardTeacher }, // edukacija
//   { value: 'FaGraduationCap', icon: FaGraduationCap }, // nauka

//   // SAJMOVI & TRADICIJA
//   { value: 'FaStore', icon: FaStore }, // sajmovi
//   { value: 'FaTractor', icon: FaTractor }, // poljoprivreda

//   // DRUŠTVENI PROGRAMI
//   { value: 'FaHandHoldingHeart', icon: FaHandHoldingHeart }, // humanitarno
//   { value: 'FaHandPeace', icon: FaHandPeace }, // omladinsko / volontersko
//   { value: 'FaUsers', icon: FaUsers }, // društveni program
//   { value: 'FaHandshake', icon: FaHandshake }, // saradnje
//   { value: 'FaGlobeEurope', icon: FaGlobeEurope }, // međunarodni događaji
//   { value: 'FaLeaf', icon: FaLeaf }, // ekologija
//   { value: 'FaBullhorn', icon: FaBullhorn }, // promocije / najave
//   { value: 'FaStar', icon: FaStar }, // jubileji, dani MZ
//   { value: 'FaStarAndCrescent', icon: FaStarAndCrescent }, // religija / kultura sjećanja
// ];

import { FA_ICONS } from '../../ui/iconsMap';

// Ako želiš držati isti API:
export const ICON_OPTIONS = [
  { value: 'FaFutbol', icon: FA_ICONS.FaFutbol },
  { value: 'FaBasketballBall', icon: FA_ICONS.FaBasketballBall },
  { value: 'FaVolleyballBall', icon: FA_ICONS.FaVolleyballBall },
  { value: 'FaBaseballBall', icon: FA_ICONS.FaBaseballBall },
  { value: 'FaSwimmer', icon: FA_ICONS.FaSwimmer },
  { value: 'FaRunning', icon: FA_ICONS.FaRunning },
  { value: 'FaDumbbell', icon: FA_ICONS.FaDumbbell },
  { value: 'FaHandRock', icon: FA_ICONS.FaHandRock },
  { value: 'FaChess', icon: FA_ICONS.FaChess },
  { value: 'FaTableTennis', icon: FA_ICONS.FaTableTennis },
  { value: 'FaFish', icon: FA_ICONS.FaFish },
  { value: 'FaSkiing', icon: FA_ICONS.FaSkiing },
  { value: 'FaBullseye', icon: FA_ICONS.FaBullseye },

  { value: 'FaMusic', icon: FA_ICONS.FaMusic },
  { value: 'FaMicrophone', icon: FA_ICONS.FaMicrophone },
  { value: 'FaTheaterMasks', icon: FA_ICONS.FaTheaterMasks },
  { value: 'FaFilm', icon: FA_ICONS.FaFilm },
  { value: 'FaBook', icon: FA_ICONS.FaBook },
  { value: 'FaPaintBrush', icon: FA_ICONS.FaPaintBrush },
  { value: 'FaDrum', icon: FA_ICONS.FaDrum },

  { value: 'FaChild', icon: FA_ICONS.FaChild },
  { value: 'FaChalkboardTeacher', icon: FA_ICONS.FaChalkboardTeacher },
  { value: 'FaGraduationCap', icon: FA_ICONS.FaGraduationCap },

  { value: 'FaStore', icon: FA_ICONS.FaStore },
  { value: 'FaTractor', icon: FA_ICONS.FaTractor },

  { value: 'FaHandHoldingHeart', icon: FA_ICONS.FaHandHoldingHeart },
  { value: 'FaHandPeace', icon: FA_ICONS.FaHandPeace },
  { value: 'FaUsers', icon: FA_ICONS.FaUsers },
  { value: 'FaHandshake', icon: FA_ICONS.FaHandshake },
  { value: 'FaGlobeEurope', icon: FA_ICONS.FaGlobeEurope },
  { value: 'FaLeaf', icon: FA_ICONS.FaLeaf },
  { value: 'FaBullhorn', icon: FA_ICONS.FaBullhorn },
  { value: 'FaStar', icon: FA_ICONS.FaStar },
  { value: 'FaStarAndCrescent', icon: FA_ICONS.FaStarAndCrescent },
];
