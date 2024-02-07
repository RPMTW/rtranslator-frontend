import { HttpMethod, fetchData, fetcher } from "@/config/api";
import { ModMetadata } from "@/types/minecraft_mod";
import { TextEntry } from "@/types/text_entry";
import useSWR, { SWRResponse } from "swr";

export interface SearchModResponse {
  total_pages: number;
  mods: ModMetadata[];
}

export function useMods(
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

export function useModEntries(
  mod_id: number,
  page: number,
  query?: string
): SWRResponse<SearchEntriesResponse> {
  const params: Record<string, string> = { page: page.toString() };
  if (query) params["query"] = query;

  return useSWR(
    [HttpMethod.GET, `/mods/${mod_id}/entries`, { params }],
    fetcher
  );
}
