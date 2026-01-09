import { api } from "../utils/axios";

export type LinkItem = {
  code: string;
  shortUrl?: string;
  longUrl: string;
  createdAt: string;
  expiresAt: string;
};

async function createShortLink(longUrl: string) {
  const res = await api.post("/api/v1/shorten", { longUrl });
  return res.data as { code: string; shortUrl: string; expiresAt: string };
}

async function getMyLinks() {
  const res = await api.get("/api/v1/links");
  return res.data as LinkItem[];
}

export {
  createShortLink,
  getMyLinks
};