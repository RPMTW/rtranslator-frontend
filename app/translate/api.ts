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
