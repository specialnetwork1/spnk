import { User, Tournament, Transaction, AppSettings, TournamentType, TransactionStatus } from '../types';

export const INITIAL_APP_SETTINGS: AppSettings = {
    appName: 'FF HUB',
    appLogoUrl: '',
    marqueeText: '',
    theme: {
        colors: {
            primary: '#EF4444', // red-500
            textPrimary: '#111827', // gray-900
            textSecondary: '#6B7280', // gray-500
            background: '#F9FAFB', // gray-50
        },
        fonts: {
            heading: 'Orbitron, sans-serif',
            body: 'Rajdhani, sans-serif',
        }
    },
    paymentGateways: [
        {
            name: 'bKash',
            logoUrl: 'https://seeklogo.com/images/B/bkash-logo-FBB25873C6-seeklogo.com.png',
            paymentNumber: '01700000000',
            paymentInstructions: 'Please use the reference number provided below when sending money. Your balance will be updated automatically.',
            enabled: true,
        },
        {
            name: 'Nagad',
            logoUrl: 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png',
            paymentNumber: '01800000000',
            paymentInstructions: 'Please use the reference number provided below as the payment reference to ensure your transaction is processed instantly.',
            enabled: true,
        },
        {
            name: 'Rocket',
            logoUrl: 'https://seeklogo.com/images/R/rocket-logo-622E42682C-seeklogo.com.png',
            paymentNumber: '',
            paymentInstructions: '',
            enabled: false,
        },
        {
            name: 'Upay',
            logoUrl: 'https://seeklogo.com/images/U/upay-logo-A95A475591-seeklogo.com.png',
            paymentNumber: '',
            paymentInstructions: '',
            enabled: false,
        }
    ]
};

export const USERS: User[] = [];

export const TOURNAMENTS: Tournament[] = [];

export const TRANSACTIONS: Transaction[] = [];