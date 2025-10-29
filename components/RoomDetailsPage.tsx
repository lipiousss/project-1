import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../store';
import { Room } from '../types';

const BookingModal: React.FC<{ room: Room; onClose: () => void }> = ({ room, onClose }) => {
    const { t } = useTranslation();
    const { user, addHotelBooking } = useAppContext();
    const [bookingDetails, setBookingDetails] = useState({
        checkInDate: '',
        checkOutDate: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
            alert(t('error.fillRequiredFields'));
            return;
        }
        addHotelBooking({
            roomId: room.id,
            checkInDate: bookingDetails.checkInDate,
            checkOutDate: bookingDetails.checkOutDate,
        });
        alert(t('alert.hotelRequestSent'));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">{t('hotel.bookRoomTitle', { id: room.id })}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.firstNamePlaceholder')}</label>
                        <input type="text" value={user?.firstName} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 shadow-sm sm:text-sm"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.lastNamePlaceholder')}</label>
                        <input type="text" value={user?.lastName} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 shadow-sm sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('hotel.checkIn')}</label>
                        <input type="date" id="checkIn" value={bookingDetails.checkInDate} onChange={e => setBookingDetails({...bookingDetails, checkInDate: e.target.value})} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('hotel.checkOut')}</label>
                        <input type="date" id="checkOut" value={bookingDetails.checkOutDate} onChange={e => setBookingDetails({...bookingDetails, checkOutDate: e.target.value})} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                    </div>
                    <div className="flex justify-end pt-4">
                         <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2 hover:bg-gray-300 dark:hover:bg-gray-500">{t('common.cancel')}</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{t('hotel.submitBooking')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const RoomDetailsPage: React.FC = () => {
    const { selectedRoomId, rooms, language, roomTypes, navigateTo } = useAppContext();
    const { t } = useTranslation();
    const [isBooking, setIsBooking] = useState(false);
    
    const room = rooms.find(r => r.id === selectedRoomId);
    const roomType = room ? roomTypes.find(rt => rt.id === room.roomTypeId) : null;
    const [mainImage, setMainImage] = useState(room?.imageUrls[0] || '');

    if (!room || !roomType) {
        return (
             <div className="text-center">
                <h2 className="text-2xl font-bold">Room not found</h2>
                <button onClick={() => navigateTo('hotel')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {t('roomDetails.backButton')}
                </button>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => navigateTo('hotel')} className="mb-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('roomDetails.backButton')}
            </button>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="p-8">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">{t('hotel.room')} #{room.id} - {roomType.name}</h2>
                    
                    <div className="mt-8">
                         <h3 className="text-2xl font-bold mb-4">{t('roomDetails.galleryTitle')}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="md:col-span-2">
                                <img src={mainImage} alt="Main room view" className="w-full h-96 object-cover rounded-lg shadow-md" />
                             </div>
                             <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
                                 {room.imageUrls.map((url, index) => (
                                     <img 
                                         key={index} 
                                         src={url} 
                                         alt={`Room view ${index + 1}`} 
                                         onClick={() => setMainImage(url)}
                                         className={`w-full h-24 object-cover rounded-md cursor-pointer border-4 ${mainImage === url ? 'border-blue-500' : 'border-transparent hover:border-blue-300'}`}
                                     />
                                 ))}
                             </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        <div className="md:col-span-2">
                            <h3 className="text-2xl font-bold mb-4">{t('roomDetails.aboutTitle')}</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{room.longDescription[language]}</p>
                        </div>
                        <div>
                             <h3 className="text-2xl font-bold mb-4">{t('roomDetails.characteristicsTitle')}</h3>
                             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                 {room.characteristics[language].split(', ').map((char, i) => <li key={i}>{char}</li>)}
                             </ul>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-5 flex justify-between items-center">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{t('hotel.pricePerNight', { price: room.pricePerNight })}</span>
                    <button 
                        onClick={() => setIsBooking(true)}
                        className="font-bold py-3 px-6 rounded-lg text-lg transition-colors bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50"
                    >
                        {t('roomDetails.bookNow')}
                    </button>
                </div>
            </div>
            {isBooking && <BookingModal room={room} onClose={() => setIsBooking(false)} />}
        </div>
    );
};
