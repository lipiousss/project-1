// FIX: Define all the necessary types for the application.

export enum Role {
  USER = 'user',
  TOUR_ADMIN = 'tour_admin',
  HOTEL_ADMIN = 'hotel_admin'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  patronymic?: string;
  email: string;
  password_hash: string;
  birthDate: string;
  role: Role;
}

export interface LocalizedString {
  en: string;
  ru: string;
}

export interface TourPoint {
    id: number;
    description: LocalizedString;
    photoUrl: string;
}

export interface Tour {
  id: number;
  name: LocalizedString;
  startLocation: LocalizedString;
  startDatetime: string;
  durationDays: number;
  totalSeats: number;
  ageRestriction: number;
  basePrice: number;
  description: LocalizedString;
  adminId: number;
  points: TourPoint[];
  status: 'active' | 'archived';
}

export interface Attraction {
  id: number;
  userId: number;
  userEmail: string;
  imageUrl: string;
  description: LocalizedString;
  uploadDate: string;
  tourId?: number;
}

export enum RoomTypeName {
    STANDARD = 'Standard',
    STUDIO = 'Studio',
    LUX = 'Lux'
}

export interface RoomType {
  id: number;
  name: RoomTypeName;
}

export interface Room {
  id: number;
  roomTypeId: number;
  pricePerNight: number;
  characteristics: LocalizedString;
  longDescription: LocalizedString;
  imageUrls: string[];
}

export interface TourBooking {
  id: number;
  userId: number;
  tourId: number;
  finalPrice: number;
  status: 'confirmed' | 'cancelled';
}

export interface HotelBooking {
  id: number;
  userId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
}