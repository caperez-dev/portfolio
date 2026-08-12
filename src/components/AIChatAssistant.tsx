import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Bot, User, ShieldCheck, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage, ThemeOption } from '../types';

interface AIChatAssistantProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatAssistant({
  currentTheme,
  isDarkMode,
  isOpen,
  onClose
}: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am Carlos's grounded AI Portfolio Assistant. Ask me anything about Carlos's UST degree, Henkel internship, technical skills, or capstone projects!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "What was Carlos's GWA & honor at UST?",
    "Tell me about his Henkel internship",
    "What capstone & web projects did he build?",
    "What certifications does he hold?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() })
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || "I'm sorry, I couldn't generate a response at this time.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Network error communicating with AI server. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className={`fixed bottom-4 right-4 z-50 rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-[95vw] md:w-[600px] h-[80vh]' : 'w-[92vw] sm:w-[400px] h-[520px]'
        } ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-cyan-950/40'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30'
        }`}
      >
        {/* Header */}
        <div
          className="p-3.5 border-b flex items-center justify-between text-white"
          style={{ backgroundColor: isDarkMode ? currentTheme.darkCard : currentTheme.lightAccent }}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono flex items-center gap-1.5">
                <span>Carlos's AI Assistant</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono">
                  Grounded
                </span>
              </div>
              <div className="text-[10px] text-slate-300 font-sans">Strictly answers from resume facts</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white"
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`p-1.5 rounded-full shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800 text-cyan-400 border border-slate-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : isDarkMode
                    ? 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-tl-none'
                    : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
              <Bot className="w-4 h-4 animate-spin" />
              <span>Checking resume facts...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sample Prompt Chips */}
        <div className="px-3 py-2 border-t border-slate-800/60 bg-slate-950/40 flex flex-wrap gap-1.5 overflow-x-auto">
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-2 py-1 rounded-md text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 hover:bg-cyan-900/60 transition-all truncate max-w-[200px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about Carlos's UST degree, Henkel internship..."
            className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 ${
              isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-300'
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 rounded-xl bg-cyan-500 text-white disabled:opacity-40 hover:bg-cyan-600 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
