import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  Calendar,
  Input,
  Select,
  Button,
  Card,
  DatePicker,
  Checkbox,
  Avatar,
  Badge,
  Modal,
} from 'antd';
import {
  SearchOutlined,
  HeartOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined,
  HeartFilled,
  EyeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

// Dummy data
const eventsData = [
  {
    id: 1,
    title: 'Fantastic Four',
    description: 'A team of superheroes with unique powers.',
    is_public: true,
    location: 'Kino sala Tešanj',
    start_date: '2025-10-01T18:00:00Z',
    end_date: '2025-10-01T20:00:00Z',
    category: 'Kino',
    institution: 'Centar za kulturu i obrazovanje Tešanj',
    storedfile: 'https://events-opcina.poruci.ba/api/file/e97c2385-6987-4cfd-866f-41706880ffd3',
    price: 5,
    likes: 55,
  },
  {
    id: 2,
    title: 'Otelo',
    description: "Shakespeare's classic tragedy about jealousy and betrayal.",
    is_public: true,
    location: 'Kino sala Tešanj',
    start_date: '2025-10-02T18:00:00Z',
    end_date: '2025-10-02T20:00:00Z',
    category: 'Pozorište',
    institution: 'Centar za kulturu i obrazovanje Tešanj',
    storedfile:
      'https://m.media-amazon.com/images/M/MV5BYzg4YjIwODQtMGM4YS00NjUyLWFkNWMtYjVkYTgzMTYyMDhiXkEyXkFqcGc@._V1_.jpg',
    price: 20,
    likes: 2,
  },
  {
    id: 3,
    title: 'TOŠK - Željezničar',
    description: 'Football match between TOŠK and Željezničar.',
    is_public: true,
    location: 'Stadion Luke Tešanj',
    start_date: '2025-10-03T18:00:00Z',
    end_date: '2025-10-03T20:00:00Z',
    category: 'Nogomet',
    institution: 'Sportsko udruženje TOŠK Tešanj',
    storedfile:
      'https://files.ekmcdn.com/575068/images/liverpool-v-tottenham-hotspur-official-matchday-programme-2024-25-27th-april-2025-109607-p.jpeg',
    likes: 120,
    price: 10,
  },
];

const institutions = [
  { name: 'Centar za kulturu i obrazovanje Tešanj', logo: '🎭' },
  { name: 'Sportsko udruženje TOŠK Tešanj', logo: '⚽' },
  { name: 'Muzej Tešanj', logo: '🏛️' },
  { name: 'Gradska biblioteka', logo: '📚' },
  { name: 'Dom zdravlja', logo: '🏥' },
  { name: 'Omladinski centar', logo: '🎪' },
];

const categories = ['Kino', 'Pozorište', 'Nogomet', 'Koncert', 'Izložba', 'Radionica', 'Sport'];

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
`;

const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
  max-width: 600px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
    flex-direction: column;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CarouselContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 2rem auto;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const CarouselWrapper = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  cursor: grab;
  transform: translateX(${(props) => -props.currentSlide * 100}%);

  &:active {
    cursor: grabbing;
  }
`;

const CarouselItem = styled.div`
  min-width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
`;

const CarouselOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: all 0.3s ease;

  ${CarouselItem}:hover & {
    opacity: 1;
  }

  ${CarouselItem}:hover ${CarouselImage} {
    filter: blur(3px) brightness(0.6);
  }
`;

const CarouselButton = styled(Button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &.left {
    left: 20px;
  }

  &.right {
    right: 20px;
  }

  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
`;

const InstitutionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InstitutionCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-5px);
  }
`;

const InstitutionLogo = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
`;

