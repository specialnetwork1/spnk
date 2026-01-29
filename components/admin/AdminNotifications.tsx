
import React, { useState } from 'react';
import { PaperAirplaneIcon } from '../icons/Icons';
import { useLanguage } from '../../context/LanguageContext';

interface AdminNotificationsProps {
    onSend: (title: string, message: string) => void;
}

const AdminNotifications: React.FC<AdminNotificationsProps> = ({ onSend }) => {
    const { t } = useLanguage();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && message.trim()) {
            onSend(title, message);
            setTitle('');
            setMessage('');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
            <h1 className="text-3xl font-heading text-primary mb-6">{t('sendNotification')}</h1>
            <p className="mb-6 text-text-secondary font-body">
                {t('sendNotificationDescription')}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="notif-title" className="block text-sm font-medium text-text-secondary font-body">{t('title')}</label>
                    <input
                        id="notif-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary font-body"
                        placeholder="e.g., New Tournament Alert!"
                    />
                </div>
                <div>
                    <label htmlFor="notif-message" className="block text-sm font-medium text-text-secondary font-body">{t('message')}</label>
                    <textarea
                        id="notif-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary font-body"
                        placeholder="e.g., The 'Kalahari Kings' solo tournament is now open for registration. Join now!"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-900 transition-colors font-body"
                    disabled={!title.trim() || !message.trim()}
                >
                    <PaperAirplaneIcon />
                    <span>{t('sendToAllUsers')}</span>
                </button>
            </form>
        </div>
    );
};

export default AdminNotifications;
