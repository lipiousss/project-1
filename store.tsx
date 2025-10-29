// FIX: Implement the AppProvider and useAppContext to provide global state management.
import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import i18n from 'i18next';
import { User, Tour, Attraction, RoomType, Room, TourBooking, HotelBooking, Role, LocalizedString } from './types';
import { MOCK_USERS, MOCK_TOURS, MOCK_ATTRACTIONS, MOCK_ROOM_TYPES, MOCK_ROOMS, MOCK_TOUR_BOOKINGS, MOCK_HOTEL_BOOKINGS } from './mockData';

// Define the shape of the context state
interface AppContextType {
    isAuthenticated: boolean;
    user: User | null;
    users: User[];
    tours: Tour[];
    attractions: Attraction[];
    roomTypes: RoomType[];
    rooms: Room[];
    tourBookings: TourBooking[];
    hotelBookings: HotelBooking[];
    currentPage: string;
    selectedTourId: number | null;
    selectedRoomId: number | null;
    language: 'en' | 'ru';
    tourFilter: Tour | null;
    login: (email: string, password_hash: string) => boolean;
    logout: () => void;
    register: (data: Omit<User, 'id' | 'role' | 'password_hash'> & { password?: string }) => boolean;
    navigateTo: (page: string, id?: number) => void;
    changeLanguage: (lang: 'en' | 'ru') => void;
    addAttraction: (attraction: Omit<Attraction, 'id' | 'userId' | 'userEmail' | 'description'> & { description: string }) => void;
    setTourFilter: (tour: Tour | null) => void;
    addHotelBooking: (booking: Omit<HotelBooking, 'id' | 'userId' | 'status'>) => void;
    bookTour: (tourId: number) => boolean;
    updateUser: (data: Partial<Omit<User, 'id' | 'email' | 'role' | 'password_hash'>>) => void;
    cancelTourBooking: (bookingId: number) => void;
    cancelHotelBooking: (bookingId: number) => void;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
    const [attractions, setAttractions] = useState<Attraction[]>(MOCK_ATTRACTIONS);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>(MOCK_ROOM_TYPES);
    const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
    const [tourBookings, setTourBookings] = useState<TourBooking[]>(MOCK_TOUR_BOOKINGS);
    const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>(MOCK_HOTEL_BOOKINGS);
    
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState('udmurtia');
    const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [language, setLanguage] = useState<'en' | 'ru'>(i18n.language as 'en' | 'ru' || 'ru');
    const [tourFilter, setTourFilter] = useState<Tour | null>(null);

    const login = useCallback((email: string, password_hash: string): boolean => {
        const foundUser = users.find(u => u.email === email && u.password_hash === password_hash);
        if (foundUser) {
            setUser(foundUser);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    }, [users]);

    const logout = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
        setCurrentPage('udmurtia');
    }, []);

    const register = useCallback((data: Omit<User, 'id' | 'role' | 'password_hash'> & { password?: string }): boolean => {
        if (users.some(u => u.email === data.email)) {
            return false; // Email already exists
        }
        const newUser: User = {
            id: Math.max(...users.map(u => u.id)) + 1,
            ...data,
            password_hash: data.password || '',
            role: Role.USER,
        };
        delete (newUser as any).password;
        setUsers(prev => [...prev, newUser]);
        return true;
    }, [users]);

    const navigateTo = useCallback((page: string, id?: number) => {
        setCurrentPage(page);
        if (page === 'tour-details' && id) {
            setSelectedTourId(id);
            setSelectedRoomId(null);
        } else if (page === 'room-details' && id) {
            setSelectedRoomId(id);
            setSelectedTourId(null);
        } else {
            setSelectedTourId(null);
            setSelectedRoomId(null);
        }
    }, []);

    const changeLanguage = useCallback((lang: 'en' | 'ru') => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
    }, []);

    const addAttraction = useCallback((attraction: Omit<Attraction, 'id' | 'userId' | 'userEmail' | 'description'> & { description: string }) => {
        if (!user) return;
        const newAttraction: Attraction = {
            id: Math.max(0, ...attractions.map(a => a.id)) + 1,
            userId: user.id,
            userEmail: user.email,
            ...attraction,
            description: {
                en: attraction.description,
                ru: attraction.description
            }
        };
        setAttractions(prev => [newAttraction, ...prev]);
    }, [user, attractions]);
    
    const addHotelBooking = useCallback((booking: Omit<HotelBooking, 'id' | 'userId' | 'status'>) => {
        if (!user) return;
        const newBooking: HotelBooking = {
            id: Math.max(0, ...hotelBookings.map(b => b.id)) + 1,
            userId: user.id,
            status: 'pending',
            ...booking
        };
        setHotelBookings(prev => [...prev, newBooking]);
    }, [user, hotelBookings]);

    const bookTour = useCallback((tourId: number) => {
        if (!user) return false;
        const tour = tours.find(t => t.id === tourId);
        if (!tour) return false;
        
        const isAlreadyBooked = tourBookings.some(b => b.userId === user.id && b.tourId === tourId && b.status === 'confirmed');
        if (isAlreadyBooked) return false;

        const newBooking: TourBooking = {
            id: Math.max(0, ...tourBookings.map(b => b.id)) + 1,
            userId: user.id,
            tourId: tourId,
            finalPrice: tour.basePrice,
            status: 'confirmed'
        };
        setTourBookings(prev => [...prev, newBooking]);
        return true;
    }, [user, tours, tourBookings]);
    
    const updateUser = useCallback((data: Partial<Omit<User, 'id' | 'email' | 'role' | 'password_hash'>>) => {
        if (!user) return;
        
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        
        setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? updatedUser : u));
    }, [user]);

    const cancelTourBooking = useCallback((bookingId: number) => {
        setTourBookings(prev => prev.map(b => 
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ));
    }, []);

    const cancelHotelBooking = useCallback((bookingId: number) => {
        setHotelBookings(prev => prev.map(b => 
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ));
    }, []);

    const contextValue = useMemo(() => ({
        isAuthenticated,
        user,
        users,
        tours,
        attractions,
        roomTypes,
        rooms,
        tourBookings,
        hotelBookings,
        currentPage,
        selectedTourId,
        selectedRoomId,
        language,
        tourFilter,
        login,
        logout,
        register,
        navigateTo,
        changeLanguage,
        addAttraction,
        setTourFilter,
        addHotelBooking,
        bookTour,
        updateUser,
        cancelTourBooking,
        cancelHotelBooking
    }), [
        isAuthenticated, user, users, tours, attractions, roomTypes, rooms, tourBookings, hotelBookings,
        currentPage, selectedTourId, selectedRoomId, language, tourFilter,
        login, logout, register, navigateTo, changeLanguage, addAttraction,
        addHotelBooking, bookTour, updateUser, cancelTourBooking, cancelHotelBooking
    ]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the app context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};