const InstitutionName = styled.span`
  font-size: 0.9rem;
  text-align: center;
  color: #666;
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled(Button)`
  border-radius: 20px;
  background: ${(props) => (props.active ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  border: 1px solid ${(props) => (props.active ? 'transparent' : '#d9d9d9')};

  &:hover {
    background: ${(props) =>
      props.active ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'rgba(102, 126, 234, 0.1)'};
    color: ${(props) => (props.active ? 'white' : '#667eea')};
    border-color: #667eea;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EventCard = styled(Card)`
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .ant-card-cover img {
    height: 200px;
    object-fit: cover;
  }
`;

const EventInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EventPrice = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
`;

const EventDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const EventLocation = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const LikeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LikeButton = styled(Button)`
  border: none;
  background: none;
  color: #ff4d4f;
  padding: 0;

  &:hover {
    color: #ff7875;
    background: none;
  }
`;

const CalendarSection = styled(Section)`
  .ant-picker-calendar {
    background: transparent;
    border: none;
  }

  .ant-picker-calendar-header {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 1rem;
  }
`;

const PreferencesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const PreferenceCard = styled.div`
  padding: 1rem;
  border: 2px solid ${(props) => (props.selected ? '#667eea' : '#f0f0f0')};
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.selected ? 'rgba(102, 126, 234, 0.1)' : 'white')};

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
`;

const PopularEventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const PopularEventCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const PopularEventImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const PopularEventInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PopularEventTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
`;

const PopularEventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #666;
`;

const EventsApp = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn] = useState(true); // Set to true to show logged in state
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [likedEvents, setLikedEvents] = useState(new Set([1, 3])); // Mock liked events
  const carouselRef = useRef(null);

  const filterOptions = ['All', 'For you', 'Online', 'Today', 'This weekend', 'Free'];

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentSlide((prev) => (prev + 1) % eventsData.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isDragging]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % eventsData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + eventsData.length) % eventsData.length);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const diff = e.clientX - dragStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleLike = (eventId) => {
    setLikedEvents((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(eventId)) {
        newLiked.delete(eventId);
      } else {
        newLiked.add(eventId);
      }
      return newLiked;
    });
  };

  const togglePreference = (category) => {
    setSelectedPreferences((prev) =>
      prev.includes(category) ? prev.filter((p) => p !== category) : [...prev, category]
    );
  };

  const getEventsForDate = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return eventsData.filter((event) => dayjs(event.start_date).format('YYYY-MM-DD') === dateStr);
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') {
      const events = getEventsForDate(current);
      return (
        <div>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                background: '#667eea',
                color: 'white',
                padding: '2px 4px',
                margin: '1px 0',
                borderRadius: '3px',
                fontSize: '10px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }
    return info.originNode;
  };

  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <Logo>EventHub</Logo>

          <SearchSection>
            <Input placeholder="Search events..." prefix={<SearchOutlined />} size="large" />
            <Select placeholder="Categories" style={{ minWidth: 130 }} size="large">
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
            <Select placeholder="Institutions" style={{ minWidth: 150 }} size="large">
              {institutions.map((institution) => (
                <Option key={institution.name} value={institution.name}>
                  {institution.name}
                </Option>
              ))}
            </Select>
          </SearchSection>

          <UserSection>
            {isLoggedIn ? (
              <>
                <Badge count={likedEvents.size} offset={[-5, 5]}>
                  <Button
                    type="text"
                    icon={<HeartOutlined />}
                    size="large"
                    style={{ color: '#ff4d4f' }}
                  />
                </Badge>
                <Avatar icon={<UserOutlined />} style={{ background: '#667eea' }} />
                <span>aidinIbrahimkadic</span>
              </>
            ) : (
              <>
                <Button type="primary">Login</Button>
                <Button>Register</Button>
              </>
            )}
          </UserSection>
        </HeaderContent>
      </Header>

      {/* Carousel */}
      <CarouselContainer>
        <CarouselWrapper
          currentSlide={currentSlide}
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {eventsData.map((event) => (
            <CarouselItem key={event.id}>
              <CarouselImage src={event.storedfile} alt={event.title} />
              <CarouselOverlay>
                <Button type="primary" size="large" icon={<EyeOutlined />}>
                  Vidi više
                </Button>
                <Button
                  size="large"
                  icon={likedEvents.has(event.id) ? <HeartFilled /> : <HeartOutlined />}
                  onClick={() => toggleLike(event.id)}
                  style={{
                    color: likedEvents.has(event.id) ? '#ff4d4f' : 'white',
                    borderColor: 'white',
                  }}
                >
                  Like
                </Button>
              </CarouselOverlay>
            </CarouselItem>
          ))}
        </CarouselWrapper>

        <CarouselButton className="left" onClick={prevSlide}>
          <LeftOutlined />
        </CarouselButton>
        <CarouselButton className="right" onClick={nextSlide}>
          <RightOutlined />
        </CarouselButton>
      </CarouselContainer>

      <MainContent>
        {/* Events Grid with Filters */}
        <Section>
          <SectionTitle>Događaji</SectionTitle>

          {/* Institutions Filter */}
          <InstitutionsGrid>
            {institutions.map((institution) => (
              <InstitutionCard key={institution.name}>
                <InstitutionLogo>{institution.logo}</InstitutionLogo>
                <InstitutionName>{institution.name}</InstitutionName>
              </InstitutionCard>
            ))}
          </InstitutionsGrid>

          {/* Filter Buttons */}
          <FiltersRow>
            {filterOptions.map((filter) => (
              <FilterButton
                key={filter}
                active={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </FilterButton>
            ))}
            <RangePicker />
          </FiltersRow>

          {/* Events Grid */}
          <EventsGrid>
            {eventsData.map((event) => (
              <EventCard
                key={event.id}
                cover={<img alt={event.title} src={event.storedfile} />}
                actions={[
                  <Button key="view" type="link" icon={<EyeOutlined />}>
                    Detalji
                  </Button>,
                  <LikeButton
                    key="like"
                    icon={likedEvents.has(event.id) ? <HeartFilled /> : <HeartOutlined />}
                    onClick={() => toggleLike(event.id)}
                  >
                    {event.likes}
                  </LikeButton>,
                ]}
              >
                <Card.Meta title={event.title} description={event.description} />
                <EventInfo>
                  <EventDetails>
                    <EventDate>
                      <CalendarOutlined /> {dayjs(event.start_date).format('DD.MM.YYYY HH:mm')}
                    </EventDate>
                    <EventLocation>
                      <EnvironmentOutlined /> {event.location}
                    </EventLocation>
                  </EventDetails>
                  <EventPrice>
                    <DollarOutlined /> {event.price}€
                  </EventPrice>
                </EventInfo>
              </EventCard>
            ))}
          </EventsGrid>
        </Section>

        {/* Calendar */}
        <CalendarSection>
          <SectionTitle>Kalendar događaja</SectionTitle>
          <Calendar cellRender={cellRender} />
        </CalendarSection>

        {/* User Preferences */}
        <Section>
          <SectionTitle>Vaše preferencije</SectionTitle>
          <p>Odaberite kategorije za koje želite da budete obavješteni o novim događajima:</p>
          <PreferencesGrid>
            {categories.map((category) => (
              <PreferenceCard
                key={category}
                selected={selectedPreferences.includes(category)}
                onClick={() => togglePreference(category)}
              >
                {category}
              </PreferenceCard>
            ))}
          </PreferencesGrid>
        </Section>

        {/* Popular Events */}
        <Section>
          <SectionTitle>Najpopularniji događaji</SectionTitle>
          <PopularEventsGrid>
            {eventsData
              .sort((a, b) => b.likes - a.likes)
              .map((event) => (
                <PopularEventCard key={event.id}>
                  <PopularEventImage src={event.storedfile} alt={event.title} />
                  <PopularEventInfo>
                    <PopularEventTitle>{event.title}</PopularEventTitle>
                    <PopularEventMeta>
                      <span>{dayjs(event.start_date).format('DD.MM.YYYY HH:mm')}</span>
                      <span>{event.price}€</span>
                      <span>{event.likes} likes</span>
                    </PopularEventMeta>
                  </PopularEventInfo>
                </PopularEventCard>
              ))}
          </PopularEventsGrid>
        </Section>
      </MainContent>
    </AppContainer>
  );
};

export default EventsApp;
