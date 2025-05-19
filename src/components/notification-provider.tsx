"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { NotificationService } from "@/services/notification-service"
import { NotificationToast } from "@/components/ui/notification-toast"

interface Notification {
  notification_id: number
  user_id: number
  contenu: string
  dateCreation: string
  isRead: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  fetchNotifications: (userId: number) => Promise<void>
  markAsRead: (notificationId: number) => Promise<void>
  markAllAsRead: (userId: number) => Promise<void>
  createDocumentCommentNotification: (adminId: number, documentId: number, contenu: string) => Promise<void>
  createDocumentStatusNotification: (documentId: number, status: "approved" | "rejected" | "pending") => Promise<void>
  createDeclarationStatusNotification: (
    declarationId: number,
    status: "approved" | "rejected" | "pending",
  ) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  createDocumentCommentNotification: async () => {},
  createDocumentStatusNotification: async () => {},
  createDeclarationStatusNotification: async () => {},
})

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null)

  const fetchNotifications = async (userId: number) => {
    try {
      const data = await NotificationService.getUserNotifications(userId)
      setNotifications(data)
      setUnreadCount(data.filter((notif: Notification) => !notif.isRead).length)
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      await NotificationService.markAsRead(notificationId)

      // Mettre à jour l'état local
      setNotifications(
        notifications.map((notif) => (notif.notification_id === notificationId ? { ...notif, isRead: true } : notif)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error)
    }
  }

  const markAllAsRead = async (userId: number) => {
    try {
      await NotificationService.markAllAsRead(userId)

      // Mettre à jour l'état local
      setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications comme lues:", error)
    }
  }

  const createDocumentCommentNotification = async (adminId: number, documentId: number, contenu: string) => {
    try {
      const newNotification = await NotificationService.createDocumentCommentNotification(adminId, documentId, contenu)
      setLatestNotification(newNotification)

      // Mettre à jour l'état local
      setNotifications((prev) => [newNotification, ...prev])
      setUnreadCount((prev) => prev + 1)
    } catch (error) {
      console.error("Erreur lors de la création de la notification de commentaire:", error)
    }
  }

  const createDocumentStatusNotification = async (documentId: number, status: "approved" | "rejected" | "pending") => {
    try {
      const newNotification = await NotificationService.createDocumentStatusNotification(documentId, status)
      setLatestNotification(newNotification)

      // Mettre à jour l'état local
      setNotifications((prev) => [newNotification, ...prev])
      setUnreadCount((prev) => prev + 1)
    } catch (error) {
      console.error("Erreur lors de la création de la notification de statut de document:", error)
    }
  }

  const createDeclarationStatusNotification = async (
    declarationId: number,
    status: "approved" | "rejected" | "pending",
  ) => {
    try {
      const newNotification = await NotificationService.createDeclarationStatusNotification(declarationId, status)
      setLatestNotification(newNotification)

      // Mettre à jour l'état local
      setNotifications((prev) => [newNotification, ...prev])
      setUnreadCount((prev) => prev + 1)
    } catch (error) {
      console.error("Erreur lors de la création de la notification de statut de déclaration:", error)
    }
  }

  // Effet pour afficher un toast lorsqu'une nouvelle notification est créée
  useEffect(() => {
    if (latestNotification) {
      // Afficher un toast pour la nouvelle notification
    }
  }, [latestNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        createDocumentCommentNotification,
        createDocumentStatusNotification,
        createDeclarationStatusNotification,
      }}
    >
      {children}
      {latestNotification && <NotificationToast message={latestNotification.contenu} type="info" />}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
