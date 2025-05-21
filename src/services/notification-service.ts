import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export const NotificationService = {
  // Créer une notification pour un commentaire sur un document
  createDocumentCommentNotification: async (adminId: number, documentId: number, contenu: string) => {
    try {
      const response = await axios.post(`${API_URL}/notifications/document-comment`, {
        admin_id: adminId,
        document_id: documentId,
        contenu,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la création de la notification de commentaire:", error)
      throw error
    }
  },

  // Créer une notification pour un changement de statut d'un document
  createDocumentStatusNotification: async (documentId: number, status: "approved" | "rejected" | "pending") => {
    try {
      const response = await axios.post(`${API_URL}/notifications/document-status`, {
        document_id: documentId,
        status,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la création de la notification de statut de document:", error)
      throw error
    }
  },

  // Créer une notification pour un changement de statut d'une déclaration
  createDeclarationStatusNotification: async (declarationId: number, status: "approved" | "rejected" | "pending") => {
    try {
      const response = await axios.post(`${API_URL}/notifications/declaration-status`, {
        declaration_id: declarationId,
        status,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la création de la notification de statut de déclaration:", error)
      throw error
    }
  },

  // Récupérer les notifications d'un utilisateur
  getUserNotifications: async (userId: number) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/notifications`)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error)
      throw error
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (notificationId: number) => {
    try {
      const response = await axios.patch(`${API_URL}/notifications/${notificationId}`, {
        isRead: true,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors du marquage de la notification comme lue:", error)
      throw error
    }
  },

  // Marquer toutes les notifications d'un utilisateur comme lues
  markAllAsRead: async (userId: number) => {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/notifications/mark-all-read`)
      return response.data
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications comme lues:", error)
      throw error
    }
  },

  // Créer une notification pour une nouvelle déclaration
  createNewDeclarationNotification: async (userId: number, declarationId: number) => {
    try {
      const response = await axios.post(`${API_URL}/notifications/new-declaration`, {
        user_id: userId,
        declaration_id: declarationId,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la création de la notification de nouvelle déclaration:", error)
      throw error
    }
  },

  // Créer une notification pour un nouveau document
  createNewDocumentNotification: async (userId: number, documentId: number) => {
    try {
      const response = await axios.post(`${API_URL}/notifications/new-document`, {
        user_id: userId,
        document_id: documentId,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de la création de la notification de nouveau document:", error)
      throw error
    }
  },

  
}
