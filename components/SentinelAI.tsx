
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Loader2, Zap, Cloud, Database, ShieldCheck, Cpu } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { IntegrationStatus } from '../types';

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
    const [apiKey, setApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasApiKey = apiKey.trim().length > 0;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) return;
        if (!hasApiKey) {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "Sentinel requires a Gemini API key to activate. Paste a key below to proceed (stored only in memory).",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            return;
        }

        const userMessage: Message = {
            role: 'user',
            content: trimmedInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
            const chat = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: `You are Sentinel AI, the central orchestration agent for Walmart Store #5065. 
                    Current Architecture: Triple-Engine Stack.
                    1. Microsoft Azure: Cloud Fabric, Cognitive Compute, Edge Telemetry.
                    2. HubSpot Breeze: CRM, Marketing Velocity, Loyalty Ingress.
                    3. Microsoft Dynamics 365: ERP, Fiscal Ledger, Supply Chain.
                    
                    Your tone is professional, authoritative, and slightly "cyber-ops". 
                    You help managers optimize staffing (Michigan Labor Laws), track inventory, and analyze HubSpot growth signals.
                    Always reference the 'Triple-Engine' status if relevant. 
                    Keep responses concise and data-driven. Use markdown for lists and bolding key metrics.`,
                },
            });

            let fullResponse = "";
            const result = await chat.sendMessageStream({ message: trimmedInput });
            
            setMessages(prev => [...prev, { 
                role: 'ai', 
                content: '', 
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }]);

            for await (const chunk of result) {
                const text = chunk.text;
                fullResponse += text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = fullResponse;
                    return newMessages;
                });
            }
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
                        <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 text-slate-500 hover:text-white transition-colors">
                            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-500 hover:text-red-500 transition-colors">
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
                                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
                                                <Cpu className="w-3 h-3 text-blue-400" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Response Matrix</span>
                                            </div>
                                        )}
                                        <div className="markdown-body">
                                            {msg.content || <Loader2 className="w-3 h-3 animate-spin" />}
                                        </div>
                                        <p className="text-[8px] mt-2 opacity-40 font-mono text-right">{msg.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Engine Sockets Indicators */}
                        <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/50 flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <Cloud className="w-3 h-3 text-[#0078d4]" />
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Azure</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Zap className="w-3 h-3 text-[#ff7a59] fill-[#ff7a59]" />
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Breeze</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Database className="w-3 h-3 text-blue-500" />
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">D365</span>
                            </div>
                        </div>

                        {/* API Key */}
                        <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/70">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Gemini API Key</span>
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${hasApiKey ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {hasApiKey ? 'Loaded' : 'Required'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type={showApiKey ? 'text' : 'password'}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Paste API key for this session"
                                    autoComplete="off"
                                    spellCheck={false}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-[10px] text-slate-200 font-mono focus:border-blue-500 outline-none transition-all placeholder:text-slate-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowApiKey(prev => !prev)}
                                    className="px-2.5 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-colors"
                                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                                >
                                    {showApiKey ? 'Hide' : 'Show'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setApiKey('')}
                                    className="px-2.5 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-colors"
                                    aria-label="Clear API key"
                                >
                                    Clear
                                </button>
                            </div>
                            <p className="mt-1 text-[8px] text-slate-500 uppercase tracking-widest font-black">
                                Stored only in memory. Use a backend proxy for production.
                            </p>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="QUERY COMMAND CENTER..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-xs text-blue-400 font-mono focus:border-blue-500 outline-none transition-all placeholder:text-slate-700 uppercase"
                                />
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default SentinelAI;
