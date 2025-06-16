import { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";

export function getStatusBadge(status: string): ReactElement {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-200 text-green-800">Approuvé</Badge>;
    case "pending":
      return (
        <Badge className="bg-yellow-200 text-yellow-800">En attente</Badge>
      );
    case "rejected":
      return <Badge className="bg-red-200 text-red-800">Rejeté</Badge>;
    case "archived":
      return <Badge className="bg-gray-200 text-gray-800">Archivé</Badge>;
    default:
      return <Badge>Inconnu</Badge>;
  }
}
