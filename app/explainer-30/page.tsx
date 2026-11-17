import type { Metadata } from "next";
import ShortExplainer from "@/components/ShortExplainer";

// 35-second social cut of the explainer. /explainer-30?record=1 (16:9) or ?record=1&format=tall (9:16)
// fills the window with no controls for the MP4 recording script. Not listed in the sitemap or search results.
export const metadata: Metadata = {
  title: "Explainer (35s)",
  robots: { index: false, follow: false },
};

export default async function ShortExplainerPage({ searchParams }: { searchParams: Promise<{ record?: string; format?: string }> }) {
  const { record, format } = await searchParams;
  return (
    <section className="section">
      <div className="container">
        <ShortExplainer record={record === "1"} format={format === "tall" ? "tall" : "wide"} />
      </div>
    </section>
  );
}
