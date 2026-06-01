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

        <Card className="animate-fade-up">
          <CardBody>
            <form onSubmit={handleUpload} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <Field label="Document file">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-dashed border-border-strong bg-surface-raised px-4 py-4 text-sm text-ink-muted file:mr-4 file:rounded-lg file:border-0 file:bg-brand-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand transition hover:border-brand/40"
                />
              </Field>
              <Button type="submit" size="lg" disabled={uploadStatus === "uploading"}>
                {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
              </Button>
            </form>
            {error ? (
              <div className="mt-4">
                <Alert>{error}</Alert>
              </div>
            ) : null}
          </CardBody>
        </Card>

        <Card className="mt-8 animate-fade-up stagger-2 overflow-hidden">
          <CardHeader>
            <h2 className="font-display text-lg font-semibold text-ink">Uploaded documents</h2>
          </CardHeader>

          {status === "loading" && (
            <CardBody>
              <p className="text-sm text-ink-muted">Loading documents...</p>
            </CardBody>
          )}

          {status === "error" && (
            <CardBody>
              <Alert>Unable to load documents.</Alert>
            </CardBody>
          )}

          {status === "ready" && documents.length === 0 && (
            <CardBody>
              <div className="rounded-xl border border-dashed border-border-strong bg-surface-raised px-6 py-12 text-center">
                <p className="font-display text-lg font-semibold text-ink">No documents yet</p>
                <p className="mt-2 text-sm text-ink-muted">
                  Upload your first file to power the support chatbot.
                </p>
              </div>
            </CardBody>
          )}

          {status === "ready" && documents.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-surface-raised text-ink-muted">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">File</th>
                    <th className="px-6 py-3.5 font-semibold">Type</th>
                    <th className="px-6 py-3.5 font-semibold">Status</th>
                    <th className="px-6 py-3.5 font-semibold">Uploaded</th>
                    <th className="px-6 py-3.5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {documents.map((document) => (
                    <tr key={document._id} className="transition hover:bg-brand-light/30">
                      <td className="px-6 py-4 font-medium text-ink">{document.originalName}</td>
                      <td className="px-6 py-4 uppercase text-ink-muted">{document.fileType}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant(document.status)}>{document.status}</Badge>
                        {document.status === "failed" && document.errorMessage ? (
                          <p className="mt-2 max-w-xs text-xs leading-5 text-danger">
                            {document.errorMessage}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 text-ink-muted">{formatDate(document.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => handleFileAction(document)}
                          >
                            Open
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            type="button"
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
