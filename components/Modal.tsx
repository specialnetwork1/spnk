
import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ModalProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, type, onClose }) => {
    const { t } = useLanguage();
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const borderColor = type === 'success' ? 'border-green-700' : 'border-red-700';

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <div className={`text-white px-6 py-4 border-2 ${borderColor} rounded-lg shadow-lg ${bgColor} animate-bounce`}>
                <span className="font-bold">{type === 'success' ? t('success') : t('error')}</span>
                <span className="block sm:inline ml-2">{message}</span>
            </div>
        </div>
    );
};

export default Modal;
