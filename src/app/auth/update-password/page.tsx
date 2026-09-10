import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/AuthForms";
import { AuthCard } from "@/components/ui";

export const metadata: Metadata = { title: "New password", robots: { index: false } };

export default function UpdatePasswordPage() {
  return (
    <AuthCard title="Choose a new password">
      <UpdatePasswordForm />
    </AuthCard>
  );
}
