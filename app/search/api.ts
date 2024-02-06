import { HttpMethod, fetchData } from "@/config/api";

export interface MinecraftMod {
  id: number;
  status: ModStatus;
  created_at: Date;
  updated_at: Date;
}

export enum ModStatus {
  Normal = "normal",
  MissingEntries = "missing_entries",
}

export interface SearchModResponse {
  total_pages: number;
  mods: DatabaseMod[];
}

export interface DatabaseMod {
  id: number;
  status: ModStatus;
  name: string;
  description: string;
  image_url?: string;
  page_url: Record<ModProviderType, string>;
}

export enum ModProviderType {
  CurseForge = "curseforge",
  Modrinth = "modrinth",
  Custom = "custom",
}

export async function searchMods(
  page: number,
  query?: string
): Promise<SearchModResponse> {
  const params: Record<string, string> = { page: page.toString() };
  if (query) params["query"] = query;

  const res = await fetchData(HttpMethod.GET, "/mods/search", { params });
  return await res.json();
}
