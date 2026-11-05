import type { Metadata } from "next";
import LegalPlaceholder from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "Licensing" };

export default function Page() {
  return (
    <LegalPlaceholder
      title="Licensing & Disclosures"
      summary="EquiBridge Capital’s NMLS number, state licenses and required consumer disclosures."
    />
  );
}
