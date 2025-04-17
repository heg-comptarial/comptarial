"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/pending-sidebar";
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
import ProtectedRoutePending from "@/components/routes/ProtectedRoutePending";

export default function DashboardPendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentPage = pathname.split("/").pop()?.replace(/-/g, " ");
  const isDashboardRoot = pathname === "/dashboard-pending";

  const capitalizedPage =
    !isDashboardRoot && currentPage
      ? currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
      : "Dashboard";

  return (
    <ProtectedRoutePending>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex flex-1 items-center justify-between">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/dashboard-pending">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    {!isDashboardRoot && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>{capitalizedPage}</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoutePending>
  );
}
