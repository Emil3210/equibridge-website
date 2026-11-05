import type { Metadata } from "next";
import LegalPlaceholder from "@/components/LegalPlaceholder";

export const metadata: Metadata = { title: "Terms of Use" };

export default function Page() {
  return (
    <LegalPlaceholder
      title="Terms of Use"
      summary="The terms that apply when you use the EquiBridge Capital website and partner portal."
    />
  );
}
