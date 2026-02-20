
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Terminal, Loader2, Zap, Cloud, Database } from 'lucide-react';
import { IntegrationStatus } from '../types';
import { ChatHistoryItem, requestSentinelChatReply } from '../services/sentinelAiService';

interface SentinelAIProps {
    hubspotStatus: IntegrationStatus;
}

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    isBreeze?: boolean;
    isAzure?: boolean;
    isD365?: boolean;
}

const SentinelAI: React.FC<SentinelAIProps> = ({ hubspotStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'ai',
            content: "Sentinel AI Node #5065 Online. Triple-Engine Stack (Azure, HubSpot, Dynamics 365) detected. How can I assist with your operational theater today?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape' || !isOpen) return;

            if (!isMinimized) {
                setIsMinimized(true);
                return;
            }

            setIsOpen(false);
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, isMinimized]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const historyForRequest: ChatHistoryItem[] = [...messages, userMessage].map((message) => ({
                role: message.role,
                content: message.content,
            }));

            const response = await requestSentinelChatReply({
                prompt: userMessage.content,
                history: historyForRequest,
                hubspotStatus,
            });

            setMessages(prev => [...prev, {
                role: 'ai',
                content: response,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            console.error("Sentinel Sync Error:", error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "CRITICAL: Azure Compute Handshake Failed. Please check your API credentials or Cloud Fabric status.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                aria-label="Open Sentinel assistant"
                title="Open Sentinel assistant"
                className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl shadow-blue-600/40 flex items-center justify-center transition-all hover:scale-110 z-50 group border-2 border-white/20"
            >
                <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-20"></div>
                <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col transition-all duration-300 ${isMinimized ? 'h-16 w-72' : 'h-[600px] w-96'}`}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
                            <Bot className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Sentinel Core AI</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[8px] text-slate-500 font-mono uppercase">Azure Fabric: Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsMinimized(!isMinimized)} aria-label={isMinimized ? 'Expand Sentinel panel' : 'Minimize Sentinel panel'} className="p-1.5 text-slate-500 hover:text-white transition-colors">
                            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => setIsOpen(false)} aria-label="Close Sentinel panel" className="p-1.5 text-slate-500 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                                    }`}>
                                        {msg.role === 'ai' && (
                                            <div className="flex items-center gap-2 mb-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                                <Terminal className="w-3 h-3" /> Sentinel Node
                                            </div>
                                        )}
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                                            <span className="text-[10px] text-slate-400 font-mono animate-pulse">Computing Response...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-900 border-t border-slate-800">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter operational command..."
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono placeholder:text-slate-600"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    aria-label="Send message to Sentinel AI"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                            <div className="flex justify-center mt-2 gap-3">
                                <div className="flex items-center gap-1 text-[8px] text-slate-600 uppercase font-bold">
                                    <Cloud className="w-2.5 h-2.5" /> Azure
                                </div>
                                <div className="flex items-center gap-1 text-[8px] text-slate-600 uppercase font-bold">
                                    <Zap className="w-2.5 h-2.5" /> Breeze
                                </div>
                                <div className="flex items-center gap-1 text-[8px] text-slate-600 uppercase font-bold">
                                    <Database className="w-2.5 h-2.5" /> D365
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SentinelAI;
