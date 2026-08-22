import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateAIResponse, QUICK_PROMPTS } from '../../services/aiAssistantService';
import { Sparkles, X, Send, Bot, User, RefreshCw, Compass } from 'lucide-react';
import GlassCard from '../Common/GlassCard';

export default function AIChatDrawer() {
  const { showAiDrawer, setShowAiDrawer, activeCity } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello! I am Aether AI, your real-time atmospheric intelligence co-pilot. Ask me anything about current weather conditions, outfit recommendations, or travel safety for ${activeCity?.name || 'your city'}.`,
      timestamp: 'Now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!showAiDrawer) return null;

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const responseText = await generateAIResponse(query, activeCity);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-[#05070A]/95 backdrop-blur-2xl border-l border-sky-500/30 flex flex-col shadow-2xl animate-slideInRight">
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 glow-cyan">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Aether AI Co-Pilot</h3>
            <p className="text-[11px] text-sky-400 font-mono-telemetry">Active Station: {activeCity?.name}</p>
          </div>
        </div>

        <button
          onClick={() => setShowAiDrawer(false)}
          className="p-2 rounded-xl glass-card text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-purple-400 border border-purple-500/30'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sky-500 text-white font-medium rounded-tr-none shadow-md'
                  : 'glass-card border-white/10 text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <span className="text-[10px] text-slate-400 mt-1 block text-right font-mono-telemetry">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass-card p-3 rounded-2xl rounded-tl-none text-xs text-sky-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing atmospheric telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-3 border-t border-white/5 bg-slate-950/40">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Suggested Inquiries</div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-sky-400 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Aether AI co-pilot..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-400"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white shadow-md transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
