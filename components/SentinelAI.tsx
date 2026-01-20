import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Terminal, Sparkles, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

const SentinelAI: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: `Sentinel AI online. Date: ${new Date().toLocaleDateString()}. How can I assist with your operational protocol today, Wesley?`, timestamp: new Date().toLocaleTimeString() }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            let aiContent = "Analyzing Sentinel Telemetry... ";
            const lowerInput = input.toLowerCase();
            
            if (lowerInput.includes('hubspot')) {
                aiContent = "HubSpot CRM link is currently pending authorization. Attributed campaign revenue for Store 5065 is estimated at $15.4k this period.";
            } else if (lowerInput.includes('dynamics') || lowerInput.includes('erp')) {
                aiContent = "Dynamics 365 Core Ingress is secure. Sales velocity data is synchronized with 99.8% precision.";
            } else if (lowerInput.includes('staff') || lowerInput.includes('schedule')) {
                aiContent = "Current Front End staffing is at 12/15. Compliance grade is 94%. Recommend reallocating 2 assets from Home Goods to cover peak surge at 5 PM.";
            } else if (lowerInput.includes('status') || lowerInput.includes('health')) {
                aiContent = `System Status: Hardened. Uptime: 99.999%. Latency: 12ms. All Sentinel Nodes operational as of ${new Date().toLocaleTimeString()}.`;
            } else {
                aiContent = "I've analyzed the current store state. All operational nodes are within standard deviation parameters. Sentinel Protocol v3.2 is fully enforced.";
            }

            setMessages(prev => [...prev, {
                role: 'ai',
                content: aiContent,
                timestamp: new Date().toLocaleTimeString()
            }]);
            setIsTyping(false);
        }, 1500);
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-[#002050] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group border border-blue-400/30"
            >
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-900 animate-pulse" />
                <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
        );
    }

    return (
        <div className={`fixed right-8 bottom-8 z-50 bg-slate-950 border border-slate-800 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col transition-all duration-300 overflow-hidden ${isMinimized ? 'w-64 h-14' : 'w-[400px] h-[550px]'}`}>
            {/* Header */}
            <div className="bg-[#002050] p-4 flex items-center justify-between border-b border-blue-400/20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-400/30">
                        <Terminal className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-tight">Sentinel AI</p>
                        <p className="text-[9px] text-blue-300/60 font-mono uppercase tracking-widest mt-0.5">Protocol Node 5065</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded transition-colors text-blue-200">
                        {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-red-500/20 rounded transition-colors text-blue-200 hover:text-red-400">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#020617]">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-slate-900 text-slate-300 border border-slate-800 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[8px] font-mono text-slate-600 mt-1 uppercase tracking-widest">{msg.timestamp}</span>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-start gap-2 text-blue-400 italic font-mono text-[10px] animate-pulse">
                                <Sparkles className="w-3 h-3" /> Processing Sentinel Streams...
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900/50 border-t border-slate-800">
                        <div className="relative">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask Sentinel..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                            />
                            <button 
                                onClick={handleSend}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-400 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-3 flex gap-2">
                           {['HubSpot Sync', 'D365 Data', 'Floor Traffic', 'System Status'].map(tag => (
                               <button 
                                 key={tag}
                                 onClick={() => setInput(tag === 'System Status' ? 'Check System Status' : `Give me the latest on ${tag}`)}
                                 className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all"
                               >
                                  {tag}
                               </button>
                           ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SentinelAI;