import Navbar from "../components/common/Navbar";
import PageShell from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";

const stats = [
  { label: "Documents", value: "0", detail: "Ready for upload module" },
  { label: "Conversations", value: "0", detail: "Chat module not connected" },
  { label: "Users", value: "1", detail: "Demo admin session" },
];

function Dashboard() {
  const { user } = useAuth();

  return (
    <PageShell>
      <Navbar />
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#307d89]">
            Admin dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#121923]">
            Welcome, {user?.name || "Admin"}
          </h1>
          <p className="mt-3 max-w-2xl text-[#52616f]">
            This is the base dashboard shell. The next build step can add real
            document uploads, organization data, and conversation analytics.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-[#dce3ea] bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-[#6b7886]">{stat.label}</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-[#121923]">{stat.value}</p>
              <p className="mt-3 text-sm text-[#52616f]">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-[#dce3ea] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#121923]">Starter structure is active</h2>
          <p className="mt-2 text-sm leading-6 text-[#52616f]">
            Client routing, login state, protected pages, and the Node health/auth
            API are now in place.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

export default Dashboard;
