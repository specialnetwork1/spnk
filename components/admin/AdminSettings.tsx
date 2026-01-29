
import React, { useState } from 'react';
import { AppSettings, PaymentGateway } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AdminSettingsProps {
    appSettings: AppSettings;
    onUpdateSettings: (settings: AppSettings) => void;
}

const ColorInput: React.FC<{ label: string, description: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, description, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary">{label}</label>
        <div className="flex items-center mt-1">
            <input
                type="color"
                value={value}
                onChange={onChange}
                className="p-0 h-10 w-12 block bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                title="Click to select a color"
            />
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="ml-2 p-2 w-40 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="#RRGGBB"
            />
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
);

const FontSelect: React.FC<{ label: string, description: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: { name: string, value: string }[] }> = ({ label, description, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
        </select>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
);


const AdminSettings: React.FC<AdminSettingsProps> = ({ appSettings, onUpdateSettings }) => {
    const { t } = useLanguage();
    const [settings, setSettings] = useState<AppSettings>(appSettings);

    const handleSettingsChange = (field: keyof AppSettings, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleGatewayChange = (index: number, field: keyof PaymentGateway, value: string | boolean) => {
        const updatedGateways = [...settings.paymentGateways];
        const gatewayToUpdate = { ...updatedGateways[index] };
        (gatewayToUpdate as any)[field] = value;
        updatedGateways[index] = gatewayToUpdate;
        setSettings({ ...settings, paymentGateways: updatedGateways });
    };
    
    const handleThemeColorChange = (key: keyof AppSettings['theme']['colors'], value: string) => {
        setSettings(prev => ({
            ...prev,
            theme: {
                ...prev.theme,
                colors: {
                    ...prev.theme.colors,
                    [key]: value
                }
            }
        }));
    };

    const handleThemeFontChange = (key: keyof AppSettings['theme']['fonts'], value: string) => {
        setSettings(prev => ({
            ...prev,
            theme: {
                ...prev.theme,
                fonts: {
                    ...prev.theme.fonts,
                    [key]: value
                }
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateSettings(settings);
    };

    const fontOptions = [
        { name: 'Orbitron', value: "'Orbitron', sans-serif" },
        { name: 'Rajdhani', value: "'Rajdhani', sans-serif" },
        { name: 'Roboto', value: "'Roboto', sans-serif" },
        { name: 'Noto Sans Bengali', value: "'Noto Sans Bengali', sans-serif" }
    ];
    
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-primary/20 dark:border-primary/30 shadow-lg dark:shadow-primary/20 font-body">
            <h1 className="text-3xl font-heading text-primary mb-6">{t('platformSettings')}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="p-4 bg-gray-100 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
                    <h3 className="text-xl font-bold text-primary mb-4">{t('brandingNotice')}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">{t('appNameLabel')}</label>
                            <input type="text" value={settings.appName} onChange={(e) => handleSettingsChange('appName', e.target.value)}
                                className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">{t('logoUrlLabel')}</label>
                            <input type="text" value={settings.appLogoUrl || ''} onChange={(e) => handleSettingsChange('appLogoUrl', e.target.value)}
                                className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                             <p className="text-xs text-gray-500 mt-1">{t('logoUrlDescription')}</p>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-secondary">{t('scrollingNoticeLabel')}</label>
                            <textarea value={settings.marqueeText || ''} onChange={(e) => handleSettingsChange('marqueeText', e.target.value)} rows={2}
                                className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                             <p className="text-xs text-gray-500 mt-1">{t('scrollingNoticeDescription')}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-100 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
                    <h3 className="text-xl font-bold text-primary mb-4">{t('themeCustomization')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ColorInput label={t('primaryColor')} description={t('primaryColorDescription')} value={settings.theme.colors.primary} onChange={(e) => handleThemeColorChange('primary', e.target.value)} />
                        <ColorInput label={t('textPrimaryColor')} description={t('textPrimaryColorDescription')} value={settings.theme.colors.textPrimary} onChange={(e) => handleThemeColorChange('textPrimary', e.target.value)} />
                        <ColorInput label={t('textSecondaryColor')} description={t('textSecondaryColorDescription')} value={settings.theme.colors.textSecondary} onChange={(e) => handleThemeColorChange('textSecondary', e.target.value)} />
                        <ColorInput label={t('backgroundColor')} description={t('backgroundColorDescription')} value={settings.theme.colors.background} onChange={(e) => handleThemeColorChange('background', e.target.value)} />
                    </div>
                </div>
                
                <div className="p-4 bg-gray-100 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
                    <h3 className="text-xl font-bold text-primary mb-4">{t('fontCustomization')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FontSelect label={t('headingFont')} description={t('headingFontDescription')} value={settings.theme.fonts.heading} onChange={(e) => handleThemeFontChange('heading', e.target.value)} options={fontOptions} />
                        <FontSelect label={t('bodyFont')} description={t('bodyFontDescription')} value={settings.theme.fonts.body} onChange={(e) => handleThemeFontChange('body', e.target.value)} options={fontOptions} />
                    </div>
                </div>


                <div>
                    <h2 className="text-2xl font-heading text-primary mb-2">{t('paymentGateways')}</h2>
                    <p className="mb-4 text-text-secondary">{t('paymentGatewaysDescription')}</p>
                    <div className="space-y-8">
                        {settings.paymentGateways.map((gateway, index) => (
                            <div key={gateway.name} className="p-4 bg-gray-100 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-primary">{gateway.name}</h3>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={gateway.enabled} onChange={(e) => handleGatewayChange(index, 'enabled', e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-400 dark:bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        <span className="ml-3 text-sm font-medium text-text-secondary">{gateway.enabled ? t('enabled') : t('disabled')}</span>
                                    </label>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary">{t('logoUrl')}</label>
                                        <input type="text" value={gateway.logoUrl || ''} onChange={(e) => handleGatewayChange(index, 'logoUrl', e.target.value)}
                                            className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary">{t('paymentNumber')}</label>
                                        <input type="text" value={gateway.paymentNumber || ''} onChange={(e) => handleGatewayChange(index, 'paymentNumber', e.target.value)}
                                            className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" placeholder="e.g., 01700000000" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                     <label className="block text-sm font-medium text-text-secondary">{t('paymentInstructions')}</label>
                                    <textarea value={gateway.paymentInstructions || ''} onChange={(e) => handleGatewayChange(index, 'paymentInstructions', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="e.g., Use the reference number when sending money."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit" className="w-full py-3 px-4 rounded-md font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-900 transition-colors">
                    {t('saveSettings')}
                </button>
            </form>
        </div>
    );
};

export default AdminSettings;