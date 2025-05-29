"use client";

import * as React from "react";
import Link from "next/link";
import { Command, Frame, LifeBuoy, Map, PieChart, Shield, SquareUserRound } from 'lucide-react';
import axios from "axios";
import { notFound } from "next/navigation";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUserAdmin } from "@/components/sidebar/nav-user-admin";
import { NotificationBellAdmin } from "@/components/ui/notification-bell-admin";
import { useSidebar } from "@/components/ui/sidebar";

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

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const userId = Number(params?.userId);
  const { close } = useSidebar();

  const [user, setUser] = React.useState<{ name: string; email: string; avatar?: string }>({
    name: "",
    email: "",
    avatar: "",
  });
  const [authentifie, setAuthentifie] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser({
          name: response.data.nom || response.data.name || "Admin",
          email: response.data.email,
          avatar: response.data.avatar || "/images/avatar.png",
        });
        setAuthentifie(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser({
          name: "Admin inconnu",
          email: "",
          avatar: "/images/avatar.png",
        });
        setAuthentifie(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (authentifie === null) {
    return null;
  }

  if (!authentifie) {
    return notFound();
  }

  const data = {
    user,
    navMain: [
      {
        title: "Mon compte",
        url: `/account-admin/${userId}`,
        icon: SquareUserRound
      },
      {
        title: "Dashboard",
        url: `/admin/${userId}`,
        icon: Command,
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

  const handleMenuClick = () => {
    if (window.innerWidth < 640) close();
  };

  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between py-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild onClick={handleMenuClick}>
                <Link href={`/admin/${userId}`} passHref>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Comptarial</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {userId && <NotificationBellAdmin userId={userId} adminId={userId} />}
        </div>
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.map(item => ({
            ...item,
            onClick: handleMenuClick,
          }))}
        />
        <NavSecondary
          items={data.navSecondary.map(item => ({
            ...item,
            onClick: handleMenuClick,
          }))}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUserAdmin user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}