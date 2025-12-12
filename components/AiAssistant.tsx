import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, User } from 'lucide-react';
import { getSafetyChatResponse } from '../services/geminiService';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Halo! Saya asisten keamanan AI Siskamling. Ada yang bisa saya bantu terkait keamanan lingkungan?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const aiResponse = await getSafetyChatResponse(userMsg, messages.map(m => m.text));
    
    setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)]">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-xl mb-4 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Safety AI Assistant</h2>
            <p className="text-indigo-100 text-xs">Powered by Gemini 2.5</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-2 no-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
               <Loader2 size={16} className="animate-spin text-gray-500" />
               <span className="text-xs text-gray-500">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya tips keamanan..."
          className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm"
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default AiAssistant;