
import React, { useState } from 'react';
import { User, Transaction, TransactionStatus, AppSettings, PaymentGateway } from '../types';
import AddMoneyModal from '../components/AddMoneyModal';
import { useLanguage } from '../context/LanguageContext';

interface WalletPageProps {
    user: User;
    transactions: Transaction[];
    onAddMoney: (amount: number, trxId: string, referenceNumber: string, gatewayName: string) => void;
    appSettings: AppSettings;
}

const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
        case TransactionStatus.Approved:
            return 'text-green-500 dark:text-green-400';
        case TransactionStatus.Pending:
            return 'text-yellow-500 dark:text-yellow-400';
        case TransactionStatus.Rejected:
            return 'text-red-500 dark:text-red-400';
        default:
            return 'text-gray-500 dark:text-gray-400';
    }
}

const getGatewayLogo = (name: PaymentGateway['name']): string => {
    switch(name) {
        case 'bKash':
            return 'https://seeklogo.com/images/B/bkash-logo-FBB25873C6-seeklogo.com.png';
        case 'Nagad':
            return 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png';
        case 'Rocket':
            return 'https://seeklogo.com/images/R/rocket-logo-622E42682C-seeklogo.com.png';
        case 'Upay':
            return 'https://seeklogo.com/images/U/upay-logo-A95A475591-seeklogo.com.png';
        default:
            return ''; // fallback
    }
}


const WalletPage: React.FC<WalletPageProps> = ({ user, transactions, onAddMoney, appSettings }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
    const { t } = useLanguage();
    
    const configuredGateways = appSettings.paymentGateways.filter(g => 
        g.enabled && g.paymentNumber
    );

    const handleGatewayClick = (gateway: PaymentGateway) => {
        setSelectedGateway(gateway);
        setIsModalOpen(true);
    };

    const handleModalSubmit = (amount: number, trxId: string, referenceNumber: string) => {
        if (selectedGateway) {
            onAddMoney(amount, trxId, referenceNumber, selectedGateway.name);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-body">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20 text-center">
                        <h3 className="text-text-secondary text-lg">{t('currentBalance')}</h3>
                        <p className="text-5xl font-heading font-bold text-green-600 dark:text-green-400 mt-2">৳{user.walletBalance.toFixed(2)}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
                        <h2 className="text-2xl font-heading text-center text-primary mb-4">{t('addMoney')}</h2>
                        <p className="text-center text-text-secondary mb-6">{t('addMoneyDescription')}</p>
                        <div className="grid grid-cols-2 gap-4">
                             {configuredGateways.length > 0 ? (
                                configuredGateways.map(gateway => (
                                    <button
                                        key={gateway.name}
                                        onClick={() => handleGatewayClick(gateway)}
                                        className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex justify-center items-center h-20 border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none transition-all transform hover:scale-105"
                                        aria-label={`Deposit with ${gateway.name}`}
                                    >
                                        <img 
                                            src={gateway.logoUrl || getGatewayLogo(gateway.name)} 
                                            alt={`${gateway.name} logo`} 
                                            className="max-h-12 object-contain"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.onerror = null; // prevent infinite loop
                                                target.src = getGatewayLogo(gateway.name); // load default
                                            }}
                                        />
                                    </button>
                                ))
                            ) : (
                                <p className="col-span-2 text-center text-md font-semibold text-orange-600 dark:text-orange-500 bg-orange-500/10 p-4 rounded-md">
                                    {t('noPaymentMethods')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
                    <h2 className="text-2xl font-heading text-primary mb-4">{t('transactionHistory')}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-text-secondary">
                            <thead className="text-xs text-primary/80 dark:text-primary uppercase bg-gray-100 dark:bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-4 py-3">{t('date')}</th>
                                    <th scope="col" className="px-4 py-3">{t('amount')}</th>
                                    <th scope="col" className="px-4 py-3">{t('details')}</th>
                                    <th scope="col" className="px-4 py-3">{t('status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
                                    <tr key={tx.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-3 whitespace-nowrap">{new Date(tx.date).toLocaleString()}</td>
                                        <td className="px-4 py-3 font-medium text-text-primary">৳{tx.amount}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-text-primary">{tx.senderNumber}</p>
                                            <p className="text-xs text-gray-500">{t('trxId')}: {tx.trxId}</p>
                                            {tx.referenceNumber && <p className="text-xs text-gray-500">{t('referenceNumber')}: {tx.referenceNumber}</p>}
                                        </td>
                                        <td className={`px-4 py-3 font-bold ${getStatusColor(tx.status)}`}>{tx.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isModalOpen && selectedGateway && (
                <AddMoneyModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    gateway={selectedGateway}
                    onSubmit={handleModalSubmit}
                />
            )}
        </>
    );
};

export default WalletPage;