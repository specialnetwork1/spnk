
import React, { useMemo } from 'react';
import { User, Tournament, Transaction, TransactionStatus } from '../../types';
import { UsersIcon, TrophyIcon, TransactionIcon, CashIcon, WalletIcon, ClipboardListIcon, UserCircleIcon } from '../icons/Icons';
import { useLanguage } from '../../context/LanguageContext';

interface AdminDashboardProps {
    users: User[];
    tournaments: Tournament[];
    transactions: Transaction[];
}

const StatCard: React.FC<{title: string, value: string | number, icon: React.ReactNode, color: string}> = ({ title, value, icon, color }) => (
    <div className={`bg-white dark:bg-gray-900 p-6 rounded-lg border-l-4 ${color} shadow-lg flex items-center`}>
        <div className={`p-3 rounded-full mr-4 bg-opacity-20 ${color.replace('border-', 'bg-')}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-text-secondary text-sm font-bold uppercase tracking-wider">{title}</h3>
            <p className="text-3xl font-heading font-extrabold text-text-primary mt-1">{value}</p>
        </div>
    </div>
);


const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, tournaments, transactions }) => {
    const { t } = useLanguage();

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

    const totalUsers = users.length;
    const pendingTransactions = transactions.filter(t => t.status === 'Pending').length;
    const activeTournaments = tournaments.length;
    
    const uniqueParticipantIds = new Set(tournaments.flatMap(t => t.participants));
    const usersInTournaments = uniqueParticipantIds.size;
    
    const totalRevenue = tournaments.reduce((acc, t) => acc + t.entryFee * t.participants.length, 0);

    const totalUserWalletBalance = users.reduce((acc, u) => acc + u.walletBalance, 0);

    type Activity = {
        id: string;
        type: 'registration' | 'deposit';
        date: string;
        content: React.ReactNode;
    };

    const recentActivities = useMemo(() => {
        const registrationActivities: Activity[] = users.map(user => ({
            id: `reg-${user.id}`,
            type: 'registration',
            date: user.registrationDate,
            content: (
                <>
                    <span className="font-bold">{user.inGameName}</span> {t('userRegistered', { inGameName: user.inGameName }).replace(user.inGameName, '')}
                </>
            ),
        }));

        const depositActivities: Activity[] = transactions
            .filter(tx => tx.status === TransactionStatus.Approved)
            .map(tx => {
                const user = users.find(u => u.id === tx.userId);
                return {
                    id: `dep-${tx.id}`,
                    type: 'deposit' as const,
                    date: tx.date,
                    content: (
                        <>
                            <span className="font-bold">{user?.inGameName || 'A user'}</span> {t('userDeposited', { inGameName: user?.inGameName || 'A user', amount: tx.amount }).replace(user?.inGameName || 'A user', '').replace(`৳${tx.amount}`, '')} <span className="font-bold text-green-500">৳{tx.amount}</span>.
                        </>
                    ),
                };
            });

        return [...registrationActivities, ...depositActivities]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [users, transactions, t]);


    return (
        <div>
            <h1 className="text-3xl font-heading text-primary mb-6">{t('platformStats')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard 
                    title={t('totalUsers')} 
                    value={totalUsers} 
                    color="border-blue-500"
                    icon={<UsersIcon className="h-6 w-6 text-blue-500"/>}
                />
                <StatCard 
                    title={t('usersInTournaments')} 
                    value={usersInTournaments} 
                    color="border-purple-500"
                    icon={<ClipboardListIcon className="h-6 w-6 text-purple-500"/>}
                />
                <StatCard 
                    title={t('totalRevenue')} 
                    value={`৳${totalRevenue.toLocaleString()}`} 
                    color="border-green-500"
                    icon={<CashIcon className="h-6 w-6 text-green-500"/>}
                />
                 <StatCard 
                    title={t('totalUserFunds')} 
                    value={`৳${totalUserWalletBalance.toLocaleString()}`} 
                    color="border-indigo-500"
                    icon={<WalletIcon className="h-6 w-6 text-indigo-500"/>}
                />
                <StatCard 
                    title={t('activeTournaments')} 
                    value={activeTournaments} 
                    color="border-red-500"
                    icon={<TrophyIcon className="h-6 w-6 text-red-500"/>}
                />
                <StatCard 
                    title={t('pendingTransactions')} 
                    value={pendingTransactions} 
                    color="border-yellow-500"
                    icon={<TransactionIcon className="h-6 w-6 text-yellow-500"/>}
                />
            </div>
            <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
                <h2 className="text-2xl font-heading text-primary mb-4">{t('recentActivity')}</h2>
                <div className="space-y-4">
                    {recentActivities.length > 0 ? recentActivities.map(activity => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-md bg-gray-50 dark:bg-gray-800/50">
                            <div className={`flex-shrink-0 mt-1 h-8 w-8 rounded-full flex items-center justify-center ${activity.type === 'registration' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>
                                {activity.type === 'registration' ? <UserCircleIcon className="h-5 w-5" /> : <WalletIcon className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="text-sm text-text-primary">{activity.content}</p>
                                <p className="text-xs text-text-secondary">{timeSince(activity.date)}</p>
                            </div>
                        </div>
                    )) : <p className="text-text-secondary">{t('noRecentActivity')}</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
