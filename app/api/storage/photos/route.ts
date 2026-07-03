import { createHash } from "crypto";
import { NextResponse } from "next/server";

import { getSupabaseStorageBucket } from "../../../../lib/env";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "../../../../lib/supabase/server";

type StoredPhoto = {
  id: string;
  bucket: string;
  storagePath: string;
  url: string;
  filename: string;
  mimeType: string | null;
  sizeBytes: number | null;
  w: number;
  h: number;
  sourceType: "laporan" | "bukti_lapangan";
  publicBucket: boolean;
};

function hashStoragePath(path: string) {
  return `storage-${createHash("sha1").update(path).digest("hex").slice(0, 24)}`;
}

function cleanStorageFilename(name: string) {
  return name.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i, "");
}

async function signedUrl(bucket: string, path: string) {
  const admin = createSupabaseServiceRoleClient();
  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
  if (error) return "";
  return data?.signedUrl || "";
}

async function listStorageFallback(ownerId: string, bucket: string, projectId: string | null): Promise<StoredPhoto[]> {
  const admin = createSupabaseServiceRoleClient();
  const roots = projectId ? [`${ownerId}/report-photos/${projectId}`, `${ownerId}/report-photos`] : [`${ownerId}/report-photos`];
  const seen = new Set<string>();
  const photos: StoredPhoto[] = [];

  for (const root of roots) {
    const { data: firstLevel } = await admin.storage.from(bucket).list(root, { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
    for (const entry of firstLevel || []) {
      const entryPath = `${root}/${entry.name}`;
      const isFile = Boolean(entry.metadata?.mimetype || entry.name.match(/\.(jpe?g|png|webp)$/i));
      const files = isFile ? [entry] : (await admin.storage.from(bucket).list(entryPath, { limit: 1000, sortBy: { column: "created_at", order: "desc" } })).data || [];

      for (const file of files) {
        if (!file.name.match(/\.(jpe?g|png|webp)$/i)) continue;
        const storagePath = isFile ? entryPath : `${entryPath}/${file.name}`;
        if (seen.has(storagePath)) continue;
        if (projectId && storagePath.startsWith(`${ownerId}/report-photos/`) && !storagePath.startsWith(`${ownerId}/report-photos/${projectId}/`) && roots[0] !== root) {
          // Old uploads had no project segment; still expose them to the user after project-scoped files.
        }
        seen.add(storagePath);
        const url = await signedUrl(bucket, storagePath);
        if (!url) continue;
        photos.push({
          id: hashStoragePath(storagePath),
          bucket,
          storagePath,
          url,
          filename: cleanStorageFilename(file.name),
          mimeType: file.metadata?.mimetype || null,
          sizeBytes: typeof file.metadata?.size === "number" ? file.metadata.size : null,
          w: 900,
          h: 650,
          sourceType: "laporan",
          publicBucket: false,
        });
      }
    }
  }

  return photos;
}

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData.user;

    if (userError || !user) {
      return NextResponse.json({ error: "Login dibutuhkan." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = String(searchParams.get("projectId") || "").trim() || null;
    const bucket = getSupabaseStorageBucket();
    const admin = createSupabaseServiceRoleClient();

    if (projectId) {
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id")
        .eq("id", projectId)
        .eq("owner_id", user.id)
        .maybeSingle();
      if (projectError) return NextResponse.json({ error: projectError.message }, { status: 502 });
      if (!project) return NextResponse.json({ error: "Project tidak ditemukan." }, { status: 404 });
    }

    let query = admin
      .from("gallery_photos")
      .select("id,project_id,source_type,storage_path,public_url,filename,mime_type,width,height,size_bytes,metadata,created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(500);

    if (projectId) query = query.or(`project_id.eq.${projectId},project_id.is.null`);

    const { data: rows, error: rowsError } = await query;
    if (rowsError) return NextResponse.json({ error: rowsError.message }, { status: 502 });

    const dbPhotos: StoredPhoto[] = [];
    const dbPaths = new Set<string>();
    for (const row of rows || []) {
      const meta = (row.metadata || {}) as { bucket?: string; resized?: boolean; originalSizeBytes?: number };
      const rowBucket = meta.bucket || bucket;
      const url = row.public_url || await signedUrl(rowBucket, row.storage_path);
      if (!url) continue;
      dbPaths.add(row.storage_path);
      dbPhotos.push({
        id: row.id,
        bucket: rowBucket,
        storagePath: row.storage_path,
        url,
        filename: row.filename,
        mimeType: row.mime_type,
        sizeBytes: row.size_bytes,
        w: row.width || 900,
        h: row.height || 650,
        sourceType: row.source_type === "bukti_lapangan" ? "bukti_lapangan" : "laporan",
        publicBucket: Boolean(row.public_url),
      });
    }

    const fallback = await listStorageFallback(user.id, bucket, projectId);
    const fallbackOnly = fallback.filter((photo) => !dbPaths.has(photo.storagePath));

    return NextResponse.json({ photos: [...dbPhotos, ...fallbackOnly] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Galeri gagal dimuat." }, { status: 500 });
  }
}