import type { Metadata } from "next";
import ProcessExplainer from "@/components/ProcessExplainer";

// Stand-alone view of The EquiBridge Process video. /process-explainer?record=1 fills the window with
// no controls, which is what the MP4 recording script uses. Not listed in the sitemap or search results.
export const metadata: Metadata = {
  title: "Process explainer",
  robots: { index: false, follow: false },
};

export default async function ProcessExplainerPage({ searchParams }: { searchParams: Promise<{ record?: string }> }) {
  const { record } = await searchParams;
  return (
    <section className="section">
      <div className="container">
        <ProcessExplainer record={record === "1"} />
      </div>
    </section>
  );
}
