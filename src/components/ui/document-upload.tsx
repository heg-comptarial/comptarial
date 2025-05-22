"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { NotificationService } from "@/services/notification-service"

interface DocumentUploadProps {
  userId: number
  declarationId: number
  rubriqueId: number
  sousRubriqueId?: number
  onUploadSuccess?: (documentId: number) => void
}

export function DocumentUpload({
  userId,
  declarationId,
  rubriqueId,
  sousRubriqueId,
  onUploadSuccess,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const clearFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadDocument = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier")
      return
    }

    setUploading(true)

    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        toast.error("Vous devez être connecté pour télécharger un document")
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("declaration_id", declarationId.toString())
      formData.append("rubrique_id", rubriqueId.toString())

      if (sousRubriqueId) {
        formData.append("sous_rubrique_id", sousRubriqueId.toString())
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/documents/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )

      if (response.data && response.data.document_id) {
        toast.success("Document téléchargé avec succès")

        // Notifier les administrateurs du nouveau document
        try {
          await NotificationService.createNewDocumentNotification(userId, response.data.document_id)
          console.log("Notification de nouveau document envoyée")
        } catch (notifError) {
          console.error("Erreur lors de l'envoi de la notification:", notifError)
          // Ne pas bloquer le processus si la notification échoue
        }

        // Appeler le callback si fourni
        if (onUploadSuccess) {
          onUploadSuccess(response.data.document_id)
        }

        clearFile()
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      toast.error("Erreur lors du téléchargement du document")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="document">Document</Label>
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            id="document"
            type="file"
            onChange={handleFileChange}
            className={file ? "hidden" : ""}
          />
          {file && (
            <div className="flex items-center gap-2 p-2 border rounded-md w-full">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm truncate flex-1">{file.name}</span>
              <Button variant="ghost" size="icon" onClick={clearFile} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {file && (
        <Button onClick={uploadDocument} disabled={uploading}>
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Téléchargement...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Télécharger
            </>
          )}
        </Button>
      )}
    </div>
  )
}
