"use client";

import * as React from "react";
import {
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  // Upload,
  Shield,
  FolderOpen,
  SquareUserRound,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
// import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // {
      // title: "Mes documents",
      // url: "/browse",
      // icon: FolderOpen,
      // items: [
        // {
          // title: "Comptabilité",
          // url: "#",
        // },
        // {
          // title: "Fiscalité",
          // url: "#",
        // },
        // {
          // title: "Ressources Humaines",
          // url: "#",
        // },
        // {
          // title: "Administratif",
          // url: "#",
        // },
        // {
          // title: "Autres",
          // url: "#",
        // },
      // ],
    // },
    {
      title: "Mon compte",
      url: "/account",
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
      title: "Mes déclarations",
      url: "/declarations",
      icon: FolderOpen,
      items: [],
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Comptarial</span>
                  <span className="truncate text-xs">Fiduciaire</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
