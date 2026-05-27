import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import {
  getPublicOrganization,
  sendPublicMessage,
  startPublicChat,
} from "../services/publicService";

function PublicChat() {
  const { slug } = useParams();
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
      } catch (error) {
        setStatus("error");
      }
    }

    loadOrganization();
  }, [slug]);

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
    <PageShell>
      <section className="mx-auto flex min-h-screen max-w-4xl items-center px-5 py-10">
        <div className="w-full rounded-lg border border-[#dce3ea] bg-white p-6 shadow-sm sm:p-8">
          {status === "loading" && (
            <p className="text-sm font-medium text-[#52616f]">Loading chatbot...</p>
          )}

          {status === "error" && (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a33a3a]">
                Not found
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-[#121923]">
                This chatbot is not available.
              </h1>
              <Link to="/" className="mt-6 inline-block text-sm font-semibold text-[#145c72]">
                Back to RAGify
              </Link>
            </>
          )}

          {status === "ready" && (
            <>
              <div className="mb-6 border-b border-[#e7edf3] pb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#307d89]">
                  Public chatbot
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#121923]">
                  {organization.name} Chatbot
                </h1>
                <p className="mt-3 text-sm text-[#52616f]">
                  Share your name and email to start a support conversation.
                </p>
              </div>

              {!conversation ? (
                <form onSubmit={handleStartChat} className="space-y-5">
                  <label className="block">
                    <span className="text-sm font-medium text-[#243241]">Name</span>
                    <input
                      type="text"
                      name="name"
                      value={leadForm.name}
                      onChange={handleLeadChange}
                      className="mt-2 w-full rounded-lg border border-[#cfd8e3] px-4 py-3 text-sm outline-none transition focus:border-[#145c72] focus:ring-4 focus:ring-[#145c72]/10"
                      placeholder="Rahul"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-[#243241]">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={leadForm.email}
                      onChange={handleLeadChange}
                      className="mt-2 w-full rounded-lg border border-[#cfd8e3] px-4 py-3 text-sm outline-none transition focus:border-[#145c72] focus:ring-4 focus:ring-[#145c72]/10"
                      placeholder="rahul@example.com"
                      required
                    />
                  </label>

                  {error && (
                    <div className="rounded-lg border border-[#f0c8c8] bg-[#fff5f5] px-4 py-3 text-sm text-[#a33a3a]">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isStarting}
                    className="w-full rounded-lg bg-[#145c72] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#104a5c] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isStarting ? "Starting chat..." : "Start chat"}
                  </button>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="h-[360px] overflow-y-auto rounded-lg border border-[#e4ebf2] bg-[#fbfcfd] p-4">
                    <div className="space-y-3">
                      {messages.map((item) => (
                        <div
                          key={item.id}
                          className={`flex ${
                            item.sender === "visitor" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[78%] rounded-lg px-4 py-3 text-sm leading-6 ${
                              item.sender === "visitor"
                                ? "bg-[#145c72] text-white"
                                : "border border-[#dce3ea] bg-white text-[#243241]"
                            }`}
                          >
                            {item.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-lg border border-[#f0c8c8] bg-[#fff5f5] px-4 py-3 text-sm text-[#a33a3a]">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-[#cfd8e3] px-4 py-3 text-sm outline-none transition focus:border-[#145c72] focus:ring-4 focus:ring-[#145c72]/10"
                      placeholder="Type your question..."
                      disabled={isSending}
                    />
                    <button
                      type="submit"
                      disabled={isSending}
                      className="rounded-lg bg-[#145c72] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#104a5c] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSending ? "Sending" : "Send"}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default PublicChat;
