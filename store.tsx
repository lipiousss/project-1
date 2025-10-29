// FIX: Implement the AppProvider and useAppContext to provide global state management.
import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import i18n from 'i18next';
import { User, Tour, Attraction, RoomType, Room, TourBooking, HotelBooking, Role, LocalizedString } from './types';

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
    const [users, setUsers] = useState<User[]>([]);
    const [tours, setTours] = useState<Tour[]>([]);
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [tourBookings, setTourBookings] = useState<TourBooking[]>([]);
    const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
    
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState('udmurtia');
    const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [language, setLanguage] = useState<'en' | 'ru'>(i18n.language as 'en' | 'ru' || 'ru');
    const [tourFilter, setTourFilter] = useState<Tour | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/data.php');
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data = await response.json();
                setUsers(data.users);
                setTours(data.tours);
                setAttractions(data.attractions);
                setRoomTypes(data.roomTypes);
                setRooms(data.rooms);
                setTourBookings(data.tourBookings);
                setHotelBookings(data.hotelBookings);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Here you could set an error state to show a message to the user
            }
        };

        fetchData();
    }, []);

    const login = useCallback((email: string, password_hash: string): boolean => {
        // In a real app, this would be a POST request to a login API endpoint.
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
        // In a real app, you would also send this newUser to a PHP script
        // using fetch() with a POST method to save it.
        // For now, we are only updating the client-side state.
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
        // In a real app, this would be a POST request to save the new attraction.
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
        // In a real app, this would be a POST request to save the new booking.
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
        // In a real app, this would be a POST request to save the new booking.
        setTourBookings(prev => [...prev, newBooking]);
        return true;
    }, [user, tours, tourBookings]);
    
    const updateUser = useCallback((data: Partial<Omit<User, 'id' | 'email' | 'role' | 'password_hash'>>) => {
        if (!user) return;
        
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        
        // In a real app, this would be a POST request to update user data.
        setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? updatedUser : u));
    }, [user]);

    const cancelTourBooking = useCallback((bookingId: number) => {
        // In a real app, this would be a POST request to update the booking status.
        setTourBookings(prev => prev.map(b => 
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ));
    }, []);

    const cancelHotelBooking = useCallback((bookingId: number) => {
        // In a real app, this would be a POST request to update the booking status.
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