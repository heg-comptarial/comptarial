import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";

// Ensure environment variables are set correctly
const s3Endpoint = process.env.INFOMANIAK_ENDPOINT!;
const s3Region = process.env.INFOMANIAK_REGION!;
const s3AccessKeyId = process.env.INFOMANIAK_ACCESS_KEY!;
const s3SecretAccessKey = process.env.INFOMANIAK_SECRECT_KEY!;
const s3BucketName = process.env.INFOMANIAK_PROJECT_NAME!;

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");

  if (!year) {
    return NextResponse.json({ error: "Year is required" }, { status: 400 });
  }

  // Hardcoded user (replace later with actual user logic, e.g., session-based user retrieval)
  const user = "user1";

  const prefix = `${year}/${user}/`;

  try {
    const params = {
      Bucket: s3BucketName,
      Prefix: prefix,
    };

    const data = await s3.listObjectsV2(params).promise();

    const files =
      data.Contents?.map((file) => ({
        name: file.Key?.replace(prefix, ""),
        type: file.Key?.split(".").pop() || "",
        size: file.Size || 0,
        url: `https://${s3Endpoint}/${s3BucketName}/${file.Key}`,
        lastModified: file.LastModified?.getTime() || Date.now(),
      })) || [];

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
