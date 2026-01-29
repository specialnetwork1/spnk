
import React, { useState } from 'react';
import { Tournament } from '../../types';
import TournamentFormModal from './TournamentFormModal';
import { PlusIcon } from '../icons/Icons';
import { useLanguage } from '../../context/LanguageContext';

interface AdminTournamentsProps {
    tournaments: Tournament[];
    onCreate: (tournament: Omit<Tournament, 'id' | 'participants'>) => void;
    onUpdate: (tournament: Tournament) => void;
    onDelete: (tournamentId: string) => void;
}

const AdminTournaments: React.FC<AdminTournamentsProps> = ({ tournaments, onCreate, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
    const { t } = useLanguage();

    const handleOpenCreateModal = () => {
        setEditingTournament(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (tournament: Tournament) => {
        setEditingTournament(tournament);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTournament(null);
    };

    const handleDelete = (tournamentId: string) => {
        if (window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
            onDelete(tournamentId);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-heading text-primary">{t('manageTournaments')}</h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary/80 transition-colors font-body"
                >
                    <PlusIcon className="h-5 w-5 mr-2"/>
                    {t('createTournament')}
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-text-secondary font-body">
                    <thead className="text-xs text-primary/80 dark:text-primary uppercase bg-gray-100 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-4 py-3">{t('name')}</th>
                            <th className="px-4 py-3">{t('fee')}</th>
                            <th className="px-4 py-3">{t('prize')}</th>
                            <th className="px-4 py-3">{t('players')}</th>
                            <th className="px-4 py-3">{t('startTime')}</th>
                            <th className="px-4 py-3">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Renamed loop variable 't' to 'tournamentItem' to avoid shadowing the translation function 't' */}
                        {tournaments.map(tournamentItem => (
                            <tr key={tournamentItem.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-4 py-3 font-medium text-text-primary">{tournamentItem.name}</td>
                                <td className="px-4 py-3">৳{tournamentItem.entryFee}</td>
                                <td className="px-4 py-3">৳{tournamentItem.prizePool}</td>
                                <td className="px-4 py-3">{tournamentItem.participants.length}/{tournamentItem.maxPlayers}</td>
                                <td className="px-4 py-3">{new Date(tournamentItem.startTime).toLocaleString()}</td>
                                <td className="px-4 py-3 space-x-2">
                                    <button onClick={() => handleOpenEditModal(tournamentItem)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{t('edit')}</button>
                                    <button onClick={() => handleDelete(tournamentItem.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">{t('delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <TournamentFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={editingTournament ? onUpdate : onCreate}
                    tournament={editingTournament}
                />
            )}
        </div>
    );
};

export default AdminTournaments;
