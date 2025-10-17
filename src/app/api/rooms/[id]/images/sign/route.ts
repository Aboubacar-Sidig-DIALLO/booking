import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Placeholder signé simple: retourne un nom d’objet et une URL fictive
export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const objectKey = `rooms/${id}/${crypto.randomUUID()}.png`;
  const uploadUrl = `${process.env.S3_BUCKET_URL ?? "https://example-bucket"}/${objectKey}`;
  return NextResponse.json({
    objectKey,
    uploadUrl,
    method: "PUT",
    headers: { "Content-Type": "image/png" },
  });
}
