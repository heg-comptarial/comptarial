"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"

interface Notification {
  notification_id: number
  user_id: number
  contenu: string
  dateCreation: string
  isRead?: boolean
  resource_type?: string
  resource_id?: number
  target_user_id?: number
}

export function NotificationBellAdmin({ userId, adminId }: { userId: number; adminId: number }) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchNotifications = async () => {
    if (!userId) {
      console.error("ID utilisateur non défini")
      return
    }

    try {
      //console.log("Récupération des notifications pour l'administrateur:", userId)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/users/${userId}/notifications`,
      )
      // console.log("Notifications reçues:", response.data)
      setNotifications(response.data)
      setUnreadCount(response.data.filter((notif: Notification) => !notif.isRead).length)
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchNotifications()

      // Mettre en place un polling pour vérifier les nouvelles notifications
      const interval = setInterval(fetchNotifications, 30000) // Toutes les 30 secondes

      return () => clearInterval(interval)
    }
  }, [userId])

  const markAsRead = async (notificationId: number) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/notifications/${notificationId}`,
        {
          isRead: true,
        },
      )

      // Mettre à jour l'état local
      setNotifications(
        notifications.map((notif) => (notif.notification_id === notificationId ? { ...notif, isRead: true } : notif)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/users/${userId}/notifications/mark-all-read`,
      )

      // Mettre à jour l'état local
      setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications comme lues:", error)
    }
  }

  const deleteNotification = async (notificationId: number, event: React.MouseEvent) => {
    event.stopPropagation() // Empêcher la navigation ou le marquage comme lu

    try {
      setIsDeleting(true)
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/notifications/${notificationId}`,
      )

      // Mettre à jour l'état local
      const updatedNotifications = notifications.filter((notif) => notif.notification_id !== notificationId)
      setNotifications(updatedNotifications)

      // Mettre à jour le compteur de notifications non lues
      if (notifications.find((n) => n.notification_id === notificationId)?.isRead === false) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }

      toast.success("Notification supprimée")
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error)
      toast.error("Erreur lors de la suppression de la notification")
    } finally {
      setIsDeleting(false)
    }
  }

  const deleteAllNotifications = async () => {
    try {
      setIsDeleting(true)
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/users/${userId}/notifications`,
      )

      // Mettre à jour l'état local
      setNotifications([])
      setUnreadCount(0)
      toast.success("Toutes les notifications ont été supprimées")
    } catch (error) {
      console.error("Erreur lors de la suppression des notifications:", error)
      toast.error("Erreur lors de la suppression des notifications")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Marquer comme lu si ce n'est pas déjà fait
    if (!notification.isRead) {
      markAsRead(notification.notification_id)
    }

    // Fermer le popover
    setIsOpen(false)

    //console.log("=== NOTIFICATION ADMIN CLICK DEBUG ===")
    //console.log("Notification complète:", notification)
    //console.log("Admin ID:", adminId)

    // Extraire l'ID client de la notification
    let clientId = notification.target_user_id

    // Si target_user_id n'est pas disponible, essayer d'extraire l'ID du contenu
    if (!clientId) {
      // Rechercher spécifiquement "Client ID: X" dans le contenu
      const clientIdMatch = notification.contenu.match(/Client ID: (\d+)/)
      if (clientIdMatch && clientIdMatch[1]) {
        clientId = Number.parseInt(clientIdMatch[1])
        // console.log("ID client extrait du contenu (format Client ID):", clientId)
      } else {
        // Fallback à l'ancienne méthode
        const idMatch = notification.contenu.match(/$$ID: (\d+)$$/)
        if (idMatch && idMatch[1]) {
          clientId = Number.parseInt(idMatch[1])
          // console.log("ID client extrait du contenu (format ID):", clientId)
        }
      }
    }

    console.log("ID client final:", clientId)

    // Construire l'URL pour l'admin
    let url = ""

    if (clientId) {
      // Format de l'URL admin: /admin/{adminId}/client/{clientId}
      url = `/admin/${adminId}/client/${clientId}`

      // Ajouter des paramètres supplémentaires si nécessaire
      if (notification.resource_type === "document" && notification.resource_id) {
        url += `?document=${notification.resource_id}`
      } else if (notification.resource_type === "declaration" && notification.resource_id) {
        url += `?declaration=${notification.resource_id}`
      }
    } else {
      // Si on n'a pas d'ID client, rediriger vers le tableau de bord admin
      url = `/admin/${adminId}`
    }

    console.log("URL finale générée:", url)

    // Vérifier que l'URL ne contient pas "null" ou "undefined"
    if (url.includes("null") || url.includes("undefined")) {
      console.error("URL invalide générée:", url)
      toast.error("Impossible d'accéder à cette ressource")
      return
    }

    // Naviguer vers l'URL
    console.log("Navigation vers:", url)
    router.push(url)
  }

  const handleOpen = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications Admin</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Tout marquer comme lu
              </Button>
            )}
            
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`p-4 hover:bg-muted transition-colors ${!notification.isRead ? "bg-muted/50" : ""} relative cursor-pointer`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium pr-6">
                        {notification.contenu.replace(/\s*\(Client ID:.*?\)/g, "").trim()}
                    </p>
                    {!notification.isRead && (
                      <Badge variant="secondary" className="ml-2">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.dateCreation), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={(e) => deleteNotification(notification.notification_id, e)}
                    disabled={isDeleting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Aucune notification</p>
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
            <div className="flex justify-end px-4 py-2">
                <Button
                variant="ghost"
                size="sm"
                onClick={deleteAllNotifications}
                disabled={isDeleting}
                className="text-destructive hover:text-destructive"
                >
                <Trash2 className="h-4 w-4 mr-1" />
                    Tout supprimer
                </Button>
            </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
