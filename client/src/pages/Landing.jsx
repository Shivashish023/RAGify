import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import PageShell from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";
import { Card, CardBody } from "../components/ui/Card";

const capabilities = [
  {
    title: "Tenant-aware knowledge",
    detail: "Each organization gets an isolated vector index and document library.",
  },
  {
    title: "Document pipeline",
    detail: "Upload PDF, DOCX, or TXT — chunked, embedded, and searchable in minutes.",
  },
  {
    title: "Public support chat",
    detail: "Share a branded link so customers chat with answers grounded in your docs.",
  },
];

function Landing() {
  const { isAuthenticated, user } = useAuth();
  const chatbotUrl = user?.organizationSlug
    ? `${window.location.origin}/chat/${user.organizationSlug}`
    : null;

  return (
    <PageShell>
      <Navbar />
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-12 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-light/80 px-3.5 py-1.5 text-xs font-semibold text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-glow" />
              B2B support automation
            </p>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
              Turn company documents into a{" "}
              <span className="text-brand">support chatbot</span> your customers can trust.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              RAGify is the control room for document-powered customer support — upload knowledge,
              deploy a public chat link, and answer questions from your own content.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-brand-dark"
                  >
                    Go to dashboard
                  </Link>
                  <Link
                    to="/documents"
                    className="inline-flex items-center justify-center rounded-xl border border-border-strong bg-surface px-6 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
                  >
                    Manage documents
                  </Link>
                  {chatbotUrl ? (
                    <a
                      href={chatbotUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border border-border-strong bg-surface px-6 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
                    >
                      Open chatbot
                    </a>
                  ) : null}
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-brand-dark"
                  >
                    Create workspace
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-border-strong bg-surface px-6 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { label: "Formats", value: "PDF · DOCX · TXT" },
                { label: "Stack", value: "RAG + LLM" },
                { label: "Deploy", value: "Per-tenant" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Card className="animate-fade-up stagger-2 overflow-hidden">
            <CardBody className="p-0">
              <div className="border-b border-border bg-linear-to-r from-brand/5 to-accent/5 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">Workspace preview</p>
                    <p className="text-sm text-ink-muted">Acme Support Portal</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                    Online
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-6">
                {capabilities.map((capability, index) => (
                  <div
                    key={capability.title}
                    className="rounded-xl border border-border bg-surface-raised p-4 transition hover:border-brand/25 hover:shadow-[var(--shadow-soft)]"
                    style={{ animationDelay: `${0.15 + index * 0.08}s` }}
                  >
                    <p className="text-sm font-semibold text-ink">{capability.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{capability.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mx-6 mb-6 overflow-hidden rounded-xl bg-ink p-5 text-white">
                <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                  Live flow
                </p>
                <p className="mt-2 font-display text-xl font-semibold leading-snug">
                  Upload → ingest → chat with grounded answers
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}

export default Landing;
