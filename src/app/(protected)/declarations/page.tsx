"use client";

import type React from "react";

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
import { Trash2, Download, Upload, FileText } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";

const years = Array.from({ length: 20 }, (_, i) => 2020 + i); // Generates years from 2020 to 2039

interface FileData {
  name: string;
  type: string;
  size: number;
  data: string; // base64 encoded file
  lastModified: number;
}

export default function Page() {
  // Initialize with undefined to avoid hydration mismatch
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined
  );
  const [file, setFile] = useState<FileData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once the component mounts on the client
  useEffect(() => {
    setIsClient(true);

    // Load the selected year from localStorage
    const savedYear = localStorage.getItem("selectedYear");
    if (savedYear) {
      setSelectedYear(savedYear);
    }
  }, []);

  // Load file from localStorage when year changes
  useEffect(() => {
    if (!isClient || !selectedYear) return;

    const savedFile = localStorage.getItem(`file-${selectedYear}`);
    if (savedFile) {
      setFile(JSON.parse(savedFile));
    } else {
      setFile(null);
    }
  }, [selectedYear, isClient]);

  // Update the handleYearChange function to keep files when selecting a different year
  // Replace the entire handleYearChange function with this simplified version:

  const handleYearChange = (year: string) => {
    // Update the selected year
    setSelectedYear(year);
    localStorage.setItem("selectedYear", year);

    // Check if there's a file for the newly selected year
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

    try {
      // Read file as base64
      const base64 = await readFileAsBase64(selectedFile);

      const fileData: FileData = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        data: base64,
        lastModified: Date.now(),
      };

      // Save to localStorage
      localStorage.setItem(`file-${selectedYear}`, JSON.stringify(fileData));
      setFile(fileData);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!file) return;

    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (!selectedYear) return;

    localStorage.removeItem(`file-${selectedYear}`);
    setFile(null);
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith("image/")) {
      <Image
        src={file?.data || "/placeholder.svg"}
        alt={file?.name || "placeholder"}
        layout="fill"
        objectFit="contain"
        className="max-w-full max-h-full"
      />;
    }
    return <FileText className="w-24 h-24 text-gray-400" />;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full md:w-3/4 lg:w-3/4">
        <CardHeader>
          <CardTitle>File Manager</CardTitle>
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
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="flex-shrink-0 flex items-center justify-center w-40 h-40">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="text-center md:text-left flex-grow">
                          <p className="font-medium text-lg break-all">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatFileSize(file.size)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Last modified:{" "}
                            {new Date(file.lastModified).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap md:flex-nowrap justify-between bg-gray-50 p-4 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="w-full md:w-auto"
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                      <div className="flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 space-x-0 md:space-x-2 w-full md:w-auto justify-end">
                        <Label
                          htmlFor="replace-file"
                          className="cursor-pointer w-full md:w-auto"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full md:w-auto"
                            asChild
                          >
                            <span>
                              <Upload className="h-4 w-4 mr-1" /> Replace
                            </span>
                          </Button>
                        </Label>
                        <Input
                          id="replace-file"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDelete}
                          className="w-full md:w-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
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
                        <p className="mt-1 text-xs text-gray-500">
                          Upload any file for the year {selectedYear}
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
