
import React from 'react';
import { AdminSubPage } from '../../types';
import { DashboardIcon, TransactionIcon, SettingsIcon, ClipboardListIcon, BellIcon } from '../icons/Icons';
import { useLanguage } from '../../context/LanguageContext';

interface AdminSidebarProps {
    activeView: AdminSubPage;
    setActiveView: (view: AdminSubPage) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setActiveView }) => {
    const { t, language, setLanguage } = useLanguage();
    const navItems = [
        { id: 'dashboard', label: t('dashboard'), icon: <DashboardIcon /> },
        { id: 'transactions', label: t('transactions'), icon: <TransactionIcon /> },
        { id: 'tournaments', label: t('tournaments'), icon: <ClipboardListIcon /> },
        { id: 'notifications', label: t('notifications'), icon: <BellIcon /> },
        { id: 'settings', label: t('settings'), icon: <SettingsIcon /> },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
            <h2 className="text-xl font-heading text-primary mb-4 px-2">{t('adminMenu')}</h2>
            <nav className="flex flex-col space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id as AdminSubPage)}
                        className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md transition-colors ${
                            activeView === item.id 
                            ? 'bg-primary text-white' 
                            : 'text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700/50 hover:text-text-primary'
                        }`}
                    >
                        {item.icon}
                        <span className="font-semibold font-body">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-primary/20">
                <label htmlFor="language-select" className="block px-2 text-sm font-medium text-text-secondary">{t('language')}</label>
                <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                    className="mt-1 w-full text-left px-3 py-2 rounded-md transition-colors text-text-secondary bg-gray-100 dark:bg-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={t('language')}
                >
                    <option value="en">{t('english')}</option>
                    <option value="bn">{t('bengali')}</option>
                </select>
            </div>
        </div>
    );
};

export default AdminSidebar;
