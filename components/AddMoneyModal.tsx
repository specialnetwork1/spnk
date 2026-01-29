import React, { useState, useEffect, useMemo } from 'react';
import { PaymentGateway } from '../types';
import { IdentificationIcon, ClipboardListIcon } from './icons/Icons';
import { useLanguage } from '../context/LanguageContext';

interface AddMoneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    gateway: PaymentGateway;
    onSubmit: (amount: number, trxId: string, referenceNumber: string) => void;
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ isOpen, onClose, gateway, onSubmit }) => {
    const { t } = useLanguage();
    const [amount, setAmount] = useState<number | ''>('');
    const [trxId, setTrxId] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const referenceNumber = useMemo(() => `FF-${Date.now()}`, []);

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setTrxId('');
            setError('');
            setIsProcessing(false);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof amount !== 'number' || amount <= 0) {
            setError(t('errorInvalidAmount'));
            return;
        }
        if (!trxId.trim()) {
            setError(t('errorTrxIdRequired'));
            return;
        }
        
        setError('');
        setIsProcessing(true);
        
        // Simulate API call delay
        setTimeout(() => {
            if(typeof amount === 'number') {
                onSubmit(amount, trxId, referenceNumber);
            }
            onClose(); 
        }, 1500);
    };
    
    if (!isOpen) return null;

    const renderContent = () => {
        if (isProcessing) {
            return (
                <div className="p-8 text-center font-body">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <h2 className="text-xl font-heading font-bold text-center text-primary mt-4">{t('verifyingPayment')}</h2>
                    <p className="text-text-secondary mt-2">{t('pleaseWait')}</p>
                </div>
            );
        }

        return (
            <form onSubmit={handleSubmit} className="p-6 font-body">
                <h2 id="add-money-title" className="text-2xl font-heading font-bold text-center text-primary mb-2">
                    {t('depositVia', { gatewayName: gateway.name })}
                </h2>

                <div className="mt-4 p-4 bg-gray-100 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3 text-center">
                    <div>
                        <p className="text-sm text-text-secondary">{t('paymentNumber')}:</p>
                        <p className="text-lg font-bold text-text-primary tracking-wider">{gateway.paymentNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">{t('referenceNumber')}:</p>
                        <p className="text-lg font-bold text-primary tracking-widest">{referenceNumber}</p>
                    </div>
                </div>

                <p className="text-center text-text-secondary my-4 text-sm bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-md border border-yellow-300 dark:border-yellow-500">{gateway.paymentInstructions || t('paymentInstructions')}</p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">{t('amountBdt')}</label>
                        <input type="number" id="amount" value={amount}
                            onChange={(e) => setAmount(e.target.value === '' ? '' : parseInt(e.target.value))}
                            required placeholder="e.g., 500" autoFocus
                            className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                     <div>
                        <label htmlFor="trxId" className="block text-sm font-medium text-text-secondary">{t('trxIdLabel')}</label>
                         <div className="relative mt-1">
                            <IdentificationIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" id="trxId" value={trxId}
                                onChange={(e) => setTrxId(e.target.value)}
                                required placeholder={t('trxIdPlaceholder')}
                                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pr-3 pl-10 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
                </div>

                <div className="mt-8 flex space-x-2">
                     <button type="button" onClick={onClose} className="w-1/3 py-3 px-4 rounded-md font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        {t('cancel')}
                    </button>
                    <button type="submit" className="w-2/3 py-3 px-4 rounded-md font-bold text-white bg-primary hover:bg-primary/80 transition-colors transform hover:scale-105">
                        {t('verifyPayment')}
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={isProcessing ? undefined : onClose} role="dialog" aria-modal="true" aria-labelledby="add-money-title">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                {renderContent()}
            </div>
        </div>
    );
};

export default AddMoneyModal;