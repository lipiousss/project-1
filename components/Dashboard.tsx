import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../store';
import { Tour } from '../types';

export const UdmurtiaInfoPage: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('udmurtia.title')}</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('udmurtia.description')}
            </p>
            <img src="https://picsum.photos/seed/udmurtia/1000/400" alt="Udmurtia Landscape" className="w-full h-auto rounded-lg mt-6 object-cover" />
        </div>
    );
};

export const AttractionsPage: React.FC = () => {
    const { attractions, addAttraction, tours, language } = useAppContext();
    const { t } = useTranslation();
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [selectedTourId, setSelectedTourId] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !image) {
            alert(t('alert.provideImageAndDescription'));
            return;
        }
        const imageUrl = URL.createObjectURL(image);
        addAttraction({ 
            description, 
            imageUrl, 
            uploadDate: new Date().toISOString().split('T')[0],
            tourId: selectedTourId ? parseInt(selectedTourId) : undefined
        });
        setDescription('');
        setImage(null);
        setSelectedTourId('');
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">{t('attractions.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('attractions.descriptionLabel')}</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 dark:text-white" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('attractions.imageLabel')}</label>
                        <input type="file" id="image" accept=".jpg, .jpeg, .png" onChange={e => e.target.files && setImage(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                    </div>
                    <div>
                        <label htmlFor="tourId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('attractions.linkToTourLabel')}</label>
                        <select 
                            id="tourId" 
                            value={selectedTourId} 
                            onChange={e => setSelectedTourId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 dark:text-white"
                        >
                            <option value="">{t('attractions.selectTourOptional')}</option>
                            {tours.filter(t => t.status === 'active').map(tour => (
                                <option key={tour.id} value={tour.id}>{tour.name[language]}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">{t('attractions.uploadButton')}</button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {attractions.map(attraction => (
                    <div key={attraction.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <img src={attraction.imageUrl} alt={attraction.description[language]} className="w-full h-56 object-cover" />
                        <div className="p-4">
                            <p className="text-gray-800 dark:text-gray-200">{attraction.description[language]}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('attractions.uploadedBy', { email: attraction.userEmail, date: attraction.uploadDate })}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SearchPage: React.FC = () => {
    const { tours, language, setTourFilter, navigateTo } = useAppContext();
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Tour[]>([]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }
        const lowerCaseTerm = searchTerm.toLowerCase();
        const foundTours = tours.filter(tour => 
            tour.status === 'active' &&
            (tour.name[language].toLowerCase().includes(lowerCaseTerm) ||
            tour.description[language].toLowerCase().includes(lowerCaseTerm) ||
            tour.startLocation[language].toLowerCase().includes(lowerCaseTerm))
        );
        setResults(foundTours);
    };

    const handleResultClick = (tour: Tour) => {
        setTourFilter(tour);
        navigateTo('tours');
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{t('search.title')}</h2>
            <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    placeholder={t('search.placeholder')}
                    className="flex-grow block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 dark:text-white"
                />
                <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">{t('search.findButton')}</button>
            </form>
            
            <div>
                <h3 className="text-xl font-semibold mb-4">{t('search.resultsTitle')}</h3>
                {results.length > 0 ? (
                    <div className="space-y-4">
                        {results.map(tour => (
                             <div key={tour.id} onClick={() => handleResultClick(tour)} className="p-4 border dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <h4 className="font-bold text-lg">{tour.name[language]}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{tour.startLocation[language]}</p>
                                <p className="mt-2">{tour.description[language]}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">{t('search.noResults')}</p>
                )}
            </div>
        </div>
    );
};