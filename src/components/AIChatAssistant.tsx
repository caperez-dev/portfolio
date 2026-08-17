import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Bot, User, ShieldCheck, Minimize2, Maximize2, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, ThemeOption } from '../types';
import carlosBranding from '../assets/carlos branding.png';

interface AIChatAssistantProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'carlos-portfolio-ai-chat';
const MAX_STORED_MESSAGES = 50;
const STORAGE_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const formatTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const makeWelcomeMessage = (): ChatMessage => ({
  id: `welcome-${Date.now()}`,
  sender: 'assistant',
  text: "Hello! I am Carlos's AI Portfolio Assistant. Ask me anything about Carlos's UST degree, Henkel internship, technical skills, or capstone projects!",
  timestamp: formatTimestamp()
});

const loadStoredMessages = (): ChatMessage[] | null => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      version?: number;
      updatedAt?: number;
      messages?: unknown;
    };

    if (!parsed || !Array.isArray(parsed.messages)) return null;

    if (typeof parsed.updatedAt === 'number') {
      if (Date.now() - parsed.updatedAt > STORAGE_EXPIRY_MS) {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        return null;
      }
    }

    const hydrated = (parsed.messages as any[])
      .filter(
        (m) =>
          m &&
          typeof m.id === 'string' &&
          (m.sender === 'user' || m.sender === 'assistant') &&
          typeof m.text === 'string' &&
          typeof m.timestamp === 'string'
      )
      .map<ChatMessage>((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp
      }));

    return hydrated.length > 0 ? hydrated.slice(-MAX_STORED_MESSAGES) : null;
  } catch {
    return null;
  }
};

const saveMessagesToStorage = (messages: ChatMessage[]) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const capped = messages.slice(-MAX_STORED_MESSAGES);
    const payload = {
      version: 1,
      updatedAt: Date.now(),
      messages: capped.map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp
      }))
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / disabled storage — degrade to in-memory only */
  }
};

const clearStoredMessages = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

