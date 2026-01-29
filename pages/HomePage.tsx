
import React from 'react';
import { Tournament, User, Page, AdminSubPage } from '../types';
import TournamentCard from '../components/TournamentCard';
import Leaderboard from '../components/Leaderboard';
import { WalletIcon, DashboardIcon } from '../components/icons/Icons';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
    tournaments: Tournament[];
    onViewDetails: (id: string) => void;
    currentUser: User | null;
    onNavigate: (page: Page, subPage?: AdminSubPage) => void;
    users: User[];
}

const HomePage: React.FC<HomePageProps> = ({ tournaments, onViewDetails, currentUser, onNavigate, users }) => {
    const { t } = useLanguage();
    // Show a dedicated home screen for admin users
    if (currentUser && currentUser.isAdmin) {
        return (
            <div className="text-center py-20 bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
                <h1 className="text-4xl font-heading font-extrabold text-primary">
                    {t('adminHomeTitle')}
                </h1>
                <p className="mt-4 text-lg text-text-secondary">{t('welcomeAdmin', { inGameName: currentUser.inGameName })}</p>
                <p className="mt-2 text-text-secondary">{t('adminAccessMessage')}</p>
                <button 
                    onClick={() => onNavigate('admin', 'dashboard')}
                    className="mt-8 bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-primary/80 transition-colors flex items-center space-x-2 mx-auto font-body"
                >
                    <DashboardIcon />
                    <span>{t('goToAdminDashboard')}</span>
                </button>
            </div>
        );
    }

    // Standard view for regular users and guests
    return (
        <div className="font-body">
            {currentUser && (
                <div className="mb-12 bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                           <h2 className="text-2xl font-bold text-text-primary">{t('welcomeBackUser', { inGameName: currentUser.inGameName })}</h2>
                           <p className="text-text-secondary mt-1">{t('readyForBattle')}</p>
                        </div>
                        <div className="flex items-center">
                             <button 
                                onClick={() => onNavigate('wallet')}
                                className="bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-primary/80 transition-colors flex items-center space-x-2"
                             >
                                 <WalletIcon className="h-5 w-5" />
                                 <span>{t('manageWallet')}</span>
                             </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                    {t('upcomingTournaments')}
                </h1>
                <p className="mt-4 text-lg text-text-secondary">{t('competeAndWin')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tournaments.map(tournament => (
                    <TournamentCard 
                        key={tournament.id} 
                        tournament={tournament} 
                        onViewDetails={onViewDetails}
                        currentUser={currentUser}
                    />
                ))}
            </div>

            <div className="mt-16">
                 <Leaderboard users={users} currentUser={currentUser} />
            </div>
        </div>
    );
};

export default HomePage;
