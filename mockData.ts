// FIX: Import new types for bookings.
import { User, Role, Tour, Attraction, RoomType, Room, RoomTypeName, TourBooking, HotelBooking } from './types';

export const MOCK_USERS: User[] = [
  { id: 1, firstName: 'TourAdmin', lastName: 'User', email: 'tour_admin@example.com', password_hash: 'adminTour', birthDate: '1990-01-01', role: Role.TOUR_ADMIN },
  { id: 2, firstName: 'HotelAdmin', lastName: 'User', email: 'hotel_admin@example.com', password_hash: 'adminHotel', birthDate: '1990-01-01', role: Role.HOTEL_ADMIN },
  { id: 3, firstName: 'Ivan', lastName: 'Ivanov', email: 'ivan@example.com', password_hash: 'password123', birthDate: '1995-05-10', role: Role.USER },
];

export const MOCK_TOURS: Tour[] = [
  {
    id: 1,
    name: {
      en: 'The Heart of Izhevsk',
      ru: 'Сердце Ижевска'
    },
    startLocation: {
        en: 'Central Square, Izhevsk',
        ru: 'Центральная площадь, Ижевск'
    },
    startDatetime: '2024-10-15T09:00:00',
    durationDays: 3,
    totalSeats: 20,
    ageRestriction: 12,
    basePrice: 5000.00,
    description: {
        en: 'Explore the capital of Udmurtia, visit the Kalashnikov museum and enjoy the local cuisine.',
        ru: 'Исследуйте столицу Удмуртии, посетите музей Калашникова и насладитесь местной кухней.'
    },
    adminId: 1,
    points: [
        { id: 1, description: { en: "Kalashnikov Museum", ru: "Музей Калашникова" }, photoUrl: "https://picsum.photos/seed/tour1/400/200" },
        { id: 2, description: { en: "Izhevsk Embankment", ru: "Ижевская набережная" }, photoUrl: "https://picsum.photos/seed/tour2/400/200" }
    ],
    status: 'active',
  },
  {
    id: 2,
    name: {
        en: 'Votkinsk - Tchaikovsky\'s Homeland',
        ru: 'Воткинск - Родина Чайковского'
    },
    startLocation: {
        en: 'Votkinsk Railway Station',
        ru: 'Железнодорожный вокзал, Воткинск'
    },
    startDatetime: '2024-11-05T10:00:00',
    durationDays: 2,
    totalSeats: 15,
    ageRestriction: 6,
    basePrice: 4200.00,
    description: {
        en: 'A journey to the birthplace of the great composer Pyotr Ilyich Tchaikovsky.',
        ru: 'Путешествие на родину великого композитора Петра Ильича Чайковского.'
    },
    adminId: 1,
    points: [
      { id: 3, description: { en: "Tchaikovsky's Estate Museum", ru: "Музей-усадьба Чайковского" }, photoUrl: "https://picsum.photos/seed/tour3/400/200" },
      { id: 4, description: { en: "Votkinsk Pond", ru: "Воткинский пруд" }, photoUrl: "https://picsum.photos/seed/tour4/400/200" }
    ],
    status: 'active',
  },
  {
    id: 3,
    name: {
        en: 'Ancient Udmurt Trails',
        ru: 'Древние тропы Удмуртии'
    },
    startLocation: {
        en: 'Glazov, Udmurtia',
        ru: 'Глазов, Удмуртия'
    },
    startDatetime: '2024-08-20T08:00:00',
    durationDays: 5,
    totalSeats: 10,
    ageRestriction: 18,
    basePrice: 9500.00,
    description: {
        en: 'A deep dive into the historical and cultural heritage of the northern Udmurts. Visit ancient settlements and learn traditional crafts.',
        ru: 'Глубокое погружение в историческое и культурное наследие северных удмуртов. Посетите древние городища и изучите традиционные ремесла.'
    },
    adminId: 1,
    points: [
      { id: 5, description: { en: "Idnakar historical site", ru: "Городище Иднакар" }, photoUrl: "https://picsum.photos/seed/tour5/400/200" },
    ],
    status: 'archived',
  },
];

export const MOCK_ATTRACTIONS: Attraction[] = [
    { id: 1, userId: 3, userEmail: 'ivan@example.com', imageUrl: 'https://picsum.photos/seed/attraction1/600/400', description: { en: 'Beautiful sunset over the Kama River.', ru: 'Красивый закат над рекой Камой.' }, uploadDate: '2023-08-20' },
    { id: 2, userId: 3, userEmail: 'ivan@example.com', imageUrl: 'https://picsum.photos/seed/attraction2/600/400', description: { en: 'Ludorvay Architectural and Ethnographic Museum-Reserve.', ru: 'Архитектурно-этнографический музей-заповедник "Лудорвай".' }, uploadDate: '2023-07-11' },
    { id: 3, userId: 3, userEmail: 'ivan@example.com', imageUrl: 'https://picsum.photos/seed/attraction3/600/400', description: { en: 'View from the Tchaikovsky museum grounds in Votkinsk!', ru: 'Вид с территории музея Чайковского в Воткинске!' }, uploadDate: '2024-01-15', tourId: 2 },
    { id: 4, userId: 3, userEmail: 'ivan@example.com', imageUrl: 'https://picsum.photos/seed/attraction4/600/400', description: { en: 'The famous monument in Izhevsk during our tour.', ru: 'Знаменитый памятник в Ижевске во время нашего тура.' }, uploadDate: '2024-02-22', tourId: 1 }
];

