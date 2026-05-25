import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import PageShell from "../components/layout/PageShell";

const capabilities = [
  "Tenant-aware knowledge bases",
  "Admin document operations",
  "Customer support chat workspace",
];

function Landing() {
  return (
    <PageShell>
      <Navbar />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#307d89]">
            B2B support automation
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#121923] sm:text-5xl">
            Deploy organization-specific support chatbots from company knowledge.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#52616f]">
            RAGify is the control room for document-powered customer support.
            Start with authentication, tenant boundaries, and a focused dashboard,
            then connect the RAG service when the app shell is ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-lg bg-[#145c72] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#104a5c]"
            >
              Open login
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg border border-[#cfd8e3] bg-white px-5 py-3 text-sm font-semibold text-[#243241] transition hover:border-[#145c72] hover:text-[#145c72]"
            >
              View dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#dce3ea] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-[#e7edf3] pb-4">
            <div>
              <p className="text-sm font-semibold text-[#17202a]">Workspace preview</p>
              <p className="text-sm text-[#6b7886]">Acme Support Portal</p>
            </div>
            <span className="rounded-md bg-[#e9f6f3] px-3 py-1 text-xs font-semibold text-[#21705f]">
              Online
            </span>
          </div>

          <div className="grid gap-3">
            {capabilities.map((capability) => (
              <div
                key={capability}
                className="flex items-center justify-between rounded-lg border border-[#e4ebf2] bg-[#fbfcfd] px-4 py-3"
              >
                <span className="text-sm font-medium text-[#243241]">{capability}</span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#36a269]" />
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg bg-[#17202a] p-4 text-white">
            <p className="text-sm text-[#b8c5cf]">Next milestone</p>
            <p className="mt-2 text-xl font-semibold">Wire real JWT auth and MongoDB models.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default Landing;
