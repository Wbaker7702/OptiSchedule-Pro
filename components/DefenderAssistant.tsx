import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Terminal, Loader2, Zap, Database, ShieldCheck } from 'lucide-react';
import { IntegrationStatus } from '../types';
import { sanitizeInput } from '../validators';

interface DefenderAssistantProps {
    hubspotStatus: IntegrationStatus;
}

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

const createMessageId = (role: Message['role']) => `${role}-${crypto.randomUUID()}`;
const formatMessageTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const createAiMessage = (content: string): Message => ({
    id: createMessageId('ai'),
    role: 'ai',
    content,
    timestamp: formatMessageTime()
});

const DefenderAssistant: React.FC<DefenderAssistantProps> = ({ hubspotStatus }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isMinimized, setIsMinimized] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>(() => [
        createAiMessage("Microsoft Defender portal #5065 online. Security operations stack (Azure, Defender XDR, Dynamics 365) detected. How can I assist with your operational theater today?")
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback((): void => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // ISSUE #8 FIX: Sanitize user input before sending
        const sanitizedInput = sanitizeInput(input);
        
        const userMessage: Message = {
            id: createMessageId('user'),
            role: 'user',
            content: sanitizedInput,
            timestamp: formatMessageTime()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // ISSUE #1 & #4 FIX: Call backend endpoint instead of exposing API key client-side
            // Backend securely manages Google GenAI API credentials
            const response = await fetch('/api/defender/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include', // Session validation via HTTP-only cookie
                body: JSON.stringify({
                    message: sanitizedInput,
                    history: messages.map(m => ({
                        role: m.role === 'ai' ? 'model' : 'user',
                        parts: [{ text: m.content }],
                    })),
                    hubspotStatus
                })
            });
            
            // ISSUE #5 FIX: Handle rate limiting errors
            if (response.status === 429) {
                setError('Rate limit exceeded. Please wait before sending another message.');
                setMessages(prev => [...prev, createAiMessage("RATE LIMIT: Too many requests. Please wait a moment before sending another message.")]);
                setIsLoading(false);
                return;
            }
            
            // ISSUE #9 FIX: Specific error handling for different status codes
            if (response.status === 401) {
                setError('Session expired. Please log in again.');
                setMessages(prev => [...prev, createAiMessage("SECURITY: Session authentication failed. Please refresh and log in again.")]);
                setIsLoading(false);
                return;
            }
            
            if (response.status === 403) {
                setError('You do not have permission to use this feature.');
                setMessages(prev => [...prev, createAiMessage("SECURITY: Insufficient permissions to access this feature.")]);
                setIsLoading(false);
                return;
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Service temporarily unavailable' }));
                setError(errorData.message || 'Failed to get response from Defender portal');
                setMessages(prev => [...prev, createAiMessage(`CRITICAL: Defender portal error (${response.status}). ${errorData.message || 'Please contact support.'}`)]);
                setIsLoading(false);
                return;
            }
            
            const data = await response.json();
            
            // ISSUE #3 FIX: Sanitize AI response before displaying
            const sanitizedResponse = sanitizeInput(data.response || '');
            
            setMessages(prev => [...prev, createAiMessage(sanitizedResponse)]);
        } catch (error) {
            // ISSUE #9 FIX: Log security errors for monitoring but show generic message to user
            console.error("[SECURITY] Defender portal error:", error);
            setError('Connection error. Please check your network and try again.');
            setMessages(prev => [...prev, createAiMessage('CRITICAL: Defender portal connection failed. Please check your network and try again.')]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl shadow-blue-600/40 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Open Defender Assistant"
                title="Open Defender Assistant Chat"
            >
                <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-20"></div>
                <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col transition-all duration-300 ${isMinimized ? 'h-16 w-72' : 'h-[600px] w-96'}`}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
                <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
                            <Bot className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Defender portal assistant</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[8px] text-slate-500 font-mono uppercase">Defender XDR: Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsMinimized(!isMinimized)} 
                            className="p-1.5 text-slate-500 hover:text-white transition-colors"
                            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                        >
                            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                        </button>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="p-1.5 text-slate-500 hover:text-red-500 transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                                    }`}>
                                        {msg.role === 'ai' && (
                                            <div className="flex items-center gap-2 mb-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                                <Terminal className="w-3 h-3" /> Defender Portal
                                            </div>
                                        )}
                                        {/* ISSUE #3 FIX: Content is already sanitized before display */}
                                        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
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
                            {error && (
                                <div className="flex justify-start">
                                    <div className="bg-red-500/10 p-3 rounded-2xl rounded-tl-none border border-red-500/30">
                                        <p className="text-[10px] text-red-400 font-semibold">{error}</p>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-slate-900 border-t border-slate-800">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter operational command..."
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    disabled={isLoading}
                                    maxLength={500}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
                                    aria-label="Send message"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                            <div className="flex justify-center mt-2 gap-3">
                                <div className="flex items-center gap-1 text-[8px] text-slate-600 uppercase font-bold">
                                    <ShieldCheck className="w-2.5 h-2.5" /> Defender XDR
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

export default DefenderAssistant;
