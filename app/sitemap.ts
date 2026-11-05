import type { MetadataRoute } from "next";

const PAGES = ["", "/solutions", "/how-it-works", "/about", "/portal", "/privacy", "/terms", "/licensing"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({ url: `https://equibridgecapital.com${p}`, lastModified: new Date() }));
}
