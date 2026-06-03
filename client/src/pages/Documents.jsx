import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import PageShell from "../components/layout/PageShell";
import {
  getDocumentFile,
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../services/documentService";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Field } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusVariant(status) {
  if (status === "completed") return "success";
  if (status === "failed") return "danger";
  if (status === "processing") return "warning";
  return "neutral";
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

  const handleDelete = async (documentId) => {
    if (!window.confirm("Delete this document? This will remove it from all stores.")) return;

    try {
      setError("");
      await deleteDocument(documentId);
      setDocuments((current) => current.filter((d) => d._id !== documentId));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete document");
    }
  };

  return (
    <PageShell>
      <Navbar />
      <section className="mx-auto max-w-6xl px-5 py-10">
        <PageHeader
          eyebrow="Knowledge base"
          title="Upload company knowledge"
          description="Add PDF, DOCX, or TXT files. They are chunked, embedded in Pinecone, and used to answer customer questions."
        />

        <Card className="animate-fade-up border border-white/10 bg-slate-900/40 backdrop-blur-md">
          <CardBody>
            <form onSubmit={handleUpload} className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <Field label="Drag or browse knowledge document">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                  className="w-full rounded-xl border-2 border-dashed border-white/10 bg-slate-950/40 px-5 py-6 text-sm text-ink-muted file:mr-4 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-brand-glow file:cursor-pointer transition-all hover:border-brand/40 cursor-pointer"
                />
              </Field>
              <Button type="submit" size="lg" className="h-[54px] min-w-[120px]" disabled={uploadStatus === "uploading"}>
                {uploadStatus === "uploading" ? "Uploading..." : "Upload File"}
              </Button>
            </form>
            {error ? (
              <div className="mt-4">
                <Alert>{error}</Alert>
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card className="mt-8 animate-fade-up stagger-2 overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-md">
          <CardHeader className="border-b border-white/5 px-6 py-4.5 bg-slate-950/10">
            <h2 className="font-display text-lg font-semibold text-white">Uploaded documents</h2>
          </CardHeader>

          {status === "loading" && (
            <CardBody>
              <p className="text-sm text-ink-muted">Retrieving knowledge files...</p>
            </CardBody>
          )}

          {status === "error" && (
            <CardBody>
              <Alert>Unable to load knowledge repository files.</Alert>
            </CardBody>
          )}

          {status === "ready" && documents.length === 0 && (
            <CardBody>
              <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/40 px-6 py-14 text-center">
                <p className="font-display text-lg font-semibold text-white">No files processed yet</p>
                <p className="mt-2 text-sm text-ink-muted max-w-sm mx-auto">
                  Upload your company policies, manuals, or reference guides to ground the chatbot's answers.
                </p>
              </div>
            </CardBody>
          )}

          {status === "ready" && documents.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-950/40 text-ink-muted border-b border-white/5">
                  <tr>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[11px]">File Name</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[11px]">Format</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[11px]">Indexing Status</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[11px]">Processed</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {documents.map((document) => (
                    <tr key={document._id} className="transition duration-150 hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium text-white">{document.originalName}</td>
                      <td className="px-6 py-4 uppercase text-xs font-semibold text-ink-muted">{document.fileType}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant(document.status)}>{document.status}</Badge>
                        {document.status === "failed" && document.errorMessage ? (
                          <p className="mt-2 max-w-xs text-xs leading-5 text-danger bg-danger-bg/25 border border-danger/25 p-2 rounded-lg">
                            {document.errorMessage}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-muted">{formatDate(document.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2.5 justify-end">
                          <Button
                            variant="secondary"
                            size="sm"
                            type="button"
                            className="px-3.5 py-1.5 text-xs font-semibold border-white/5 hover:border-brand/40 hover:bg-brand/10 text-white"
                            onClick={() => handleFileAction(document)}
                          >
                            Open
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            type="button"
                            className="px-3.5 py-1.5 text-xs font-semibold border-transparent"
                            onClick={() => handleDelete(document._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
    </PageShell>
  );
}

export default Documents;
