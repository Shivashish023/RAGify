import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import {
  getPublicConversation,
  getVisitorConversations,
  getPublicOrganization,
  sendPublicMessage,
  startPublicChat,
} from "../services/publicService";
import {
  clearChatSession,
  getStoredChatSession,
  saveChatSession,
} from "../utils/chatSessionStorage";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { Field, Input } from "../components/ui/Input";
import { Eyebrow } from "../components/ui/PageHeader";
import LeadForm from "../components/chat/LeadForm";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatMessages from "../components/chat/ChatMessages";

function PublicChat() {
  const { slug } = useParams();
  const [organization, setOrganization] = useState(null);
  const [status, setStatus] = useState("loading");
  const [visitor, setVisitor] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [historyStatus, setHistoryStatus] = useState("idle");
  const [showHistory, setShowHistory] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ragify_chat_sidebar");
    if (stored === "0") {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeChat() {
      setStatus("loading");
      setError("");
      setVisitor(null);
      setConversation(null);
      setMessages([]);
      setHasStartedChat(false);

      try {
        const org = await getPublicOrganization(slug);
        if (cancelled) {
          return;
        }

        setOrganization(org);

        const storedSession = getStoredChatSession(slug);

        if (storedSession?.visitorId && storedSession?.conversationId) {
          try {
            const restored = await getPublicConversation(
              slug,
              storedSession.conversationId,
              storedSession.visitorId,
            );

            if (cancelled) {
              return;
            }

            if (restored.conversation.status !== "active") {
              clearChatSession(slug);
            } else {
              setVisitor(restored.visitor);
              setConversation(restored.conversation);
              setMessages(restored.messages);
              setHasStartedChat(true);
              setLeadForm({
                name: restored.visitor.name || "",
                email: restored.visitor.email || "",
              });
            }
          } catch {
            if (!cancelled) {
              clearChatSession(slug);
            }
          }
        } else if (storedSession?.visitorId) {
          setVisitor({ id: storedSession.visitorId });
        }

        if (!cancelled) {
          setStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    initializeChat();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      if (!visitor?.id) {
        setConversations([]);
        setHistoryStatus("idle");
        return;
      }

      setHistoryStatus("loading");
      try {
        const data = await getVisitorConversations(slug, visitor.id);
        if (!cancelled) {
          setConversations(data.conversations || []);
          setHistoryStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setHistoryStatus("error");
        }
      }
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [slug, visitor?.id]);

  const handleLeadChange = (event) => {
    const { name, value } = event.target;
    setLeadForm((current) => ({ ...current, [name]: value }));
  };

  const handleStartChat = async (event) => {
    event.preventDefault();
    setError("");
    setIsStarting(true);

    try {
      const data = await startPublicChat(slug, leadForm);
      setVisitor(data.visitor);
      saveChatSession(slug, {
        visitorId: data.visitor.id,
      });
      setShowHistory(false);
      setHasStartedChat(true);
      setMessages([
        {
          id: "welcome",
          sender: "assistant",
          content: `Hi ${data.visitor.name}, how can I help you today?`,
        },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to start chat");
    } finally {
      setIsStarting(false);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    const pendingMessage = {
      id: `pending-${Date.now()}`,
      sender: "visitor",
      content: message.trim(),
    };

    setError("");
    setMessage("");
    setMessages((current) => [...current, pendingMessage]);
    setIsSending(true);

    try {
      const data = await sendPublicMessage(slug, {
        conversationId: conversation?.id,
        visitorId: visitor.id,
        message: pendingMessage.content,
      });

      if (!conversation?.id && data.conversation?.id) {
        setConversation(data.conversation);
        saveChatSession(slug, { visitorId: visitor.id, conversationId: data.conversation.id });
      }

      setMessages((current) => [
        ...current.filter((item) => item.id !== pendingMessage.id),
        data.visitorMessage,
        data.assistantMessage,
      ]);
    } catch (err) {
      setMessages((current) => current.filter((item) => item.id !== pendingMessage.id));
      setError(err.response?.data?.message || "Unable to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleStartNewChat = async () => {
    if (!visitor?.email || !visitor?.name) {
      return;
    }

    setError("");
    setIsStarting(true);

    try {
      const data = await startPublicChat(slug, { name: visitor.name, email: visitor.email });
      saveChatSession(slug, {
        visitorId: visitor.id,
      });
      setShowHistory(false);
      setConversation(null);
      setHasStartedChat(true);
      setMessages([
        {
          id: "welcome",
          sender: "assistant",
          content: `Hi ${visitor.name}, how can I help you today?`,
        },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to start a new chat");
    } finally {
      setIsStarting(false);
    }
  };

  const handleSwitchConversation = async (conversationId) => {
    if (!visitor?.id) {
      return;
    }

    setError("");
    setIsSending(false);
    setShowHistory(false);
    setMessages([]);

    try {
      const restored = await getPublicConversation(slug, conversationId, visitor.id);
      if (restored.conversation.status !== "active") {
        clearChatSession(slug);
        setConversation(null);
        setMessages([]);
        return;
      }

      setConversation(restored.conversation);
      setMessages(restored.messages);
      saveChatSession(slug, { visitorId: visitor.id, conversationId });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load that conversation");
    }
  };

  const loadingLabel = getStoredChatSession(slug) ? "Restoring your chat..." : "Loading chatbot...";

  return (
    <PageShell variant="chat">
      <section className="mx-auto flex h-screen max-w-5xl flex-col px-5 py-8 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm font-semibold text-ink-muted transition-colors hover:text-white"
          >
            ← RAGify
          </Link>
          {organization ? (
            <span className="rounded-full bg-success-bg/60 border border-success/30 px-3 py-1 text-xs font-semibold text-success">
              Support online
            </span>
          ) : null}
        </div>

        <Card className="flex flex-1 min-h-0 flex-col overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-[var(--shadow-glow)] animate-fade-up">
          <CardBody className="flex flex-1 min-h-0 flex-col p-0 sm:p-0">
            {status === "loading" && (
              <div className="p-8">
                <p className="text-sm font-medium text-ink-muted">{loadingLabel}</p>
              </div>
            )}

            {status === "error" && (
              <div className="p-8">
                <Eyebrow>Not found</Eyebrow>
                <h1 className="mt-3 font-display text-3xl font-semibold text-white">
                  This chatbot is not available.
                </h1>
                <Link to="/" className="mt-6 inline-block">
                  <Button variant="secondary">Back to RAGify</Button>
                </Link>
              </div>
            )}

            {status === "ready" && (
              <>
                <div className="border-b border-white/5 bg-linear-to-r from-brand/10 to-transparent px-6 py-6 sm:px-8">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Eyebrow>Document support gateway</Eyebrow>
                      <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                        {organization.name}
                      </h1>
                      <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                        Ask questions about products, guidelines, and policies — answers are grounded in our document repository.
                      </p>
                    </div>
                    {hasStartedChat && visitor ? (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="md:hidden"
                          onClick={() => setShowHistory((current) => !current)}
                        >
                          History
                        </Button>
                         <button
                          type="button"
                          className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/60 hover:bg-brand-light border border-white/5 text-ink-muted hover:text-white cursor-pointer transition duration-200 shadow-sm"
                          onClick={() => {
                            setIsSidebarOpen((current) => {
                              const next = !current;
                              localStorage.setItem("ragify_chat_sidebar", next ? "1" : "0");
                              return next;
                            });
                          }}
                          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform duration-200"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M9 3v18" />
                            {isSidebarOpen ? (
                              <path d="m16 15-3-3 3-3" />
                            ) : (
                              <path d="m13 15 3-3-3-3" />
                            )}
                          </svg>
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-1 min-h-0 flex-col p-6 sm:p-8">
                  <div className="flex flex-1 min-h-0 flex-col gap-5 md:flex-row md:items-stretch">
                    {hasStartedChat && visitor && isSidebarOpen ? (
                      <aside className="hidden md:flex md:flex-col">
                        <div className="flex w-[300px] min-h-0 flex-1 flex-col rounded-2xl border border-white/5 bg-slate-950/20 p-4">
                          <ChatSidebar
                            conversations={conversations}
                            currentConversationId={conversation?.id}
                            historyStatus={historyStatus}
                            onSwitchConversation={handleSwitchConversation}
                            onStartNewChat={handleStartNewChat}
                            isStarting={isStarting}
                          />
                        </div>
                      </aside>
                    ) : null}

                    <div className="flex min-h-0 flex-1 flex-col">
                       {showHistory && hasStartedChat && visitor ? (
                        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md p-6 md:hidden animate-fade-up">
                          <ChatSidebar
                            conversations={conversations}
                            currentConversationId={conversation?.id}
                            historyStatus={historyStatus}
                            onSwitchConversation={(id) => {
                              handleSwitchConversation(id);
                              setShowHistory(false);
                            }}
                            onStartNewChat={() => {
                              handleStartNewChat();
                              setShowHistory(false);
                            }}
                            isStarting={isStarting}
                            showCloseButton={true}
                            onClose={() => setShowHistory(false)}
                          />
                        </div>
                      ) : null}

                      {!hasStartedChat ? (
                        <LeadForm
                          leadForm={leadForm}
                          onLeadChange={handleLeadChange}
                          onSubmit={handleStartChat}
                          isStarting={isStarting}
                          error={error}
                        />
                      ) : (
                        <div className="flex min-h-0 flex-1 flex-col">
                          <ChatMessages messages={messages} isSending={isSending} />

                          {error ? (
                            <div className="mt-4">
                              <Alert>{error}</Alert>
                            </div>
                          ) : null}

                          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 sm:gap-3">
                            <Input
                              value={message}
                              onChange={(event) => setMessage(event.target.value)}
                              placeholder="Type your question..."
                              disabled={isSending}
                              className="min-w-0 flex-1"
                            />
                            <Button type="submit" disabled={isSending} size="lg">
                              {isSending ? "…" : "Send"}
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </section>
    </PageShell>
  );
}

export default PublicChat;
