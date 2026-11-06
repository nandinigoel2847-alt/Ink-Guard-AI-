import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ShieldCheck, 
  History, 
  ChevronDown, 
  Sparkles,
  Layers,
  ArrowUp,
  AlertCircle
} from 'lucide-react';
import { BrandKit, AuditResult, ChatConversation, ChatMessage } from '../../types';
import { ChatMessageItem } from './ChatMessageItem';
import { QuickPromptButtons } from './QuickPromptButtons';
import { api } from '../../services/api';

interface ChatbotDrawerProps {
  activeBrandKit: BrandKit;
  latestAudit?: AuditResult | null;
  onBrandKitChange?: (kitId: string) => void;
  brandKits?: BrandKit[];
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  activeBrandKit,
  latestAudit,
  onBrandKitChange,
  brandKits = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations on mount or when opening
  useEffect(() => {
    loadConversations();
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isLoading]);

  const loadConversations = async () => {
    try {
      const list = await api.getChatConversations();
      if (Array.isArray(list) && list.length > 0) {
        setConversations(list);
        if (!activeConversationId) {
          selectConversation(list[0].id);
        }
      } else {
        handleNewConversation();
      }
    } catch (err) {
      console.warn('Failed to load conversations:', err);
    }
  };

  const selectConversation = async (id: string) => {
    setActiveConversationId(id);
    setShowHistoryView(false);
    try {
      const conv = await api.getChatConversation(id);
      if (conv) {
        setCurrentConversation(conv);
      }
    } catch (err) {
      console.warn('Failed to load conversation details:', err);
    }
  };

  const handleNewConversation = async () => {
    try {
      setIsLoading(true);
      const newConv = await api.createChatConversation(activeBrandKit.id);
      if (newConv) {
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
        setCurrentConversation(newConv);
        setShowHistoryView(false);
      }
    } catch (err) {
      console.warn('Failed to create new conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteChatConversation(id);
      const updated = conversations.filter(c => c.id !== id);
      setConversations(updated);
      if (activeConversationId === id) {
        if (updated.length > 0) {
          selectConversation(updated[0].id);
        } else {
          handleNewConversation();
        }
      }
    } catch (err) {
      console.warn('Delete conversation error:', err);
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage || inputText).trim();
    if (!textToSend || isLoading) return;

    setInputText('');
    setErrorMessage(null);
    setIsLoading(true);

    // Optimistic user message preview
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversationId,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
      brandKitId: activeBrandKit.id
    };

    if (currentConversation) {
      setCurrentConversation({
        ...currentConversation,
        messages: [...currentConversation.messages, tempUserMsg]
      });
    }

    try {
      const res = await api.sendChatMessage({
        conversationId: activeConversationId,
        message: textToSend,
        brandKitId: activeBrandKit.id,
        context: {
          channel: latestAudit?.channel || 'General Copy',
          draftSnippet: latestAudit?.currentText?.slice(0, 300) || undefined,
          latestAuditId: latestAudit?.id
        }
      });

      if (res && res.conversationId) {
        setActiveConversationId(res.conversationId);
        // Refresh conversation details
        const updatedConv = await api.getChatConversation(res.conversationId);
        setCurrentConversation(updatedConv);
        // Refresh list
        loadConversations();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'AI assistant is currently responding via fallback rules.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearCurrentConversation = async () => {
    if (!activeConversationId) return;
    try {
      await api.deleteChatConversation(activeConversationId);
      setShowClearConfirm(false);
      handleNewConversation();
    } catch (e) {
      console.warn('Clear conversation error:', e);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right, Zero Obstruction) */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-full shadow-xl shadow-indigo-950/60 border border-indigo-400/40 transition-all hover:scale-105 group"
            title="Open InkGuard AI Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold tracking-tight">InkGuard AI Assistant</div>
              <div className="text-[10px] text-indigo-200">Brand Governance Companion</div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1 shrink-0" />
          </button>
        )}
      </div>

      {/* Main Chat Drawer / Popover Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-slate-100">
          
          {/* Header Bar */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white tracking-tight">InkGuard AI Assistant</h3>
                  <span className="text-[10px] text-slate-500">·</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-medium">Ready</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[210px]">
                  Kit: <strong className="text-indigo-300">{activeBrandKit.name}</strong>
                </div>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowHistoryView(!showHistoryView)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showHistoryView ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Conversation History"
              >
                <History className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNewConversation}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="New Conversation"
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body: History View OR Message Stream */}
          {showHistoryView ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/60">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-2">
                <span className="font-semibold text-slate-300">Saved Conversations</span>
                <button
                  type="button"
                  onClick={handleNewConversation}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium text-[11px]"
                >
                  <Plus className="w-3 h-3" /> New Chat
                </button>
              </div>

              {conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No saved conversations found.
                </div>
              ) : (
                conversations.map(c => (
                  <div
                    key={c.id}
                    onClick={() => selectConversation(c.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      activeConversationId === c.id
                        ? 'bg-slate-800 border-indigo-500/70 text-white'
                        : 'bg-slate-950/70 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate">{c.title || 'Conversation'}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {new Date(c.updatedAt).toLocaleDateString()} · {c.messageCount || 1} msgs
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteConversation(c.id, e)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                      title="Delete Conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
              
              {/* Message List */}
              {currentConversation?.messages.map(msg => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))}

              {/* Typing / Loading indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
                  <span>InkGuard AI Assistant is analyzing brand evidence...</span>
                </div>
              )}

              {/* Error Notice */}
              {errorMessage && (
                <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{errorMessage}</span>
                </div>
              )}

              {/* Quick Prompts shown if conversation is fresh (<= 2 msgs) */}
              {(!currentConversation || currentConversation.messages.length <= 1) && !isLoading && (
                <QuickPromptButtons
                  onSelectPrompt={(text) => handleSendMessage(text)}
                  disabled={isLoading}
                />
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Footer Input Area */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0 space-y-2">
            <div className="relative flex items-center gap-2">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about brand rules, tone, or paste copy to rewrite..."
                className="flex-1 p-2.5 pr-10 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none max-h-24 overflow-y-auto"
              />

              <button
                type="button"
                disabled={!inputText.trim() || isLoading}
                onClick={() => handleSendMessage()}
                className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
                title="Send Message (Enter)"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Meta & Clear Option */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
              <span>Press <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for newline</span>

              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="hover:text-rose-400 transition-colors"
              >
                Clear Chat
              </button>
            </div>

            {/* Clear Confirmation Prompt */}
            {showClearConfirm && (
              <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs space-y-2">
                <p className="text-slate-300 text-[11px]">Clear all messages in this conversation?</p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCurrentConversation}
                    className="px-2.5 py-1 text-[11px] bg-rose-600 text-white rounded font-medium hover:bg-rose-500"
                  >
                    Confirm Clear
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </>
  );
};
