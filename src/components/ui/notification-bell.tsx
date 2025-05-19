"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import axios from "axios"

interface Notification {
  notification_id: number
  user_id: number
  contenu: string
  dateCreation: string
  isRead?: boolean
}

export function NotificationBell({ userId }: { userId: number }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/users/${userId}/notifications`,
      )
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

  const handleOpen = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`p-4 hover:bg-muted transition-colors ${!notification.isRead ? "bg-muted/50" : ""}`}
                  onClick={() => !notification.isRead && markAsRead(notification.notification_id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium">{notification.contenu}</p>
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
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Aucune notification</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
