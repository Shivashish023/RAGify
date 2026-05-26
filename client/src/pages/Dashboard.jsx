import Navbar from "../components/common/Navbar";
import PageShell from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const chatbotUrl = `${window.location.origin}/chat/${user?.organizationSlug || ""}`;
  const stats = [
    { label: "Documents", value: "0", detail: "Ready for upload module" },
    { label: "Conversations", value: "0", detail: "Chat module not connected" },
    { label: "Users", value: "1", detail: `${user?.role || "admin"} account` },
  ];

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
            {user?.organizationName || "Your company"} now has a workspace and a
            public chatbot route. Document uploads and conversations come next.
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
          <h2 className="text-lg font-semibold text-[#121923]">Public chatbot link</h2>
          <div className="mt-3 rounded-lg border border-[#e4ebf2] bg-[#fbfcfd] px-4 py-3">
            <a
              href={chatbotUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all text-sm font-semibold text-[#145c72]"
            >
              {chatbotUrl}
            </a>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#52616f]">
            This link resolves your company by slug. Customers will use this page
            to chat with your company chatbot.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#dce3ea] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#121923]">Organization</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7886]">Company</dt>
                <dd className="font-medium text-[#243241]">{user?.organizationName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7886]">Slug</dt>
                <dd className="font-medium text-[#243241]">{user?.organizationSlug}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7886]">Status</dt>
                <dd className="font-medium text-[#243241]">{user?.chatbotStatus}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-[#dce3ea] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#121923]">Admin account</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7886]">Name</dt>
                <dd className="font-medium text-[#243241]">{user?.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7886]">Email</dt>
                <dd className="font-medium text-[#243241]">{user?.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7886]">Role</dt>
                <dd className="font-medium text-[#243241]">{user?.role}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default Dashboard;
