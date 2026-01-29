
import React from 'react';
import { Transaction, TransactionStatus, User } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AdminTransactionsProps {
    transactions: Transaction[];
    users: User[];
    onUpdateStatus: (transactionId: string, status: TransactionStatus.Approved | TransactionStatus.Rejected) => void;
}

const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
        case TransactionStatus.Approved: return 'text-green-500 dark:text-green-400';
        case TransactionStatus.Pending: return 'text-yellow-500 dark:text-yellow-400';
        case TransactionStatus.Rejected: return 'text-red-500 dark:text-red-400';
        default: return 'text-gray-500 dark:text-gray-400';
    }
}

const AdminTransactions: React.FC<AdminTransactionsProps> = ({ transactions, users, onUpdateStatus }) => {
    const { t } = useLanguage();
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getUserInGameName = (userId: string) => {
        return users.find(u => u.id === userId)?.inGameName || 'Unknown User';
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
            <h1 className="text-3xl font-heading text-primary mb-6">{t('transactionHistoryAdmin')}</h1>
            <p className="mb-6 text-text-secondary font-body">
                {t('transactionHistoryDescription')}
            </p>
            {sortedTransactions.length === 0 ? (
                <p className="text-text-secondary font-body">{t('noTransactionsRecorded')}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary font-body">
                        <thead className="text-xs text-primary/80 dark:text-primary uppercase bg-gray-100 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-4 py-3">{t('date')}</th>
                                <th scope="col" className="px-4 py-3">{t('playerIgn')}</th>
                                <th scope="col" className="px-4 py-3">{t('amount')}</th>
                                <th scope="col" className="px-4 py-3">{t('methodDetails')}</th>
                                <th scope="col" className="px-4 py-3">{t('trxId')}</th>
                                <th scope="col" className="px-4 py-3">{t('status')}</th>
                                <th scope="col" className="px-4 py-3">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTransactions.map(tx => (
                                <tr key={tx.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-3 whitespace-nowrap">{new Date(tx.date).toLocaleString()}</td>
                                    <td className="px-4 py-3">{getUserInGameName(tx.userId)}</td>
                                    <td className="px-4 py-3 font-medium text-text-primary">৳{tx.amount}</td>
                                    <td className="px-4 py-3">{tx.senderNumber}</td>
                                    <td className="px-4 py-3">{tx.trxId}</td>
                                    <td className={`px-4 py-3 font-bold ${getStatusColor(tx.status)}`}>{tx.status}</td>
                                    <td className="px-4 py-3 space-x-2">
                                        {tx.status === TransactionStatus.Pending ? (
                                            <>
                                                <button onClick={() => onUpdateStatus(tx.id, TransactionStatus.Approved)} className="font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md">{t('approve')}</button>
                                                <button onClick={() => onUpdateStatus(tx.id, TransactionStatus.Rejected)} className="font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md">{t('reject')}</button>
                                            </>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminTransactions;
