
import React, { useState, useEffect } from 'react';
import { User, Page, Tournament, AdminSubPage } from '../types';
import { UserCircleIcon, MailIcon, PhoneIcon, IdentificationIcon, PencilIcon, SaveIcon, FacebookIcon, DiscordIcon, WalletIcon } from '../components/icons/Icons';
import { useLanguage } from '../context/LanguageContext';

interface ProfilePageProps {
    currentUser: User;
    joinedTournaments: Tournament[];
    onUpdateUser: (updatedUser: User) => void;
    showModal: (message: string, type: 'success' | 'error') => void;
    onNavigate: (page: Page, subPage?: AdminSubPage) => void;
    onViewTournamentDetails: (tournamentId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, joinedTournaments, onUpdateUser, showModal, onNavigate, onViewTournamentDetails }) => {
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<User>(currentUser);

    useEffect(() => {
        setEditedUser(currentUser);
    }, [currentUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            socials: {
                ...prev.socials,
                [name]: value,
            },
        }));
    };

    const handleSave = () => {
        onUpdateUser(editedUser);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedUser(currentUser);
        setIsEditing(false);
    };
    
    const handleAvatarChange = () => {
        const randomId = Math.floor(Math.random() * 1000);
        const newAvatar = `https://i.pravatar.cc/150?u=${randomId}`;
        setEditedUser(prev => ({...prev, avatarUrl: newAvatar}));
    }

    const InfoRow: React.FC<{ icon: React.ReactNode, label: string, value: string, name: keyof User, type?: string }> = ({ icon, label, value, name, type = "text" }) => (
        <div className="flex items-center space-x-4 py-3">
            <div className="text-primary">{icon}</div>
            <div className="flex-1">
                <p className="text-sm text-text-secondary">{label}</p>
                {isEditing && name !== 'email' ? (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b-2 border-primary/50 py-1 px-0 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    />
                ) : (
                    <p className="font-semibold text-text-primary">{value}</p>
                )}
            </div>
        </div>
    );
    
     const SocialRow: React.FC<{ icon: React.ReactNode, label: string, value: string, name: 'facebook' | 'discord' }> = ({ icon, label, value, name }) => (
        <div className="flex items-center space-x-4 py-3">
            <div className="text-gray-500">{icon}</div>
            <div className="flex-1">
                <p className="text-sm text-text-secondary">{label}</p>
                {isEditing ? (
                    <input
                        type="text"
                        name={name}
                        value={value}
                        placeholder={`Your ${label} link/username`}
                        onChange={handleSocialChange}
                        className="w-full bg-transparent border-b-2 border-primary/50 py-1 px-0 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    />
                ) : (
                     <p className="font-semibold text-text-primary truncate">{value || t('notSet')}</p>
                )}
            </div>
        </div>
    );


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-body">
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20 text-center">
                    <div className="relative w-32 h-32 mx-auto">
                         <img src={editedUser.avatarUrl || `https://i.pravatar.cc/150?u=${currentUser.id}`} alt="Avatar" className="rounded-full w-32 h-32 object-cover border-4 border-primary" />
                        {isEditing && (
                            <button onClick={handleAvatarChange} className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/80 transition-colors">
                                <PencilIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <h2 className="mt-4 text-2xl font-heading font-bold text-text-primary">{editedUser.inGameName}</h2>
                    <p className="text-text-secondary">{editedUser.name}</p>

                    <div className="my-6 w-full h-px bg-primary/20 dark:bg-primary/30"></div>

                    <div className="flex items-center justify-center space-x-2 text-3xl font-heading text-green-500">
                        <WalletIcon className="h-8 w-8 text-green-500 dark:text-green-400" />
                        <span>৳{currentUser.walletBalance.toFixed(2)}</span>
                    </div>
                    <button onClick={() => onNavigate('wallet')} className="mt-4 w-full text-center py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white dark:focus:ring-offset-gray-900 transition-colors">
                        {t('goToWallet')}
                    </button>
                    
                    <div className="mt-6">
                        {isEditing ? (
                            <div className="flex space-x-2">
                                <button onClick={handleSave} className="flex-1 py-2 px-4 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">{t('save')}</button>
                                <button onClick={handleCancel} className="flex-1 py-2 px-4 rounded-md font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">{t('cancel')}</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-center py-2 px-4 rounded-md font-medium text-white bg-primary hover:bg-primary/80 transition-colors">
                                <PencilIcon className="h-4 w-4 mr-2"/>
                                {t('editProfile')}
                            </button>
                        )}
                    </div>

                </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
                 <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
                    <h3 className="text-xl font-heading text-primary mb-2">{t('playerInformation')}</h3>
                     <InfoRow icon={<UserCircleIcon className="h-5 w-5" />} label={t('fullName')} value={editedUser.name} name="name" />
                     <InfoRow icon={<IdentificationIcon className="h-5 w-5" />} label={t('playerUID')} value={editedUser.playerUID} name="playerUID" />
                     <InfoRow icon={<MailIcon className="h-5 w-5" />} label={t('email')} value={editedUser.email} name="email" />
                     <InfoRow icon={<PhoneIcon className="h-5 w-5" />} label={t('phone')} value={editedUser.phone} name="phone" />
                </div>
                 <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
                    <h3 className="text-xl font-heading text-primary mb-2">{t('socialLinks')}</h3>
                    <SocialRow icon={<FacebookIcon />} label={t('facebook')} value={editedUser.socials?.facebook || ''} name="facebook" />
                    <SocialRow icon={<DiscordIcon />} label={t('discord')} value={editedUser.socials?.discord || ''} name="discord" />
                 </div>
                 <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20">
                    <h3 className="text-xl font-heading text-primary mb-4">{t('joinedTournaments')}</h3>
                    {joinedTournaments.length > 0 ? (
                        <ul className="space-y-3 max-h-48 overflow-y-auto">
                            {joinedTournaments.map(t => (
                                <li key={t.id} onClick={() => onViewTournamentDetails(t.id)} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800/50 rounded-md cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                                    <span className="font-semibold text-text-primary">{t.name}</span>
                                    <span className="text-xs text-text-secondary">{new Date(t.startTime).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-text-secondary">{t('noJoinedTournaments')}</p>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default ProfilePage;
