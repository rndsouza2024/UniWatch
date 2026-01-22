import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { getRecommendation } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your UniWatch AI Concierge. Tell me what you're in the mood for (e.g., '90s action movies' or 'sad romantic comedies') and I'll find something great!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await getRecommendation(userMsg.content);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-20 px-4 sm:px-6 lg:px-8 pb-10 flex flex-col">
        <SEO 
            title="AI Movie Assistant & Concierge | UniWatch"
            description="Get personalized movie and TV show recommendations powered by Google Gemini AI. Chat with our intelligent assistant to find your next favorite watch."
            keywords={['ai recommendations', 'movie finder', 'what to watch', 'gemini ai']}
        />
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col bg-dark-surface rounded-2xl border border-dark-border shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="p-4 border-b border-dark-border bg-brand-900/20 flex items-center gap-3">
                <div className="p-2 bg-brand-600 rounded-lg">
                    <Sparkles size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-white">AI Assistant</h2>
                    <p className="text-xs text-brand-300">Powered by Google Gemini</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user' ? 'bg-indigo-600' : 'bg-brand-600'
                        }`}>
                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-gray-700/50 text-gray-200 rounded-tl-none border border-gray-600'
                        }`}>
                            <div className="prose prose-invert prose-sm">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                            <span className="text-[10px] opacity-50 block mt-2 text-right">
                                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
                            <Bot size={14} />
                        </div>
                        <div className="bg-gray-700/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-brand-400" />
                            <span className="text-sm text-gray-400">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-dark-border bg-dark-bg/50">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask for recommendations..."
                        className="flex-1 bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AIChat;