export const MOCK_ROOM_TYPES: RoomType[] = [
    { id: 1, name: RoomTypeName.STANDARD },
    { id: 2, name: RoomTypeName.STUDIO },
    { id: 3, name: RoomTypeName.LUX }
];

export const MOCK_ROOMS: Room[] = [
    { 
      id: 101, 
      roomTypeId: 1, 
      pricePerNight: 2500, 
      characteristics: { en: '1 double bed, TV, Wi-Fi, Bathroom', ru: '1 двуспальная кровать, ТВ, Wi-Fi, ванная комната' },
      longDescription: { en: 'A cozy and comfortable standard room, perfect for solo travelers or couples. Equipped with all necessary amenities for a pleasant stay.', ru: 'Уютный и комфортабельный стандартный номер, идеально подходящий для соло-путешественников или пар. Оборудован всеми необходимыми удобствами для приятного отдыха.' },
      imageUrls: ['https://picsum.photos/seed/room1_1/800/600', 'https://picsum.photos/seed/room1_2/800/600', 'https://picsum.photos/seed/room1_3/800/600'] 
    },
    { 
      id: 102, 
      roomTypeId: 1, 
      pricePerNight: 2600, 
      characteristics: { en: '1 double bed, TV, Wi-Fi, Bathroom, Balcony', ru: '1 двуспальная кровать, ТВ, Wi-Fi, ванная комната, балкон' },
      longDescription: { en: 'A lovely standard room with a private balcony offering a view of the city. A great choice for those who appreciate fresh air and scenic views.', ru: 'Прекрасный стандартный номер с собственным балконом, откуда открывается вид на город. Отличный выбор для тех, кто ценит свежий воздух и живописные виды.' },
      imageUrls: ['https://picsum.photos/seed/room2_1/800/600', 'https://picsum.photos/seed/room2_2/800/600'] 
    },
    { 
      id: 201, 
      roomTypeId: 2, 
      pricePerNight: 4000, 
      characteristics: { en: '1 king bed, TV, Wi-Fi, Kitchenette, Jacuzzi', ru: '1 кровать king-size, ТВ, Wi-Fi, мини-кухня, джакузи' },
      longDescription: { en: 'Spacious and modern studio with a kitchenette and a luxurious jacuzzi. The open-plan design creates a sense of freedom and comfort.', ru: 'Просторная и современная студия с мини-кухней и роскошным джакузи. Открытая планировка создает ощущение свободы и комфорта.' },
      imageUrls: ['https://picsum.photos/seed/room3_1/800/600', 'https://picsum.photos/seed/room3_2/800/600', 'https://picsum.photos/seed/room3_3/800/600'] 
    },
    { 
      id: 301, 
      roomTypeId: 3, 
      pricePerNight: 7500, 
      characteristics: { en: '2 rooms, 1 king bed, Panoramic view, Mini-bar', ru: '2 комнаты, 1 кровать king-size, панорамный вид, мини-бар' },
      longDescription: { en: 'An elegant two-room suite with a panoramic view of the city\'s main attractions. Ideal for a luxurious stay and business trips.', ru: 'Элегантный двухкомнатный люкс с панорамным видом на главные достопримечательности города. Идеально подходит для роскошного отдыха и деловых поездок.' },
      imageUrls: ['https://picsum.photos/seed/room4_1/800/600', 'https://picsum.photos/seed/room4_2/800/600', 'https://picsum.photos/seed/room4_3/800/600', 'https://picsum.photos/seed/room4_4/800/600'] 
    },
    { 
      id: 302, 
      roomTypeId: 3, 
      pricePerNight: 8000, 
      characteristics: { en: '2 rooms, 1 king bed, Panoramic view, Mini-bar, Butler service', ru: '2 комнаты, 1 кровать king-size, панорамный вид, мини-бар, услуги дворецкого' },
      longDescription: { en: 'The pinnacle of luxury. A magnificent suite with exclusive butler service, offering the highest level of comfort and personalized attention.', ru: 'Вершина роскоши. Великолепный люкс с эксклюзивными услугами дворецкого, предлагающий высочайший уровень комфорта и персонального внимания.' },
      imageUrls: ['https://picsum.photos/seed/room5_1/800/600', 'https://picsum.photos/seed/room5_2/800/600'] 
    }
];

export const MOCK_TOUR_BOOKINGS: TourBooking[] = [
    { id: 1, userId: 3, tourId: 1, finalPrice: 5000, status: 'confirmed' },
    { id: 2, userId: 3, tourId: 2, finalPrice: 4200, status: 'confirmed' },
    { id: 3, userId: 3, tourId: 3, finalPrice: 9500, status: 'confirmed' }, // Booking for an archived tour
];

export const MOCK_HOTEL_BOOKINGS: HotelBooking[] = [
    { id: 1, userId: 3, roomId: 101, checkInDate: '2024-09-01', checkOutDate: '2024-09-05', status: 'approved' },
    { id: 2, userId: 3, roomId: 201, checkInDate: '2024-09-10', checkOutDate: '2024-09-12', status: 'pending' },
];