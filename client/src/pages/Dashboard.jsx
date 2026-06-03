import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import PageShell from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../services/dashboardService";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

function StatCard({ label, value, detail, loading, color = "indigo" }) {
  const borders = {
    indigo: "border-t-2 border-brand hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]",
    purple: "border-t-2 border-brand-glow hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]",
    accent: "border-t-2 border-accent hover:shadow-[0_0_25px_rgba(217,70,239,0.15)]",
  };
  
  return (
    <Card className={`group transition-all duration-300 hover:-translate-y-1 border border-white/5 bg-slate-900/40 backdrop-blur-md ${borders[color]}`}>
      <CardBody>
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</p>
        <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-white">
          {loading ? (
            <span className="inline-block h-10 w-16 animate-pulse-soft rounded-lg bg-brand-light" />
          ) : (
            value
          )}
        </p>
        <p className="mt-2 text-xs text-ink-faint">{detail}</p>
      </CardBody>
    </Card>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/40 py-3 last:border-0 last:pb-0">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="text-right text-sm font-semibold text-white">{value || "—"}</dd>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    totalVisitors: 0,
    totalConversations: 0,
    totalMessages: 0,
  });
  const [statsStatus, setStatsStatus] = useState("loading");
  const [copied, setCopied] = useState(false);
  const chatbotUrl = `${window.location.origin}/chat/${user?.organizationSlug || ""}`;

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setDashboardStats(data);
        setStatsStatus("ready");
      } catch {
        setStatsStatus("error");
      }
    }

    loadStats();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chatbotUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy link:", err);
    }
  };

  const stats = [
    {
      label: "Visitors",
      value: dashboardStats.totalVisitors,
      detail: "Unique users initialized",
      color: "indigo",
    },
    {
      label: "Conversations",
      value: dashboardStats.totalConversations,
      detail: "Active support threads",
      color: "purple",
    },
    {
      label: "Messages",
      value: dashboardStats.totalMessages,
      detail: "Exchanged query loops",
      color: "accent",
    },
  ];

  const chatbotActive = user?.chatbotStatus === "active";

  return (
    <PageShell>
      <Navbar />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <PageHeader
          eyebrow="Console Dashboard"
          title={`Welcome back, ${user?.name || "Admin"}`}
          description={`Oversee your company's support gateway. Connect data sources, inspect visitor interactions, and share your public chat engine.`}
        />

        <div className="grid gap-5 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`animate-fade-up stagger-${index + 1}`}>
              <StatCard
                label={stat.label}
                value={stat.value}
                detail={stat.detail}
                loading={statsStatus === "loading"}
                color={stat.color}
              />
            </div>
          ))}
        </div>

        {statsStatus === "error" ? (
          <div className="mt-6">
            <Alert>Unable to load live telemetry from server.</Alert>
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <Card className="animate-fade-up stagger-2 lg:col-span-3 border border-white/5 bg-slate-900/40 backdrop-blur-md">
            <CardBody className="flex h-full flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-white">Public chatbot</h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      Direct link to integrate or share with customers for instant support.
                    </p>
                  </div>
                  <Badge variant={chatbotActive ? "success" : "warning"}>
                    {user?.chatbotStatus || "unknown"}
                  </Badge>
                </div>
                
                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-950/40 px-4 py-3.5">
                  <a
                    href={chatbotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-sm font-semibold text-brand-glow hover:text-white transition-colors duration-200"
                  >
                    {chatbotUrl}
                  </a>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleCopy} 
                    className="shrink-0 text-xs font-bold border-white/5 hover:border-brand/40 px-3 py-1.5"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <a href={chatbotUrl} target="_blank" rel="noreferrer">
                  <Button variant="primary" size="sm">
                    Open chat window
                  </Button>
                </a>
              </div>
            </CardBody>
          </Card>

          <Card className="animate-fade-up stagger-3 lg:col-span-2 border border-white/5 bg-slate-900/40 backdrop-blur-md">
            <CardBody className="flex h-full flex-col justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-white">Knowledge base</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Feed company information to your chatbot. Uploaded documents are parsed, chunked, and embedded into Pinecone.
                </p>
              </div>
              <Link to="/documents" className="mt-6">
                <Button className="w-full">Upload Knowledge Files</Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md">
            <CardBody>
              <h2 className="font-display text-lg font-semibold text-white border-b border-white/5 pb-2">Workspace organization</h2>
              <dl className="mt-1">
                <DetailRow label="Company Name" value={user?.organizationName} />
                <DetailRow label="Organization Slug" value={user?.organizationSlug} />
                <DetailRow label="Chatbot Route" value={user?.chatbotStatus} />
              </dl>
            </CardBody>
          </Card>

          <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md">
            <CardBody>
              <h2 className="font-display text-lg font-semibold text-white border-b border-white/5 pb-2">Administrator account</h2>
              <dl className="mt-1">
                <DetailRow label="Full Name" value={user?.name} />
                <DetailRow label="Primary Email" value={user?.email} />
                <DetailRow label="System Role" value={user?.role} />
              </dl>
            </CardBody>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}

export default Dashboard;
