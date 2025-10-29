// FIX: Create the ProfilePage component to display and manage user data.
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../store';
import { Tour, Room } from '../types';

export const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const { user, updateUser, tourBookings, hotelBookings, tours, rooms, roomTypes, language, cancelTourBooking, cancelHotelBooking } = useAppContext();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        patronymic: user?.patronymic || '',
        birthDate: user?.birthDate || '',
    });

    const userTourBookings = useMemo(() => 
        tourBookings.filter(b => b.userId === user?.id).sort((a, b) => {
            const tourA = tours.find(t => t.id === a.tourId);
            const tourB = tours.find(t => t.id === b.tourId);
            if (!tourA || !tourB) return 0;
            return new Date(tourB.startDatetime).getTime() - new Date(tourA.startDatetime).getTime();
        }),
    [tourBookings, user, tours]);

    const userHotelBookings = useMemo(() =>
        hotelBookings.filter(b => b.userId === user?.id).sort((a,b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()),
    [hotelBookings, user]);

    if (!user) {
        return <div>{t('profile.loading')}</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditToggle = () => {
        if (isEditing) {
            updateUser(formData);
        } else {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                patronymic: user.patronymic || '',
                birthDate: user.birthDate,
            });
        }
        setIsEditing(!isEditing);
    };
    
    const getTourById = (id: number): Tour | undefined => tours.find(t => t.id === id);
    const getRoomById = (id: number): Room | undefined => rooms.find(r => r.id === id);

    const inputClass = "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700/50";
    
    const getStatusChipClass = (status: string) => {
        switch (status) {
            case 'confirmed':
            case 'approved':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
            case 'rejected':
            case 'cancelled':
                return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
            default:
                return 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200';
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('profile.title')}</h2>
                    <button onClick={handleEditToggle} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                        {isEditing ? t('profile.saveButton') : t('profile.editButton')}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.firstNamePlaceholder')}</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={!isEditing} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.lastNamePlaceholder')}</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!isEditing} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.patronymicPlaceholder')}</label>
                        <input type="text" name="patronymic" value={formData.patronymic} onChange={handleInputChange} disabled={!isEditing} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.birthDatePlaceholder')}</label>
                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} disabled={!isEditing} className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.emailPlaceholder')}</label>
                        <input type="email" value={user.email} disabled className={inputClass} />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">{t('profile.myTours')}</h2>
                <div className="space-y-4">
                    {userTourBookings.length > 0 ? userTourBookings.map(booking => {
                        const tour = getTourById(booking.tourId);
                        if (!tour) return null;

                        const tourStartDate = new Date(tour.startDatetime);
                        const canCancelTour = tourStartDate.getTime() > new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

                        return (
                            <div key={booking.id} className="p-4 border dark:border-gray-700 rounded-md flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">{tour.name[language]}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('tours.date')}: {tourStartDate.toLocaleDateString()}</p>
                                    {tour.status === 'archived' && (
                                        <span className="mt-1 inline-block text-xs font-semibold uppercase px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">{t('tours.status.archived')}</span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusChipClass(booking.status)}`}>{t(`bookingStatus.${booking.status}`)}</span>
                                    {booking.status === 'confirmed' && canCancelTour && (
                                        <button 
                                            onClick={() => {
                                                if (window.confirm(t('profile.confirmCancelTour'))) {
                                                    cancelTourBooking(booking.id);
                                                }
                                            }}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                                        >
                                            {t('profile.cancelButton')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    }) : <p>{t('profile.noTourBookings')}</p>}
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">{t('profile.myHotelBookings')}</h2>
                <div className="space-y-4">
                     {userHotelBookings.length > 0 ? userHotelBookings.map(booking => {
                        const room = getRoomById(booking.roomId);
                        const roomType = room ? roomTypes.find(rt => rt.id === room.roomTypeId) : null;
                        if (!room) return null;

                        const checkInDate = new Date(booking.checkInDate);
                        const canCancelHotel = checkInDate.getTime() > new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
                        
                        return (
                            <div key={booking.id} className="p-4 border dark:border-gray-700 rounded-md">
                                <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{t('hotel.room')} #{room.id} ({roomType?.name})</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('hotel.checkIn')}: {booking.checkInDate} &mdash; {t('hotel.checkOut')}: {booking.checkOutDate}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusChipClass(booking.status)}`}>{t(`bookingStatus.${booking.status}`)}</span>
                                        {(booking.status === 'pending' || booking.status === 'approved') && canCancelHotel && (
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm(t('profile.confirmCancelHotel'))) {
                                                        cancelHotelBooking(booking.id);
                                                    }
                                                }}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                                            >
                                                {t('profile.cancelButton')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    }) : <p>{t('profile.noHotelBookings')}</p>}
                </div>
            </div>
        </div>
    );
};