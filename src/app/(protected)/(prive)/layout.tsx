"use client";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
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
import ProtectedRoutePrive from "@/components/routes/ProtectedRoutePrive";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentPage = pathname.split("/").pop()?.replace(/-/g, " ");
  const capitalizedPage =
    currentPage && currentPage !== "dashboard"
      ? currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
      : "Dashboard";

  return (
    <ProtectedRoutePrive>
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
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  {currentPage !== "dashboard" && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                  {currentPage !== "dashboard" && (
                    <BreadcrumbItem>
                      <BreadcrumbPage>{capitalizedPage}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoutePrive>
  );
}