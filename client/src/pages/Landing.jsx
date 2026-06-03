import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import PageShell from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";
import { Card, CardBody } from "../components/ui/Card";

const capabilities = [
  {
    title: "Isolated Tenant Spaces",
    detail: "Each organization gets complete data isolation with dedicated vector index routing.",
    icon: (
      <svg className="h-5 w-5 text-brand-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Instant Ingestion Pipeline",
    detail: "Upload PDF, DOCX, or TXT. Automatic parsing, chunking, and metadata tagging in seconds.",
    icon: (
      <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    title: "Grounded Support Chat",
    detail: "A fully embeddable public chat link answering strictly from uploaded company documents.",
    icon: (
      <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
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
      
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 lg:pt-20">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          
          {/* Left Column: Headline & Actions */}
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-light/40 px-4 py-1.5 text-xs font-semibold text-brand-glow">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Next-Gen Customer Support AI
            </p>
            
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Turn company documents into a{" "}
              <span className="bg-linear-to-r from-brand-glow via-brand to-accent bg-clip-text text-transparent">
                grounded support chatbot
              </span>{" "}
              your customers trust.
            </h1>
            
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              RAGify bridges the gap between your organization's manuals and customer queries. 
              Upload documents, deploy public links, and answer questions grounded strictly in your content.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-brand to-brand-glow hover:brightness-110 active:scale-[0.98] transition-all px-6 py-3.5 text-sm font-semibold text-white shadow-glow duration-200"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/documents"
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-surface-raised/40 backdrop-blur-md text-white hover:border-brand/50 hover:bg-brand/10 px-6 py-3.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                  >
                    Manage Documents
                  </Link>
                  {chatbotUrl ? (
                    <a
                      href={chatbotUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-surface-raised/40 backdrop-blur-md text-white hover:border-accent/50 hover:bg-accent/10 px-6 py-3.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                    >
                      Open Chatbot
                    </a>
                  ) : null}
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-brand to-brand-glow hover:brightness-110 active:scale-[0.98] transition-all px-7 py-3.5 text-sm font-semibold text-white shadow-glow duration-200"
                  >
                    Create Workspace
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-surface-raised/40 backdrop-blur-md text-white hover:border-brand/50 hover:bg-brand/10 px-7 py-3.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
            
            <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-border/40 pt-8">
              {[
                { label: "Document Formats", value: "PDF · DOCX · TXT" },
                { label: "Core Pipeline", value: "Sentence Embeddings" },
                { label: "LLM Orchestration", value: "Qwen 2.5 Instruct" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <dt className="text-[10px] uppercase font-bold tracking-widest text-ink-faint">
                    {item.label}
                  </dt>
                  <dd className="text-sm font-semibold text-white">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right Column: Premium App Mock Preview */}
          <div className="relative animate-fade-up stagger-2">
            {/* Background ambient lighting behind the preview card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/15 to-accent/15 blur-2xl rounded-3xl" />
            
            <Card className="relative overflow-hidden border border-white/10 bg-slate-900/60 shadow-card">
              <CardBody className="p-0">
                
                {/* Header of mock card */}
                <div className="border-b border-border/40 bg-linear-to-r from-brand/10 to-accent/5 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-brand-glow">Interactive Preview</p>
                      <p className="text-base font-semibold text-white mt-1">Acme Support Assistant</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                      Active Gateway
                    </span>
                  </div>
                </div>

                {/* Capabilities mock list */}
                <div className="space-y-4 p-6">
                  {capabilities.map((capability, index) => (
                    <div
                      key={capability.title}
                      className="flex items-start gap-4 rounded-xl border border-white/5 bg-slate-950/40 p-4 transition-all duration-300 hover:border-brand/30 hover:bg-slate-900/40"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                        {capability.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{capability.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-ink-muted">{capability.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Flow preview highlight */}
                <div className="mx-6 mb-6 overflow-hidden rounded-xl bg-linear-to-r from-brand/20 to-accent/20 border border-brand/25 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-glow">
                    Automation Cycle
                  </p>
                  <p className="mt-1 text-sm font-medium text-white leading-relaxed">
                    Upload documents → Extract semantic chunks → Query vectors → Synthesize context-aware responses instantly.
                  </p>
                </div>
                
              </CardBody>
            </Card>
          </div>
          
        </div>
      </section>
    </PageShell>
  );
}

export default Landing;
