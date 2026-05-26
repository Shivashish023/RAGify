import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import { getPublicOrganization } from "../services/publicService";

function PublicChat() {
  const { slug } = useParams();
  const [organization, setOrganization] = useState(null);
  const [status, setStatus] = useState("loading");

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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#307d89]">
                Public chatbot
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#121923]">
                {organization.name} Chatbot
              </h1>
              <p className="mt-3 max-w-2xl text-[#52616f]">
                This is the customer-facing chatbot page. The next milestone will
                add the actual message UI and fake replies before the Python RAG
                service is connected.
              </p>

              <div className="mt-8 rounded-lg border border-[#e4ebf2] bg-[#fbfcfd] p-4">
                <p className="text-sm font-medium text-[#243241]">Chatbot status</p>
                <p className="mt-2 text-sm text-[#52616f]">{organization.chatbotStatus}</p>
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default PublicChat;
