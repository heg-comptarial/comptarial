"use client";

import { useEffect, useState } from "react";
import { usePathname, useParams } from "next/navigation";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import ProtectedRouteAdmin from "@/components/routes/ProtectedRouteAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const params = useParams();
  const userId = Number(params?.userId);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Découper les segments de l'URL
  const segments = pathname.split("/").filter(Boolean);

  // Vérifier les deux derniers segments
  const secondLastSegment = segments[segments.length - 2]; // Avant-dernier segment
  const lastSegment = segments[segments.length - 1]; // Dernier segment

  const isSecondLastNumeric = !isNaN(Number(secondLastSegment));
  const isLastNumeric = !isNaN(Number(lastSegment));

  // Déterminer la page lisible
  const readablePage = isSecondLastNumeric
    ? "Admin"
    : secondLastSegment
        ?.replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <ProtectedRouteAdmin>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex flex-1 items-center justify-between">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href={`/admin/${userId}`}>Admin</BreadcrumbLink>
                    </BreadcrumbItem>

                    {isLastNumeric && readablePage !== "Admin" && (
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
    </ProtectedRouteAdmin>
  );
}
