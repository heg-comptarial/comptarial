"use client";

import * as React from "react";
import Link from "next/link";
import {
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Shield,
  FolderOpen,
  SquareUserRound,
  FilePlus,
} from "lucide-react";
import { notFound } from "next/navigation";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import { NotificationBell } from "@/components/ui/notification-bell";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const userId = Number(params?.userId);

  const [user, setUser] = React.useState<{ nom: string; email: string } | null>(null);
  const [authentifie, setAuthentifie] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          setAuthentifie(false);
          return;
        }
        const data = await res.json();
        setUser(data);
        setAuthentifie(true);
      } catch (error) {
        setUser({ nom: "Utilisateur", email: "inconnu" });
        setAuthentifie(false);
      }
    }
    if (userId) fetchUser();
  }, [userId]);

  if (authentifie === null) {
    return null;
  }

  if (!authentifie) {
    return notFound();
  }

  const data = {
    user: {
      name: user?.nom || "Utilisateur",
      email: user?.email || "inconnu",
    },
    navMain: [
      {
        title: "Mon compte",
        url: `/account/${userId}`,
        icon: SquareUserRound
      },
      {
        title: "Mes déclarations",
        url: `/declarations-client/${userId}`,
        icon: FolderOpen,
      },
      {
        title: "Nouvelle déclaration",
        url: `/new-declaration/${userId}`,
        icon: FilePlus,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "mailto:contact@comptarial.ch",
        icon: LifeBuoy,
      },
      {
        title: "Politique de confidentialité",
        url: "/privacy-policy",
        icon: Shield,
      },
    ],
    projects: [
      {
        name: "bla",
        url: "#",
        icon: Frame,
      },
      {
        name: "bllalala",
        url: "#",
        icon: PieChart,
      },
      {
        name: "blalalalass",
        url: "#",
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="transition-all duration-300 ease-in-out"
      {...props}
    >
      <SidebarHeader>
        <div className="flex items-center justify-between py-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href={`/dashboard/${userId}`} passHref>
                  <div className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted transition-colors">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-all">
                      <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Comptarial</span>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {userId && <NotificationBell userId={userId} />}
        </div>
        <SidebarSeparator />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
