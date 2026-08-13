import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Bot, User, ShieldCheck, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
      text: "Hello! I am Carlos's AI Portfolio Assistant. Ask me anything about Carlos's UST degree, Henkel internship, technical skills, or capstone projects!",
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          isExpanded ? 'w-[95vw] md:w-[600px] h-[80vh]' : 'w-[92vw] sm:w-[400px] h-[560px]'
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
              </div>
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
        <div className={`flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans chat-scrollbar ${
          isDarkMode ? 'bg-slate-900' : 'bg-white'
        }`}>
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
                className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : isDarkMode
                    ? 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-tl-none'
                    : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none'
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
                            className="text-cyan-400 underline hover:text-cyan-300"
                          >
                            {children}
                          </a>
                        ),
                        h1: ({ children }) => <h1 className="text-sm font-bold mb-1 mt-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xs font-bold mb-1 mt-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xs font-semibold mb-1 mt-1">{children}</h3>,
                        code: ({ children }) => (
                          <code className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                            isDarkMode ? 'bg-slate-900 text-cyan-300' : 'bg-slate-200 text-cyan-700'
                          }`}>{children}</code>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className={`border-l-2 pl-3 italic my-1 ${
                            isDarkMode ? 'border-slate-600 text-slate-400' : 'border-slate-300 text-slate-600'
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
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
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
            ? 'border-slate-800/60 bg-slate-950/40'
            : 'border-slate-200 bg-slate-50'
        }`}>
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className={`px-2 py-1 rounded-md text-[10px] font-mono transition-all truncate max-w-[200px] ${
                isDarkMode
                  ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 hover:bg-cyan-900/60'
                  : 'text-cyan-700 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100'
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Powered By Attribution */}
        <div className={`px-3 py-1 text-center text-[9px] font-mono border-t ${
          isDarkMode
            ? 'text-slate-500 border-slate-800 bg-slate-950/60'
            : 'text-slate-400 border-slate-200 bg-slate-50'
        }`}>
          ✨ Powered by Google Gemini AI
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className={`p-3 border-t flex items-center gap-2 ${
            isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
          }`}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about Carlos..."
            className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 transition-colors ${
              isDarkMode ? 'bg-slate-800 text-white border-slate-700 placeholder-slate-500' : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 rounded-xl bg-cyan-500 text-white disabled:opacity-40 hover:bg-cyan-600 transition-all shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
