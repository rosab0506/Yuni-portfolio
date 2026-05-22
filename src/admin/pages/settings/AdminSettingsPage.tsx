import { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Palette, 
  Database, 
  Shield, 
  Bell, 
  Save, 
  Check,
  Sparkles,
  Moon,
  Sun,
  Mail,
  Key,
  RefreshCw
} from 'lucide-react';

type SettingsSection = 'general' | 'appearance' | 'notifications' | 'security' | 'database';

export function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    siteName: 'My Portfolio',
    siteDescription: 'Personal portfolio website',
    siteUrl: 'https://myportfolio.com',
    contactEmail: 'hello@myportfolio.com',
    theme: 'dark',
    primaryColor: '#C77DFF',
    enableBlog: true,
    enableContact: true,
    enableNewsletter: false,
    emailNotifications: true,
    browserNotifications: false,
    maintenanceMode: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save - will be replaced with Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const sections = [
    { id: 'general' as const, label: 'General', icon: Globe },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'notifications' as const, label: 'Notifications' },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'database' as const, label: 'Database', icon: Database },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="mt-1 text-white/60">Manage your site configuration and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] text-white font-semibold rounded-xl shadow-lg shadow-[#C77DFF]/30 hover:shadow-xl hover:shadow-[#C77DFF]/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-3 h-fit">
          <nav className="space-y-1">
            {sections.map((section) => {
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-[#C77DFF]/20 to-[#9D4EDD]/20 text-white border border-[#C77DFF]/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {section.icon && <section.icon className={`w-5 h-5 ${activeSection === section.id ? 'text-[#C77DFF]' : ''}`} />}
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/20">
                  <Globe className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">General Settings</h2>
                  <p className="text-sm text-white/60">Basic site configuration</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B1320]/60 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#C77DFF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Site Description</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B1320]/60 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#C77DFF] transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Site URL</label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B1320]/60 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#C77DFF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0B1320]/60 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#C77DFF] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/20">
                  <Palette className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Appearance</h2>
                  <p className="text-sm text-white/60">Customize the look and feel</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Theme</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSettings({ ...settings, theme: 'dark' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                        settings.theme === 'dark'
                          ? 'bg-[#C77DFF]/20 border-[#C77DFF]/50 text-white'
                          : 'bg-[#0B1320]/60 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      Dark
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, theme: 'light' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                        settings.theme === 'light'
                          ? 'bg-[#C77DFF]/20 border-[#C77DFF]/50 text-white'
                          : 'bg-[#0B1320]/60 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      Light
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-3">Primary Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#0B1320]/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C77DFF] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white">Features</h3>
                  {[
                    { key: 'enableBlog', label: 'Enable Blog Section' },
                    { key: 'enableContact', label: 'Enable Contact Form' },
                    { key: 'enableNewsletter', label: 'Enable Newsletter Signup' },
                  ].map((feature) => (
                    <label key={feature.key} className="flex items-center justify-between p-4 rounded-xl bg-[#0B1320]/60 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                      <span className="text-white">{feature.label}</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings[feature.key as keyof typeof settings] as boolean}
                          onChange={(e) => setSettings({ ...settings, [feature.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#C77DFF] transition-colors" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/20">
                  {/* Bell icon removed */}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Notifications</h2>
                  <p className="text-sm text-white/60">Configure notification preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                  { key: 'browserNotifications', label: 'Browser Notifications', description: 'Show desktop notifications' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-[#0B1320]/60 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                    <div>
                      <span className="text-white font-medium">{item.label}</span>
                      <p className="text-sm text-white/60 mt-0.5">{item.description}</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings[item.key as keyof typeof settings] as boolean}
                        onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#C77DFF] transition-colors" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/20">
                  <Shield className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Security</h2>
                  <p className="text-sm text-white/60">Security and access settings</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-xl bg-[#0B1320]/60 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                  <div>
                    <span className="text-white font-medium">Maintenance Mode</span>
                    <p className="text-sm text-white/60 mt-0.5">Temporarily disable public access</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
                  </div>
                </label>

                <div className="p-4 rounded-xl bg-[#0B1320]/60 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Key className="w-5 h-5 text-[#C77DFF]" />
                    <span className="text-white font-medium">Change Password</span>
                  </div>
                  <p className="text-sm text-white/60 mb-4">Password management will be available after Supabase integration.</p>
                  <button disabled className="px-4 py-2 bg-white/10 text-white/40 rounded-lg cursor-not-allowed">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Database Settings */}
          {activeSection === 'database' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/20">
                  <Database className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Database</h2>
                  <p className="text-sm text-white/60">Data storage configuration</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/20">
                <Sparkles className="w-5 h-5 text-[#C77DFF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Supabase Integration</p>
                  <p className="text-white/60 text-sm mt-1">
                    Currently using in-memory storage. Connect Supabase to enable persistent data storage, authentication, and file uploads.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1320]/60 border border-white/10">
                <h3 className="text-white font-medium mb-3">Supabase Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Project URL</label>
                    <input
                      type="text"
                      placeholder="https://your-project.supabase.co"
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-[#0B1320]/40 border border-white/10 text-white/40 placeholder-white/30 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Anon Key</label>
                    <input
                      type="password"
                      placeholder="Enter your anon key"
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-[#0B1320]/40 border border-white/10 text-white/40 placeholder-white/30 cursor-not-allowed"
                    />
                  </div>
                </div>
                <p className="text-sm text-white/40 mt-3">Configuration will be enabled after Supabase setup.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
