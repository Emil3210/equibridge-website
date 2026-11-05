import type { Metadata } from "next";
import LegalPlaceholder from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <LegalPlaceholder
      title="Privacy Policy"
      summary="How EquiBridge Capital collects, uses, shares and protects personal information, including our Gramm-Leach-Bliley Act privacy notice and California privacy rights."
    />
  );
}
