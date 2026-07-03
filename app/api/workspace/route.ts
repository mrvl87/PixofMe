import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "../../../lib/supabase/server";

function toProjectCard(row: {
  id: string;
  name: string;
  institution_name: string | null;
  activity_location: string | null;
  status: "draft" | "active" | "archived";
  rab_text: string | null;
}) {
  const items = (row.rab_text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    id: row.id,
    name: row.name,
    instansi: row.institution_name || "Belum diatur",
    location: row.activity_location || "-",
    status: row.status === "active" ? "Aktif" : row.status === "archived" ? "Arsip" : "Draft",
    items,
    rabText: row.rab_text || "",
  };
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData.user;

    if (userError || !user) {
      return NextResponse.json({ error: "Login dibutuhkan." }, { status: 401 });
    }

    const { data: workspaceRows, error: workspaceError } = await supabase
      .from("workspaces")
      .select("id,name,created_at")
      .order("created_at", { ascending: true })
      .limit(1);

    if (workspaceError) {
      return NextResponse.json({ error: workspaceError.message }, { status: 502 });
    }

    let workspace = workspaceRows?.[0] || null;

    if (!workspace) {
      const { data: created, error: createError } = await supabase
        .from("workspaces")
        .insert({ owner_id: user.id, name: "Workspace Utama" })
        .select("id,name,created_at")
        .single();

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 502 });
      }
      workspace = created;
    }

    const { data: projectRows, error: projectsError } = await supabase
      .from("projects")
      .select("id,name,institution_name,activity_location,status,rab_text,header_text,header_mode,show_logo_instansi,show_logo_perusahaan,updated_at")
      .eq("workspace_id", workspace.id)
      .order("updated_at", { ascending: false });

    if (projectsError) {
      return NextResponse.json({ error: projectsError.message }, { status: 502 });
    }

    const projects = (projectRows || []).map(toProjectCard);
    const activeProject = projects.find((project) => project.status === "Aktif") || projects[0] || null;

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        activeProjectId: activeProject?.id || "",
        projects,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Workspace gagal dimuat." }, { status: 500 });
  }
}