
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { CURRENT_USER } from '../constants';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notifications = [
    { id: 0, type: 'success', text: 'System Restoration Complete. Microsoft Sentinel Online.', time: 'Just now' },
    { id: 1, type: 'info', text: 'Optimization protocol running normally', time: '5 min ago' },
    { id: 2, type: 'info', text: 'New inventory shipment arrived', time: '1 hour ago' },
    { id: 3, type: 'success', text: 'Weekly schedule published successfully', time: '2 hours ago' },
    { id: 4, type: 'alert', text: '3 employees called out sick', time: '4 hours ago' },
  ];

  return (
    <header className="bg-[#0f172a] border-b border-slate-800 px-8 py-5 flex items-center justify-between sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-opacity-90">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-widest">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block group">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2 group-hover:text-slate-300 transition-colors" />
          <input 
            type="text" 
            placeholder="SEARCH COMMANDS..." 
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all text-slate-200 placeholder-slate-600"
          />
        </div>
        
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <h3 className="font-bold text-white text-xs uppercase tracking-widest">Notifications</h3>
                <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase">Mark all read</button>
              </div>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3">
                    <div className="mt-1 shrink-0">
                      {notif.type === 'alert' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      {notif.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                      {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <div>
                      <p className="text-xs text-slate-200 leading-snug font-medium">{notif.text}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-slate-950 text-center border-t border-slate-800">
                <button className="text-[10px] text-slate-400 hover:text-white font-bold uppercase tracking-widest py-2 w-full">View All Activity</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{CURRENT_USER}</p>
            <p className="text-[10px] text-slate-500 font-mono uppercase">Store Manager</p>
          </div>
          <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400 font-black text-xs border border-slate-700 cursor-pointer hover:bg-slate-700 hover:border-slate-600 transition-all shadow-lg">
            WB
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
