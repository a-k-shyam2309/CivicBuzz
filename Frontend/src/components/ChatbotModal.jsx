import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, X, Minimize2, RefreshCw } from 'lucide-react';
import { chatService } from '../services/chatService';

const SUGGESTED_QUESTIONS = [
  'How do I report a pothole?',
  'What is Participatory Budgeting?',
  'Check status of complaint CB-1001',
  'How does citizen verification work?',
];

export const ChatbotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Namaste! 🙏 I am your CivicBuzz AI Assistant. I can help you report civic issues, track complaint resolutions, understand participatory budgets, or navigate city services. How can I assist you today?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputValue;
    if (!text || !text.trim() || isLoading) return;

    const userMsg = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(text.trim(), sessionId);
      if (response?.session_id) {
        setSessionId(response.session_id);
      }
      const botReply = response?.reply || "I'm sorry, I couldn't generate a response at this moment.";
      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I am currently operating in offline mode. CivicBuzz allows citizens to report civic grievances, track work progress with photo evidence, and vote on ward project budgets.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 group"
          aria-label="Open CivicBuzz AI Chatbot"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold pr-1">
            Civic Assistant
          </span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white" />
        </button>
      )}

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 sm:w-[420px] h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  CivicBuzz AI Assistant
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h4>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini-Powered • Multilingual
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    CB
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[82%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center text-slate-400 text-xs pl-9">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Gemini is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-slate-100/70 border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-800 rounded-full text-[11px] font-medium transition-all shadow-xs flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything or enter complaint ID..."
              disabled={isLoading}
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotModal;
