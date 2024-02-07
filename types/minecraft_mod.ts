export interface MinecraftMod {
  id: number;
  status: ModStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ModMetadata {
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

export enum ModStatus {
  Normal = "normal",
  MissingEntries = "missing_entries",
}
