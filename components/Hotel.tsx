import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../store';
import { Room } from '../types';

const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
    const { roomTypes, language, navigateTo } = useAppContext();
    const { t } = useTranslation();
    const roomType = roomTypes.find(rt => rt.id === room.roomTypeId);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300">
            <img src={room.imageUrls[0]} alt={`Room ${room.id}`} className="w-full h-56 object-cover" />
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('hotel.room')} #{room.id} - {roomType?.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 flex-grow">{room.characteristics[language]}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{t('hotel.pricePerNight', { price: room.pricePerNight })}</span>
                    <button onClick={() => navigateTo('room-details', room.id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{t('hotel.viewDetails')}</button>
                </div>
            </div>
        </div>
    );
};

export const HotelPage: React.FC = () => {
    const { rooms } = useAppContext();
    const { t } = useTranslation();

    return (
        <div>
            <h2 className="text-3xl font-bold text-center mb-8">{t('hotel.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map(room => <RoomCard key={room.id} room={room} />)}
            </div>
        </div>
    );
};