import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from './store';
import { LoginPage, RegisterPage } from './components/Auth';
import { UdmurtiaInfoPage, AttractionsPage, SearchPage } from './components/Dashboard';
import { ToursPage } from './components/Tours';
import { HotelPage } from './components/Hotel';
import { ProfilePage } from './components/ProfilePage';
import { TourDetailsPage } from './components/TourDetailsPage';
import { RoomDetailsPage } from './components/RoomDetailsPage';

const App: React.FC = () => {
    const { isAuthenticated, user, logout, currentPage, navigateTo, language, changeLanguage } = useAppContext();
    const [isAuthPage, setIsAuthPage] = useState(true); // true for login, false for register
    const { t } = useTranslation();

    const renderPage = () => {
        switch (currentPage) {
            case 'udmurtia':
                return <UdmurtiaInfoPage />;
            case 'tours':
                return <ToursPage />;
            case 'tour-details':
                return <TourDetailsPage />;
            case 'hotel':
                return <HotelPage />;
            case 'room-details':
                return <RoomDetailsPage />;
            case 'attractions':
                return <AttractionsPage />;
            case 'search':
                return <SearchPage />;
            case 'profile':
                return <ProfilePage />;
            default:
                return <UdmurtiaInfoPage />;
        }
    };

    if (!isAuthenticated) {
        return isAuthPage ? 
               <LoginPage onRegisterLinkClick={() => setIsAuthPage(false)} /> : 
               <RegisterPage onLoginLinkClick={() => setIsAuthPage(true)} />;
    }

    const NavButton: React.FC<{page: 'udmurtia' | 'tours' | 'hotel' | 'attractions' | 'search', children: React.ReactNode}> = ({ page, children }) => (
        <button 
            onClick={() => navigateTo(page)} 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${currentPage === page ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
                <nav className="container mx-auto px-6 py-3">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => navigateTo('udmurtia')}>
                            {t('app.title')}
                        </div>
                        
                        <div className="hidden md:flex items-center space-x-2">
                            <NavButton page="udmurtia">{t('nav.udmurtia')}</NavButton>
                            <NavButton page="tours">{t('nav.tours')}</NavButton>
                            <NavButton page="hotel">{t('nav.hotel')}</NavButton>
                            <NavButton page="attractions">{t('nav.attractions')}</NavButton>
                            <NavButton page="search">{t('nav.search')}</NavButton>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button onClick={() => navigateTo('profile')} className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium">{t('nav.profile')}</button>
                            <span className="hidden sm:block text-gray-300 dark:text-gray-600">|</span>
                             
                            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1 text-sm">
                                <button onClick={() => changeLanguage('ru')} className={`px-3 py-1 rounded-full text-xs transition-all ${language === 'ru' ? 'bg-white dark:bg-gray-900 font-semibold shadow' : 'opacity-70'}`}>RU</button>
                                <button onClick={() => changeLanguage('en')} className={`px-3 py-1 rounded-full text-xs transition-all ${language === 'en' ? 'bg-white dark:bg-gray-900 font-semibold shadow' : 'opacity-70'}`}>EN</button>
                            </div>
                            
                            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-full text-xs transition-colors duration-200 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                {t('auth.signOutButton')}
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="container mx-auto p-6">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;