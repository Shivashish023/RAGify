import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import PageShell from "../components/layout/PageShell";
import { getDocumentFile, getDocuments, uploadDocument } from "../services/documentService";

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("loading");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [error, setError] = useState("");

  async function loadDocuments() {
    try {
      const data = await getDocuments();
      setDocuments(data);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || "Unable to load documents");
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Choose a PDF, DOCX, or TXT file first");
      return;
    }

    setError("");
    setUploadStatus("uploading");

    try {
      const document = await uploadDocument(selectedFile);
      setDocuments((current) => [document, ...current]);
      setSelectedFile(null);
      event.target.reset();
      setUploadStatus("idle");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to upload document");
      setUploadStatus("idle");
    }
  };

  const handleFileAction = async (document) => {
    try {
      setError("");
      const blob = await getDocumentFile(document._id);
      const fileUrl = URL.createObjectURL(blob);

      window.open(fileUrl, "_blank", "noopener,noreferrer");

      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to open document");
    }
  };

  return (
    <PageShell>
      <Navbar />
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#307d89]">
            Documents
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#121923]">
            Upload company knowledge
          </h1>
          <p className="mt-3 max-w-2xl text-[#52616f]">
            Upload PDF, DOCX, or TXT files. For now they are stored in Cloudinary
            and tracked in MongoDB; vector processing comes later.
          </p>
        </div>

        <div className="rounded-lg border border-[#dce3ea] bg-white p-5 shadow-sm">
          <form onSubmit={handleUpload} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <label className="block">
              <span className="text-sm font-medium text-[#243241]">Document file</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                className="mt-2 w-full rounded-lg border border-[#cfd8e3] px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#e9f6f3] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#145c72]"
              />
            </label>

            <button
              type="submit"
              disabled={uploadStatus === "uploading"}
              className="rounded-lg bg-[#145c72] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#104a5c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-lg border border-[#f0c8c8] bg-[#fff5f5] px-4 py-3 text-sm text-[#a33a3a]">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-[#dce3ea] bg-white shadow-sm">
          <div className="border-b border-[#e7edf3] px-5 py-4">
            <h2 className="text-lg font-semibold text-[#121923]">Uploaded documents</h2>
          </div>

          {status === "loading" && (
            <p className="px-5 py-6 text-sm text-[#52616f]">Loading documents...</p>
          )}

          {status === "error" && (
            <p className="px-5 py-6 text-sm text-[#a33a3a]">Unable to load documents.</p>
          )}

          {status === "ready" && documents.length === 0 && (
            <p className="px-5 py-6 text-sm text-[#52616f]">No documents uploaded yet.</p>
          )}

          {status === "ready" && documents.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[#fbfcfd] text-[#52616f]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">File</th>
                    <th className="px-5 py-3 font-semibold">Type</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Uploaded</th>
                    <th className="px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7edf3]">
                  {documents.map((document) => (
                    <tr key={document._id}>
                      <td className="px-5 py-4 font-medium text-[#243241]">
                        {document.originalName}
                      </td>
                      <td className="px-5 py-4 uppercase text-[#52616f]">{document.fileType}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-[#e9f6f3] px-2.5 py-1 text-xs font-semibold text-[#21705f]">
                          {document.status}
                        </span>
                        {document.status === "failed" && document.errorMessage && (
                          <p className="mt-2 max-w-xs text-xs leading-5 text-[#a33a3a]">
                            {document.errorMessage}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-[#52616f]">{formatDate(document.createdAt)}</td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleFileAction(document)}
                          className="font-semibold text-[#145c72]"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default Documents;