export function AIChatAssistant({
  currentTheme,
  isDarkMode,
  isOpen,
  onClose
}: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = loadStoredMessages();
    return stored ?? [makeWelcomeMessage()];
  });

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

  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);

  const handleClearChat = useCallback(() => {
    clearStoredMessages();
    setMessages([makeWelcomeMessage()]);
    setInputText('');
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: formatTimestamp()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'x-vercel-protection-bypass': '1'
        },
        body: JSON.stringify({ message: text.trim() })
      });

      if (response.status === 401) {
        throw new Error('Vercel deployment protection is blocking the API. Please disable Standard Protection or Password Protection in Vercel Project Settings → Deployment Protection.');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || "I'm sorry, I couldn't generate a response at this time.",
        timestamp: formatTimestamp()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const friendlyMsg =
        err?.message?.includes('Vercel deployment protection')
          ? "⚠️ Deployment protection is currently blocking the chat. Carlos needs to disable 'Standard Protection' in his Vercel Project Settings under Deployment Protection. Please contact him at alfonso.cperez08@gmail.com!"
          : 'Network error communicating with AI server. Please try again in a moment.';
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: friendlyMsg,
          timestamp: formatTimestamp()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`fixed bottom-4 right-4 z-50 rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-[95vw] md:w-[600px] h-[80vh]' : 'w-[92vw] sm:w-[400px] h-[560px]'
        } ${
          isDarkMode
            ? 'bg-[#141414] border-white/10 text-white shadow-[#ff9500]/40'
            : 'bg-white border-white/10 text-white shadow-[#ff9500]/30'
        }`}
      >
        {/* Header */}
        <div
          className="p-3.5 border-b flex items-center justify-between text-white"
          style={{ backgroundColor: isDarkMode ? currentTheme.darkCard : currentTheme.lightAccent }}
        >
          <div className="flex items-center gap-2">
            <img src={carlosBranding} alt="Carlos" className="w-8 h-8 rounded-full object-cover shrink-0" />
            <div>
              <div className="text-xs font-bold font-mono flex items-center gap-1.5">
                <span>Carlos' Assistant</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              onClick={handleClearChat}
              whileTap={{ scale: 0.88 }}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white"
              title="Start a new conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              whileTap={{ scale: 0.88 }}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white"
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </motion.button>
            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.88 }}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Message Stream */}
        <div className={`flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans chat-scrollbar ${
          isDarkMode ? 'bg-[#141414]' : 'bg-white'
        }`}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className="shrink-0">
                {msg.sender === 'user' ? (
                  <div className="p-1.5 rounded-full bg-[#ff9500] text-black">
                    <User className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <img
                    src={carlosBranding}
                    alt="Carlos"
                    className="w-7 h-7 rounded-full object-cover border border-white/10 shadow-sm"
                  />
                )}
              </div>

              <div
                className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#ff9500] text-black rounded-tr-none'
                    : isDarkMode
                    ? 'bg-[#1c1c1e] text-white border border-white/10 rounded-tl-none'
                    : 'bg-white text-slate-800 border border-white/10 rounded-tl-none'
                }`}
              >
                <div className={`chat-markdown prose-sm ${
                  msg.sender === 'user'
                    ? 'prose-invert'
                    : isDarkMode
                    ? 'prose-invert'
                    : ''
                }`}>
                  {msg.sender === 'user' ? (
                    <p className="text-xs">{msg.text}</p>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="text-xs mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        u: ({ children }) => <u className="underline">{children}</u>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-0.5">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-0.5">{children}</ol>,
                        li: ({ children }) => <li className="text-xs">{children}</li>,
                        br: () => <br />,
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ff9500] underline hover:text-[#ffb340]"
                          >
                            {children}
                          </a>
                        ),
                        h1: ({ children }) => <h1 className="text-sm font-bold mb-1 mt-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xs font-bold mb-1 mt-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xs font-semibold mb-1 mt-1">{children}</h3>,
                        code: ({ children }) => (
                          <code className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                            isDarkMode ? 'bg-[#0d0d0f] text-[#ff9500]' : 'bg-white/10 text-[#ff9500]'
                          }`}>{children}</code>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className={`border-l-2 pl-3 italic my-1 ${
                            isDarkMode ? 'border-white/20 text-white/60' : 'border-white/20 text-white/60'
                          }`}>{children}</blockquote>
                        )
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
                <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-[#ff9500] text-xs font-mono p-2">
              <Bot className="w-4 h-4 animate-pulse" />
              <span className="flex items-center gap-0.5">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>T</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>y</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>p</span>
                <span className="animate-bounce" style={{ animationDelay: '450ms' }}>i</span>
                <span className="animate-bounce" style={{ animationDelay: '600ms' }}>n</span>
                <span className="animate-bounce" style={{ animationDelay: '750ms' }}>g</span>
                <span className="flex gap-0.5 ml-1">
                  <span className="animate-bounce" style={{ animationDelay: '900ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '1050ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '1200ms' }}>.</span>
                </span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sample Prompt Chips */}
        <div className={`px-3 py-2 border-t flex flex-wrap gap-1.5 overflow-x-auto chips-scrollbar ${
          isDarkMode
            ? 'border-white/10 bg-[#0d0d0f]'
            : 'border-white/10 bg-white'
        }`}>
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className={`px-2 py-1 rounded-md text-[10px] font-mono transition-all truncate max-w-[200px] ${
                isDarkMode
                  ? 'text-[#ff9500] bg-[#ff9500]/15 border border-[#ff9500]/30 hover:bg-[#ff9500]/25'
                  : 'text-[#ff9500] bg-[#ff9500]/10 border border-[#ff9500]/30 hover:bg-[#ff9500]/20'
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Powered By Attribution */}
        <div className={`px-3 py-1 text-center text-[9px] font-mono border-t ${
          isDarkMode
            ? 'text-white/40 border-white/10 bg-[#0d0d0f]'
            : 'text-white/40 border-white/10 bg-white'
        }`}>
          Powered by Google Gemini AI
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className={`p-3 border-t flex items-center gap-2 ${
            isDarkMode ? 'border-white/10 bg-[#141414]' : 'border-white/10 bg-white'
          }`}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about Carlos..."
            className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#ff9500] transition-colors ${
              isDarkMode ? 'bg-[#1c1c1e] text-white border-white/10 placeholder-white/40' : 'bg-white/90 text-white border-white/10 placeholder-white/40'
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 rounded-xl bg-[#ff9500] text-white disabled:opacity-40 hover:bg-[#ffb340] transition-all shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
      )}
    </AnimatePresence>
  );
}

