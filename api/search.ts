import { HttpMethod, fetchData, fetcher } from "@/config/api";
import { ModMetadata } from "@/types/minecraft_mod";
import { TextEntry } from "@/types/text_entry";
import useSWR, { SWRResponse } from "swr";

export interface SearchModResponse {
  total_pages: number;
  mods: ModMetadata[];
}

export function useSearchMods(
  page: number,
  query?: string
): SWRResponse<SearchModResponse> {
  const params: Record<string, string> = { page: page.toString() };
  if (query) params["query"] = query;

  return useSWR([HttpMethod.GET, "/mods/search", { params }], fetcher);
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
