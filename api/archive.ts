import { HttpMethod, fetchData } from "@/config/api";
import { MinecraftMod } from "@/types/minecraft_mod";

export enum ArchiveProvider {
  CurseForge = "curseforge",
  Modrinth = "modrinth",
}

export interface ArchiveResourceInfo {
  identifier: string;
  name: string;
  description?: string;
  image_url?: string;
  page_url: string;
  included_in_database: boolean;
}

export interface ArchiveTask {
  stage: ArchiveTaskStage;
  progress: number;
  mc_mod: MinecraftMod;
}

export enum ArchiveTaskStage {
  Preparing = "preparing",
  Downloading = "downloading",
  Extracting = "extracting",
  Saving = "saving",
  Completed = "completed",
  Failed = "failed",
}

export namespace ArchiveTaskStage {
  export function isFinished(stage: ArchiveTaskStage): boolean {
    const finishedStages = [
      ArchiveTaskStage.Completed,
      ArchiveTaskStage.Failed,
    ];

    return finishedStages.includes(stage);
  }
}

export async function searchResources(
  provider: ArchiveProvider,
  page: number,
  query?: string
): Promise<ArchiveResourceInfo[]> {
  const params: Record<string, string> = { provider, page: page.toString() };
  if (query) params["query"] = query;

  const res = await fetchData(HttpMethod.GET, "/archives/search", { params });
  return await res.json();
}

export async function createArchiveTask(
  provider: ArchiveProvider,
  identifier: string
): Promise<string> {
  const payload = { provider, identifier };
  const res = await fetchData(HttpMethod.POST, "/archives/tasks", {
    body: payload,
  });

  return await res.text();
}

export async function getArchiveTask(id: string): Promise<ArchiveTask> {
  const res = await fetchData(HttpMethod.GET, `/archives/tasks/${id}`);
  return await res.json();
}
