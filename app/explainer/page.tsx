import type { Metadata } from "next";
import Explainer from "@/components/Explainer";

// Stand-alone view of the explainer. /explainer?record=1 fills the window with no controls,
// which is what the MP4 recording script uses. Not listed in the sitemap or search results.
export const metadata: Metadata = {
  title: "Explainer",
  robots: { index: false, follow: false },
};

export default async function ExplainerPage({ searchParams }: { searchParams: Promise<{ record?: string }> }) {
  const { record } = await searchParams;
  return (
    <section className="section">
      <div className="container">
        <Explainer record={record === "1"} />
      </div>
    </section>
  );
}
