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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("File name:", file.name); // Log file name for debugging

    const buffer = await file.arrayBuffer();
    const fileName = file.name;
    const fileBuffer = Buffer.from(buffer);

    // Hardcoded year (you can replace this with dynamic logic later)
    const year = new Date().getFullYear().toString();

    // Hardcoded user (replace later with actual user logic) --> we will need to retrieve the user from the session
    const user = "user1"; // Placeholder user

    // Set the file path structure to: year/user/fileName
    const fileKey = `${year}/${user}/${fileName}`;

    console.log("Uploading file with key:", fileKey); // Log the upload path

    // Set the parameters for the S3 upload
    const params = {
      Bucket: s3BucketName,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: file.type,
    };

    // Upload the file to S3
    await s3.upload(params).promise();

    // Return the file URL
    return NextResponse.json({
      url: `https://${s3Endpoint}/${s3BucketName}/${fileKey}`,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
