import { type NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import { allowedFileTypes } from "@/utils/allowedFileTypes";

// Use the same environment variable names as your working route
const s3Endpoint = process.env.INFOMANIAK_ENDPOINT!;
const s3Region = process.env.INFOMANIAK_REGION!;
const s3AccessKeyId = process.env.INFOMANIAK_ACCESS_KEY!;
const s3SecretAccessKey = process.env.INFOMANIAK_SECRECT_KEY!;
const s3BucketName = process.env.INFOMANIAK_PROJECT_NAME!;

// Log the configuration for debugging
console.log("S3 Configuration:", {
  endpoint: s3Endpoint ? "Set" : "Missing",
  region: s3Region ? "Set" : "Missing",
  accessKey: s3AccessKeyId ? "Set" : "Missing",
  secretKey: s3SecretAccessKey ? "Set" : "Missing",
  bucket: s3BucketName ? "Set" : "Missing",
});

// Configure AWS S3
AWS.config.update({
  accessKeyId: s3AccessKeyId,
  secretAccessKey: s3SecretAccessKey,
  region: s3Region,
});

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(s3Endpoint),
  s3ForcePathStyle: true, // Required for some S3-compatible APIs like Infomaniak
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const year = formData.get("year") as string;
    const userId = formData.get("userId") as string;
    const rubriqueId = formData.get("rubriqueId") as string;
    const rubriqueName = formData.get("rubriqueName") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!userId || !year || !rubriqueId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const fileName = file.name;
    const fileBuffer = Buffer.from(buffer);

    // Set the file path structure to: {user}/{year}/{rubrique}/{fileName}
    const fileKey = `${userId}/${year}/${rubriqueName}/${fileName}`;

    console.log("Uploading file with key:", fileKey);

    // Set the parameters for the S3 upload
    const params = {
      Bucket: s3BucketName,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: file.type,
    };

    // Upload the file to S3
    const uploadResult = await s3.upload(params).promise();

    // Return the file URL and details
    return NextResponse.json({
      url: uploadResult.Location,
      key: fileKey,
      fileName: fileName,
      fileType: file.type.split("/").pop() || "other",
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
