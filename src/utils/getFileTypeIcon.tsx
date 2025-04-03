"use client";

import { FileText, FileImage, FileSpreadsheet } from "lucide-react";
import type { ReactElement } from "react";

export function getFileTypeIcon(fileName: string): ReactElement {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return <FileText className="h-4 w-4 text-red-500" />;
    case "doc":
    case "docx":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "xls":
    case "xlsx":
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    case "jpg":
    case "jpeg":
    case "png":
      return <FileImage className="h-4 w-4 text-purple-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
}
