import { HttpMethod, fetchData } from "@/config/api";

export interface TextEntry {
  key: string;
  value: string;
  preview_translation: string;
}

export interface SearchEntriesResponse {
  total_pages: number;
  entries: TextEntry[];
}

export async function searchModEntries(
  mod_id: number,
  page: number,
  query?: string
): Promise<SearchEntriesResponse> {
  const params: Record<string, string> = { page: page.toString() };
  if (query) params["query"] = query;

  const res = await fetchData(HttpMethod.GET, `/mods/${mod_id}/entries`, {
    params,
  });
  return await res.json();
}
