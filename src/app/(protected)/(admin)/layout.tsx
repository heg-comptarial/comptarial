"use client";

import { usePathname } from "next/navigation";
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
import { useParams } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPage = pathname.split("/").pop()?.replace(/-/g, " ");
  const capitalizedPage =
    currentPage && currentPage !== "admin"
      ? currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
      : "Admin";
  const params = useParams()
  const userId = Number(params?.userId)

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
                  {currentPage !== "admin" && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
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
    </ProtectedRouteAdmin>
  );
}
