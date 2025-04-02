"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Edit } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";  // Importer le composant

export default function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {  
    fetch("http://localhost:3001/api/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-8">
          Infos générales (page s&apos;inscrire)
          <p>Backend Response: {message}</p>
        </h1>

        <div className="space-y-6 mb-12"></div>

        <div className="flex items-center justify-between mt-16">
          <h2 className="text-xl font-medium">Grand livre (pdf à consulter)</h2>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="icon">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
