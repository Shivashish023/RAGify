import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import {
  getPublicOrganization,
  sendPublicMessage,
  startPublicChat,
} from "../services/publicService";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { Field, Input } from "../components/ui/Input";
import { Eyebrow } from "../components/ui/PageHeader";

function PublicChat() {
  const { slug } = useParams();
  const messagesEndRef = useRef(null);
  const [organization, setOrganization] = useState(null);
  const [status, setStatus] = useState("loading");
  const [visitor, setVisitor] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function loadOrganization() {
      try {
        const data = await getPublicOrganization(slug);
        setOrganization(data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    loadOrganization();
  }, [slug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

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
      setConversation(data.conversation);
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
        conversationId: conversation.id,
        visitorId: visitor.id,
        message: pendingMessage.content,
      });

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

  return (
    <PageShell variant="chat">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-8 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm font-semibold text-ink-muted transition hover:text-brand"
          >
            ← RAGify
          </Link>
          {organization ? (
            <span className="rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success">
              Support online
            </span>
          ) : null}
        </div>

        <Card className="flex flex-1 flex-col overflow-hidden shadow-[var(--shadow-glow)] animate-fade-up">
          <CardBody className="flex flex-1 flex-col p-0 sm:p-0">
            {status === "loading" && (
              <div className="p-8">
                <p className="text-sm font-medium text-ink-muted">Loading chatbot...</p>
              </div>
            )}

            {status === "error" && (
              <div className="p-8">
                <Eyebrow>Not found</Eyebrow>
                <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
                  This chatbot is not available.
                </h1>
                <Link to="/" className="mt-6 inline-block">
                  <Button variant="secondary">Back to RAGify</Button>
                </Link>
              </div>
            )}

            {status === "ready" && (
              <>
                <div className="border-b border-border bg-linear-to-r from-brand/8 to-transparent px-6 py-6 sm:px-8">
                  <Eyebrow>Support chat</Eyebrow>
                  <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    {organization.name}
                  </h1>
                  <p className="mt-2 text-sm text-ink-muted">
                    Ask questions about our products and policies — answers come from our documents.
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  {!conversation ? (
                    <form onSubmit={handleStartChat} className="mx-auto w-full max-w-md space-y-5">
                      <p className="text-center text-sm text-ink-muted">
                        Introduce yourself to start the conversation.
                      </p>
                      <Field label="Name">
                        <Input
                          type="text"
                          name="name"
                          value={leadForm.name}
                          onChange={handleLeadChange}
                          placeholder="Your name"
                          required
                        />
                      </Field>
                      <Field label="Email">
                        <Input
                          type="email"
                          name="email"
                          value={leadForm.email}
                          onChange={handleLeadChange}
                          placeholder="you@example.com"
                          required
                        />
                      </Field>
                      {error ? <Alert>{error}</Alert> : null}
                      <Button type="submit" className="w-full" size="lg" disabled={isStarting}>
                        {isStarting ? "Starting chat..." : "Start chat"}
                      </Button>
                    </form>
                  ) : (
                    <div className="flex min-h-[420px] flex-1 flex-col">
                      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-surface-raised p-4 sm:p-5">
                        {messages.map((item) => (
                          <div
                            key={item.id}
                            className={`flex ${item.sender === "visitor" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                item.sender === "visitor"
                                  ? "rounded-br-md bg-brand text-white"
                                  : "rounded-bl-md border border-border bg-surface text-ink"
                              } ${item.id.startsWith("pending") ? "opacity-70" : ""}`}
                            >
                              {item.sender === "assistant" ? (
                                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-brand-glow">
                                  Assistant
                                </span>
                              ) : null}
                              <span className="whitespace-pre-wrap">{item.content}</span>
                            </div>
                          </div>
                        ))}
                        {isSending ? (
                          <div className="flex justify-start">
                            <div className="rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3">
                              <span className="flex gap-1">
                                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand/60" />
                                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand/40 [animation-delay:0.2s]" />
                                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand/30 [animation-delay:0.4s]" />
                              </span>
                            </div>
                          </div>
                        ) : null}
                        <div ref={messagesEndRef} />
                      </div>

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
              </>
            )}
          </CardBody>
        </Card>
      </section>
    </PageShell>
  );
}

export default PublicChat;
