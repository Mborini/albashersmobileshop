import { NextResponse } from "next/server";
import {
  S3Client,
  GetBucketLocationCommand,
  GetBucketVersioningCommand,
  GetBucketEncryptionCommand,
  GetBucketPolicyStatusCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  const bucketName = "albasheermblshop";

  try {
    // Region
    const locationRes = await s3.send(new GetBucketLocationCommand({ Bucket: bucketName }));
    const region = locationRes.LocationConstraint ?? "us-east-1";

    // Versioning
    const versioningRes = await s3.send(new GetBucketVersioningCommand({ Bucket: bucketName }));
    const versioning = versioningRes.Status === "Enabled";

    // Encryption
    let encryption = false;
    try {
      await s3.send(new GetBucketEncryptionCommand({ Bucket: bucketName }));
      encryption = true;
    } catch {}

    // Public Access
    let isPublic = false;
    try {
      const policyStatus = await s3.send(new GetBucketPolicyStatusCommand({ Bucket: bucketName }));
      isPublic = policyStatus.PolicyStatus?.IsPublic ?? false;
    } catch {}

    // Size & Count
    let totalSize = 0;
    let totalCount = 0;
    let continuationToken: string | undefined = undefined;

    do {
      const response = await s3.send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          ContinuationToken: continuationToken,
        })
      );

      const contents = response.Contents ?? [];
      totalCount += contents.length;
      totalSize += contents.reduce((sum, item) => sum + (item.Size || 0), 0);

      continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
    } while (continuationToken);

    return NextResponse.json({
      bucket: bucketName,
      region,
      versioning,
      encryption,
      isPublic,
      totalCount,
      totalSizeMB: totalSize / (1024 * 1024),
    });
  } catch (error) {
    console.error("Error fetching bucket info:", error);
    return NextResponse.json({ error: "Failed to retrieve bucket info" }, { status: 500 });
  }
}
