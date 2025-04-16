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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");
    const year = searchParams.get("year");
    const userId = searchParams.get("userId");
    const rubriqueName = searchParams.get("rubriqueName");

    console.log("DOWNLOAD PARAMS:", { fileName, year, userId, rubriqueName });

    if (!fileName || !year || !userId || !rubriqueName) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const key = `${userId}/${year}/${rubriqueName}/${fileName}`;
    console.log("S3 KEY:", key);

    const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();

    return new NextResponse(s3Object.Body as Buffer, {
      status: 200,
      headers: {
        "Content-Type": s3Object.ContentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (err) {
    console.error("Download failed:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
