import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import type { Database } from "../../../../lib/supabase/database.types";

async function requireUserWorkspace() {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData.user;

  if (userError || !user) {
    return { supabase, user: null, workspace: null, error: NextResponse.json({ error: "Login dibutuhkan." }, { status: 401 }) };
  }

  const { data: workspaceRows, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id,name")
    .order("created_at", { ascending: true })
    .limit(1);

  if (workspaceError) {
    return { supabase, user, workspace: null, error: NextResponse.json({ error: workspaceError.message }, { status: 502 }) };
  }

  let workspace = workspaceRows?.[0] || null;

  if (!workspace) {
    const { data: created, error: createError } = await supabase
      .from("workspaces")
      .insert({ owner_id: user.id, name: "Workspace Utama" })
      .select("id,name")
      .single();

    if (createError) {
      return { supabase, user, workspace: null, error: NextResponse.json({ error: createError.message }, { status: 502 }) };
    }
    workspace = created;
  }

  return { supabase, user, workspace, error: null };
}

export async function POST(request: Request) {
  try {
    const context = await requireUserWorkspace();
    if (context.error || !context.user || !context.workspace) return context.error;

    const body = await request.json().catch(() => ({}));
    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Nama project wajib diisi." }, { status: 400 });
    }

    const { data: project, error: createError } = await context.supabase
      .from("projects")
      .insert({
        workspace_id: context.workspace.id,
        owner_id: context.user.id,
        name,
        job_name: name,
        institution_name: "Belum diatur",
        activity_location: "-",
        status: "active",
      })
      .select("id")
      .single();

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 502 });
    }

    await context.supabase
      .from("projects")
      .update({ status: "draft" })
      .eq("workspace_id", context.workspace.id)
      .neq("id", project.id)
      .eq("status", "active");

    return NextResponse.json({ projectId: project.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Project gagal dibuat." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const context = await requireUserWorkspace();
    if (context.error || !context.user || !context.workspace) return context.error;

    const body = await request.json().catch(() => ({}));
    const projectId = String(body.projectId || "").trim();
    const action = String(body.action || "activate");

    if (!projectId) {
      return NextResponse.json({ error: "projectId wajib diisi." }, { status: 400 });
    }

    const { data: target, error: targetError } = await context.supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("workspace_id", context.workspace.id)
      .single();

    if (targetError || !target) {
      return NextResponse.json({ error: "Project tidak ditemukan." }, { status: 404 });
    }

    if (action === "update") {
      const changes = body.changes || {};
      const updatePayload: Database["public"]["Tables"]["projects"]["Update"] = {};
      if (typeof changes.name === "string") updatePayload.name = changes.name.trim() || "Untitled Project";
      if (typeof changes.client === "string") updatePayload.institution_name = changes.client;
      if (typeof changes.instansi === "string") updatePayload.institution_name = changes.instansi;
      if (typeof changes.location === "string") updatePayload.activity_location = changes.location;
      if (typeof changes.lokasi === "string") updatePayload.activity_location = changes.lokasi;
      if (typeof changes.headerText === "string") updatePayload.header_text = changes.headerText;
      if (changes.headerMode === "all" || changes.headerMode === "first") updatePayload.header_mode = changes.headerMode;
      if (typeof changes.logoInstansi === "boolean") updatePayload.show_logo_instansi = changes.logoInstansi;
      if (typeof changes.logoPerusahaan === "boolean") updatePayload.show_logo_perusahaan = changes.logoPerusahaan;
      if (typeof changes.rabText === "string") updatePayload.rab_text = changes.rabText;
      if (Object.keys(updatePayload).length) {
        const { error: updateError } = await context.supabase
          .from("projects")
          .update(updatePayload)
          .eq("id", projectId)
          .eq("workspace_id", context.workspace.id);

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 502 });
        }
      }
    }

    if (action === "activate") {
      await context.supabase
        .from("projects")
        .update({ status: "draft" })
        .eq("workspace_id", context.workspace.id)
        .eq("status", "active");

      const { error: activateError } = await context.supabase
        .from("projects")
        .update({ status: "active" })
        .eq("id", projectId)
        .eq("workspace_id", context.workspace.id);

      if (activateError) {
        return NextResponse.json({ error: activateError.message }, { status: 502 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Project gagal diperbarui." }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  try {
    const context = await requireUserWorkspace();
    if (context.error || !context.user || !context.workspace) return context.error;

    const { searchParams } = new URL(request.url);
    const projectId = String(searchParams.get("projectId") || "").trim();

    if (!projectId) {
      return NextResponse.json({ error: "projectId wajib diisi." }, { status: 400 });
    }

    const { error: deleteError } = await context.supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("workspace_id", context.workspace.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Project gagal dihapus." }, { status: 500 });
  }
}