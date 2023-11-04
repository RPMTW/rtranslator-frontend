import { HttpMethod, fetchData } from "@/config/api";

export interface MinecraftModInfo {
  name: string;
  description?: string;
  image_url?: string;
  page_url: string;
  included_in_database: boolean;
}

export enum ArchiveSource {
  CurseForge = "curseforge",
  Modrinth = "modrinth",
}

export async function searchMods(
  source: ArchiveSource,
  query?: string
): Promise<MinecraftModInfo[]> {
  const params: Record<string, string> = { source };
  if (query) params["query"] = query;

  const res = await fetchData(HttpMethod.GET, "archives/search", { params });
  return res;
}
