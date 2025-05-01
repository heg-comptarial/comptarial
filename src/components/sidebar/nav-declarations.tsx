"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  SquareUserRound,
  ChevronRight,
  Settings,
  LogOut,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const POSSIBLE_TITLES = ["Comptabilité", "TVA", "Salaires", "Administration", "Fiscalité", "Divers"];

type Declaration = {
  titre: string;
};

export function NavDeclarations({ userId }: { userId: number }) {
  const [tabs, setTabs] = useState<string[]>([]);

  useEffect(() => {
    const fetchDeclarations = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/users/${userId}`);
        if (!res.ok) return;

        const data: { declarations: Declaration[] } = await res.json();

        const uniqueTitles = Array.from(
          new Set(data.declarations.map((d: Declaration) => d.titre))
        ).filter((titre) => POSSIBLE_TITLES.includes(titre));

        setTabs(uniqueTitles);
      } catch (error) {
        console.error("Erreur lors du fetch des déclarations :", error);
      }
    };

    fetchDeclarations();
  }, [userId]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {/* Onglet "Mon compte" avec sous-menus */}
        <Collapsible defaultOpen>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Mon compte">
              <Link href={`/account/${userId}`}>
                <SquareUserRound />
                <span>Mon compte</span>
              </Link>
            </SidebarMenuButton>

            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight />
              </SidebarMenuAction>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        {/* Onglets dynamiques des déclarations */}
        {tabs.map((titre) => (
          <SidebarMenuItem key={titre}>
            <SidebarMenuButton asChild tooltip={titre}>
              <Link href={`/declarations-client/${userId}?type=${encodeURIComponent(titre)}`}>
                <FolderOpen />
                <span>{titre}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
