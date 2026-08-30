import React, { useState, useEffect, useRef } from 'react';
import { 
  HelpCircle, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Bot,
  Flame,
  FileText
} from 'lucide-react';
import { StudentProfile, HelpdeskTicket, FAQItem } from '../types';
import { sendHelpdeskChat, fetchFaqs, createTicket, fetchTickets } from '../services/api';

interface AIHelpdeskProps {
  student: StudentProfile | null;
}

export const AIHelpdeskView: React.FC<AIHelpdeskProps> = ({ student }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'faqs' | 'tickets'>('chat');
  
  // Chat State
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello ${student?.name?.split(' ')[0] || 'there'}! I am your **SkillBridge AI Technical Advisor**. \n\nI can help you debug Express/Postgres code, clarify micro-internship deliverables, or prepare questions for your next 15-minute mentor capsule. How can I assist you today?`,
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // FAQ State
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);
  const [faqCategory, setFaqCategory] = useState('all');

  // Ticket State
  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState('technical');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [ticketDesc, setTicketDesc] = useState('');

  useEffect(() => {
    fetchFaqs().then((data) => {
      if (data && data.faqs) setFaqs(data.faqs);
    });
    fetchTickets().then((data) => {
      if (Array.isArray(data)) setTickets(data);
    });
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setIsAiTyping(true);

    try {
      const res = await sendHelpdeskChat(textToSend, messages, 'technical', student || {});
      const aiReply = res?.reply || "I've analyzed your question and logged it. Check the recommendations below.";
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai' as const,
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai' as const,
          text: 'I encountered a brief network delay. Please verify your connection or review our FAQ section!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle || !ticketDesc) return;

    try {
      const res = await createTicket({
        title: ticketTitle,
        category: ticketCategory,
        description: ticketDesc,
        priority: ticketPriority,
        studentId: student?.id || 1
      });

      if (res && res.ticket) {
        setTickets(prev => [res.ticket, ...prev]);
      }
      setIsTicketModalOpen(false);
      setTicketTitle('');
      setTicketDesc('');
    } catch (e) {
      console.warn('Error creating ticket:', e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-5 h-5 text-violet-400" />
            <h1 className="text-xl font-extrabold text-white">AI Help Desk & Technical Advisor</h1>
          </div>
          <p className="text-xs text-slate-300">
            Powered by Gemini AI for rapid root cause debugging, micro-internship clarifications, and instant ticket resolution.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'chat' ? 'bg-[#7C5CFC] text-white shadow-md' : 'bg-[#141C48] text-slate-300 hover:text-white'
            }`}
          >
            Live AI Counselor
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'faqs' ? 'bg-[#7C5CFC] text-white shadow-md' : 'bg-[#141C48] text-slate-300 hover:text-white'
            }`}
          >
            Instant FAQs
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tickets' ? 'bg-[#7C5CFC] text-white shadow-md' : 'bg-[#141C48] text-slate-300 hover:text-white'
            }`}
          >
            My Support Tickets ({tickets.length})
          </button>
        </div>
      </div>

      {/* 1. LIVE CHAT COUNSELOR */}
      {activeTab === 'chat' && (
        <div className="rounded-2xl bg-[#090E2A] border border-[#1E2964] overflow-hidden flex flex-col h-[560px] shadow-xl">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-[#7C5CFC] text-white'
                    : 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#7C5CFC] text-white rounded-tr-none'
                    : 'bg-[#0E1538] border border-[#1E2964] text-slate-200 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div className={`text-[9.5px] mt-2 font-mono ${msg.sender === 'user' ? 'text-purple-200 text-right' : 'text-slate-400'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex gap-3 max-w-lg mr-auto animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#0E1538] border border-[#1E2964] text-xs text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                  <span>Gemini AI is analyzing diagnostic context...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="p-3 bg-[#0B1033] border-t border-[#18214D] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Suggestions:</span>
            {[
              "Database connection timeout error",
              "How to prepare for a 15-min mentor capsule?",
              "Clarify JWT middleware token blacklisting"
            ].map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="text-[11px] font-medium bg-[#141D4E] hover:bg-[#1D296C] text-[#C4B5FD] px-2.5 py-1 rounded-lg border border-[#232F6E] shrink-0 transition-all"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3.5 bg-[#090E2A] border-t border-[#18214D] flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything about coding tasks, JWT auth, database queries, or mentor feedback..."
              className="flex-1 bg-[#0E1538] border border-[#1E2964] focus:border-[#7C5CFC] text-white text-xs rounded-xl px-4 py-2.5 outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. FAQS */}
      {activeTab === 'faqs' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            {['all', 'gigs', 'technical', 'mentorship', 'career'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFaqCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  faqCategory === cat ? 'bg-[#7C5CFC] text-white' : 'bg-[#0E1538] border border-[#1E2964] text-slate-300'
                }`}
              >
                {cat === 'all' ? 'All Topics' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {faqs
              .filter(f => faqCategory === 'all' || f.category === faqCategory)
              .map((faq) => (
                <div
                  key={faq.id}
                  className="rounded-xl bg-[#0E1538] border border-[#1E2964] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-white hover:text-[#C4B5FD] transition-colors"
                  >
                    <span>{faq.question}</span>
                    {openFaqId === faq.id ? <ChevronUp className="w-4 h-4 text-[#A78BFA]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {openFaqId === faq.id && (
                    <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-[#18214D] pt-3 bg-[#0B1033]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Help Desk Tickets</h2>
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Diagnostic Ticket</span>
            </button>
          </div>

          {tickets.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#0E1538] border border-[#1E2964] text-center text-xs text-slate-400">
              No open tickets. Need help? Click "Create Diagnostic Ticket" above.
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{ticket.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      {ticket.status} · {ticket.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{ticket.description}</p>
                  {ticket.ai_summary && (
                    <div className="p-2.5 rounded-lg bg-[#0A0F2E] border border-[#1B255C] text-[11px] text-cyan-300">
                      💡 <strong>AI Immediate Diagnostic:</strong> {ticket.ai_summary}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsTicketModalOpen(false)} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#0A0F2E] border border-[#1E2964] rounded-2xl p-6 z-10 animate-fade-in shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-4">Submit Help Desk Diagnostic Ticket</h3>
            
            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder="e.g. PostgreSQL pool timeout during micro-gig build"
                  className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-4 py-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="technical">Technical / Code Bug</option>
                    <option value="gigs">Micro-Internship Task</option>
                    <option value="mentorship">Mentor Capsule</option>
                    <option value="passport">Passport Verification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Error Logs & Description</label>
                <textarea
                  required
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  rows={4}
                  placeholder="Paste error logs, stack traces, or step-by-step reproduction details."
                  className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-4 py-2.5 outline-none resize-none font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#141D4E] text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold shadow"
                >
                  Submit & Run AI Diagnostic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
