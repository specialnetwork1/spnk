
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionStatus, User, Tournament, AppSettings, AdminSubPage } from '../types';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminTransactions from '../components/admin/AdminTransactions';
import AdminSettings from '../components/admin/AdminSettings';
import AdminTournaments from '../components/admin/AdminTournaments';
import AdminNotifications from '../components/admin/AdminNotifications';

interface AdminPageProps {
    transactions: Transaction[];
    users: User[];
    tournaments: Tournament[];
    appSettings: AppSettings;
    onUpdateStatus: (transactionId: string, status: TransactionStatus.Approved | TransactionStatus.Rejected) => void;
    onUpdateSettings: (settings: AppSettings) => void;
    onCreateTournament: (tournament: Omit<Tournament, 'id' | 'participants'>) => void;
    onUpdateTournament: (tournament: Tournament) => void;
    onDeleteTournament: (tournamentId: string) => void;
    onSendNotification: (title: string, message: string) => void;
    initialView: AdminSubPage;
}

const AdminPage: React.FC<AdminPageProps> = (props) => {
    const { onUpdateStatus, ...restProps } = props;
    const [activeView, setActiveView] = useState<AdminSubPage>(props.initialView);

    useEffect(() => {
        setActiveView(props.initialView);
    }, [props.initialView]);

    const renderContent = () => {
        switch(activeView) {
            case 'dashboard':
                return <AdminDashboard users={props.users} tournaments={props.tournaments} transactions={props.transactions} />;
            case 'transactions':
                return <AdminTransactions transactions={props.transactions} users={props.users} onUpdateStatus={onUpdateStatus} />;
            case 'tournaments':
                return <AdminTournaments 
                            tournaments={props.tournaments} 
                            onCreate={props.onCreateTournament} 
                            onUpdate={props.onUpdateTournament}
                            onDelete={props.onDeleteTournament} 
                        />;
            case 'notifications':
                return <AdminNotifications onSend={props.onSendNotification} />;
            case 'settings':
                return <AdminSettings appSettings={props.appSettings} onUpdateSettings={props.onUpdateSettings} />;
            default:
                return <AdminDashboard users={props.users} tournaments={props.tournaments} transactions={props.transactions} />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 font-body">
            <div className="md:w-1/4 lg:w-1/5">
                <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
            </div>
            <div className="md:w-3/4 lg:w-4/5">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPage;
