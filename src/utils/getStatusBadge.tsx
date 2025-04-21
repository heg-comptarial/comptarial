import { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";

export function getStatusBadge(status: string): ReactElement {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500">Approuvé</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">En attente</Badge>;
    case "rejected":
      return <Badge className="bg-red-500">Rejeté</Badge>;
    default:
      return <Badge>Inconnu</Badge>;
  }
}