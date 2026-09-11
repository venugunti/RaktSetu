import React, { useState } from 'react';
import {
  Send,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Paperclip,
  Building2,
  User,
  Heart,
  FileText,
  AlertCircle
} from 'lucide-react';
import { ChatMessage, DonorProfile } from '../types';

interface SecureChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  donorProfile: DonorProfile;
}

export const SecureChat: React.FC<SecureChatProps> = ({
  messages,
  onSendMessage,
  donorProfile
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'st_jude' | 'metro_hub'>('st_jude');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickReplies = [
    'I am en route now (ETA ~15 mins).',
    'I have arrived at Emergency Gate B.',
    'Do I need to fast before donating whole blood?',
    'Please confirm my digital verified donor badge.'
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[640px]">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {selectedChannel === 'st_jude'
                  ? 'St. Jude Level 1 Trauma Center Desk'
                  : 'Metro Red Cross Regional Coordinator'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Staff Online
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Coordinator: Nurse Sharon Jenkins (License #RN-7729)</span>
            </p>
          </div>
        </div>

        {/* Security / Encryption Pill */}
        <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold text-slate-700">256-Bit E2E Encrypted</span>
        </div>
      </div>

      {/* Hospital Channels Selector */}
      <div className="flex border-b border-slate-200 bg-slate-100/60 px-4 py-2 gap-2 text-xs font-semibold">
        <button
          id="channel-st-jude-btn"
          onClick={() => setSelectedChannel('st_jude')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            selectedChannel === 'st_jude'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>Active Trauma Alert (Code Red O-)</span>
        </button>
        <button
          id="channel-metro-hub-btn"
          onClick={() => setSelectedChannel('metro_hub')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            selectedChannel === 'metro_hub'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>General Donor Inquiries</span>
        </button>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        <div className="text-center my-2">
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-200/80 px-3 py-1 rounded-full">
            Hospital Direct Channel Opened Today • Messages Retained for 24h
          </span>
        </div>

        {messages.map((msg) => {
          const isDonor = msg.senderRole === 'DONOR';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isDonor ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800">{msg.senderName}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {isDonor && (
                  <span className="text-emerald-700 font-bold ml-1 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Biometrically Signed
                  </span>
                )}
              </div>

              <div
                className={`max-w-md rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  isDonor
                    ? 'bg-red-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>

                {/* Attachment Badge if any */}
                {msg.attachmentType && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center gap-2 bg-slate-50/80 text-slate-800 p-2 rounded-xl border">
                    <FileText className="w-4 h-4 text-red-600 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold">{msg.attachmentTitle || 'Attachment'}</div>
                      <div className="text-[10px] text-slate-700">Digital Fast-Pass Barcode Included</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Non-technical Quick Replies */}
      <div className="p-3 bg-white border-t border-slate-100">
        <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Quick Responses for Coordinators:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              id={`quick-reply-btn-${idx}`}
              type="button"
              onClick={() => onSendMessage(qr)}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              {qr}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          id="chat-message-input"
          type="text"
          placeholder="Message hospital triage coordinator directly..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 transition-all"
        />
        <button
          id="send-chat-message-btn"
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl shadow-xs transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
