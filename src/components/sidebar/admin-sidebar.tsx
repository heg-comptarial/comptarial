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

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUserAdmin } from "@/components/sidebar/nav-user-admin";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams()
  const userId = Number(params?.userId)

  const data = {
    user: {
      name: "Username",
      email: "Email",
      avatar: "/avatars/default.jpg",
    },
    navMain: [
      {
        title: "Mon compte",
        url: `/account-admin/${userId}`,
        icon: SquareUserRound,
        items: [
          {
            title: "Paramètres",
            url: "/settings",
          },
          {
            title: "Déconnexion",
            url: "/logout",
          },
        ],
      },
      {
        title: "Dashboard",
        url: `/admin/${userId}`,
        icon: Command,
      }
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
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`/admin/${userId}`} passHref>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Comptarial</span>
                  <span className="truncate text-xs">Fiduciaire</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUserAdmin user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
