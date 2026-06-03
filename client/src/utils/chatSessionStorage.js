const STORAGE_PREFIX = "ragify_chat_";

export function getStoredChatSession(slug) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${slug}`);
    if (!raw) {
      return null;
    }

    const session = JSON.parse(raw);

    if (!session?.visitorId) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function saveChatSession(slug, { visitorId, conversationId }) {
  localStorage.setItem(
    `${STORAGE_PREFIX}${slug}`,
    JSON.stringify({
      slug,
      visitorId,
      conversationId: conversationId || null,
    }),
  );
}

export function clearChatSession(slug) {
  localStorage.removeItem(`${STORAGE_PREFIX}${slug}`);
}
