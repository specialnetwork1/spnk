import React, { useState } from 'react';
import { Page, AdminSubPage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LoginPageProps {
    onLogin: (email: string, password: string) => Promise<boolean>;
    onNavigate: (page: Page, subPage?: AdminSubPage) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useLanguage();
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-900 p-8 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20 font-body">
            <h2 className="text-3xl font-heading text-center text-primary mb-6">{t('playerLogin')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary">{t('email')}</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="your@email.com"
                    />
                </div>
                 <div>
                    <label htmlFor="password" aria-label="Password" className="block text-sm font-medium text-text-secondary">{t('password')}</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="********"
                    />
                </div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-900 transition-colors">
                    {t('login')}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-text-secondary">
                {t('dontHaveAccount')}{' '}
                <button onClick={() => onNavigate('register')} className="font-medium text-primary hover:text-primary/80">
                    {t('registerNow')}
                </button>
            </p>
        </div>
    );
};

export default LoginPage;