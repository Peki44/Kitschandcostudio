import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, ChatRole, Category, Product } from '../types';

interface ConciergeProps {
  categories: Category[];
  products: Product[];
}

export const Concierge: React.FC<ConciergeProps> = ({ categories, products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: ChatRole.MODEL, text: 'Bok! Ja sam vaš Kitsch asistent. Trebate li pomoć oko odabira savršenog poklona ili kozmetike?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: ChatRole.USER, text: userMsg }]);
    setIsLoading(true);

    // Format history for Gemini
    const history = messages.map(m => ({
      role: m.role === ChatRole.USER ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const responseText = await sendMessageToGemini(userMsg, history, { categories, products });

    setMessages(prev => [...prev, { role: ChatRole.MODEL, text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-cardboard border-2 border-neonPink shadow-[8px_8px_0px_0px_rgba(255,0,255,0.2)] flex flex-col h-[500px] transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="bg-neonPink text-white p-3 flex justify-between items-center border-b-2 border-black">
            <h3 className="font-display font-bold text-lg tracking-wide uppercase">Kitsch Concierge</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-black transition-colors">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cardboard">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === ChatRole.USER ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 text-sm font-sans border border-black ${
                  msg.role === ChatRole.USER 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neonGreen text-black text-xs px-2 py-1 border border-black animate-pulse">
                  RAZMIŠLJAM...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t-2 border-black bg-white flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pitajte me bilo što..."
              className="flex-1 bg-transparent outline-none font-sans text-black placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="ml-2 text-neonPink font-bold hover:text-black transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-neonGreen text-black border-2 border-black w-14 h-14 flex items-center justify-center hover:bg-black hover:text-neonGreen hover:border-neonGreen transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        {!isOpen ? (
          <span className="font-display font-bold text-2xl">?</span>
        ) : (
          <span className="font-display font-bold text-xl">✕</span>
        )}
      </button>
    </div>
  );
};