

export enum TournamentType {
    Solo = 'Solo',
    Duo = 'Duo',
    Squad = 'Squad',
}

export enum TransactionStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
}

export type Page = 'home' | 'login' | 'register' | 'wallet' | 'admin' | 'tournamentDetail' | 'profile';

export type AdminSubPage = 'dashboard' | 'transactions' | 'settings' | 'tournaments' | 'notifications';

export interface PaymentGateway {
    name: 'bKash' | 'Nagad' | 'Rocket' | 'Upay';
    logoUrl?: string;
    apiKey?: string;
    secretKey?: string;
    username?: string;
    password?: string;
    enabled: boolean;
}

export interface AppSettings {
    id?: string;
    appName: string;
    appLogoUrl?: string;
    marqueeText?: string;
    paymentGateways: PaymentGateway[];
    theme: {
        colors: {
            primary: string;
            textPrimary: string;
            textSecondary: string;
            background: string;
        };
        fonts: {
            heading: string;
            body: string;
        }
    }
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    inGameName: string;
    playerUID: string;
    walletBalance: number;
    isAdmin: boolean;
    joinedTournaments: string[];
    readNotificationIds: string[];
    registrationDate: string;
    avatarUrl?: string;
    socials?: {
        facebook?: string;
        discord?: string;
    };
}

export interface Tournament {
    id: string;
    name: string;
    type: TournamentType;
    entryFee: number;
    prizePool: number;
    mapName: string;
    startTime: string;
    maxPlayers: number;
    participants: string[]; // array of user IDs
    imageUrl?: string;
    roomDetails?: {
        id: string;
        pass: string;
    };
}

export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    senderNumber: string;
    trxId: string;
    status: TransactionStatus;
    date: string;
}
