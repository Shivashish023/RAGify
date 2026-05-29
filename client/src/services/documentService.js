import api from "./api";

export async function getDocuments() {
  const { data } = await api.get("/documents");
  return data.documents;
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("document", file);

  const { data } = await api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.document;
}

export async function getDocumentFile(documentId, download = false) {
  const { data } = await api.get(`/documents/${documentId}/file`, {
    params: { download },
    responseType: "blob",
  });

  return data;
}
