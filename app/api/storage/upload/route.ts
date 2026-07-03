import { NextResponse } from "next/server";

import { getHomepageStorageBuckets, getSupabaseStorageBucket } from "../../../../lib/env";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "../../../../lib/supabase/server";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function cleanName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96) || "image";
}

function pickBucket(kind: string) {
  const homepageBuckets = getHomepageStorageBuckets();
  if (kind === "homepage-hero") return { bucket: homepageBuckets.hero, publicBucket: true, folder: "hero" };
  if (kind === "homepage-workflow") return { bucket: homepageBuckets.workflow, publicBucket: true, folder: "workflow" };
  if (kind === "homepage-template") return { bucket: homepageBuckets.templates, publicBucket: true, folder: "templates" };
  return { bucket: getSupabaseStorageBucket(), publicBucket: false, folder: "report-photos" };
}

function sizeFromUpload(file: File, widthValue: FormDataEntryValue | null, heightValue: FormDataEntryValue | null) {
  const width = Number(widthValue || 0);
  const height = Number(heightValue || 0);
  if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) return { width, height };
  const match = file.name.match(/(?:^|[-_])(\d{3,5})x(\d{3,5})(?:[-_.]|$)/);
  return { width: match ? Number(match[1]) : null, height: match ? Number(match[2]) : null };
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Gunakan multipart/form-data dengan field file." }, { status: 400 });
    }
    const form = await request.formData();
    const file = form.get("file");
    const kind = String(form.get("kind") || "report-photo");
    const projectId = String(form.get("projectId") || "").trim() || null;
    const widthValue = form.get("width");
    const heightValue = form.get("height");
    const originalName = String(form.get("originalName") || "");
    const originalSizeBytes = Number(form.get("originalSizeBytes") || 0);
    const resized = String(form.get("resized") || "false") === "true";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File gambar wajib dikirim." }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Format hanya JPG, PNG, atau WebP." }, { status: 415 });
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Ukuran gambar maksimal 15MB." }, { status: 413 });
    }

    const serverClient = await createSupabaseServerClient();
    const { data: userData } = await serverClient.auth.getUser();
    const ownerId = userData.user?.id || "";

    if (!ownerId) {
      return NextResponse.json({ error: "Login dibutuhkan untuk upload foto." }, { status: 401 });
    }

    if (projectId) {
      const { data: project, error: projectError } = await serverClient
        .from("projects")
        .select("id")
        .eq("id", projectId)
        .eq("owner_id", ownerId)
        .maybeSingle();
      if (projectError) return NextResponse.json({ error: projectError.message }, { status: 502 });
      if (!project) return NextResponse.json({ error: "Project tidak ditemukan untuk user ini." }, { status: 404 });
    }

    const admin = createSupabaseServiceRoleClient();
    const bucketConfig = pickBucket(kind);
    const extension = EXT_BY_MIME[file.type] || "jpg";
    const baseName = cleanName(file.name.replace(/\.[^.]+$/, ""));
    const pathParts = [ownerId, bucketConfig.folder];
    if (projectId && kind === "report-photo") pathParts.push(projectId);
    pathParts.push(new Date().toISOString().slice(0, 10));
    const objectPath = `${pathParts.join("/")}/${crypto.randomUUID()}-${baseName}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await admin.storage.from(bucketConfig.bucket).upload(objectPath, buffer, {
      contentType: file.type,
      cacheControl: bucketConfig.publicBucket ? "31536000" : "3600",
      upsert: false,
    });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message, bucket: bucketConfig.bucket }, { status: 502 });
    }

    const url = bucketConfig.publicBucket
      ? admin.storage.from(bucketConfig.bucket).getPublicUrl(objectPath).data.publicUrl
      : (await admin.storage.from(bucketConfig.bucket).createSignedUrl(objectPath, 60 * 60 * 24 * 7)).data?.signedUrl;

    if (!url) {
      return NextResponse.json({ error: "Gagal membuat URL preview storage." }, { status: 502 });
    }

    const dimensions = sizeFromUpload(file, widthValue, heightValue);
    const sourceType = kind === "report-photo" ? "laporan" : "bukti_lapangan";
    const filename = originalName || file.name;
    const photoId = crypto.randomUUID();

    if (kind === "report-photo") {
      const { error: insertError } = await admin.from("gallery_photos").insert({
        id: photoId,
        owner_id: ownerId,
        project_id: projectId,
        source_type: sourceType,
        storage_path: objectPath,
        public_url: bucketConfig.publicBucket ? url : null,
        filename,
        mime_type: file.type,
        width: dimensions.width,
        height: dimensions.height,
        size_bytes: file.size,
        metadata: {
          bucket: bucketConfig.bucket,
          resized,
          originalSizeBytes: Number.isFinite(originalSizeBytes) && originalSizeBytes > 0 ? originalSizeBytes : file.size,
        },
      });

      if (insertError) {
        await admin.storage.from(bucketConfig.bucket).remove([objectPath]);
        return NextResponse.json({ error: insertError.message }, { status: 502 });
      }
    }

    const photo = {
      id: photoId,
      bucket: bucketConfig.bucket,
      storagePath: objectPath,
      url,
      filename,
      mimeType: file.type,
      sizeBytes: file.size,
      originalSizeBytes: Number.isFinite(originalSizeBytes) && originalSizeBytes > 0 ? originalSizeBytes : file.size,
      resized,
      w: dimensions.width || 900,
      h: dimensions.height || 650,
      sourceType,
      publicBucket: bucketConfig.publicBucket,
    };

    return NextResponse.json({ photo });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload gagal." }, { status: 500 });
  }
}