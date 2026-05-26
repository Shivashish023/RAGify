import api from "./api";

export async function getPublicOrganization(slug) {
  const { data } = await api.get(`/public/organizations/${slug}`);
  return data.organization;
}
