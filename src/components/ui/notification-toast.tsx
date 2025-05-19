"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { Bell } from "lucide-react"

interface NotificationToastProps {
  message: string
  type?: "success" | "error" | "info" | "warning"
}

export function NotificationToast({ message, type = "info" }: NotificationToastProps) {
  useEffect(() => {
    // Afficher la notification toast
    switch (type) {
      case "success":
        toast.success(message, {
          icon: <Bell className="h-4 w-4" />,
          duration: 5000,
        })
        break
      case "error":
        toast.error(message, {
          icon: <Bell className="h-4 w-4" />,
          duration: 5000,
        })
        break
      case "warning":
        toast.warning(message, {
          icon: <Bell className="h-4 w-4" />,
          duration: 5000,
        })
        break
      default:
        toast.info(message, {
          icon: <Bell className="h-4 w-4" />,
          duration: 5000,
        })
        break
    }
  }, [message, type])

  // Ce composant ne rend rien visuellement
  return null
}
