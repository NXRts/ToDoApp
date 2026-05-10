'use client';

import { useState, useEffect } from 'react';
import { User, Moon, Sun, Monitor, Bell, Shield, Database, Info, LogOut, ChevronRight, Trash2, Download, Upload } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');
  
  // Settings State
  const [profile, setProfile] = useState(() => {
    if (typeof window === 'undefined') return { name: 'NXRts', email: '' };
    return JSON.parse(localStorage.getItem('todo_profile') || '{"name": "NXRts", "email": ""}');
  });

  const [appearance, setAppearance] = useState(() => {
    if (typeof window === 'undefined') return { theme: 'system', glassmorphism: true, compact: false };
    return JSON.parse(localStorage.getItem('todo_appearance') || '{"theme": "system", "glassmorphism": true, "compact": false}');
  });

  const [notifications, setNotifications] = useState(() => {
    if (typeof window === 'undefined') return { reminders: true, summary: false, collab: false };
    return JSON.parse(localStorage.getItem('todo_notifications') || '{"reminders": true, "summary": false, "collab": false}');
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('todo_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('todo_appearance', JSON.stringify(appearance));
    
    // Apply Theme
    const root = window.document.documentElement;
    if (appearance.theme === 'dark') {
      root.classList.add('dark');
      localStorage.theme = 'dark';
    } else if (appearance.theme === 'light') {
      root.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
      localStorage.removeItem('theme'); // Reset to system
    }

    // Apply Glassmorphism
    if (appearance.glassmorphism) {
      root.classList.add('glass-enabled');
    } else {
      root.classList.remove('glass-enabled');
    }
  }, [appearance]);

  useEffect(() => {
    localStorage.setItem('todo_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      window.localStorage.clear();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      tasks: JSON.parse(localStorage.getItem('todo_tasks') || '[]'),
      lists: JSON.parse(localStorage.getItem('todo_lists') || '[]'),
      tags: JSON.parse(localStorage.getItem('todo_tags') || '[]'),
      profile,
      appearance,
      notifications
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todolist-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.tasks) localStorage.setItem('todo_tasks', JSON.stringify(data.tasks));
        if (data.lists) localStorage.setItem('todo_lists', JSON.stringify(data.lists));
        if (data.tags) localStorage.setItem('todo_tags', JSON.stringify(data.tags));
        if (data.profile) setProfile(data.profile);
        if (data.appearance) setAppearance(data.appearance);
        if (data.notifications) setNotifications(data.notifications);
        alert('Data imported successfully! The page will reload.');
        window.location.reload();
      } catch (err) {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const sections = [
    { id: 'general', label: 'General', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            className={twMerge(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              activeTab === section.id 
                ? "bg-foreground text-background shadow-lg shadow-foreground/10" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <section.icon size={18} />
            {section.label}
          </button>
        ))}
      </aside>

      {/* Content Area */}
      <div className="flex-1 max-w-2xl bg-card border border-border rounded-3xl p-8 shadow-sm overflow-y-auto custom-scrollbar">
        {activeTab === 'general' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h3 className="text-xl font-bold mb-1">Profile Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your public profile and account details.</p>
            </div>
            
            <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-2xl border border-border">
              <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center text-background text-3xl font-bold uppercase">
                {profile.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{profile.name}</h4>
                <p className="text-sm text-muted-foreground">Personal Account</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Display Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="email@example.com" 
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all" 
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h3 className="text-xl font-bold mb-1">Appearance</h3>
              <p className="text-sm text-muted-foreground">Customize how the app looks on your screen.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setAppearance({ ...appearance, theme: theme.id as any })}
                  className={twMerge(
                    "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all",
                    appearance.theme === theme.id 
                      ? "border-foreground bg-foreground/5 shadow-sm" 
                      : "border-border hover:border-foreground/20 hover:bg-muted/30"
                  )}
                >
                  <theme.icon size={24} />
                  <span className="text-sm font-bold">{theme.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div 
                onClick={() => setAppearance({ ...appearance, glassmorphism: !appearance.glassmorphism })}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Glassmorphism Effect</h4>
                  <p className="text-xs text-muted-foreground">Enable frosted glass effects on panels.</p>
                </div>
                <div className={twMerge(
                  "w-10 h-5 rounded-full relative p-1 transition-colors",
                  appearance.glassmorphism ? "bg-foreground" : "bg-muted-foreground/30"
                )}>
                  <div className={twMerge(
                    "w-3 h-3 bg-background rounded-full absolute transition-all",
                    appearance.glassmorphism ? "right-1" : "left-1"
                  )} />
                </div>
              </div>
              <div 
                onClick={() => setAppearance({ ...appearance, compact: !appearance.compact })}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Compact Mode</h4>
                  <p className="text-xs text-muted-foreground">Reduce spacing to show more content.</p>
                </div>
                <div className={twMerge(
                  "w-10 h-5 rounded-full relative p-1 transition-colors",
                  appearance.compact ? "bg-foreground" : "bg-muted-foreground/30"
                )}>
                  <div className={twMerge(
                    "w-3 h-3 bg-background rounded-full absolute transition-all",
                    appearance.compact ? "right-1" : "left-1"
                  )} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h3 className="text-xl font-bold mb-1">Notifications</h3>
              <p className="text-sm text-muted-foreground">Stay updated on your tasks and deadlines.</p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'reminders', title: 'Reminders', desc: 'Get notified when a task is due soon.' },
                { id: 'summary', title: 'Weekly Summary', desc: 'Receive a report of your weekly progress.' },
                { id: 'collab', title: 'Collaboration', desc: 'Notifications when someone mentions you.' },
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id as keyof typeof notifications] })}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <div className={twMerge(
                    "w-10 h-5 rounded-full relative p-1 transition-colors",
                    notifications[item.id as keyof typeof notifications] ? "bg-foreground" : "bg-muted-foreground/30"
                  )}>
                    <div className={twMerge(
                      "w-3 h-3 bg-background rounded-full absolute transition-all",
                      notifications[item.id as keyof typeof notifications] ? "right-1" : "left-1"
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h3 className="text-xl font-bold mb-1">Data Management</h3>
              <p className="text-sm text-muted-foreground">Control your data and how it's handled.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleExportData}
                className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border/50 hover:bg-muted transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Download size={20} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm">Export Data</h4>
                  <p className="text-[10px] text-muted-foreground">Download as JSON</p>
                </div>
              </button>
              <div className="relative group p-4 bg-muted/30 rounded-2xl border border-border/50 hover:bg-muted transition-all overflow-hidden cursor-pointer">
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm">Import Data</h4>
                    <p className="text-[10px] text-muted-foreground">Restore from backup</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20">
                <h4 className="font-bold text-red-500 mb-1">Danger Zone</h4>
                <p className="text-xs text-red-500/80 mb-4">Deleting your account data is permanent. Please be certain.</p>
                <button 
                  onClick={handleClearData}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-foreground text-background rounded-4xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-foreground/10 rotate-3">
                <Shield size={40} />
              </div>
              <h3 className="text-3xl font-bold">ToDo List Pro</h3>
              <p className="text-muted-foreground mt-2">Version 1.0.4 (Stable)</p>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Developer', value: 'Antigravity AI' },
                { label: 'License', value: 'MIT License' },
                { label: 'Website', value: 'todolist.pro' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
