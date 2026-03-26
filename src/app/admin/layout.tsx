import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role;

  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
