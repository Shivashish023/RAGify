import api from "./api";

export async function getPublicOrganization(slug) {
  const { data } = await api.get(`/public/organizations/${slug}`);
  return data.organization;
}

export async function startPublicChat(slug, payload) {
  const { data } = await api.post(`/public/chat/${slug}/start`, payload);
  return data;
}

export async function sendPublicMessage(slug, payload) {
  const { data } = await api.post(`/public/chat/${slug}/message`, payload);
  return data;
}

export async function getPublicConversation(slug, conversationId, visitorId) {
  const { data } = await api.get(`/public/chat/${slug}/conversations/${conversationId}`, {
    params: { visitorId },
  });
  return data;
}

export async function getVisitorConversations(slug, visitorId) {
  const { data } = await api.get(`/public/chat/${slug}/visitors/${visitorId}/conversations`);
  return data;
}
