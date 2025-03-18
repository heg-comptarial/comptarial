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

    console.log("Trying to fetch file:", fileName, "from year:", year);

    // Hardcoded user (replace with session-based user retrieval)
    const user = "user1";
    const fileKey = `${year}/${user}/${fileName}`;

    console.log("Fetching file with key:", fileKey);

    // Set the parameters for the S3 getObject call
    const params = {
      Bucket: s3BucketName,
      Key: fileKey,
    };

    // Fetch the file from the S3 bucket
    const s3Object = await s3.getObject(params).promise();

    // Return the file as a stream with the appropriate headers
    return new NextResponse(s3Object.Body as Buffer, {
      status: 200,
      headers: {
        "Content-Type": s3Object.ContentType as string,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Download failed:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
