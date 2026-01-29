
import React, { useState, useEffect } from 'react';
import { Tournament, TournamentType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface TournamentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (tournament: Tournament | Omit<Tournament, 'id' | 'participants'>) => void;
    tournament: Tournament | null;
}

const initialFormData = {
    name: '',
    type: TournamentType.Squad,
    entryFee: 0,
    prizePool: 0,
    mapName: 'Bermuda',
    startTime: '',
    maxPlayers: 48,
    imageUrl: '',
    roomDetails: {
        id: '',
        pass: ''
    }
};

const TournamentFormModal: React.FC<TournamentFormModalProps> = ({ isOpen, onClose, onSubmit, tournament }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (tournament) {
            setFormData({
                ...initialFormData,
                ...tournament,
                startTime: new Date(tournament.startTime).toISOString().slice(0, 16),
                imageUrl: tournament.imageUrl || '',
                roomDetails: tournament.roomDetails || { id: '', pass: '' },
            });
        } else {
            setFormData(initialFormData);
        }
    }, [tournament, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value,
        }));
    };
    
    const handleRoomDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            roomDetails: {
                ...prev.roomDetails,
                [name]: value,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submissionData = {
            ...formData,
            startTime: new Date(formData.startTime).toISOString(),
        };

        if (submissionData.roomDetails.id.trim() && submissionData.roomDetails.pass.trim()) {
            submissionData.roomDetails = {
                id: submissionData.roomDetails.id,
                pass: submissionData.roomDetails.pass
            };
        } else {
            delete (submissionData as any).roomDetails;
        }

        onSubmit(submissionData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 font-body">
                    <h2 className="text-2xl font-heading font-bold text-primary mb-6">
                        {tournament ? t('editTournament') : t('createTournament')}
                    </h2>

                    <div className="space-y-4">
                        <InputField name="name" label={t('name')} value={formData.name} onChange={handleChange} required />
                        <InputField name="imageUrl" label={t('imageUrl')} value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.png" />
                        <SelectField name="type" label={t('type')} value={formData.type} onChange={handleChange} options={Object.values(TournamentType)} />
                        <InputField name="mapName" label={t('mapName')} value={formData.mapName} onChange={handleChange} required />
                        <InputField name="entryFee" label={t('entryFee')} type="number" value={formData.entryFee} onChange={handleChange} required />
                        <InputField name="prizePool" label={t('prizePool')} type="number" value={formData.prizePool} onChange={handleChange} required />
                        <InputField name="maxPlayers" label={t('maxPlayers')} type="number" value={formData.maxPlayers} onChange={handleChange} required />
                        <InputField name="startTime" label={t('startTime')} type="datetime-local" value={formData.startTime} onChange={handleChange} required />
                        
                        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                             <h3 className="text-lg font-semibold text-text-primary mb-2">{t('roomDetailsOptional')}</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField name="id" label={t('roomId')} value={formData.roomDetails.id} onChange={handleRoomDetailsChange} placeholder="e.g., 12345678" />
                                <InputField name="pass" label={t('roomPassword')} value={formData.roomDetails.pass} onChange={handleRoomDetailsChange} placeholder="e.g., 1234" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded-md font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="py-2 px-4 rounded-md font-medium text-white bg-primary hover:bg-primary/80 transition-colors">
                            {tournament ? t('saveChanges') : t('create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const InputField: React.FC<any> = ({ name, label, type = "text", value, onChange, required = false, placeholder = '' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
        />
    </div>
);

const SelectField: React.FC<any> = ({ name, label, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
        >
            {options.map((option: string) => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);

export default TournamentFormModal;