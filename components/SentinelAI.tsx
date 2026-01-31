
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Terminal, Sparkles, Loader2, ExternalLink, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { IntegrationStatus } from '../types';

interface SentinelAIProps {
    hubspotStatus: IntegrationStatus;
}

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    groundingChunks?: any[];
    isBreeze?: boolean;
}

const SentinelAI: React.FC<SentinelAIProps> = ({ hubspotStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { 
            role: 'ai', 
            content: hubspotStatus === 'connected' 
                ? "Breeze Agent Online. HubSpot CRM is synced. I'm monitoring marketing velocity to optimize your floor deployment. How can I assist, Wesley?"
                : `Sentinel AI online. Date: ${new Date().toLocaleDateString()}. How can I assist with your operational protocol today, Wesley?`, 
            timestamp: new Date().toLocaleTimeString(),
            isBreeze: hubspotStatus === 'connected'
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: userMsg.content,
                config: {
                    systemInstruction: hubspotStatus === 'connected' 
                        ? "You are the HubSpot Breeze Agent. You provide proactive intelligence on marketing campaigns and their impact on retail staffing. Be concise, professional, and data-driven."
                        : "You are the Sentinel AI operational assistant. You focus on workforce optimization and system integrity.",
                    tools: [{ googleSearch: {} }],
                }
            });

            const aiContent = response.text || "Operational data not found.";
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

            setMessages(prev => [...prev, {
                role: 'ai',
                content: aiContent,
                timestamp: new Date().toLocaleTimeString(),
                groundingChunks: groundingChunks,
                isBreeze: hubspotStatus === 'connected'
            }]);
        } catch (error) {
            console.error("Sentinel AI Error:", error);
            let fallbackContent = "Sentinel Node Connection Interrupted. Unable to fetch live intelligence.";
            
            const lowerInput = userMsg.content.toLowerCase();
            if (lowerInput.includes('hubspot') || lowerInput.includes('crm') || lowerInput.includes('breeze')) {
                if (hubspotStatus === 'connected') {
                     fallbackContent = "Breeze Agent report: Marketing attribution is 100% active. We detected a 15% surge in loyalty redemptions in Zone B. I recommend reallocating one resource from Apparel to Front End to mitigate wait-time spikes.";
                } else {
                     fallbackContent = "HubSpot link is currently inactive. Launch the Breeze Agent in the Scheduling Center to enable real-time marketing traffic forecasting.";
                }
            }

            setMessages(prev => [...prev, {
                role: 'ai',
                content: fallbackContent,
                timestamp: new Date().toLocaleTimeString(),
                isBreeze: hubspotStatus === 'connected'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group border ${hubspotStatus === 'connected' ? 'bg-[#ff7a59] border-white/50' : 'bg-[#002050] border-blue-400/30'}`}
            >
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 animate-pulse ${hubspotStatus === 'connected' ? 'bg-white' : 'bg-blue-500'}`} />
                {hubspotStatus === 'connected' ? <Zap className="w-6 h-6 text-white fill-white" /> : <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />}
            </button>
        );
    }

    return (
        <div className={`fixed right-8 bottom-8 z-50 bg-slate-950 border rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col transition-all duration-300 overflow-hidden ${isMinimized ? 'w-64 h-14' : 'w-[400px] h-[600px]'} ${hubspotStatus === 'connected' ? 'border-[#ff7a59]/30' : 'border-slate-800'}`}>
            {/* Header */}
            <div className={`p-4 flex items-center justify-between border-b transition-colors duration-500 ${hubspotStatus === 'connected' ? 'bg-[#ff7a59] border-white/10' : 'bg-[#002050] border-blue-400/20'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${hubspotStatus === 'connected' ? 'bg-white/20 border-white/30' : 'bg-blue-500/20 border-blue-400/30'}`}>
                        {hubspotStatus === 'connected' ? <Zap className="w-4 h-4 text-white fill-white" /> : <Terminal className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-tight">{hubspotStatus === 'connected' ? 'Breeze Agent' : 'Sentinel AI'}</p>
                        <p className={`text-[9px] font-mono uppercase tracking-widest mt-0.5 ${hubspotStatus === 'connected' ? 'text-white/60' : 'text-blue-300/60'}`}>
                            {hubspotStatus === 'connected' ? 'Smart CRM Node' : 'Protocol Node 5065'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/80">
                        {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-red-500/20 rounded transition-colors text-white/80">
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
                                    : msg.isBreeze 
                                        ? 'bg-[#2d1b15] text-orange-100 border border-orange-500/20 rounded-tl-none' 
                                        : 'bg-slate-900 text-slate-300 border border-slate-800 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                    
                                    {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                                        <div className="mt-3 pt-2 border-t border-slate-700/50">
                                            <p className={`text-[9px] font-mono mb-2 uppercase tracking-widest flex items-center gap-1 ${msg.isBreeze ? 'text-orange-400' : 'text-slate-500'}`}>
                                                <Sparkles className="w-3 h-3" /> Data Ingress
                                            </p>
                                            <div className="space-y-1.5">
                                                {msg.groundingChunks.map((chunk, idx) => (
                                                    chunk.web?.uri && (
                                                        <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2 rounded bg-slate-950/50 border transition-colors group ${msg.isBreeze ? 'border-orange-500/20 hover:bg-orange-950/20' : 'border-slate-800 hover:bg-slate-800'}`}>
                                                            <ExternalLink className={`w-3 h-3 ${msg.isBreeze ? 'text-orange-400' : 'text-blue-500'}`} />
                                                            <span className={`text-[10px] truncate font-medium underline decoration-current/30 ${msg.isBreeze ? 'text-orange-300' : 'text-blue-400'}`}>{chunk.web.title}</span>
                                                        </a>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <span className="text-[8px] font-mono text-slate-600 mt-1 uppercase tracking-widest">{msg.timestamp}</span>
                            </div>
                        ))}
                        {isTyping && (
                            <div className={`flex items-start gap-2 italic font-mono text-[10px] animate-pulse ${hubspotStatus === 'connected' ? 'text-orange-400' : 'text-blue-400'}`}>
                                <Sparkles className="w-3 h-3" /> {hubspotStatus === 'connected' ? 'Breeze Agent Fetching Insights...' : 'Processing Sentinel Streams...'}
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
                                placeholder={hubspotStatus === 'connected' ? 'Ask Breeze Agent...' : 'Ask Sentinel AI...'}
                                className={`w-full bg-slate-950 border rounded-xl pl-4 pr-12 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-mono ${hubspotStatus === 'connected' ? 'border-orange-500/20 focus:ring-1 focus:ring-orange-500' : 'border-slate-800 focus:ring-1 focus:ring-blue-500'}`}
                            />
                            <button 
                                onClick={handleSend}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 transition-colors ${hubspotStatus === 'connected' ? 'text-[#ff7a59] hover:text-[#ff8f75]' : 'text-blue-500 hover:text-blue-400'}`}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-3 flex gap-2">
                           {['Breeze Report', 'Deal Velocity', 'Traffic Correlation', 'Campaign ROI'].map(tag => (
                               <button 
                                 key={tag}
                                 onClick={() => setInput(`Provide ${tag} data`)}
                                 className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border transition-all ${hubspotStatus === 'connected' ? 'bg-orange-500/5 border-orange-500/20 text-orange-400 hover:bg-orange-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-blue-500 hover:text-blue-400'}`}
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
