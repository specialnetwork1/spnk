
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, Tournament, Transaction, Page, TransactionStatus, AppSettings, AdminSubPage, Notification } from './types';
import { INITIAL_APP_SETTINGS } from './utils/mockData';
import { supabase } from './utils/supabaseClient';
import Header from './components/Header';
import Marquee from './components/Marquee';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WalletPage from './pages/WalletPage';
import AdminPage from './pages/AdminPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import ProfilePage from './pages/ProfilePage';
import Modal from './components/Modal';
import { useLanguage } from './context/LanguageContext';
import { PostgrestError, AuthError } from '@supabase/supabase-js';

// Audio for notification sound
const notificationSound = new Audio('data:audio/mpeg;base64,SUQzBAAAAAAAIBAFVVRTIXgAADEAAAAAAAAAAMEQ3TS9DEwBAQG9A7/7//+H4g7dE0bQkAAAAAAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV-');

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [appSettings, setAppSettings] = useState<AppSettings>(INITIAL_APP_SETTINGS);
    const [adminView, setAdminView] = useState<AdminSubPage>('dashboard');
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
    });
    const { t } = useLanguage();

    const [modal, setModal] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    const prevNotificationsCount = useRef(notifications.length);

    const showModal = useCallback((message: string, type: 'success' | 'error') => {
        setModal({ show: true, message, type });
    }, []);

    const handleError = useCallback((error: PostgrestError | AuthError | Error, context: string) => {
        console.error(`Error in ${context}:`, error.message);
        showModal(`Error in ${context}: ${error.message}`, 'error');
    }, [showModal]);

    // Session Management & Profile fetching
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { data: userProfile, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                if (error) {
                    // Profile might not be ready yet due to trigger delay, so we fetch with a small retry if needed
                    console.log("Waiting for profile sync...");
                    setCurrentUser(null);
                } else {
                    setCurrentUser(userProfile);
                }
            } else {
                setCurrentUser(null);
            }
        });
        
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
             if (session?.user) {
                const { data: userProfile, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                if (!error) {
                    setCurrentUser(userProfile);
                }
            }
        }
        checkSession();

        return () => subscription.unsubscribe();
    }, [handleError]);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [
                    { data: usersData, error: usersError },
                    { data: tournamentsData, error: tournamentsError },
                    { data: transactionsData, error: transactionsError },
                    { data: notificationsData, error: notificationsError },
                    { data: settingsData, error: settingsError }
                ] = await Promise.all([
                    supabase.from('users').select('*'),
                    supabase.from('tournaments').select('*'),
                    supabase.from('transactions').select('*'),
                    supabase.from('notifications').select('*'),
                    supabase.from('app_settings').select('*').limit(1).single()
                ]);

                if (usersError) throw usersError;
                if (tournamentsError) throw tournamentsError;
                if (transactionsError) throw transactionsError;
                if (notificationsError) throw notificationsError;
                if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

                setUsers(usersData || []);
                setTournaments(tournamentsData || []);
                setTransactions(transactionsData || []);
                setNotifications(notificationsData || []);
                if (settingsData) setAppSettings(settingsData);
            } catch (error) {
                handleError(error as PostgrestError, "initial data fetch");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [handleError]);


    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    useEffect(() => {
        const themeSettings = appSettings.theme;
        const root = document.documentElement;
        const hexToRgb = (hex: string): string | null => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
        };
        Object.entries(themeSettings.colors).forEach(([key, value]) => {
            const rgbValue = hexToRgb(value as string);
            if (rgbValue) {
                const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                root.style.setProperty(cssVarName, rgbValue);
            }
        });
        Object.entries(themeSettings.fonts).forEach(([key, value]) => {
            const cssVarName = `--font-${key}`;
            root.style.setProperty(cssVarName, value as string);
        });
    }, [appSettings.theme]);

    useEffect(() => {
        document.title = appSettings.appName;
    }, [appSettings.appName]);

    useEffect(() => {
        if (notifications.length > prevNotificationsCount.current && currentUser && !currentUser.isAdmin) {
            notificationSound.play().catch(e => console.error("Error playing notification sound:", e));
        }
        prevNotificationsCount.current = notifications.length;
    }, [notifications, currentUser]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const navigate = useCallback((page: Page, subPage?: AdminSubPage) => {
        setSelectedTournament(null);
        if (page === 'admin') setAdminView(subPage || 'dashboard');
        setCurrentPage(page);
    }, []);

    const handleLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
        const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !authData.user) {
            handleError(error || new Error("Login failed"), "login");
            return false;
        }
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();
        if (profileError || !userProfile) {
            await supabase.auth.signOut();
            handleError(profileError || new Error("Profile not found."), "login");
            return false;
        }
        if (userProfile.isAdmin) {
            navigate('admin', 'dashboard');
            showModal(t('welcomeAdmin', { inGameName: userProfile.inGameName }), 'success');
        } else {
            navigate('home');
            showModal('Login successful!', 'success');
        }
        return true;
    }, [navigate, handleError, showModal, t]);

    const handleRegister = useCallback(async (newUser: Omit<User, 'id' | 'walletBalance' | 'isAdmin' | 'joinedTournaments' | 'readNotificationIds' | 'registrationDate' | 'avatarUrl' | 'socials'> & {password: string}): Promise<boolean> => {
        const { email, password, name, phone, inGameName, playerUID } = newUser;
        
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: { name, phone, inGameName, playerUID }
            }
        });

        if (authError) {
            handleError(authError, "registration");
            return false;
        }
        if (!authData.user) {
            handleError(new Error("User registration failed: No user object returned."), "registration");
            return false;
        }
        
        // If session is null, it means email confirmation is required.
        if (authData.user && !authData.session) {
            showModal(t('registrationSuccessConfirmEmail'), 'success');
            navigate('login');
            return true;
        }

        // If session exists, user is logged in (email confirmation is likely off).
        if (authData.user && authData.session) {
            // Wait a moment for the DB trigger to create the user profile.
            setTimeout(async () => {
                 const { data: profile } = await supabase.from('users').select('*').eq('id', authData.user!.id).single();
                 if (profile) {
                     setCurrentUser(profile);
                     showModal(t('registrationSuccessLogin'), 'success');
                     navigate('home');
                 } else {
                     showModal("Account created, but profile is syncing. Please try logging in.", "success");
                     navigate('login');
                 }
            }, 1500);
            return true;
        }
        
        return false;
    }, [navigate, handleError, showModal, t]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            handleError(error, "logout");
        } else {
            setCurrentUser(null);
            navigate('home');
        }
    };

    const handleAddMoney = async (amount: number, gatewayName: string) => {
        if (!currentUser) return;
        const newTransactionData = {
            userId: currentUser.id,
            amount,
            senderNumber: gatewayName,
            trxId: `API-${Date.now()}`,
            status: TransactionStatus.Approved,
            date: new Date().toISOString(),
        };
        const { data: insertedTx, error: txError } = await supabase.from('transactions').insert(newTransactionData).select().single();
        if (txError) {
            handleError(txError, "adding money");
            return;
        }
        setTransactions(prev => [insertedTx, ...prev]);
        const updatedBalance = currentUser.walletBalance + amount;
        const { data: updatedUser, error: userError } = await supabase.from('users').update({ walletBalance: updatedBalance }).eq('id', currentUser.id).select().single();
        if (userError || !updatedUser) {
            handleError(userError as PostgrestError, "updating balance");
            return;
        }
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
        showModal(`৳${amount} added successfully!`, 'success');
    };
    
    const handleSendNotification = async (title: string, message: string) => {
        const newNotificationData = { title, message, date: new Date().toISOString() };
        const { data, error } = await supabase.from('notifications').insert(newNotificationData).select().single();
        if (error || !data) {
            handleError(error as PostgrestError, "sending notification");
            return;
        }
        setNotifications(prev => [...prev, data]);
        showModal('Notification sent to all users!', 'success');
    };

    const handleMarkNotificationsAsRead = async () => {
        if (!currentUser) return;
        const allNotificationIds = notifications.map(n => n.id);
        const { data: updatedUser, error } = await supabase.from('users').update({ readNotificationIds: allNotificationIds }).eq('id', currentUser.id).select().single();
        if (error || !updatedUser) {
            handleError(error as PostgrestError, "marking notifications as read");
            return;
        }
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    };

    const handleTransactionStatus = async (transactionId: string, status: TransactionStatus.Approved | TransactionStatus.Rejected) => {
        const { data: updatedTx, error: txError } = await supabase.from('transactions').update({ status }).eq('id', transactionId).select().single();
        if (txError || !updatedTx) {
            handleError(txError, "updating transaction status");
            return;
        }
        setTransactions(prev => prev.map(t => t.id === transactionId ? updatedTx : t));
        if (status === TransactionStatus.Approved) {
            const user = users.find(u => u.id === updatedTx.userId);
            if (user) {
                const updatedBalance = user.walletBalance + updatedTx.amount;
                const { data: updatedUser, error: userError } = await supabase.from('users').update({ walletBalance: updatedBalance }).eq('id', user.id).select().single();
                if (userError || !updatedUser) {
                    handleError(userError, "approving transaction");
                    return;
                }
                setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
                if (currentUser && currentUser.id === user.id) {
                    setCurrentUser(updatedUser);
                }
            }
        }
    };
    
    const handleUpdateUser = async (updatedUserData: User) => {
        const { data, error } = await supabase.from('users').update(updatedUserData).eq('id', updatedUserData.id).select().single();
        if (error || !data) {
            handleError(error as PostgrestError, "updating profile");
            return;
        }
        setUsers(prevUsers => prevUsers.map(u => u.id === data.id ? data : u));
        if (currentUser && currentUser.id === data.id) {
          setCurrentUser(data);
        }
        showModal('Profile updated successfully!', 'success');
    };

    const handleUpdateSettings = useCallback(async (newSettings: AppSettings) => {
        if (newSettings.id) {
            const { data, error } = await supabase.from('app_settings').update(newSettings).eq('id', newSettings.id).select().single();
            if (error || !data) {
                handleError(error as PostgrestError, "updating settings");
                return;
            }
            setAppSettings(data);
            showModal('Settings updated successfully!', 'success');
        } else {
            const { id, ...settingsToInsert } = newSettings;
            const { data, error } = await supabase.from('app_settings').insert(settingsToInsert).select().single();
            if (error || !data) {
                handleError(error as PostgrestError, "saving new settings");
                return;
            }
            setAppSettings(data);
            showModal('Settings saved successfully!', 'success');
        }
    }, [handleError, showModal]);

    const handleCreateTournament = async (newTournamentData: Omit<Tournament, 'id' | 'participants'>) => {
        const tournamentToInsert = { ...newTournamentData, participants: [] };
        const { data, error } = await supabase.from('tournaments').insert(tournamentToInsert).select().single();
        if (error || !data) {
            handleError(error as PostgrestError, "creating tournament");
            return;
        }
        setTournaments(prev => [data, ...prev]);
        showModal('Tournament created successfully!', 'success');
    };

    const handleUpdateTournament = async (updatedTournamentData: Tournament) => {
        const { data, error } = await supabase.from('tournaments').update(updatedTournamentData).eq('id', updatedTournamentData.id).select().single();
        if (error || !data) {
            handleError(error as PostgrestError, "updating tournament");
            return;
        }
        setTournaments(prev => prev.map(t => t.id === data.id ? data : t));
        showModal('Tournament updated successfully!', 'success');
    };

    const handleDeleteTournament = async (tournamentId: string) => {
        const { error } = await supabase.from('tournaments').delete().eq('id', tournamentId);
        if (error) {
            handleError(error, "deleting tournament");
            return;
        }
        setTournaments(prev => prev.filter(t => t.id !== tournamentId));
        showModal('Tournament deleted successfully!', 'error');
    };
    
    const viewTournamentDetail = (tournamentId: string) => {
        const tournament = tournaments.find(t => t.id === tournamentId);
        if (tournament) {
            setSelectedTournament(tournament);
            setCurrentPage('tournamentDetail');
        }
    };

    const joinTournament = async (tournamentId: string) => {
        if (!currentUser) {
            showModal('You must be logged in to join.', 'error');
            navigate('login');
            return;
        }
        const tournament = tournaments.find(t => t.id === tournamentId);
        if (!tournament) {
            showModal('Tournament not found.', 'error');
            return;
        }
        if (currentUser.walletBalance < tournament.entryFee) {
            showModal('Insufficient balance.', 'error');
            navigate('wallet');
            return;
        }
        if (currentUser.joinedTournaments.includes(tournamentId) || tournament.participants.includes(currentUser.id)) {
            showModal('Already joined.', 'error');
            return;
        }
        if(tournament.participants.length >= tournament.maxPlayers) {
            showModal('Tournament is full.', 'error');
            return;
        }
        const newBalance = currentUser.walletBalance - tournament.entryFee;
        const newJoinedTournaments = [...currentUser.joinedTournaments, tournamentId];
        const { data: updatedUser, error: userError } = await supabase.from('users').update({ walletBalance: newBalance, joinedTournaments: newJoinedTournaments }).eq('id', currentUser.id).select().single();
        if (userError || !updatedUser) {
            handleError(userError, "tournament entry");
            return;
        }
        const newParticipants = [...tournament.participants, currentUser.id];
        const { data: updatedTournament, error: tournamentError } = await supabase.from('tournaments').update({ participants: newParticipants }).eq('id', tournamentId).select().single();
        if (tournamentError || !updatedTournament) {
            handleError(tournamentError, "adding participant");
            return;
        }
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
        setTournaments(tournaments.map(t => t.id === tournamentId ? updatedTournament : t));
        setSelectedTournament(updatedTournament); 
        showModal(`Successfully joined ${tournament.name}!`, 'success');
    };

    const renderPage = () => {
        if (loading) {
            return <div className="text-center py-20 text-xl font-bold">Loading Platform...</div>;
        }
        if (selectedTournament && currentPage === 'tournamentDetail') {
            return <TournamentDetailPage tournament={selectedTournament} currentUser={currentUser} joinTournament={joinTournament} users={users} />;
        }
        switch (currentPage) {
            case 'home':
                return <HomePage tournaments={tournaments} onViewDetails={viewTournamentDetail} currentUser={currentUser} onNavigate={navigate} />;
            case 'login':
                return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
            case 'register':
                return <RegisterPage onRegister={handleRegister} onNavigate={navigate} />;
            case 'wallet':
                if (!currentUser) {
                    navigate('login');
                    return null;
                }
                return <WalletPage user={currentUser} transactions={transactions.filter(t => t.userId === currentUser.id)} onAddMoney={handleAddMoney} appSettings={appSettings} />;
            case 'admin':
                 if (!currentUser || !currentUser.isAdmin) {
                    navigate('home');
                    return null;
                }
                return <AdminPage 
                    transactions={transactions} 
                    users={users}
                    tournaments={tournaments}
                    appSettings={appSettings}
                    onUpdateSettings={handleUpdateSettings}
                    onCreateTournament={handleCreateTournament}
                    onUpdateTournament={handleUpdateTournament}
                    onDeleteTournament={handleDeleteTournament}
                    onSendNotification={handleSendNotification}
                    onUpdateStatus={handleTransactionStatus}
                    initialView={adminView}
                />;
            case 'profile':
                if (!currentUser) {
                    navigate('login');
                    return null;
                }
                return <ProfilePage 
                    currentUser={currentUser} 
                    joinedTournaments={tournaments.filter(t => currentUser.joinedTournaments.includes(t.id))}
                    onUpdateUser={handleUpdateUser}
                    showModal={showModal} 
                    onNavigate={navigate}
                    onViewTournamentDetails={viewTournamentDetail}
                />;
            default:
                return <HomePage tournaments={tournaments} onViewDetails={viewTournamentDetail} currentUser={currentUser} onNavigate={navigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-primary transition-colors duration-300">
            <Header 
                currentUser={currentUser} 
                onNavigate={navigate} 
                onLogout={handleLogout} 
                theme={theme} 
                toggleTheme={toggleTheme} 
                notifications={notifications}
                onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
                appSettings={appSettings}
            />
            {appSettings.marqueeText && <Marquee text={appSettings.marqueeText} />}
            <main className="container mx-auto px-4 py-8">
                {renderPage()}
            </main>
            {modal.show && <Modal message={modal.message} type={modal.type} onClose={() => setModal({ ...modal, show: false })} />}
        </div>
    );
};

export default App;
