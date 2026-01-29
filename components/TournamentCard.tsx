
import React from 'react';
import { Tournament, User } from '../types';
import { UsersIcon, MapIcon, TrophyIcon, ShieldCheckIcon, ClockIcon, CashIcon } from './icons/Icons';
import { useCountdown } from '../hooks/useCountdown';
import { useLanguage } from '../context/LanguageContext';

interface TournamentCardProps {
    tournament: Tournament;
    onViewDetails: (id: string) => void;
    currentUser: User | null;
}

const CountdownDisplay: React.FC<{ startTime: string }> = ({ startTime }) => {
    const { days, hours, minutes, seconds, isRunning } = useCountdown(startTime);
    const { t } = useLanguage();

    if (!isRunning) {
        return <span className="font-bold text-primary">{t('matchStarted')}</span>;
    }

    return (
        <div className="font-mono tracking-tight text-sm">
            <span>{String(days).padStart(2, '0')}d</span> : <span>{String(hours).padStart(2, '0')}h</span> : <span>{String(minutes).padStart(2, '0')}m</span> : <span className="text-primary">{String(seconds).padStart(2, '0')}s</span>
        </div>
    );
};

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onViewDetails, currentUser }) => {
    const { t } = useLanguage();
    const isJoined = currentUser?.joinedTournaments.includes(tournament.id);
    
    const cardBorderColor = isJoined ? 'border-green-500' : 'dark:border-primary/50 border-primary/20';

    return (
        <div 
            onClick={() => onViewDetails(tournament.id)}
            className={`group bg-white dark:bg-gray-900 rounded-lg border ${cardBorderColor} shadow-lg dark:shadow-primary/20 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col`}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onViewDetails(tournament.id)}
        >
            <div className="relative h-40 overflow-hidden">
                <img 
                    src={tournament.imageUrl || 'https://placehold.co/600x400/1a202c/ff4500/png?text=FF+HUB'} 
                    alt={tournament.name} 
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <span className="absolute top-3 right-3 flex-shrink-0 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">{tournament.type}</span>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-heading font-bold text-primary dark:text-primary pr-2 truncate" title={tournament.name}>{tournament.name}</h3>
                
                 <div className="mt-4 space-y-3 text-sm text-text-secondary flex-grow">
                    <div className="flex items-center space-x-2">
                        <TrophyIcon />
                        <span>{t('prizePool')}: <span className="font-bold text-yellow-500 dark:text-yellow-400">৳{tournament.prizePool}</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapIcon />
                        <span>{t('map')}: <span className="font-bold text-text-primary">{tournament.mapName}</span></span>
                    </div>
                     <div className="flex items-center space-x-2">
                        <UsersIcon />
                        <span>{t('players')}: <span className="font-bold text-text-primary">{tournament.participants.length}/{tournament.maxPlayers}</span></span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-text-primary">
                        <ClockIcon className="h-5 w-5 text-primary" />
                        <CountdownDisplay startTime={tournament.startTime} />
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-black/60 px-5 py-3 flex justify-between items-center">
                 <div className="flex items-center space-x-2">
                    <CashIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <span className="font-bold text-lg text-green-600 dark:text-green-400">৳{tournament.entryFee}</span>
                </div>
                {isJoined && (
                    <div className="flex items-center bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        <ShieldCheckIcon/>
                        <span className="ml-1">{t('joined')}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TournamentCard;
