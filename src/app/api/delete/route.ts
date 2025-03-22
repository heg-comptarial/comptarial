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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");
    const year = searchParams.get("year"); // Retrieve year from query params

    if (!fileName || !year) {
      return NextResponse.json(
        { error: "File name and year are required" },
        { status: 400 }
      );
    }

    console.log("Trying to delete file:", fileName, "from year:", year);

    // Hardcoded user (replace with session-based user retrieval)
    const user = "user1";
    const fileKey = `${year}/${user}/${fileName}`;

    console.log("Deleting file with key:", fileKey);

    // Set the parameters for the S3 deleteObject call
    const params = {
      Bucket: s3BucketName,
      Key: fileKey,
    };

    // Delete the file from S3
    await s3.deleteObject(params).promise();

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
