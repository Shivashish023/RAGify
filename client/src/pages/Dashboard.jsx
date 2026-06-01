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

function StatCard({ label, value, detail, loading }) {
  return (
    <Card className="group transition hover:shadow-[var(--shadow-glow)]">
      <CardBody>
        <p className="text-sm font-medium text-ink-muted">{label}</p>
        <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          {loading ? (
            <span className="inline-block h-10 w-16 animate-pulse-soft rounded-lg bg-brand-light" />
          ) : (
            value
          )}
        </p>
        <p className="mt-2 text-sm text-ink-faint">{detail}</p>
      </CardBody>
    </Card>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/80 py-3 last:border-0 last:pb-0">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="text-right text-sm font-semibold text-ink">{value || "—"}</dd>
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

  const stats = [
    {
      label: "Visitors",
      value: dashboardStats.totalVisitors,
      detail: "People who started chat",
    },
    {
      label: "Conversations",
      value: dashboardStats.totalConversations,
      detail: "Customer chat sessions",
    },
    {
      label: "Messages",
      value: dashboardStats.totalMessages,
      detail: "Visitor and bot messages",
    },
  ];

  const chatbotActive = user?.chatbotStatus === "active";

  return (
    <PageShell>
      <Navbar />
      <section className="mx-auto max-w-6xl px-5 py-10">
        <PageHeader
          eyebrow="Admin dashboard"
          title={`Welcome back, ${user?.name || "Admin"}`}
          description={`Manage ${user?.organizationName || "your company"}'s knowledge base, monitor chat activity, and share your public support link.`}
        />

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`animate-fade-up stagger-${index + 1}`}>
              <StatCard
                label={stat.label}
                value={stat.value}
                detail={stat.detail}
                loading={statsStatus === "loading"}
              />
            </div>
          ))}
        </div>

        {statsStatus === "error" ? (
          <div className="mt-4">
            <Alert>Unable to load dashboard stats right now.</Alert>
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <Card className="animate-fade-up stagger-2 lg:col-span-3">
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink">Public chatbot</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    Share this link with customers to start support conversations.
                  </p>
                </div>
                <Badge variant={chatbotActive ? "success" : "warning"}>
                  {user?.chatbotStatus || "unknown"}
                </Badge>
              </div>
              <div className="mt-4 rounded-xl border border-border bg-surface-raised px-4 py-3.5">
                <a
                  href={chatbotUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-sm font-semibold text-brand hover:text-brand-dark"
                >
                  {chatbotUrl}
                </a>
              </div>
              <a href={chatbotUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block">
                <Button variant="secondary" size="sm">
                  Open chat page →
                </Button>
              </a>
            </CardBody>
          </Card>

          <Card className="animate-fade-up stagger-3 lg:col-span-2">
            <CardBody className="flex h-full flex-col">
              <h2 className="font-display text-xl font-semibold text-ink">Knowledge base</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                Upload PDF, DOCX, or TXT files. They are embedded and used to answer customer
                questions.
              </p>
              <Link to="/documents" className="mt-5">
                <Button className="w-full">Manage documents</Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <h2 className="font-display text-lg font-semibold text-ink">Organization</h2>
              <dl className="mt-2">
                <DetailRow label="Company" value={user?.organizationName} />
                <DetailRow label="Slug" value={user?.organizationSlug} />
                <DetailRow label="Chatbot" value={user?.chatbotStatus} />
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="font-display text-lg font-semibold text-ink">Admin account</h2>
              <dl className="mt-2">
                <DetailRow label="Name" value={user?.name} />
                <DetailRow label="Email" value={user?.email} />
                <DetailRow label="Role" value={user?.role} />
              </dl>
            </CardBody>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}

export default Dashboard;
