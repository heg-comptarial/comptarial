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

    const buffer = Buffer.from(await file.arrayBuffer()); // Avoid the experimental warning
    const fileName = `${Date.now()}-${file.name}`;

    // Set the parameters for the S3 upload
    const params = {
      Bucket: s3BucketName, // Ensure this is the correct bucket name
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read", // You can change this to another access level as per your requirements
    };

    // Upload the file to the S3 bucket
    await s3.upload(params).promise();

    // Return the file URL from the S3 bucket
    const fileUrl = `${s3Endpoint}/${s3BucketName}/${fileName}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
