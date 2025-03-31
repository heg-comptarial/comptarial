import { type NextRequest, NextResponse } from "next/server";

interface DocumentToSave {
  rubriqueId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
}

export async function POST(req: NextRequest) {
  try {
    const { documents } = (await req.json()) as { documents: DocumentToSave[] };

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json(
        { error: "No documents provided" },
        { status: 400 }
      );
    }

    // Map file types to the enum values in the database
    const mapFileType = (type: string): string => {
      const typeMap: Record<string, string> = {
        pdf: "pdf",
        doc: "doc",
        docx: "doc",
        xls: "xls",
        xlsx: "xls",
        ppt: "ppt",
        pptx: "ppt",
        jpg: "jpg",
        jpeg: "jpeg",
        png: "png",
      };
      return typeMap[type.toLowerCase()] || "other";
    };

    // Prepare documents for database insertion
    const documentsToSave = documents.map((doc) => ({
      rubrique_id: doc.rubriqueId,
      nom: doc.fileName,
      type: mapFileType(doc.fileType),
      cheminFichier: doc.url,
      statut: "pending",
      sous_rubrique: "default",
    }));

    // Make a request to your backend API to save the documents
    const response = await fetch("http://127.0.0.1:8000/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documents: documentsToSave }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save documents: ${errorText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      savedCount: documentsToSave.length,
      result,
    });
  } catch (error) {
    console.error("Error saving documents:", error);
    return NextResponse.json(
      {
        error: "Failed to save documents",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
