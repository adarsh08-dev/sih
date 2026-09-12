import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Code,
  Terminal, 
  Briefcase, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { StudentProfile } from '../types';
import { sendHelpdeskChat } from '../services/api';

// Cache for instant responses
const queryCache = new Map<string, string>();

interface BridgeBuddyProps {
  student: StudentProfile;
  currentRole: string;
}

export const BridgeBuddy: React.FC<BridgeBuddyProps> = ({ student, currentRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string; isStreaming?: boolean }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isRequestPending = useRef(false);

  const getUserName = () => {
    return localStorage.getItem('userName') || student?.name || 'there';
  };

  const getFirstName = () => {
    const fullName = getUserName();
    return fullName.split(' ')[0] || 'there';
  };

  // Initialize messages with dynamic userName
  useEffect(() => {
    const currentName = getUserName();
    setMessages([
      {
        sender: 'ai',
        text: `Hello **${currentName}**! I am your Live Ladder AI Help Desk (Gemini Connected). Ask me anything - JWT, internships, website - I give direct code answers. How can I help, ${currentName}?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [student?.name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isRequestPending.current) return;
    
    isRequestPending.current = true;
    const start = Date.now();
    const currentUserName = getUserName();
    const queryKey = textToSend.trim().toLowerCase();

    // Add user message
    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputValue('');
    
    // Check Cache
    if (queryCache.has(queryKey)) {
      console.log(`Cache hit. Time: ${Date.now() - start}ms`);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai' as const,
          text: queryCache.get(queryKey)!,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      isRequestPending.current = false;
      return;
    }

    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/helpdesk/chat?stream=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          category: 'general',
          studentProfile: { ...student, name: currentUserName }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setIsTyping(false);
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream');

      const decoder = new TextDecoder('utf-8');
      let streamedText = '';

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai' as const,
          text: '▌',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true
        }
      ]);

      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (isFirstChunk) {
          console.log(`Time to first byte: ${Date.now() - start}ms`);
          isFirstChunk = false;
        }

        streamedText += decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = {
            ...newMsgs[newMsgs.length - 1],
            text: streamedText + '▌'
          };
          return newMsgs;
        });
      }

      // Remove the cursor and finalize
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {
          ...newMsgs[newMsgs.length - 1],
          text: streamedText,
          isStreaming: false
        };
        return newMsgs;
      });

      queryCache.set(queryKey, streamedText);
      console.log(`Total stream completion Time: ${Date.now() - start}ms`);

    } catch (err) {
      console.error(err);
      setIsTyping(false);
      
      // Fallback
      const res = await sendHelpdeskChat(textToSend, messages, 'general', { ...student, name: currentUserName });
      const replyText = res?.reply || `Hey ${currentUserName}! I'm connected to Gemini. Let's tackle that issue right now.`;
      
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai' as const,
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      isRequestPending.current = false;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div id="bridge-buddy-root" className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="bridge-buddy-chat-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-80 sm:w-[420px] h-[520px] bg-[#0B0E1A] border border-[#5E3A5C] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 select-none text-[#F3E9EC]"
          >
            {/* Header */}
            <div className="p-3.5 bg-[#0B0E1A] border-b border-[#5E3A5C] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-[#5E3A5C] border border-[#B47A9A] flex items-center justify-center text-[#F3E9EC] shadow-md">
                    <Sparkles className="w-5 h-5 text-[#B47A9A]" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#B47A9A] border-2 border-[#0B0E1A] rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-extrabold text-[#F3E9EC]">Bridge Buddy</h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#5E3A5C]/40 text-[#B47A9A] border border-[#5E3A5C] uppercase tracking-wide flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#B47A9A] rounded-full animate-pulse"></span>AI HELP DESK</span>
                  </div>
                  <p className="text-[10px] text-[#F3E9EC]/60">24/7 Technical Advisor • Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-[#2C1B2F] hover:bg-[#5E3A5C] border border-[#5E3A5C] text-[#F3E9EC]/60 hover:text-[#F3E9EC] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#00030E]">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex gap-2 max-w-[90%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 mt-1 ${
                    msg.sender === 'user' 
                      ? 'bg-[#5E3A5C] text-[#F3E9EC]' 
                      : 'bg-[#2C1B2F] border border-[#5E3A5C] text-[#B47A9A]'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`p-3 rounded-xl text-xs leading-relaxed relative group ${
                    msg.sender === 'user'
                      ? 'bg-[#5E3A5C] text-[#F3E9EC] rounded-tr-none'
                      : 'bg-[#2C1B2F] border border-[#5E3A5C] text-[#F3E9EC] rounded-tl-none'
                  }`}>
                    {msg.sender === 'ai' ? (
                      <div className="space-y-2 text-[#F3E9EC] text-xs">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <div className="mb-1.5 last:mb-0 leading-relaxed">{children}</div>,
                            pre: ({ children }) => <>{children}</>,
                            strong: ({ children }) => <strong className="font-bold text-[#F3E9EC]">{children}</strong>,
                            h3: ({ children }) => <h3 className="font-bold text-sm text-[#B47A9A] mt-2 mb-1">{children}</h3>,
                            h4: ({ children }) => <h4 className="font-bold text-xs text-[#B47A9A] mt-2 mb-1">{children}</h4>,
                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1.5">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-1.5">{children}</ol>,
                            li: ({ children }) => <li className="text-[#F3E9EC]/80">{children}</li>,
                            code: ({ inline, className, children, ...props }: any) => {
                              return inline ? (
                                <code className="bg-[#0B0E1A] text-[#B47A9A] px-1 py-0.5 rounded text-[11px] font-mono border border-[#5E3A5C]">
                                  {children}
                                </code>
                              ) : (
                                <div className="my-2 rounded-lg overflow-hidden border border-[#5E3A5C] bg-[#00030E]">
                                  <div className="px-3 py-1 bg-[#0B0E1A] border-b border-[#5E3A5C] flex items-center justify-between text-[10px] text-[#F3E9EC]/60 font-mono">
                                    <span>Code Solution</span>
                                    <button 
                                      type="button"
                                      onClick={() => handleCopy(String(children).replace(/\n$/, ''), idx)}
                                      className="flex items-center gap-1 hover:text-[#F3E9EC] transition-colors cursor-pointer text-[10px]"
                                    >
                                      {copiedIndex === idx ? <Check className="w-3 h-3 text-[#B47A9A]" /> : <Copy className="w-3 h-3" />}
                                      {copiedIndex === idx ? 'Copied' : 'Copy'}
                                    </button>
                                  </div>
                                  <pre className="p-2.5 text-[11px] font-mono text-[#F3E9EC] overflow-x-auto">
                                    <code>{children}</code>
                                  </pre>
                                </div>
                              );
                            }
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line">{msg.text}</p>
                    )}
                    <span className="text-[8.5px] text-[#F3E9EC]/50 block mt-1 font-mono text-right">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 max-w-[80%] mr-auto">
                  <div className="w-6 h-6 rounded-lg bg-[#5E3A5C] text-[#F3E9EC] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-xl bg-[#2C1B2F] border border-[#5E3A5C] flex items-center gap-1.5 h-9">
                    <span className="w-2 h-2 bg-[#B47A9A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#B47A9A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#B47A9A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Dynamic Suggestion Chips */}
            <div className="p-2 bg-[#0B0E1A] border-t border-[#5E3A5C] flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {[
                { label: 'Clarify JWT Blacklist', query: 'Clarify JWT middleware token blacklisting' },
                { label: 'Optimize SQL Pool', query: 'Optimize PostgreSQL indexing' },
                { label: 'Micro-Gigs Specs', query: 'What are the micro-internship deliverables and stipend?' },
                { label: 'My Skill DNA Score', query: 'Explain my Skill DNA score of 84/100 and Career Readiness 81%' },
                { label: 'Amit Verma TCS Mentor', query: 'How to book 15-min capsule with Mentor Amit Verma TCS?' }
              ].map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(chip.query)}
                  className="text-[10px] font-semibold bg-[#2C1B2F] hover:bg-[#5E3A5C] text-[#F3E9EC] px-2.5 py-1 rounded-lg border border-[#5E3A5C] shrink-0 transition-all cursor-pointer whitespace-nowrap"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-[#0B0E1A] border-t border-[#5E3A5C] flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask Bridge Buddy anything (code, gigs, tech), ${getFirstName()}...`}
                className="flex-1 bg-[#2C1B2F] border border-[#5E3A5C] focus:border-[#B47A9A] text-[#F3E9EC] placeholder-[#F3E9EC]/40 text-xs rounded-xl px-3 py-2 outline-none transition-all"
              />
              <button
                onClick={() => handleSend()}
                className="p-2 rounded-xl bg-[#5E3A5C] hover:bg-[#B47A9A] text-[#F3E9EC] shadow-md transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Bubble */}
      <motion.button
        id="bridge-buddy-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#5E3A5C] hover:bg-[#B47A9A] border border-[#B47A9A]/40 text-[#F3E9EC] flex items-center justify-center shadow-2xl relative cursor-pointer group focus:outline-none focus:ring-4 focus:ring-[#5E3A5C]/30"
        title="Chat with Bridge Buddy (AI Help Desk)"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6" />
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Small notifications dot */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-[#070B1E] flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </span>
        )}
      </motion.button>
    </div>
  );
};

