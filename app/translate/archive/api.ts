import { HttpMethod, fetchData } from "@/config/api";

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
}

export enum ArchiveTaskStage {
  Preparing = "preparing",
  Downloading = "downloading",
  Extracting = "extracting",
  Saving = "saving",
  Completed = "completed",
  Failed = "failed",
}

export async function searchResources(
  provider: ArchiveProvider,
  query?: string,
  page?: number
): Promise<ArchiveResourceInfo[]> {
  const params: Record<string, string> = { provider };
  if (query) params["query"] = query;
  if (page) params["page"] = page.toString();

  const res = await fetchData(HttpMethod.GET, "archives/search", { params });
  return await res.json();
}

export async function createArchiveTask(
  provider: ArchiveProvider,
  identifier: string
): Promise<string> {
  const payload = { provider, identifier };
  const res = await fetchData(HttpMethod.POST, "archives/tasks", {
    body: payload,
  });

  return await res.text();
}

export async function getArchiveTask(id: string): Promise<ArchiveTask> {
  const res = await fetchData(HttpMethod.GET, `archives/tasks/${id}`);
  return await res.json();
}
