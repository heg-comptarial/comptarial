"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useParams } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const params = useParams();
  const userId = Number(params?.userId);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Déconnexion réussie");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        router.push("/login");
      } else {
        console.error("Erreur lors de la déconnexion", response.data);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la déconnexion", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Image
                  src="/images/avatar.png"
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Image
                  src="/images/avatar.png"
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={`/account/${userId}`}
                  className="flex items-center gap-2"
                >
                  <BadgeCheck />
                  Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
