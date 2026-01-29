
import React, { useState } from 'react';
import { User, Page, AdminSubPage, Notification, AppSettings } from '../types';
import { WalletIcon, UserCircleIcon, CogIcon, LoginIcon, LogoutIcon, HomeIcon, SunIcon, MoonIcon, DashboardIcon, BellIcon } from './icons/Icons';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
    currentUser: User | null;
    onNavigate: (page: Page, subPage?: AdminSubPage) => void;
    onLogout: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    notifications: Notification[];
    onMarkNotificationsAsRead: () => void;
    appSettings: AppSettings;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, onLogout, theme, toggleTheme, notifications, onMarkNotificationsAsRead, appSettings }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    const handleHomeClick = () => {
        if (currentUser?.isAdmin) {
            onNavigate('admin', 'dashboard');
        } else {
            onNavigate('home');
        }
    };

    const unreadCount = currentUser ? notifications.filter(n => !currentUser.readNotificationIds.includes(n.id)).length : 0;

    const handleBellClick = () => {
        setShowNotifications(prev => !prev);
        if (unreadCount > 0) {
            onMarkNotificationsAsRead();
        }
    };
    
    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return `${Math.floor(interval)} ${t('yearsAgo')}`;
        interval = seconds / 2592000;
        if (interval > 1) return `${Math.floor(interval)} ${t('monthsAgo')}`;
        interval = seconds / 86400;
        if (interval > 1) return `${Math.floor(interval)} ${t('daysAgo')}`;
        interval = seconds / 3600;
        if (interval > 1) return `${Math.floor(interval)} ${t('hoursAgo')}`;
        interval = seconds / 60;
        if (interval > 1) return `${Math.floor(interval)} ${t('minutesAgo')}`;
        return t('justNow');
    };

    return (
        <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-primary/30 sticky top-0 z-50 shadow-lg dark:shadow-primary/20">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <button onClick={() => onNavigate('home')} className="flex items-center text-2xl font-heading font-bold text-primary hover:text-primary/80 transition-colors tracking-widest">
                        {appSettings.appLogoUrl ? (
                            <img src={appSettings.appLogoUrl} alt={appSettings.appName} className="h-8 max-h-8 w-auto object-contain" />
                        ) : (
                            appSettings.appName
                        )}
                    </button>
                </div>

                <nav className="flex items-center space-x-1 sm:space-x-2">
                    <button onClick={handleHomeClick} className="flex items-center text-text-secondary hover:text-primary transition-colors p-2 rounded-md">
                        <HomeIcon />
                        <span className="hidden sm:inline ml-2 font-body">{t('home')}</span>
                    </button>
                    {currentUser ? (
                        <>
                            {currentUser && !currentUser.isAdmin && (
                                <div className="relative">
                                    <button onClick={handleBellClick} className="relative p-2 rounded-md text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <BellIcon />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-primary border-2 border-white dark:border-gray-800"></span>
                                        )}
                                    </button>
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                            <div className="p-3 font-bold text-text-primary border-b dark:border-gray-700">{t('notifications')}</div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    [...notifications].reverse().map(n => (
                                                        <div key={n.id} className="p-3 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                            <p className="font-semibold text-text-primary">{n.title}</p>
                                                            <p className="text-sm text-text-secondary">{n.message}</p>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeSince(n.date)}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="p-4 text-center text-text-secondary">{t('noNotifications')}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button onClick={() => onNavigate('wallet')} className="flex items-center text-text-secondary hover:text-primary transition-colors p-2 rounded-md">
                                <WalletIcon className="h-5 w-5" />
                                <span className="hidden sm:inline ml-2 font-body">{t('wallet')}</span>
                            </button>
                            <button onClick={() => onNavigate('profile')} className="flex items-center space-x-2 text-text-secondary p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <UserCircleIcon />
                                <span className="hidden md:inline font-semibold font-body">{currentUser.inGameName}</span>
                            </button>
                            <button onClick={onLogout} className="flex items-center text-text-secondary hover:text-primary transition-colors p-2 rounded-md">
                                <LogoutIcon />
                                <span className="hidden sm:inline ml-2 font-body">{t('logout')}</span>
                            </button>
                        </>
                    ) : (
                        <button onClick={() => onNavigate('login')} className="flex items-center bg-primary px-4 py-2 rounded-md hover:bg-primary/80 transition-colors font-bold text-white">
                            <LoginIcon />
                            <span className="ml-2 font-body">{t('loginRegister')}</span>
                        </button>
                    )}
                     <button onClick={toggleTheme} className="p-2 rounded-md text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                            className="p-2 rounded-md text-text-secondary bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 appearance-none cursor-pointer focus:outline-none"
                            aria-label={t('language')}
                        >
                            <option value="en">{t('english')}</option>
                            <option value="bn">{t('bengali')}</option>
                        </select>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
