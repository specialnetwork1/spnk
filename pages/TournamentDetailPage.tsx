
import React from 'react';
import { Tournament, User } from '../types';
import { UsersIcon, MapIcon, TrophyIcon, ShieldCheckIcon, CashIcon } from '../components/icons/Icons';
import { useCountdown } from '../hooks/useCountdown';
import { useLanguage } from '../context/LanguageContext';

const CountdownTimer: React.FC<{ startTime: string }> = ({ startTime }) => {
    const { days, hours, minutes, seconds, isRunning } = useCountdown(startTime);
    const { t } = useLanguage();

    if (!isRunning) {
        return (
            <div className="text-center my-8 p-6 bg-gray-50 dark:bg-black/50 rounded-lg">
                <h3 className="text-2xl font-heading text-primary">{t('matchHasStarted')}</h3>
                <p className="text-text-secondary mt-2">{t('goodLuck')}</p>
            </div>
        );
    }
    
    const TimeUnit: React.FC<{value: number, label: string}> = ({ value, label }) => (
        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-black/50 p-4 rounded-lg w-20 md:w-24">
            <span className="text-4xl font-heading font-bold text-primary">{String(value).padStart(2, '0')}</span>
            <span className="text-xs uppercase text-text-secondary">{label}</span>
        </div>
    );

    return (
        <div className="mt-8">
            <h3 className="text-center text-xl font-heading text-primary mb-4">{t('matchStartsIn')}</h3>
            <div className="flex justify-center items-center space-x-2 md:space-x-4">
                <TimeUnit value={days} label={t('days')} />
                <TimeUnit value={hours} label={t('hours')} />
                <TimeUnit value={minutes} label={t('minutes')} />
                <TimeUnit value={seconds} label={t('seconds')} />
            </div>
        </div>
    );
};


interface TournamentDetailPageProps {
    tournament: Tournament;
    currentUser: User | null;
    joinTournament: (tournamentId: string) => void;
    users: User[];
}

const TournamentDetailPage: React.FC<TournamentDetailPageProps> = ({ tournament, currentUser, joinTournament, users }) => {
    const { t } = useLanguage();
    const isJoined = currentUser?.joinedTournaments.includes(tournament.id) ?? false;
    const isFull = tournament.participants.length >= tournament.maxPlayers;
    const participantDetails = tournament.participants.map(pId => users.find(u => u.id === pId)).filter(Boolean) as User[];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20 overflow-hidden font-body">
             <div className="h-64 md:h-80 relative">
                <img 
                    src={tournament.imageUrl || 'https://placehold.co/1200x400/1a202c/ff4500/png?text=FF+Tournament'} 
                    alt={tournament.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                    <span className="flex-shrink-0 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">{tournament.type}</span>
                     <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mt-2 shadow-lg">{tournament.name}</h1>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg text-text-primary">
                            <div className="flex items-center space-x-3"><TrophyIcon /><span>{t('prizePool')}: <span className="font-bold text-yellow-600 dark:text-yellow-400">৳{tournament.prizePool}</span></span></div>
                            <div className="flex items-center space-x-3"><UsersIcon /><span>{t('players')}: <span className="font-bold">{tournament.participants.length}/{tournament.maxPlayers}</span></span></div>
                            <div className="flex items-center space-x-3"><MapIcon /><span>{t('map')}: <span className="font-bold">{tournament.mapName}</span></span></div>
                        </div>
                        
                        <CountdownTimer startTime={tournament.startTime} />

                        {isJoined && tournament.roomDetails ? (
                            <div className="mt-8 bg-gray-50 dark:bg-black/50 border-2 border-dashed border-green-500 p-6 rounded-lg text-center">
                                <h3 className="text-xl font-heading text-green-600 dark:text-green-400">{t('roomDetailsOptional')}</h3>
                                <div className="flex justify-center space-x-8 mt-4">
                                    <div>
                                        <p className="text-sm text-text-secondary">{t('roomId')}</p>
                                        <p className="text-2xl font-bold tracking-widest">{tournament.roomDetails.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-secondary">{t('roomPassword')}</p>
                                        <p className="text-2xl font-bold tracking-widest">{tournament.roomDetails.pass}</p>
                                    </div>
                                </div>
                            </div>
                        ) : isJoined ? (
                             <div className="mt-8 bg-gray-50 dark:bg-black/50 border-2 border-dashed border-yellow-500 p-6 rounded-lg text-center">
                                <h3 className="text-xl font-heading text-yellow-600 dark:text-yellow-400">{t('awaitingRoomDetails')}</h3>
                                <p className="text-text-secondary mt-2">{t('awaitingRoomDetailsDescription')}</p>
                            </div>
                        ) : null}

                        <div className="mt-8">
                            <h3 className="text-2xl font-heading text-primary mb-4">{t('participantsCount', { count: participantDetails.length })}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto pr-2">
                                {participantDetails.length > 0 ? participantDetails.map(p => (
                                    <div key={p.id} className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-md text-center">
                                        <p className="font-bold truncate text-text-primary">{p.inGameName}</p>
                                        <p className="text-xs text-text-secondary">{p.playerUID}</p>
                                    </div>
                                )) : <p className="text-text-secondary col-span-full">{t('noParticipants')}</p>}
                            </div>
                        </div>

                    </div>
                    <div className="bg-gray-100 dark:bg-gray-900/50 p-6 rounded-lg flex flex-col items-center justify-center text-center self-start">
                         <div className="flex items-center space-x-2">
                            <CashIcon className="h-8 w-8 text-green-600 dark:text-green-400"/>
                            <p className="text-3xl font-heading font-bold text-green-600 dark:text-green-400">৳{tournament.entryFee}</p>
                         </div>
                         <div className="w-full h-px bg-primary/20 dark:bg-primary/30 my-6"></div>
                         {isJoined ? (
                            <div className="flex items-center text-lg font-bold text-green-600 dark:text-green-500">
                                 <ShieldCheckIcon /> <span className="ml-2">{t('successfullyJoined')}</span>
                            </div>
                         ) : isFull ? (
                            <button disabled className="w-full py-3 mt-4 rounded-md font-bold text-white bg-gray-500 dark:bg-gray-600 cursor-not-allowed">
                                {t('tournamentFull')}
                            </button>
                         ) : (
                            <button 
                                onClick={() => joinTournament(tournament.id)}
                                className="w-full py-3 mt-4 rounded-md font-bold text-white bg-primary hover:bg-primary/80 transition-colors shadow-lg dark:shadow-primary/40 transform hover:scale-105"
                            >
                                {t('joinNow')}
                            </button>
                         )}
                         <p className="text-xs text-text-secondary mt-4">{t('joinNowFeeNotice')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentDetailPage;
