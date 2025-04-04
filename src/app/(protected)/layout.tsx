"use client";

import { usePathname, useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const currentPage = pathname.split("/").pop()?.replace(/-/g, " ");
  const capitalizedPage =
    currentPage && currentPage !== "dashboard"
      ? currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
      : "Dashboard";

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, // Utilise le token stocké
        },
        credentials: 'include', // Pour inclure les cookies si nécessaires
      });
  
      if (response.ok) {
        console.log('Déconnexion réussie');
        localStorage.removeItem('auth_token'); // Supprime le token d'authentification
        localStorage.removeItem('user_id'); // Supprime l'ID utilisateur
        router.push('/connexion'); // Redirection vers la page de connexion
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la déconnexion', errorData);
      }
    } catch (error) {
      console.error('Erreur réseau lors de la déconnexion', error);
    }
  };
  

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center justify-between">
              {/* Breadcrumb */}
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

              {/* Bouton de déconnexion */}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Déconnexion
              </Button>
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
