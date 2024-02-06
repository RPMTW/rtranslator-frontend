import { HttpMethod, fetchData } from "@/config/api";
import { ModMetadata } from "@/types/minecraft_mod";

export async function getModMetadata(mod_id: number): Promise<ModMetadata> {
  const res = await fetchData(HttpMethod.GET, `/mods/${mod_id}/metadata`);
  return await res.json();
}
