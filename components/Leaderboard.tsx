import React, { useMemo } from 'react';
import { User } from '../types';
import { CrownIcon } from './icons/Icons';
import { useLanguage } from '../context/LanguageContext';

interface LeaderboardProps {
    users: User[];
    currentUser: User | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, currentUser }) => {
    const { t } = useLanguage();

    const topPlayers = useMemo(() => 
        users
            .filter(u => !u.isAdmin) // Don't show admins in rankings
            .sort((a, b) => b.walletBalance - a.walletBalance)
            .slice(0, 10), 
        [users]
    );

    if (topPlayers.length === 0) {
        return null; // Don't render if there are no players to rank
    }

    const getRankColor = (rank: number) => {
        if (rank === 0) return 'text-yellow-400';
        if (rank === 1) return 'text-gray-400';
        if (rank === 2) return 'text-amber-600';
        return 'text-text-secondary';
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
            <h2 className="text-3xl font-heading font-extrabold text-primary mb-2 text-center">{t('playerRankings')}</h2>
            <p className="text-center text-text-secondary mb-6">{t('seeWhoTops')}</p>
            <div className="overflow-x-auto">
                <table className="w-full text-left font-body">
                    <thead className="text-xs text-primary/80 dark:text-primary uppercase bg-gray-100 dark:bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-4 py-3 w-16 text-center">{t('rank')}</th>
                            <th scope="col" className="px-4 py-3">{t('player')}</th>
                            <th scope="col" className="px-4 py-3 text-right">{t('balance')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topPlayers.map((player, index) => {
                            const isCurrentUser = currentUser?.id === player.id;
                            return (
                                <tr 
                                    key={player.id} 
                                    className={`border-b border-gray-200 dark:border-gray-700 ${isCurrentUser ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                                >
                                    <td className="px-4 py-3 text-center">
                                        <span className={`font-bold text-lg ${getRankColor(index)} flex items-center justify-center`}>
                                            {index === 0 && <CrownIcon className="w-6 h-6 mr-1" />}
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                            <img 
                                                src={player.avatarUrl || `https://i.pravatar.cc/150?u=${player.id}`} 
                                                alt={player.inGameName} 
                                                className="h-10 w-10 rounded-full object-cover border-2 border-primary/50"
                                            />
                                            <div>
                                                <p className="font-bold text-text-primary truncate">{player.inGameName}</p>
                                                <p className="text-xs text-text-secondary">{player.playerUID}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                                        ৳{player.walletBalance.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
