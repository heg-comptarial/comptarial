"use client"

import type React from "react"

import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { usePathname, useParams } from "next/navigation"
import { AdminSidebar } from "@/components/sidebar/admin-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const params = useParams()
  const userId = Number(params?.userId)

  const [loading, setLoading] = useState(true)
  const [authentifie, setAuthentifie] = useState<boolean | null>(null)
  const [adminName, setAdminName] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token || !userId) {
          setAuthentifie(false)
          setLoading(false)
          return
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
        const res = await fetch(`${API_URL}/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          setAuthentifie(false)
        } else {
          const userData = await res.json()
          setAdminName(userData.nom || "Admin")
          setAuthentifie(true)
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error)
        setAuthentifie(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [userId])

  // Générer les breadcrumbs de manière plus robuste
  const generateBreadcrumbs = () => {
    // Découper les segments de l'URL
    const segments = pathname.split("/").filter(Boolean)

    // Initialiser les breadcrumbs avec "Admin" comme premier élément
    const breadcrumbs = [{ label: "Admin", href: `/admin/${userId}`, isCurrent: segments.length === 1 }]

    // Ajouter les segments intermédiaires si nécessaire
    if (segments.length > 2) {
      // Traiter les segments intermédiaires (entre "admin" et le dernier segment)
      for (let i = 1; i < segments.length - 1; i++) {
        const segment = segments[i]
        // Ne pas ajouter l'ID de l'utilisateur comme segment de breadcrumb
        if (segment !== userId.toString()) {
          const isNumeric = !isNaN(Number(segment))
          if (!isNumeric) {
            const label = segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
            const href = `/${segments.slice(0, i + 1).join("/")}`
            breadcrumbs.push({ label, href, isCurrent: false })
          }
        }
      }
    }

    // Ajouter le dernier segment s'il n'est pas numérique
    const lastSegment = segments[segments.length - 1]
    if (segments.length > 1 && lastSegment !== userId.toString() && isNaN(Number(lastSegment))) {
      const label = lastSegment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
      breadcrumbs.push({ label, href: pathname, isCurrent: true })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!authentifie) {
    return notFound()
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b bg-background">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex flex-1 items-center justify-between">
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => (
                      <BreadcrumbItem key={index} className={index === 0 ? "hidden md:flex" : ""}>
                        {!crumb.isCurrent ? (
                          <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                        {index < breadcrumbs.length - 1 && (
                          <BreadcrumbSeparator className={index === 0 ? "hidden md:flex" : ""} />
                        )}
                      </BreadcrumbItem>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>

                {adminName && (
                  <div className="hidden md:block text-sm text-muted-foreground">Connecté en tant que {adminName}</div>
                )}
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-2 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
