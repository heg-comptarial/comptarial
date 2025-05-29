"use client";

import { useEffect, useState } from "react";
import { usePathname, useParams, notFound } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { PendingSidebar } from "@/components/sidebar/pending-sidebar";
import { EntrepriseSidebar } from "@/components/sidebar/entreprise-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

async function fetchUserDetails(userId: string | null): Promise<{ role: string | null; status: string | null }> {
  if (!userId) return { role: null, status: null };

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) return { role: null, status: null };

  const data = await response.json();
  return { role: data.role, status: data.statut };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const userId = params?.userId as string;

  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 2];
  const isNumeric = !isNaN(Number(segments[segments.length - 1]));

  const readablePage = lastSegment
    ? lastSegment
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase())
    : "Dashboard";

  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authentifie, setAuthentifie] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!userId) {
        setRole(null);
        setStatus(null);
        setAuthentifie(false);
        setLoading(false);
        return;
      }

      try {
        const { role, status } = await fetchUserDetails(userId);
        setRole(role);
        setStatus(status);
        setAuthentifie(!!role && !!status);
      } catch {
        setRole(null);
        setStatus(null);
        setAuthentifie(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [userId]);

  if (loading || authentifie === null) {
    return;
  }

  if (!authentifie) {
    return notFound();
  }

  return (
    <SidebarProvider>
      {status === "pending" ? (
        <PendingSidebar />
      ) : role === "prive" && status === "approved" ? (
        <AppSidebar />
      ) : role === "entreprise" && status === "approved" ? (
        <EntrepriseSidebar />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p>Accès non autorisé.</p>
        </div>
      )}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center justify-between">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={`/dashboard/${userId}`}>
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {isNumeric && readablePage !== "Dashboard" && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{readablePage}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
