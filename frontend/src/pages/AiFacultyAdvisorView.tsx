import React, { useState, useRef, useEffect } from 'react';
import { BaseFacultyView } from '../components/BaseFacultyView';
import { Bot, Send, Loader2 } from 'lucide-react';

export const AiFacultyAdvisorView: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([{ role: 'bot', text: 'How can I assist with your academic duties today?' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const newMessages = [...messages, { role: 'user' as const, text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    let botResponse = '';
    setMessages([...newMessages, { role: 'bot', text: '...' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              botResponse += data.text;
              setMessages([...newMessages, { role: 'bot', text: botResponse }]);
            }
          }
        }
      }
    } catch (e) {
      setMessages([...newMessages, { role: 'bot', text: 'Something went wrong, please try again' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Identify at-risk students",
    "Summarize mentorship activity",
    "Analyze curriculum compliance",
    "Suggest FDP topics"
  ];

  return (
    <BaseFacultyView title="AI Faculty Advisor" description="Your intelligent assistant for academic planning.">
      <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`text-xs p-3 rounded-lg max-w-[80%] ${m.role === 'bot' ? 'bg-[#1E2964] text-white' : 'bg-[#7C5CFC] text-white self-end'}`}>{m.text}</div>
          ))}
          {isLoading && <Loader2 className="animate-spin w-5 h-5 text-indigo-400" />}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
            {suggestions.map(s => (
                <button key={s} onClick={() => sendMessage(s)} className="bg-[#1E2964] text-slate-300 text-[10px] p-2 rounded-lg hover:text-white">
                    {s}
                </button>
            ))}
        </div>

        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
            disabled={isLoading}
            className="flex-1 bg-[#0B1033] border border-[#1E2964] rounded-lg p-2 text-xs text-white" 
            placeholder="Ask a question..." 
          />
          <button onClick={() => sendMessage(input)} disabled={isLoading} className="bg-[#7C5CFC] p-2 rounded-lg text-white disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </BaseFacultyView>
  );
};
