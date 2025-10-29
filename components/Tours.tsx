import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../store';
import { Tour } from '../types';

const TourCard: React.FC<{ tour: Tour }> = ({ tour }) => {
    const { language, navigateTo } = useAppContext();
    const { t } = useTranslation();
    const locale = language;

    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => navigateTo('tour-details', tour.id)}
        >
            <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tour.name[locale]}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('tours.startsAt', { location: tour.startLocation[locale] })}</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{tour.description[locale]}</p>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div><strong>{t('tours.date')}:</strong> {new Date(tour.startDatetime).toLocaleDateString()}</div>
                    <div><strong>{t('tours.duration')}:</strong> {t('tours.days', { count: tour.durationDays })}</div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{t('tours.price', { price: tour.basePrice })}</span>
                    <span className="font-bold py-2 px-4 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {t('tours.details')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const ToursPage: React.FC = () => {
    const { t } = useTranslation();
    const { tours, tourFilter, setTourFilter } = useAppContext();
    
    const activeTours = tours.filter(tour => tour.status === 'active');

    if (tourFilter) {
        return (
            <div>
                 <div className="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 rounded-md mb-6" role="alert">
                    <p className="font-bold">{t('tours.showingFiltered')}</p>
                    <p>{t('tours.showingFilteredDesc', { name: tourFilter.name[useAppContext().language] })}</p>
                </div>
                <button onClick={() => setTourFilter(null)} className="mb-4 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                    {t('tours.showAllButton')}
                </button>
                <div className="max-w-2xl mx-auto">
                    <TourCard tour={tourFilter} />
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-center mb-8">{t('tours.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeTours.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
        </div>
    );
};