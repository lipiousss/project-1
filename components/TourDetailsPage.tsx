import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../store';

export const TourDetailsPage: React.FC = () => {
    const { selectedTourId, tours, language, user, tourBookings, bookTour, attractions, navigateTo } = useAppContext();
    const { t } = useTranslation();
    const locale = language;

    const tour = tours.find(t => t.id === selectedTourId);
    const tourAttractions = attractions.filter(a => a.tourId === selectedTourId);

    if (!tour) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold">Tour not found</h2>
                <button onClick={() => navigateTo('tours')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {t('tourDetails.backButton')}
                </button>
            </div>
        );
    }

    const isBooked = user ? tourBookings.some(b => b.userId === user.id && b.tourId === tour.id && b.status === 'confirmed') : false;

    const handleBookClick = () => {
        if (bookTour(tour.id)) {
            alert(t('alert.tourBookedSuccess'));
        } else {
            alert(t('alert.bookingFailed'));
        }
    }

    return (
        <div>
            <button onClick={() => navigateTo('tours')} className="mb-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('tourDetails.backButton')}
            </button>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="p-8">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">{tour.name[locale]}</h2>
                    <p className="text-md text-gray-500 dark:text-gray-400 mb-6">{t('tours.startsAt', { location: tour.startLocation[locale] })}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">{tour.description[locale]}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"><strong>{t('tours.date')}:</strong><br/>{new Date(tour.startDatetime).toLocaleDateString()}</div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"><strong>{t('tours.duration')}:</strong><br/>{t('tours.days', { count: tour.durationDays })}</div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"><strong>{t('tours.seats')}:</strong><br/>{tour.totalSeats}</div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"><strong>{t('tours.age')}:</strong><br/>{tour.ageRestriction}+</div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-2xl font-bold mb-4">{t('tourDetails.tourPoints')}</h3>
                        <div className="space-y-4">
                            {tour.points.map(point => (
                                <div key={point.id} className="flex items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <img src={point.photoUrl} alt={point.description[locale]} className="w-24 h-16 object-cover rounded-md mr-4"/>
                                    <p className="font-semibold">{point.description[locale]}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-2xl font-bold mb-4">{t('tourDetails.userPhotos')}</h3>
                        {tourAttractions.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {tourAttractions.map(attraction => (
                                    <div key={attraction.id} className="relative group">
                                        <img src={attraction.imageUrl} alt={attraction.description[language]} className="w-full h-40 object-cover rounded-lg"/>
                                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                            <p className="text-sm text-white">{attraction.description[language]}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">{t('tourDetails.noPhotos')}</p>
                        )}
                    </div>
                    
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-5 flex justify-between items-center">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{t('tours.price', { price: tour.basePrice })}</span>
                    <button 
                        onClick={handleBookClick}
                        disabled={isBooked || tour.status === 'archived'}
                        className={`font-bold py-3 px-6 rounded-lg text-lg transition-colors ${
                            isBooked || tour.status === 'archived'
                                ? 'bg-gray-400 dark:bg-gray-600 text-gray-800 dark:text-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50'
                        }`}
                    >
                        {isBooked ? t('tours.booked') : (tour.status === 'archived' ? t('tours.status.archived') : t('tours.bookNow'))}
                    </button>
                </div>
            </div>
        </div>
    );
};