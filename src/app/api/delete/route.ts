// app/api/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(process.env.INFOMANIAK_ENDPOINT!),
  accessKeyId: process.env.INFOMANIAK_ACCESS_KEY!,
  secretAccessKey: process.env.INFOMANIAK_SECRECT_KEY!,
  region: process.env.INFOMANIAK_REGION!,
  s3ForcePathStyle: true,
});

const bucket = process.env.INFOMANIAK_PROJECT_NAME!;

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");
    const year = searchParams.get("year");
    const userId = searchParams.get("userId");
    const rubriqueName = searchParams.get("rubriqueName");

    if (!fileName || !year || !userId || !rubriqueName) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const key = `${userId}/${year}/${rubriqueName}/${fileName}`;

    await s3.deleteObject({ Bucket: bucket, Key: key }).promise();

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
