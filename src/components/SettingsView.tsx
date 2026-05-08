'use client';

import { useState } from 'react';
import { User, Moon, Sun, Monitor, Bell, Shield, Database, Info, LogOut, ChevronRight, Trash2, Download, Upload } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');

  const sections = [
    { id: 'general', label: 'General', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'about', label: 'About', icon: Info },
  ];

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
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todolist-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

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
        <div className="mt-auto pt-8 border-t border-border lg:block hidden">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 max-w-2xl bg-card border border-border rounded-3xl p-8 shadow-sm">
        {activeTab === 'general' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h3 className="text-xl font-bold mb-1">Profile Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your public profile and account details.</p>
            </div>
            
            <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-2xl border border-border/50">
              <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center text-background text-3xl font-bold">
                N
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">NXRts</h4>
                <p className="text-sm text-muted-foreground">Free Plan User</p>
              </div>
              <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                Edit
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Display Name</label>
                <input type="text" placeholder="Your name" defaultValue="NXRts" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Email Address</label>
                <input type="email" placeholder="email@example.com" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all" />
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
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border hover:border-foreground/20 hover:bg-muted/30 transition-all"
                >
                  <theme.icon size={24} />
                  <span className="text-sm font-bold">{theme.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Glassmorphism Effect</h4>
                  <p className="text-xs text-muted-foreground">Enable frosted glass effects on panels.</p>
                </div>
                <div className="w-10 h-5 bg-foreground rounded-full relative p-1 cursor-pointer">
                  <div className="w-3 h-3 bg-background rounded-full absolute right-1" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Compact Mode</h4>
                  <p className="text-xs text-muted-foreground">Reduce spacing to show more content.</p>
                </div>
                <div className="w-10 h-5 bg-muted-foreground/30 rounded-full relative p-1 cursor-pointer">
                  <div className="w-3 h-3 bg-background rounded-full absolute left-1" />
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
                { title: 'Reminders', desc: 'Get notified when a task is due soon.' },
                { title: 'Weekly Summary', desc: 'Receive a report of your weekly progress.' },
                { title: 'Collaboration', desc: 'Notifications when someone mentions you.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <div className={twMerge(
                    "w-10 h-5 rounded-full relative p-1 cursor-pointer transition-colors",
                    idx === 0 ? "bg-foreground" : "bg-muted-foreground/30"
                  )}>
                    <div className={twMerge(
                      "w-3 h-3 bg-background rounded-full absolute transition-all",
                      idx === 0 ? "right-1" : "left-1"
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
              <button className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border/50 hover:bg-muted transition-all opacity-50 cursor-not-allowed">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                  <Upload size={20} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm">Import Data</h4>
                  <p className="text-[10px] text-muted-foreground">Restore from backup</p>
                </div>
              </button>
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
