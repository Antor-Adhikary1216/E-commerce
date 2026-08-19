"use client";
import { useEffect, useState, useRef } from "react";
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  X,
  ChevronDown,
  Circle,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/services/api-client";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationItem {
  _id: string;
  user: { _id: string; name: string; email: string; avatar?: string };
  admin?: { _id: string; name: string; email: string };
  subject: string;
  status: "open" | "waiting" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  messages: {
    _id: string;
    sender: string;
    content: string;
    isAdmin: boolean;
    read: boolean;
    createdAt: string;
  }[];
  lastMessageAt: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const statusColors: Record<string, string> = {
  open: "bg-[#e6f7ff] text-[#0050b3]",
  waiting: "bg-[#fff7e6] text-[#d48806]",
  closed: "bg-[#f6ffed] text-[#389e0d]",
};

const statusIcons: Record<string, typeof Circle> = {
  open: Circle,
  waiting: Clock,
  closed: CheckCircle2,
};

const priorityColors: Record<string, string> = {
  low: "bg-[#f5f5f5] text-[#8c8c8c]",
  medium: "bg-[#e6f7ff] text-[#1677ff]",
  high: "bg-[#fff7e6] text-[#d48806]",
  urgent: "bg-[#fff2f0] text-[#cf1322]",
};

