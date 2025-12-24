
import React, { useState, useRef, useEffect } from 'react';
import { chatWithConcierge } from '../geminiService.ts';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your GTV Concierge. How can I help you with your UK Global Talent Visa journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    const history = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const response = await chatWithConcierge(userMessage, history);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] print:hidden">
      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 focus:ring-4 focus:ring-amber-500/50 ${
          isOpen ? 'bg-zinc-900 text-white' : 'bg-amber-600 text-white hover:bg-amber-500'
        }`}
        aria-label={isOpen ? "Close chat concierge" : "Open chat concierge"}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots'} text-xl md:text-2xl`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[85vw] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-zinc-100 flex flex-col overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="bg-zinc-900 p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white text-xs">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-widest leading-none">GTV Concierge</h4>
              <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-tight mt-1">Real-time AI Support</p>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#FCFCFC]"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs md:text-[13px] leading-relaxed font-medium italic ${
                  msg.role === 'user' 
                    ? 'bg-zinc-900 text-white rounded-tr-none' 
                    : 'bg-white border border-zinc-100 text-zinc-700 shadow-sm rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-zinc-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSend}
            className="p-4 bg-white border-t border-zinc-100 flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about GTV..."
              className="flex-1 bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-3 text-xs md:text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-zinc-300"
              aria-label="Type your message to the GTV Concierge"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 md:w-11 md:h-11 bg-amber-600 text-white rounded-2xl flex items-center justify-center transition-all active:scale-90 hover:bg-amber-500 disabled:opacity-30 shadow-lg"
              aria-label="Send message"
            >
              <i className="fas fa-paper-plane text-xs md:text-sm"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveChatWidget;
