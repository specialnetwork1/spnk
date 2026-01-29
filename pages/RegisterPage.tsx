
import React, { useState } from 'react';
import { Page, User, AdminSubPage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface RegisterPageProps {
    onRegister: (newUser: Omit<User, 'id' | 'walletBalance' | 'isAdmin' | 'joinedTournaments' | 'readNotificationIds' | 'registrationDate' | 'avatarUrl' | 'socials'> & { password: string }) => Promise<boolean>;
    onNavigate: (page: Page, subPage?: AdminSubPage) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigate }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        inGameName: '',
        playerUID: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            inGameName: formData.inGameName,
            playerUID: formData.playerUID,
            password: formData.password,
        });
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-900 p-8 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20 font-body">
            <h2 className="text-3xl font-heading text-center text-primary mb-6">{t('createAccount')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder={t('fullName')} onChange={handleChange} required className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                <input type="email" name="email" placeholder={t('email')} onChange={handleChange} required className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                <input type="tel" name="phone" placeholder={t('phone')} onChange={handleChange} required className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                <input type="text" name="inGameName" placeholder={t('inGameName')} onChange={handleChange} required className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                <input type="text" name="playerUID" placeholder={t('playerUID')} onChange={handleChange} required className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                <input type="password" name="password" placeholder={t('password')} onChange={handleChange} required className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-900 transition-colors">
                    {t('register')}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-text-secondary">
                {t('alreadyHaveAccount')}{' '}
                <button onClick={() => onNavigate('login')} className="font-medium text-primary hover:text-primary/80">
                    {t('login')}
                </button>
            </p>
        </div>
    );
};

export default RegisterPage;