"use client";

import React, { useState, useEffect } from "react";
import { allowedFileTypes } from "../../../utils/allowedFileTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Download, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast, Toaster } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute"; // Importer le composant ProtectedRoute

const years = Array.from({ length: 20 }, (_, i) => 2020 + i);

interface FileData {
  name: string;
  type: string;
  size: number;
  url: string;
  lastModified: number;
}

export default function Page() {
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    if (selectedYear) {
      fetchFiles(selectedYear);
    }
  }, [selectedYear]);

  const fetchFiles = async (year: string) => {
    try {
      const response = await fetch(`/api/list?year=${encodeURIComponent(year)}`);
      const data = await response.json();
      if (response.ok) {
        setFiles(data.files);
      } else {
        toast.error("Failed to fetch files", {
          description: data.error || "An error occurred while fetching files.",
        });
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Fetch error", {
        description: "An unexpected error occurred while fetching files.",
      });
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedYear) return;

    const selectedFile = e.target.files[0];

    if (!allowedFileTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type", {
        description: "Only documents and images are allowed.",
      });
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("year", selectedYear);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        fetchFiles(selectedYear); // Refresh the file list
        toast.success("Upload successful", {
          description: `${selectedFile.name} has been uploaded.`,
        });
      } else {
        toast.error("Upload failed", {
          description: data.error || "An error occurred during upload.",
        });
      }
    } catch {
      toast.error("Upload error", {
        description: "An unexpected error occurred during upload.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (file: FileData) => {
    if (!selectedYear) return;

    const fileName = file.name;
    const downloadUrl = `/api/download?fileName=${encodeURIComponent(
      fileName
    )}&year=${encodeURIComponent(selectedYear)}`;

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error("File download failed");
      }

      const blob = await response.blob();
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;
      downloadLink.click();

      toast.success("Download successful", {
        description: `${fileName} has been downloaded.`,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Download failed", {
        description: "An error occurred while downloading the file.",
      });
    }
  };

  const handleDelete = async (file: FileData) => {
    if (!selectedYear) return;

    try {
      const response = await fetch(
        `/api/delete?fileName=${encodeURIComponent(
          file.name
        )}&year=${encodeURIComponent(selectedYear)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setFiles(files.filter((f) => f.name !== file.name));
        toast.success("File deleted", {
          description: "File has been deleted successfully.",
        });
      } else {
        toast.error("Delete failed", {
          description: data.error || "Error deleting file.",
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Delete error", {
        description: "An unexpected error occurred while deleting the file.",
      });
    }
  };

  return (
    <ProtectedRoute> {/* Envelopper la page dans le composant ProtectedRoute */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Toaster position="bottom-right" richColors />

        <Card className="w-full md:w-3/4 lg:w-3/4">
          <CardHeader>
            <CardTitle>Déclarations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="year-select">Select Year</Label>
              <Select onValueChange={handleYearChange} value={selectedYear}>
                <SelectTrigger id="year-select" className="w-full">
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedYear && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">
                    Files for {selectedYear}
                  </h3>
                  {files.length > 0 ? (
                    files.map((file) => (
                      <Card key={file.name} className="mb-4">
                        <CardContent className="p-6">
                          <p className="font-medium text-lg break-all">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {(file.size / 1048576).toFixed(1)} MB
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Last modified:{" "}
                            {new Date(file.lastModified).toLocaleString()}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between bg-gray-50 p-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="h-4 w-4 mr-1" /> Download
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(file)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="space-y-4">
                      <Label htmlFor="file-upload" className="block">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm font-medium">
                            Drag and drop a file, or click to select
                          </p>
                        </div>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleUpload}
                      />
                    </div>
                  )}
                  {isUploading && (
                    <Alert className="mt-4">
                      <AlertDescription>Uploading file...</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute> /* Fermeture du composant ProtectedRoute */
  );
}