export default function AdminConversationsPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, [pagination.page, statusFilter]);

  useEffect(() => {
    if (selectedConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation?.messages]);

  async function fetchConversations() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);

      const { data } = await apiClient.get(`/admin/conversations?${params.toString()}`);
      setConversations(data.conversations || []);
      setPagination(data.pagination);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleSendReply() {
    if (!selectedConversation || !replyText.trim() || sending) return;

    setSending(true);
    try {
      const { data } = await apiClient.post(`/admin/conversations/${selectedConversation._id}/messages`, {
        content: replyText.trim(),
      });
      setSelectedConversation(data.conversation);
      setReplyText("");
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(conversationId: string, status: string) {
    try {
      const { data } = await apiClient.put(`/admin/conversations/${conversationId}/status`, { status });
      setConversations((prev) =>
        prev.map((c) => (c._id === conversationId ? { ...c, status: data.conversation.status } : c))
      );
      if (selectedConversation?._id === conversationId) {
        setSelectedConversation((prev) => (prev ? { ...prev, status: data.conversation.status } : null));
      }
    } catch {
      // ignore
    }
  }

  const filteredConversations = conversations.filter(
    (c) =>
      c.user.name.toLowerCase().includes(search.toLowerCase()) ||
      c.user.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && conversations.length === 0) {
    return (
      <div className="flex h-[calc(100vh-120px)] gap-0">
        <div className="w-[350px] shrink-0 border-r border-[#f0f0f0] bg-white p-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-4 h-10 w-full rounded-lg" />
          <div className="mt-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-lg border border-[#f0f0f0] p-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-3 w-32" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-6">
          <Skeleton className="h-7 w-48" />
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-0">
      {/* Conversations List */}
      <div className="w-[350px] shrink-0 border-r border-[#f0f0f0] bg-white flex flex-col">
        <div className="p-4 border-b border-[#f0f0f0]">
          <div className="flex items-center justify-between">
            <h1 className="text-[16px] font-semibold text-[#262626]">Customer Care</h1>
            <span className="rounded-full bg-[#e6f7ff] px-2 py-0.5 text-[11px] font-medium text-[#1677ff]">
              {pagination.total}
            </span>
          </div>

          <div className="mt-3 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c8c]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="h-9 w-full rounded-lg border border-[#f0f0f0] bg-[#fafafb] pl-9 pr-4 text-[12px] text-[#262626] placeholder:text-[#8c8c8c] focus:border-[#1677ff] focus:outline-none"
            />
          </div>

          <div className="mt-3 flex gap-2">
            {["", "open", "waiting", "closed"].map((status) => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setPagination((p) => ({ ...p, page: 1 })); }}
                className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-[#1677ff] text-white"
                    : "bg-[#f5f5f5] text-[#8c8c8c] hover:bg-[#e6f7ff] hover:text-[#1677ff]"
                }`}
              >
                {status || "All"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#8c8c8c]">
              <MessageSquare size={32} className="mb-2 opacity-50" />
              <p className="text-[13px]">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const lastMessage = conv.messages[conv.messages.length - 1];
              const isSelected = selectedConversation?._id === conv._id;
              const StatusIcon = statusIcons[conv.status] || Circle;

              return (
                <div
                  key={conv._id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`cursor-pointer border-b border-[#f0f0f0] p-4 transition-colors ${
                    isSelected ? "bg-[#e6f7ff]" : "hover:bg-[#fafafb]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-[#8c8c8c] text-[13px] font-medium">
                        {conv.user.avatar ? (
                          <img src={conv.user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          conv.user.name?.charAt(0) || "C"
                        )}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                        conv.status === "open" ? "bg-[#389e0d]" : conv.status === "waiting" ? "bg-[#d48806]" : "bg-[#8c8c8c]"
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-medium text-[#262626] truncate">{conv.user.name}</p>
                        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${statusColors[conv.status]}`}>
                          {conv.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8c8c8c] truncate">{conv.subject}</p>
                      {lastMessage && (
                        <p className="mt-1 text-[12px] text-[#8c8c8c] truncate">
                          {lastMessage.isAdmin ? "You: " : ""}{lastMessage.content}
                        </p>
                      )}
                      <p className="mt-1 text-[10px] text-[#bfbfbf]">
                        {new Date(conv.lastMessageAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {!selectedConversation ? (
          <div className="flex flex-1 flex-col items-center justify-center text-[#8c8c8c]">
            <MessageSquare size={48} className="mb-3 opacity-30" />
            <p className="text-[14px]">Select a conversation to start chatting</p>
            <p className="mt-1 text-[12px]">Choose from the list on the left</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-[#8c8c8c] text-[13px] font-medium">
                  {selectedConversation.user.avatar ? (
                    <img src={selectedConversation.user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    selectedConversation.user.name?.charAt(0) || "C"
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#262626]">{selectedConversation.user.name}</p>
                  <p className="text-[12px] text-[#8c8c8c]">{selectedConversation.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-[11px] font-medium capitalize ${statusColors[selectedConversation.status]}`}>
                  {selectedConversation.status}
                </span>
                <span className={`rounded-full px-2 py-1 text-[11px] font-medium capitalize ${priorityColors[selectedConversation.priority]}`}>
                  {selectedConversation.priority}
                </span>
                <div className="relative ml-2">
                  <select
                    value={selectedConversation.status}
                    onChange={(e) => handleStatusChange(selectedConversation._id, e.target.value)}
                    className="h-8 rounded-lg border border-[#f0f0f0] bg-white px-2 pr-6 text-[12px] text-[#262626] appearance-none focus:border-[#1677ff] focus:outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="waiting">Waiting</option>
                    <option value="closed">Closed</option>
                  </select>
                  <ChevronDown size={12} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8c8c8c]" />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.isAdmin
                        ? "bg-[#1677ff] text-white"
                        : "bg-[#f5f5f5] text-[#262626]"
                    }`}
                  >
                    <p className="text-[13px] leading-[20px]">{msg.content}</p>
                    <p className={`mt-1 text-[10px] ${msg.isAdmin ? "text-white/60" : "text-[#8c8c8c]"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            {selectedConversation.status !== "closed" && (
              <div className="border-t border-[#f0f0f0] px-6 py-4">
                <div className="flex items-end gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    placeholder="Type your reply..."
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-[#f0f0f0] bg-[#fafafb] px-4 py-3 text-[13px] text-[#262626] placeholder:text-[#8c8c8c] focus:border-[#1677ff] focus:outline-none focus:ring-1 focus:ring-[#1677ff]/30"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || sending}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1677ff] text-white transition-colors hover:bg-[#1259c3] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-[#8c8c8c]">Press Enter to send, Shift+Enter for new line</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}