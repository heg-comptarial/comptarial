import { type NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import { allowedFileTypes } from "@/utils/allowedFileTypes";

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.INFOMANIAK_ENDPOINT!),
  accessKeyId: process.env.INFOMANIAK_ACCESS_KEY!,
  secretAccessKey: process.env.INFOMANIAK_SECRECT_KEY!,
  region: process.env.INFOMANIAK_REGION!,
  s3ForcePathStyle: true,
});

const bucket = process.env.INFOMANIAK_PROJECT_NAME!;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const year = formData.get("year") as string;
    const userId = formData.get("userId") as string;
    const rubriqueName = formData.get("rubriqueName") as string;

    if (!file || !userId || !year || !rubriqueName) {
      return NextResponse.json(
        { error: "Missing required file or metadata" },
        { status: 400 }
      );
    }

    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const fileKey = `${userId}/${year}/${rubriqueName}/${fileName}`;

    const uploadResult = await s3
      .upload({
        Bucket: bucket,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      })
      .promise();

    return NextResponse.json({
      url: uploadResult.Location,
      key: fileKey,
      fileName,
      fileType: file.type,
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
