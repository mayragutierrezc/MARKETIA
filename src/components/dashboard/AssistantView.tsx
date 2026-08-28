import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Trash2,
  ArrowRight,
  Video,
  Calendar,
  Compass,
  Megaphone,
  BarChart3,
  User
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { useApp, DashboardTab } from '../../context/AppContext';
import { ChatMessage } from '../../types';

export const AssistantView: React.FC = () => {
  const {
    chatMessages,
    addChatMessage,
    clearChat,
    business,
    strategy,
    setActiveTab,
    consumeGeneration,
    addToast
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickChips = [
    '¿Qué publico hoy?',
    '¿Cómo vendo más este producto?',
    '¿Qué campaña hago para la temporada?',
    '¿Por qué mis publicaciones no tienen interacción?',
    '¿Cómo uso mejor mi presupuesto?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;
    if (!consumeGeneration()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addChatMessage(userMsg);
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages,
          business,
          strategy
        })
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: data.suggestedAction
      };
      addChatMessage(aiMsg);
    } catch (err) {
      addToast({ type: 'error', title: 'No se pudo conectar con el copiloto' });
    } finally {
      setIsSending(false);
    }
  };

  const handleActionClick = (tab: DashboardTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Top Header - Geometric Balance */}
      <div className="flex items-center justify-between p-5 bg-white rounded-[32px] border border-[#E5E5E1] shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#171717]">
                Asistente IA • MARKETIA
              </h2>
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            </div>
            <p className="text-xs text-[#737373] mt-0.5">
              Contextualizado con la estrategia y objetivos de {business?.name || 'tu negocio'}.
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2.5 rounded-full text-[#737373] hover:text-[#171717] hover:bg-gray-100 transition-colors cursor-pointer border border-[#E5E5E1]"
          title="Reiniciar conversación"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List Area - Geometric Balance */}
      <div className="flex-1 overflow-y-auto p-6 bg-white rounded-[36px] border border-[#E5E5E1] shadow-xs space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                  isUser
                    ? 'bg-[#171717] text-white'
                    : 'bg-[#6C5CE7] text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] space-y-1.5 ${isUser ? 'text-right' : 'text-left'}`}>
                <div
                  className={`p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-[#6C5CE7]/10 text-[#171717] rounded-2xl rounded-tr-none ml-4 border border-[#6C5CE7]/20 font-medium'
                      : 'bg-[#F8F7F4] text-[#171717] rounded-2xl rounded-tl-none border border-[#E5E5E1]'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Suggested Action Button inside bubble */}
                {!isUser && msg.suggestedAction && (
                  <button
                    onClick={() => handleActionClick(msg.suggestedAction!.tab as DashboardTab)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F8F7F4] border border-[#6C5CE7]/40 text-xs font-bold text-[#6C5CE7] transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <span className="text-[10px] text-[#A3A3A3] px-2 block">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-[#F8F7F4] border border-[#E5E5E1] text-xs text-[#737373] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#6C5CE7] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#6C5CE7] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#6C5CE7] animate-bounce [animation-delay:0.4s]" />
              <span>MARKETIA está calculando tu recomendación...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 no-scrollbar">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            disabled={isSending}
            className="px-4 py-2 rounded-full bg-white border border-[#E5E5E1] hover:border-[#6C5CE7]/50 text-xs font-medium text-[#525252] hover:text-[#6C5CE7] whitespace-nowrap transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form Bar - Geometric Balance */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center bg-white p-2 rounded-full border border-[#E5E5E1] shadow-xs shrink-0"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Preguntale a Marketia sobre ${business?.name || 'tu negocio'}...`}
          className="w-full bg-[#F8F7F4] border-none rounded-full px-5 py-3.5 text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none pr-14"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending}
          className="absolute right-3 top-3 bottom-3 w-10 bg-[#6C5CE7] text-white rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
