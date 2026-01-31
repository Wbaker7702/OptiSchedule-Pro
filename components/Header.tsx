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
    { id: 0, type: 'alert', text: 'CRITICAL: Cloud Run Quota Exceeded (us-west1). Deployment Halted.', time: 'Just now' },
    { id: 1, type: 'alert', text: 'Overtime risk detected for Checkout Dept', time: '10 min ago' },
    { id: 2, type: 'info', text: 'New inventory shipment arrived', time: '1 hour ago' },
    { id: 3, type: 'success', text: 'Weekly schedule published successfully', time: '2 hours ago' },
    { id: 4, type: 'alert', text: '3 employees called out sick', time: '4 hours ago' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all text-gray-900 placeholder-gray-400"
          />
        </div>
        
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700">Mark all read</button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3">
                    <div className="mt-1 shrink-0">
                      {notif.type === 'alert' && <AlertCircle className="w-5 h-5 text-red-500" />}
                      {notif.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                      {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 leading-snug">{notif.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 text-center">
                <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">View All Activity</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{CURRENT_USER}</p>
            <p className="text-xs text-gray-500">Store Manager</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors">
            WB
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;