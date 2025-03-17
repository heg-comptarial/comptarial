"use client";

import { useState, useEffect } from "react";
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

const years = Array.from({ length: 20 }, (_, i) => 2020 + i);

interface FileData {
  name: string;
  type: string;
  size: number;
  url: string;
  lastModified: number;
}

export default function Page() {
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined
  );
  const [file, setFile] = useState<FileData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedYear = localStorage.getItem("selectedYear");
    if (savedYear) {
      setSelectedYear(savedYear);
    }
  }, []);

  useEffect(() => {
    if (!isClient || !selectedYear) return;
    const savedFile = localStorage.getItem(`file-${selectedYear}`);
    if (savedFile) {
      setFile(JSON.parse(savedFile));
    } else {
      setFile(null);
    }
  }, [selectedYear, isClient]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    localStorage.setItem("selectedYear", year);
    const savedFile = localStorage.getItem(`file-${year}`);
    if (savedFile) {
      setFile(JSON.parse(savedFile));
    } else {
      setFile(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedYear) return;

    const selectedFile = e.target.files[0];
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        const fileData: FileData = {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          url: data.url,
          lastModified: Date.now(),
        };
        localStorage.setItem(`file-${selectedYear}`, JSON.stringify(fileData));
        setFile(fileData);
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!file) return;

    const fileName = file.name;
    const downloadUrl = `/api/download?fileName=${encodeURIComponent(
      fileName
    )}`;

    // Use the fetch API to download the file
    try {
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error("File download failed");
      }

      // Create a Blob from the response and download the file
      const blob = await response.blob();
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedYear || !file) return;

    try {
      // Call the API to delete the file from S3
      const response = await fetch(
        `/api/delete?fileName=${encodeURIComponent(file.name)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Remove the file from local storage and update the UI
        localStorage.removeItem(`file-${selectedYear}`);
        setFile(null);
        alert("File deleted successfully.");
      } else {
        alert(data.error || "Error deleting file.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("An error occurred while deleting the file.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
                {file ? (
                  <Card>
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
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
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
                      onChange={handleFileChange}
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
  );
}
