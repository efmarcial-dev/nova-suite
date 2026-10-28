'use client';

import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, MessageSquareText, Plus, Send, Sparkles, Trash2, UserRound } from 'lucide-react';
import { fetchWithAuthRefresh } from '@/app/lib/api/fetchWithAuthRefresh';

type Conversation = {
  id: string;
  title: string;
  updated_at: string;
};

type ChatMessage = {
  id: number | string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  provider?: string;
  model?: string;
};

async function readResponse(response: Response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail || payload.error || 'The chat request failed. Please try again.');
  }
  return payload;
}

export default function ChatWorkspace() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadConversation = useCallback(async (conversation: Conversation) => {
    setActiveConversation(conversation);
    setMessages([]);
    setIsLoadingConversation(true);
    setError(null);
    try {
      const response = await fetchWithAuthRefresh(`/api/chat/conversations/${conversation.id}`);
      const payload = await readResponse(response);
      setActiveConversation(payload.conversation || conversation);
      setMessages(payload.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this conversation.');
    } finally {
      setIsLoadingConversation(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      setIsLoadingHistory(true);
      try {
        const response = await fetchWithAuthRefresh('/api/chat/conversations');
        const payload = await readResponse(response);
        if (!active) return;
        const items: Conversation[] = payload.conversations || [];
        setConversations(items);
        if (items.length) await loadConversation(items[0]);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Could not load your chat history.');
      } finally {
        if (active) setIsLoadingHistory(false);
      }
    })();
    return () => { active = false; };
  }, [loadConversation]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending]);

  const startNewChat = () => {
    setActiveConversation(null);
    setMessages([]);
    setPrompt('');
    setError(null);
  };

  const deleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    try {
      await fetchWithAuthRefresh(`/api/chat/conversations/${conversationId}`, { method: 'DELETE' });
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (activeConversation?.id === conversationId) {
        startNewChat();
      }
    } catch (err) {
      console.warn('Failed to delete conversation:', err);
    }
  };

  const sendPrompt = async (event?: FormEvent) => {
    event?.preventDefault();
    const content = prompt.trim();
    if (!content || isSending) return;

    setPrompt('');
    setError(null);
    setIsSending(true);
    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((current) => [...current, optimistic]);

    try {
      let conversation = activeConversation;
      if (!conversation) {
        const createResponse = await fetchWithAuthRefresh('/api/chat/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const created = await readResponse(createResponse);
        conversation = (created.conversation as Conversation) || null;
        if (!conversation?.id) throw new Error('Could not start a new conversation.');
        setActiveConversation(conversation);
      }

      const response = await fetchWithAuthRefresh(`/api/chat/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const payload = await readResponse(response);
      setActiveConversation(payload.conversation || conversation);
      setMessages((current) => [
        ...current.filter((item) => item.id !== optimistic.id),
        ...(payload.messages || [payload.user_message, payload.assistant_message]).filter(Boolean),
      ]);

      const listResponse = await fetchWithAuthRefresh('/api/chat/conversations');
      const listPayload = await readResponse(listResponse);
      setConversations(listPayload.conversations || []);
    } catch (err) {
      setMessages((current) => current.filter((item) => item.id !== optimistic.id));
      setPrompt(content);
      setError(err instanceof Error ? err.message : 'Foxly could not respond just now.');
    } finally {
      setIsSending(false);
    }
  };

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendPrompt();
    }
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] min-h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50/80">
        <div className="border-b border-slate-200 p-4">
          <button
            type="button"
            onClick={startNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0088EE]"
          >
            <Plus size={16} /> New chat
          </button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          <p className="px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Recent chats</p>
          {isLoadingHistory ? (
            <div className="flex items-center gap-2 px-3 py-4 text-xs text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading chats</div>
          ) : conversations.length ? conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => void loadConversation(conversation)}
              className={`group flex items-center justify-between w-full rounded-lg px-3 py-2 text-left text-xs transition cursor-pointer ${activeConversation?.id === conversation.id ? 'bg-white font-semibold text-[#1EA0FF] shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:bg-white hover:text-slate-950'}`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <MessageSquareText className="h-4 w-4 shrink-0 opacity-70" />
                <span className="truncate">{conversation.title || 'New conversation'}</span>
              </div>
              <button
                type="button"
                onClick={(e) => void deleteConversation(e, conversation.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition"
                title="Delete chat"
                aria-label="Delete chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )) : (
            <p className="px-3 py-3 text-xs leading-relaxed text-slate-400">Your saved conversations will show up here.</p>
          )}
        </div>
        <div className="border-t border-slate-200 p-3 text-[10px] text-slate-400">AI responses may need review.</div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F9FF] text-[#1EA0FF]"><Sparkles className="h-4.5 w-4.5" /></div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-slate-900">{activeConversation?.title || 'Foxly AI Chat'}</h1>
            <p className="text-[11px] text-slate-500">Private to your account · Hugging Face with automatic AI fallback</p>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          {isLoadingConversation ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading conversation…</div>
          ) : messages.length ? (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((message) => (
                <article key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${message.role === 'assistant' ? 'bg-[#1EA0FF] text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {message.role === 'assistant' ? <Bot size={16} /> : <UserRound size={16} />}
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'assistant' ? 'bg-slate-50 text-slate-800 ring-1 ring-slate-100' : 'bg-[#1EA0FF] text-white'}`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && message.provider && (
                      <p className="mt-2 border-t border-slate-200 pt-1.5 text-[10px] text-slate-400">{message.provider}{message.model ? ` · ${message.model}` : ''}</p>
                    )}
                  </div>
                </article>
              ))}
              {isSending && (
                <div className="flex items-center gap-3 text-sm text-slate-500"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1EA0FF] text-white"><Bot size={16} /></div><span className="animate-pulse">Foxly is thinking…</span></div>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F9FF] text-[#1EA0FF]"><Sparkles className="h-7 w-7" /></div>
              <h2 className="text-xl font-bold text-slate-900">What can I help you with?</h2>
              <p className="mt-2 max-w-md text-sm text-slate-500">Ask Foxly to think through a problem, summarize information, or help plan your next steps.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['Help me plan my day', 'Draft a project plan', 'Summarize a complex topic'].map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => setPrompt(suggestion)} className="rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-600 transition hover:border-[#BFE7FF] hover:bg-[#F0F9FF] hover:text-[#0088EE]">{suggestion}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 px-4 py-4 sm:px-8">
          {error && <p role="alert" className="mx-auto mb-3 max-w-3xl rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
          <form onSubmit={(event) => void sendPrompt(event)} className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-[#80CFFF] focus-within:ring-4 focus-within:ring-[#F0F9FF]">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={onComposerKeyDown}
                placeholder="Message Foxly…"
                rows={1}
                maxLength={12000}
                disabled={isSending || isLoadingConversation}
                className="max-h-40 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
              />
              <button type="submit" disabled={!prompt.trim() || isSending || isLoadingConversation} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1EA0FF] text-white transition hover:bg-[#0088EE] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">
                {isSending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400">Enter to send · Shift+Enter for a new line</p>
          </form>
        </div>
      </section>
    </div>
  );
}
